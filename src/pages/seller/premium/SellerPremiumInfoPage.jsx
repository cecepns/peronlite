import { useEffect, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";

export default function SellerPremiumInfoPage() {
  const [infoText, setInfoText] = useState("");

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => {
      setInfoText(
        res.data?.premium_info_text ||
          res.data?.note ||
          "Informasi paket premium belum diatur oleh admin."
      );
    });
  }, []);

  return (
    <BannerPageStack>
      <ScreenHeader
        title="Apa itu Premium?"
        subtitle="Penjelasan layanan akun premium"
        backTo="/seller/premium"
      />
      <SectionCard>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{infoText}</p>
      </SectionCard>
    </BannerPageStack>
  );
}
