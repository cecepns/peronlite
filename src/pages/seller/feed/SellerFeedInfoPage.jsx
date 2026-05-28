import { useEffect, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";

export default function SellerFeedInfoPage() {
  const [infoText, setInfoText] = useState("");

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => {
      setInfoText(
        res.data?.feed_info_text ||
          "Iklan feed menampilkan produk Anda di section Iklan Produk pada beranda. Order paket lalu tunggu persetujuan admin."
      );
    });
  }, []);

  return (
    <BannerPageStack>
      <ScreenHeader title="Apa itu Iklan Feed?" subtitle="Penjelasan layanan iklan feed" backTo="/seller/feed" />
      <SectionCard>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{infoText}</p>
      </SectionCard>
    </BannerPageStack>
  );
}
