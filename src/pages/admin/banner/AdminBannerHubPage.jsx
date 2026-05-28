import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, ClipboardList, Image, Info, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { AdminHubCard, AdminPageStack } from "@/components/admin/AdminPageUi";

export default function AdminBannerHubPage() {
  const [banners, setBanners] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);

  const load = useCallback(async () => {
    const [bannerRes, orderRes] = await Promise.all([
      api.get(`${API_ENDPOINTS.BANNERS}?all=1`),
      api.get(`${API_ENDPOINTS.SELLER_REQUESTS.LIST}?request_type=banner&status=pending&limit=1`)
    ]);
    setBanners(Array.isArray(bannerRes.data) ? bannerRes.data : []);
    setPendingOrders(orderRes.data?.pagination?.total || 0);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = banners.filter((b) => b.is_active).length;

  return (
    <AdminPageStack>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4" data-intro-admin-page-banner>
        <div className="flex items-center gap-2">
          <Megaphone className="text-blue-800" size={22} />
          <h1 className="text-xl font-bold text-blue-900">Kelola Iklan Banner</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">Penjelasan, pricelist, kelola banner, dan order dari seller.</p>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-r border-slate-100 py-4 text-center">
          <p className="text-2xl font-extrabold text-blue-700">{banners.length}</p>
          <p className="text-xs font-semibold text-slate-500">Total</p>
        </div>
        <div className="border-r border-slate-100 py-4 text-center">
          <p className="text-2xl font-extrabold text-green-700">{activeCount}</p>
          <p className="text-xs font-semibold text-slate-500">Aktif</p>
        </div>
        <div className="py-4 text-center">
          <p className="text-2xl font-extrabold text-amber-700">{pendingOrders}</p>
          <p className="text-xs font-semibold text-slate-500">Order Pending</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Menu</p>
        <AdminHubCard icon={Info} title="Apa itu Iklan Banner?" subtitle="Edit penjelasan untuk seller" color="#2563eb" to="/admin/banner/info" />
        <AdminHubCard icon={CircleDollarSign} title="Pricelist & Cara Order" subtitle="Kelola harga & instruksi bayar" color="#7c3aed" to="/admin/banner/pricelist" />
        <AdminHubCard icon={Image} title="Manage Iklan Banner" subtitle="Upload, aktifkan, kelola banner" color="#0f766e" to="/admin/banner/kelola" />
        <AdminHubCard
          icon={ClipboardList}
          title="Order Iklan Banner"
          subtitle={`${pendingOrders} permintaan menunggu`}
          color="#b45309"
          to="/admin/banner/orders"
        />
      </div>
    </AdminPageStack>
  );
}
