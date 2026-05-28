import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, Info, LayoutGrid, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { isFeedAdActive } from "@/utils/product";
import { BannerPageStack, HubCard } from "@/components/banner/BannerUi";

export default function SellerFeedHubPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  const loadProducts = useCallback(async () => {
    const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?seller_id=${user.id}&product_type=regular`);
    setProducts(Array.isArray(res.data) ? res.data : []);
  }, [user.id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const activeCount = products.filter((p) => isFeedAdActive(p)).length;

  return (
    <BannerPageStack>
      <div className="space-y-3.5" data-intro-seller-page-feed>
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-center gap-2">
            <Megaphone className="text-teal-800" size={22} />
            <h1 className="text-xl font-bold text-teal-900">Iklan Feed</h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Tampilkan produk pilihan di section Iklan Produk pada beranda buyer setelah order disetujui admin.
          </p>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-r border-slate-100 py-4 text-center">
            <p className="text-2xl font-extrabold text-teal-700">{products.length}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Produk Biasa</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-2xl font-extrabold text-green-700">{activeCount}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Feed Aktif</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Menu Iklan Feed</p>
        <HubCard
          icon={Info}
          title="Apa itu Iklan Feed?"
          subtitle="Pelajari manfaat promosi di beranda"
          color="#0f766e"
          to="/seller/feed/info"
        />
        <HubCard
          icon={CircleDollarSign}
          title="Price List Harga"
          subtitle="Lihat paket harga iklan feed"
          color="#7c3aed"
          to="/seller/feed/pricelist"
        />
        <HubCard
          icon={LayoutGrid}
          title="Order Iklan Feed"
          subtitle="Pilih produk, paket & kirim ke admin"
          color="#2563eb"
          to="/seller/feed/order"
        />
      </div>
    </BannerPageStack>
  );
}
