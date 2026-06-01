import { useEffect, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatFeedPackageLabel } from "@/utils/banner";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";
import PaymentMethodSection from "@/components/seller/PaymentMethodSection";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";

export default function SellerFeedPricelistPage() {
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [qrisImage, setQrisImage] = useState("");

  useEffect(() => {
    const load = async () => {
      const [priceRes, contactRes] = await Promise.all([
        api.get(API_ENDPOINTS.FEED_PRICELIST),
        api.get(API_ENDPOINTS.ADMIN.CONTACT)
      ]);
      setPricelist(Array.isArray(priceRes.data) ? priceRes.data : []);
      setPaymentInstructions(contactRes.data?.feed_payment_instructions || "");
      setQrisImage(contactRes.data?.feed_qris_image || "");
    };
    load();
  }, []);

  return (
    <BannerPageStack>
      <ScreenHeader title="Price List Iklan Feed" subtitle="Informasi paket harga" backTo="/seller/feed" />

      <SectionCard title="Paket Harga" subtitle="Untuk order, buka menu Order Iklan Feed">
        {pricelist.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Belum ada paket harga.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pricelist.map((item) => (
              <li key={item.id} className="py-3 text-sm font-bold text-slate-900">
                {formatFeedPackageLabel(item)}
              </li>
            ))}
          </ul>
        )}
        <Link to="/seller/feed/order" className="mt-4 block">
          <Button variant="primary" className="w-full">
            Lanjut Order Iklan Feed
          </Button>
        </Link>
      </SectionCard>

      <PaymentMethodSection instructions={paymentInstructions} qrisImage={qrisImage} title="Cara Bayar" />
    </BannerPageStack>
  );
}
