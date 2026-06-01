import { useCallback, useEffect, useState } from "react";
import { Calendar, ImageIcon, LayoutGrid, Power, PowerOff, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import AdminProductAsyncSelect from "@/components/admin/AdminProductAsyncSelect";
import { AdminPageStack, AdminScreenHeader, AdminSectionCard } from "@/components/admin/AdminPageUi";
import { StatusBadge } from "@/components/banner/BannerUi";

const STATUS_FILTERS = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Aktif" },
  { key: "expired", label: "Kadaluarsa" }
];

function defaultExpiresDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export default function AdminFeedManagePage() {
  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loadingList, setLoadingList] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activateExpires, setActivateExpires] = useState(defaultExpiresDate);
  const [activating, setActivating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editExpires, setEditExpires] = useState("");

  const loadItems = useCallback(async () => {
    setLoadingList(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter
      });
      if (search) q.set("search", search);
      const res = await api.get(`${API_ENDPOINTS.ADMIN.FEED_ADS}?${q}`);
      setItems(res.data?.data || []);
      const p = res.data?.pagination || {};
      setPagination({
        total: p.total || 0,
        totalPages: p.totalPages || 1
      });
    } finally {
      setLoadingList(false);
    }
  }, [page, limit, statusFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, limit]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const patchFeed = async (productId, body) => {
    await api.patch(API_ENDPOINTS.ADMIN.FEED_AD(productId), body);
    loadItems();
  };

  const activateProduct = async (e) => {
    e.preventDefault();
    const id = Number(selectedProduct?.value);
    if (!id) {
      toast.error("Pilih produk terlebih dahulu");
      return;
    }
    setActivating(true);
    try {
      await patchFeed(id, { is_highlight: true, highlight_expires_at: activateExpires });
      toast.success("Iklan feed diaktifkan");
      setSelectedProduct(null);
      setActivateExpires(defaultExpiresDate());
      if (page !== 1) setPage(1);
      else loadItems();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal mengaktifkan iklan feed");
    } finally {
      setActivating(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm("Nonaktifkan iklan feed produk ini?")) return;
    try {
      await patchFeed(id, { is_highlight: false });
      toast.success("Iklan feed dinonaktifkan");
      if (items.length === 1 && page > 1) setPage(page - 1);
    } catch {
      toast.error("Gagal menonaktifkan");
    }
  };

  const removeFeed = async (id, name) => {
    if (!window.confirm(`Hapus iklan feed untuk "${name}"? Produk tidak dihapus, hanya keluar dari feed beranda.`)) return;
    try {
      await api.delete(API_ENDPOINTS.ADMIN.FEED_AD(id));
      toast.success("Iklan feed dihapus");
      if (items.length === 1 && page > 1) setPage(page - 1);
      else loadItems();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menghapus iklan feed");
    }
  };

  const saveExpiry = async (id) => {
    if (!editExpires) {
      toast.error("Tanggal wajib diisi");
      return;
    }
    try {
      await patchFeed(id, { is_highlight: true, highlight_expires_at: editExpires });
      toast.success("Tanggal diperbarui");
      setEditingId(null);
    } catch {
      toast.error("Gagal menyimpan tanggal");
    }
  };

  const activeOnPage = items.filter((i) => i.is_feed_active).length;

  return (
    <AdminPageStack>
      <AdminScreenHeader
        title="Manage Iklan Feed"
        subtitle={`${pagination.total} produk highlight · halaman ${page}/${pagination.totalPages}${activeOnPage ? ` · ${activeOnPage} aktif di halaman ini` : ""}`}
        backTo="/admin/feed"
      />

      <form onSubmit={activateProduct}>
        <AdminSectionCard title="Aktifkan Iklan Feed" subtitle="Cari produk lalu tentukan tanggal berakhir tayang di beranda.">
          <div className="grid">
            <AdminProductAsyncSelect
              value={selectedProduct}
              onChange={setSelectedProduct}
              isDisabled={activating}
            />
            <label className="block space-y-1.5 sm:pt-6">
              <span className="text-sm font-bold text-slate-700">Berlaku sampai</span>
              <input
                type="date"
                value={activateExpires}
                onChange={(e) => setActivateExpires(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                required
              />
            </label>
          </div>
          <Button type="submit" loading={activating}>
            Aktifkan di Feed
          </Button>
        </AdminSectionCard>
      </form>

      <Input placeholder="Cari nama produk, toko, seller, atau ID..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              statusFilter === f.key ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm font-bold text-slate-700">Daftar Iklan Feed</p>
      {loadingList ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminSectionCard key={item.id}>
              <div className="flex gap-3">
                {item.thumbnail ? (
                  <img src={resolveImageUrl(item.thumbnail)} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <ImageIcon size={24} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/produk/${item.slug || item.id}`} className="font-bold text-slate-900 hover:text-blue-600">
                      {item.name}
                    </Link>
                    <StatusBadge active={!!item.is_feed_active} />
                  </div>
                  <p className="text-xs text-slate-500">
                    ID #{item.id} · {formatRupiah(item.price)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.store_name} · {item.seller_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Berlaku: {item.highlight_expires_at ? new Date(item.highlight_expires_at).toLocaleDateString("id-ID") : "Tanpa batas"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditExpires(
                      item.highlight_expires_at ? new Date(item.highlight_expires_at).toISOString().slice(0, 10) : defaultExpiresDate()
                    );
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                >
                  <Calendar size={14} />
                  Perpanjang
                </button>
                {item.is_feed_active ? (
                  <button
                    type="button"
                    onClick={() => deactivate(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800"
                  >
                    <PowerOff size={14} />
                    Nonaktifkan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await patchFeed(item.id, {
                          is_highlight: true,
                          highlight_expires_at: item.highlight_expires_at?.slice(0, 10) || defaultExpiresDate()
                        });
                        toast.success("Diaktifkan kembali");
                      } catch {
                        toast.error("Gagal mengaktifkan");
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800"
                  >
                    <Power size={14} />
                    Aktifkan
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFeed(item.id, item.name)}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
              </div>
              {editingId === item.id ? (
                <div className="flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3">
                  <input type="date" value={editExpires} onChange={(e) => setEditExpires(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
                  <Button type="button" onClick={() => saveExpiry(item.id)}>
                    Simpan
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                    Batal
                  </Button>
                </div>
              ) : null}
            </AdminSectionCard>
          ))}
          {!items.length ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <LayoutGrid className="mx-auto text-slate-400" size={32} />
              <p className="mt-2 text-sm text-slate-500">Belum ada iklan feed untuk filter ini.</p>
            </div>
          ) : null}
          {pagination.total > 0 ? (
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
          ) : null}
        </div>
      )}
    </AdminPageStack>
  );
}
