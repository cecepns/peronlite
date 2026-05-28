import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { AdminPageStack, AdminScreenHeader, AdminSectionCard, REQUEST_STATUS_LABEL } from "@/components/admin/AdminPageUi";
import PaymentProofView from "@/components/admin/PaymentProofView";

const STATUS_FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "", label: "Semua" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" }
];

export default function AdminSellerRequestsPage({ requestType, title, subtitle, backTo }) {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        request_type: requestType
      });
      if (statusFilter) q.set("status", statusFilter);
      if (search) q.set("search", search);
      const res = await api.get(`${API_ENDPOINTS.SELLER_REQUESTS.LIST}?${q}`);
      setRequests(res.data?.data || []);
      const p = res.data?.pagination || {};
      setPagination({
        page: p.page || page,
        limit: p.limit || limit,
        total: p.total || 0,
        totalPages: p.total_pages || p.totalPages || 1
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search, requestType]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, limit, requestType]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRequest = async (id, status) => {
    try {
      await api.patch(API_ENDPOINTS.SELLER_REQUESTS.UPDATE(id), { status });
      toast.success(status === "approved" ? "Permintaan disetujui" : "Permintaan ditolak");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal memproses permintaan");
    }
  };

  const removeRequest = async (id) => {
    if (!window.confirm("Hapus permintaan ini?")) return;
    try {
      await api.delete(API_ENDPOINTS.SELLER_REQUESTS.DELETE(id));
      toast.success("Permintaan dihapus");
      load();
    } catch {
      toast.error("Gagal menghapus permintaan");
    }
  };

  return (
    <AdminPageStack>
      <AdminScreenHeader title={title} subtitle={subtitle || `${pagination.total} permintaan`} backTo={backTo} />
      <Input placeholder="Cari nama, email, HP, paket..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.key;
          return (
            <button
              key={filter.key || "all"}
              type="button"
              onClick={() => {
                setStatusFilter(filter.key);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                active ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : !requests.length ? (
        <EmptyState title="Tidak ada permintaan" description={search ? "Coba kata kunci lain." : "Belum ada order untuk filter ini."} />
      ) : (
        <div className="space-y-3">
          {requests.map((item) => (
            <AdminSectionCard key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{item.user_name}</p>
                  <p className="text-sm text-slate-600">{item.user_email}</p>
                  {item.user_phone ? <p className="text-sm text-slate-500">HP: {item.user_phone}</p> : null}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    item.status === "pending"
                      ? "bg-amber-100 text-amber-900"
                      : item.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {REQUEST_STATUS_LABEL[item.status] || item.status}
                </span>
              </div>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Paket:</span> {item.package_label}
              </p>
              {item.product_name || item.product_id ? (
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Produk:</span> {item.product_name || `#${item.product_id}`}
                </p>
              ) : null}
              {item.note ? (
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Info:</span> {item.note}
                </p>
              ) : null}
              <PaymentProofView path={item.payment_proof} />
              <p className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString("id-ID")}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateRequest(item.id, "approved")}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-800 hover:bg-green-100"
                    >
                      <CheckCircle size={16} />
                      Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRequest(item.id, "rejected")}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
                    >
                      <XCircle size={16} />
                      Tolak
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeRequest(item.id)}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            </AdminSectionCard>
          ))}
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(v) => {
              setLimit(v);
              setPage(1);
            }}
          />
        </div>
      )}
    </AdminPageStack>
  );
}
