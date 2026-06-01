import { useEffect, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatBannerPackageLabel } from "@/utils/banner";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";
import PaymentMethodSection from "@/components/seller/PaymentMethodSection";

export default function SellerBannerPricelistPage() {
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [qrisImage, setQrisImage] = useState("");

  useEffect(() => {
    const load = async () => {
      const [priceRes, contactRes] = await Promise.all([
        api.get(API_ENDPOINTS.BANNER_PRICELIST),
        api.get(API_ENDPOINTS.ADMIN.CONTACT)
      ]);
      setPricelist(Array.isArray(priceRes.data) ? priceRes.data : []);
      setPaymentInstructions(contactRes.data?.banner_payment_instructions || "");
      setQrisImage(contactRes.data?.banner_qris_image || "");
    };
    load();
  }, []);

  return (
    <BannerPageStack>
      <ScreenHeader title="Price List Harga" subtitle="Informasi paket harga iklan banner" />

      <SectionCard title="Paket Harga Banner" subtitle="Untuk pasang banner, pilih paket di menu Manage Iklan Banner Saya">
        {pricelist.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Belum ada paket harga.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pricelist.map((item) => (
              <li key={item.id} className="py-3 text-sm font-bold text-slate-900">
                {formatBannerPackageLabel(item)}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <PaymentMethodSection instructions={paymentInstructions} qrisImage={qrisImage} title="Cara Bayar" />
    </BannerPageStack>
  );
}
