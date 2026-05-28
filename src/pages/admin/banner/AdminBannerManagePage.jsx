import { useCallback, useEffect, useState } from "react";
import { Calendar, ImageIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { isTextBanner } from "@/utils/banner";
import { resolveImageUrl } from "@/utils/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import { AdminPageStack, AdminScreenHeader, AdminSectionCard } from "@/components/admin/AdminPageUi";
import { StatusBadge } from "@/components/banner/BannerUi";

export default function AdminBannerManagePage() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState("product");
  const [linkId, setLinkId] = useState("");
  const [isActive, setIsActive] = useState("1");
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editExpires, setEditExpires] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loadingList, setLoadingList] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoadingList(true);
    try {
      const q = new URLSearchParams({
        all: "1",
        paginate: "1",
        page: String(page),
        limit: String(limit)
      }).toString();
      const res = await api.get(`${API_ENDPOINTS.BANNERS}?${q}`);
      const payload = res.data;
      if (payload?.success) {
        setBanners(Array.isArray(payload.data) ? payload.data : []);
        const p = payload.pagination || {};
        setPagination({
          total: p.total || 0,
          totalPages: p.totalPages || p.total_pages || 1
        });
      } else {
        setBanners(Array.isArray(payload) ? payload : []);
        setPagination({ total: Array.isArray(payload) ? payload.length : 0, totalPages: 1 });
      }
    } finally {
      setLoadingList(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addBanner = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul banner wajib diisi");
      return;
    }
    if (!image && !description.trim()) {
      toast.error("Gambar atau deskripsi wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("link_type", linkType);
      form.append("link_id", linkId.trim() || "");
      form.append("is_active", isActive);
      form.append("expires_at", expiresAt);
      form.append("user_id", String(user.id));
      if (description.trim()) form.append("description", description.trim());
      if (image) form.append("image", image);
      await api.post(API_ENDPOINTS.BANNERS, form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Banner ditambahkan");
      setTitle("");
      setDescription("");
      setLinkId("");
      setImage(null);
      setImagePreview("");
      if (page !== 1) setPage(1);
      else loadBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal upload banner");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, active, expiry = null) => {
    try {
      await api.patch(`${API_ENDPOINTS.BANNERS}/${id}/status`, {
        is_active: active,
        expires_at: expiry || expiresAt
      });
      toast.success("Status banner diupdate");
      setEditingId(null);
      loadBanners();
    } catch {
      toast.error("Gagal update banner");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus banner ini?")) return;
    try {
      await api.delete(`${API_ENDPOINTS.BANNERS}/${id}`);
      toast.success("Banner dihapus");
      if (banners.length === 1 && page > 1) setPage(page - 1);
      else loadBanners();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const activeOnPage = banners.filter((b) => b.is_active).length;

  return (
    <AdminPageStack>
      <AdminScreenHeader
        title="Manage Iklan Banner"
        subtitle={`${pagination.total} banner total · halaman ${page}/${pagination.totalPages}${activeOnPage ? ` · ${activeOnPage} aktif di halaman ini` : ""}`}
        backTo="/admin/banner"
      />

      <form onSubmit={addBanner}>
        <AdminSectionCard title="Upload Banner Baru" subtitle="Admin dapat langsung mengaktifkan banner.">
          <Input label="Judul Campaign" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Promo Ramadan 2026" />
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-700">Gambar Banner</span>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 hover:border-blue-300">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="max-h-40 rounded-lg object-cover" />
              ) : (
                <>
                  <ImageIcon className="text-slate-400" size={32} />
                  <span className="mt-2 text-sm text-slate-500">Klik untuk pilih gambar</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-700">Deskripsi (opsional, banner teks)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Teks banner jika tanpa gambar"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Status</span>
              <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Kedaluwarsa</span>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Tujuan klik</span>
              <select value={linkType} onChange={(e) => setLinkType(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="product">Produk</option>
                <option value="store">Toko</option>
              </select>
            </label>
            <Input label="ID Tujuan" value={linkId} onChange={(e) => setLinkId(e.target.value)} placeholder="ID produk / user" />
          </div>
          <Button type="submit" loading={submitting}>
            Upload Banner
          </Button>
        </AdminSectionCard>
      </form>

      <p className="text-sm font-bold text-slate-700">Daftar Banner</p>
      {loadingList ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
      <div className="space-y-3">
        {banners.map((item) => (
          <AdminSectionCard key={item.id}>
            <div className="flex gap-3">
              {item.image && !isTextBanner(item) ? (
                <img src={resolveImageUrl(item.image)} alt="" className="h-20 w-32 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">Teks</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-900">{item.title || `Banner #${item.id}`}</p>
                  <StatusBadge active={!!item.is_active} />
                </div>
                {item.seller_name ? <p className="text-xs text-slate-500">Seller: {item.seller_name}</p> : null}
                <p className="text-xs text-slate-500">
                  Kedaluwarsa: {item.expires_at ? new Date(item.expires_at).toLocaleDateString("id-ID") : "-"}
                </p>
                <p className="text-xs text-slate-500">
                  Link: {item.link_type === "product" ? "Produk" : "Toko"}
                  {item.link_id ? ` #${item.link_id}` : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(item.id);
                  setEditExpires(item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 10) : expiresAt);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
              >
                <Calendar size={14} />
                Tanggal
              </button>
              <button
                type="button"
                onClick={() => updateStatus(item.id, !item.is_active, item.expires_at?.slice(0, 10) || expiresAt)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  item.is_active ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"
                }`}
              >
                {item.is_active ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
            {editingId === item.id ? (
              <div className="flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3">
                <input type="date" value={editExpires} onChange={(e) => setEditExpires(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
                <Button type="button" onClick={() => updateStatus(item.id, item.is_active, editExpires)}>
                  Simpan
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                  Batal
                </Button>
              </div>
            ) : null}
          </AdminSectionCard>
        ))}
        {!banners.length ? <p className="text-sm text-slate-500">Belum ada banner.</p> : null}
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
