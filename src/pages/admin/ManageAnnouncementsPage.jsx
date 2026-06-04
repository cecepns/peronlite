import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import { ANNOUNCEMENT_IMAGE_HINT } from "@/constants/announcements";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { resolveImageUrl } from "@/utils/image";

const emptyForm = () => ({
  title: "",
  body: "",
  audience: "all",
  is_active: "1",
  link_url: "",
  repeat_interval_minutes: "0",
  image: null
});

export default function ManageAnnouncementsPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(limit), search: debouncedSearch }).toString();
      const res = await api.get(`${API_ENDPOINTS.ANNOUNCEMENTS.LIST}?${q}`);
      setRows(res.data?.data || []);
      setPagination(res.data?.pagination || { totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || "",
      body: row.body || "",
      audience: row.audience || "all",
      is_active: row.is_active ? "1" : "0",
      link_url: row.link_url || "",
      repeat_interval_minutes: String(row.repeat_interval_minutes ?? 0),
      image: null
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Judul wajib");
      return;
    }
    if (!form.body.trim() && !form.image && !editing?.image) {
      toast.error("Isi teks atau gambar");
      return;
    }
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("body", form.body.trim());
    fd.append("audience", form.audience);
    fd.append("is_active", form.is_active);
    fd.append("repeat_interval_minutes", form.repeat_interval_minutes || "0");
    if (form.link_url) fd.append("link_url", form.link_url);
    if (form.image) fd.append("image", form.image);
    setSaving(true);
    try {
      if (editing) await api.put(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(editing.id), fd, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post(API_ENDPOINTS.ANNOUNCEMENTS.LIST, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Pengumuman disimpan");
      setOpen(false);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus pengumuman?")) return;
    await api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(id));
    toast.success("Dihapus");
    load();
  };

  const toggleActive = async (row) => {
    try {
      const next = !row.is_active;
      await api.patch(API_ENDPOINTS.ANNOUNCEMENTS.STATUS(row.id), { is_active: next });
      toast.success(next ? "Pengumuman diaktifkan" : "Pengumuman dinonaktifkan");
      load();
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  return (
    <div className="space-y-4" data-intro-admin-page-announcements>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Pengumuman</h1>
        <Button onClick={openCreate}>
          <Plus size={18} />
          Tambah
        </Button>
      </div>
      <Input placeholder="Cari judul..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              {row.image ? <img src={resolveImageUrl(row.image)} alt="" className="h-12 w-12 rounded-lg object-cover" /> : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-900">{row.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      row.is_active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500">
                  {row.body || "—"} · {row.audience}
                  {Number(row.repeat_interval_minutes) > 0
                    ? ` · ulang ${row.repeat_interval_minutes} mnt`
                    : " · setiap reload/login"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(row)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                  row.is_active
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {row.is_active ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <Button variant="outline" onClick={() => openEdit(row)}>
                Edit
              </Button>
              <button type="button" onClick={() => remove(row.id)} className="rounded-lg border border-red-200 p-2 text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={pagination.totalPages || 1}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(n) => {
          setLimit(n);
          setPage(1);
        }}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Pengumuman" : "Pengumuman Baru"}>
        <form onSubmit={save} className="space-y-3">
          <Input label="Judul" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            rows={4}
            placeholder="Teks pengumuman (opsional jika ada gambar)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <label className="block text-sm font-bold text-slate-700">Gambar (opsional)</label>
          <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
          <p className="text-xs leading-relaxed text-slate-500">{ANNOUNCEMENT_IMAGE_HINT}</p>
          <select
            value={form.audience}
            onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">Semua</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <select
            value={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
          <Input
            label="Tampilkan lagi setiap (menit)"
            type="number"
            min={0}
            value={form.repeat_interval_minutes}
            onChange={(e) => setForm((f) => ({ ...f, repeat_interval_minutes: e.target.value }))}
          />
          <p className="-mt-1 text-xs text-slate-500">
            0 = muncul lagi setiap reload halaman atau setelah login. Isi angka (mis. 30) untuk interval menit setelah ditutup.
          </p>
          <Input label="Link URL (opsional)" value={form.link_url} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} />
          <Button type="submit" loading={saving} className="w-full">
            Simpan
          </Button>
        </form>
      </Modal>
    </div>
  );
}
