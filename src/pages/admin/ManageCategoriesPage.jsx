import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get(API_ENDPOINTS.CATEGORIES.LIST).then((res) => setCategories(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIcon(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(null);
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    if (icon) fd.append("icon", icon);
    setSaving(true);
    try {
      if (editing) await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(editing.id), fd, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post(API_ENDPOINTS.CATEGORIES.CREATE, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(editing ? "Komoditas diupdate" : "Komoditas ditambahkan");
      setModalOpen(false);
      load();
    } catch {
      toast.error("Gagal menyimpan komoditas");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, catName) => {
    if (!window.confirm(`Hapus komoditas "${catName}"?`)) return;
    try {
      await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
      toast.success("Komoditas dihapus");
      load();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-4" data-intro-admin-page-categories>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Komoditas Pertanian</h1>
        <Button onClick={openCreate}>
          <Plus size={18} />
          Tambah
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-semibold">{c.name}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(c)} className="rounded-lg border p-1.5">
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => remove(c.id, c.name)} className="rounded-lg border border-red-200 p-1.5 text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Komoditas" : "Tambah Komoditas"}>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama komoditas (contoh: Karet, Jagung)" required />
          <input type="file" accept="image/*" onChange={(e) => setIcon(e.target.files?.[0] || null)} className="text-sm" />
          <Button type="submit" loading={saving} className="w-full">
            Simpan
          </Button>
        </form>
      </Modal>
    </div>
  );
}
