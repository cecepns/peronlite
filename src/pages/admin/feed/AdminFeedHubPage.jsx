import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, ClipboardList, Info, LayoutGrid, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { AdminHubCard, AdminPageStack } from "@/components/admin/AdminPageUi";

export default function AdminFeedHubPage() {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeFeed, setActiveFeed] = useState(0);

  const load = useCallback(async () => {
    const [orderRes, feedRes] = await Promise.all([
      api.get(`${API_ENDPOINTS.SELLER_REQUESTS.LIST}?request_type=feed&status=pending&limit=1`),
      api.get(`${API_ENDPOINTS.ADMIN.FEED_ADS}?status=active&limit=1`)
    ]);
    setPendingOrders(orderRes.data?.pagination?.total || 0);
    setActiveFeed(feedRes.data?.pagination?.total || 0);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminPageStack>
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" data-intro-admin-page-feed>
        <div className="flex items-center gap-2">
          <LayoutGrid className="text-teal-800" size={22} />
          <h1 className="text-xl font-bold text-teal-900">Kelola Iklan Feed</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Iklan produk di section &quot;Iklan Produk&quot; beranda. Kelola pricelist dan order dari seller.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-teal-800">{activeFeed}</p>
          <p className="text-xs font-semibold text-teal-900">Feed Aktif</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-800">{pendingOrders}</p>
          <p className="text-xs font-semibold text-amber-900">Order Pending</p>
        </div>
      </div>

      <div className="space-y-3">
        <AdminHubCard icon={Info} title="Apa itu Iklan Feed?" subtitle="Edit penjelasan untuk seller" color="#0f766e" to="/admin/feed/info" />
        <AdminHubCard icon={CircleDollarSign} title="Pricelist & Cara Order" subtitle="Kelola harga & instruksi bayar" color="#7c3aed" to="/admin/feed/pricelist" />
        <AdminHubCard
          icon={Megaphone}
          title="Manage Iklan Feed"
          subtitle="Aktifkan, perpanjang, nonaktifkan highlight produk"
          color="#2563eb"
          to="/admin/feed/kelola"
        />
        <AdminHubCard
          icon={ClipboardList}
          title="Order Iklan Feed"
          subtitle={`${pendingOrders} permintaan menunggu`}
          color="#b45309"
          to="/admin/feed/orders"
        />
      </div>
    </AdminPageStack>
  );
}
