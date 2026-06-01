import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, Image, Info, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { BannerPageStack, HubCard } from "@/components/banner/BannerUi";
import { BRAND_NAME } from "@/constants/brand";

export default function SellerBannerHubPage() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);

  const loadBanners = useCallback(async () => {
    const res = await api.get(`${API_ENDPOINTS.BANNERS}?all=1&mine=1&user_id=${user.id}`);
    setBanners(Array.isArray(res.data) ? res.data : []);
  }, [user.id]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const activeCount = banners.filter((b) => b.is_active).length;
  const pendingCount = banners.length - activeCount;

  return (
    <BannerPageStack>
      <div className="space-y-3.5" data-intro-seller-page-banner>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <Megaphone className="text-blue-800" size={22} />
            <h1 className="text-xl font-bold text-blue-900">Iklan Banner</h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Promosikan toko atau komoditas kamu di halaman utama {BRAND_NAME} dengan iklan banner.
          </p>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-r border-slate-100 py-4 text-center">
            <p className="text-2xl font-extrabold text-blue-700">{banners.length}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Banner Saya</p>
          </div>
          <div className="border-r border-slate-100 py-4 text-center">
            <p className="text-2xl font-extrabold text-green-700">{activeCount}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Aktif</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-2xl font-extrabold text-amber-700">{pendingCount}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Menunggu</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Menu Banner</p>
        <HubCard
          icon={Info}
          title="Apa itu Iklan Banner?"
          subtitle="Pelajari manfaat promosi banner"
          color="#2563eb"
          to="/seller/banner/info"
        />
        <HubCard
          icon={CircleDollarSign}
          title="Price List Harga"
          subtitle="Lihat informasi paket harga"
          color="#7c3aed"
          to="/seller/banner/pricelist"
        />
        <HubCard
          icon={Image}
          title="Manage Iklan Banner Saya"
          subtitle="Pasang banner, order paket & status"
          color="#0f766e"
          to="/seller/banner/kelola"
        />
      </div>
    </BannerPageStack>
  );
}
