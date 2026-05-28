import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, ClipboardList, Info, Sparkles } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { AdminHubCard, AdminPageStack } from "@/components/admin/AdminPageUi";

export default function AdminPremiumHubPage() {
  const [pendingOrders, setPendingOrders] = useState(0);

  const load = useCallback(async () => {
    const res = await api.get(`${API_ENDPOINTS.SELLER_REQUESTS.LIST}?request_type=premium&status=pending&limit=1`);
    setPendingOrders(res.data?.pagination?.total || 0);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminPageStack>
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4" data-intro-admin-page-premium>
        <div className="flex items-center gap-2">
          <Sparkles className="text-violet-700" size={22} />
          <h1 className="text-xl font-bold text-violet-900">Kelola Paket Premium</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">Penjelasan, pricelist, dan order upgrade premium dari seller.</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
        <p className="text-2xl font-extrabold text-amber-800">{pendingOrders}</p>
        <p className="text-xs font-semibold text-amber-900">Order Premium Pending</p>
      </div>

      <div className="space-y-3">
        <AdminHubCard icon={Info} title="Apa itu Premium?" subtitle="Edit penjelasan untuk seller" color="#7c3aed" to="/admin/premium/info" />
        <AdminHubCard icon={CircleDollarSign} title="Pricelist & Cara Order" subtitle="Kelola harga & instruksi bayar" color="#2563eb" to="/admin/premium/pricelist" />
        <AdminHubCard
          icon={ClipboardList}
          title="Order Premium"
          subtitle={`${pendingOrders} permintaan menunggu`}
          color="#b45309"
          to="/admin/premium/orders"
        />
      </div>
    </AdminPageStack>
  );
}
