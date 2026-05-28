import { useEffect, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";

export default function SellerBannerInfoPage() {
  const [infoText, setInfoText] = useState("");

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => {
      setInfoText(res.data?.banner_info_text || "Informasi iklan banner belum diatur oleh admin.");
    });
  }, []);

  return (
    <BannerPageStack>
      <ScreenHeader title="Apa itu Iklan Banner?" subtitle="Penjelasan layanan promosi banner" />
      <SectionCard>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{infoText}</p>
      </SectionCard>
    </BannerPageStack>
  );
}
