import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AdminPageStack, AdminScreenHeader, AdminSectionCard } from "@/components/admin/AdminPageUi";

export default function AdminPricelistEditor({
  title,
  subtitle,
  backTo,
  listBasePath,
  paymentFieldKey,
  paymentQrisFieldKey,
  paymentQrisType,
  packageLabelPrefix = "Paket"
}) {
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [qrisImage, setQrisImage] = useState("");
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisPreview, setQrisPreview] = useState("");
  const [uploadingQris, setUploadingQris] = useState(false);
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadPricelist = useCallback(async () => {
    const res = await api.get(listBasePath);
    setPricelist(Array.isArray(res.data) ? res.data : []);
  }, [listBasePath]);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => {
      setPaymentInstructions(res.data?.[paymentFieldKey] || "");
      if (paymentQrisFieldKey) setQrisImage(res.data?.[paymentQrisFieldKey] || "");
    });
    loadPricelist();
  }, [loadPricelist, paymentFieldKey, paymentQrisFieldKey]);

  const resetForm = () => {
    setPrice("");
    setDurationDays("");
    setEditingId(null);
  };

  const savePricelistItem = async (e) => {
    e.preventDefault();
    if (!price || !durationDays) {
      toast.error("Harga dan durasi wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = { price, duration_days: Number(durationDays) };
      if (editingId) {
        await api.put(`${listBasePath}/${editingId}`, payload);
      } else {
        await api.post(listBasePath, payload);
      }
      resetForm();
      loadPricelist();
      toast.success("Pricelist disimpan");
    } catch {
      toast.error("Gagal menyimpan pricelist");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Hapus paket ini?")) return;
    try {
      await api.delete(`${listBasePath}/${id}`);
      loadPricelist();
      toast.success("Paket dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const savePayment = async (e) => {
    e.preventDefault();
    try {
      await api.put(API_ENDPOINTS.ADMIN.CONTACT, { [paymentFieldKey]: paymentInstructions });
      toast.success("Instruksi bayar disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  const uploadQris = async () => {
    if (!qrisFile || !paymentQrisType) return;
    setUploadingQris(true);
    try {
      const form = new FormData();
      form.append("payment_type", paymentQrisType);
      form.append("qris_image", qrisFile);
      const res = await api.post(API_ENDPOINTS.ADMIN.PAYMENT_QRIS, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setQrisImage(res.data?.path || "");
      setQrisFile(null);
      if (qrisPreview) URL.revokeObjectURL(qrisPreview);
      setQrisPreview("");
      toast.success("Gambar QRIS disimpan");
    } catch {
      toast.error("Gagal upload QRIS");
    } finally {
      setUploadingQris(false);
    }
  };

  const removeQris = async () => {
    if (!paymentQrisType || !window.confirm("Hapus gambar QRIS?")) return;
    try {
      await api.delete(API_ENDPOINTS.ADMIN.PAYMENT_QRIS_DELETE(paymentQrisType));
      setQrisImage("");
      setQrisFile(null);
      if (qrisPreview) URL.revokeObjectURL(qrisPreview);
      setQrisPreview("");
      toast.success("QRIS dihapus");
    } catch {
      toast.error("Gagal menghapus QRIS");
    }
  };

  return (
    <AdminPageStack>
      <AdminScreenHeader title={title} subtitle={subtitle} backTo={backTo} />

      <AdminSectionCard title={`Daftar Paket (${pricelist.length})`}>
        <div className="space-y-2">
          {pricelist.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div>
                <p className="font-bold text-slate-900">{formatRupiah(item.price)}</p>
                <p className="text-xs text-slate-500">
                  {packageLabelPrefix} {item.duration_days} hari
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setPrice(String(item.price));
                    setDurationDays(String(item.duration_days));
                  }}
                  className="rounded-lg border border-slate-200 p-2 hover:bg-white"
                >
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {!pricelist.length ? <p className="text-sm text-slate-500">Belum ada paket.</p> : null}
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={editingId ? "Edit Paket" : "Tambah Paket"}>
        <form onSubmit={savePricelistItem} className="grid gap-3 sm:grid-cols-2">
          <Input label="Harga (Rp)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50000" />
          <Input label="Durasi (hari)" type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="7" />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" loading={saving}>
              {editingId ? "Update Paket" : <><Plus size={16} className="mr-1 inline" /> Tambah Paket</>}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
            ) : null}
          </div>
        </form>
      </AdminSectionCard>

      <form onSubmit={savePayment}>
        <AdminSectionCard title="Instruksi Cara Order & Bayar">
          <textarea
            value={paymentInstructions}
            onChange={(e) => setPaymentInstructions(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            placeholder="Transfer ke rekening..."
          />
          <Button type="submit" className="mt-3">
            Simpan Instruksi
          </Button>
        </AdminSectionCard>
      </form>

      {paymentQrisType ? (
        <AdminSectionCard title="Gambar QRIS" subtitle="Seller dapat melihat saat klik tombol di halaman order">
          {(qrisPreview || qrisImage) && (
            <img
              src={qrisPreview || resolveImageUrl(qrisImage)}
              alt="Preview QRIS"
              className="mx-auto mb-3 max-h-48 w-full max-w-xs rounded-lg border border-slate-200 object-contain"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (qrisPreview) URL.revokeObjectURL(qrisPreview);
              setQrisFile(file);
              setQrisPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-slate-600"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" loading={uploadingQris} disabled={!qrisFile} onClick={uploadQris}>
              Upload QRIS
            </Button>
            {qrisImage ? (
              <Button type="button" variant="outline" onClick={removeQris}>
                Hapus QRIS
              </Button>
            ) : null}
          </div>
        </AdminSectionCard>
      ) : null}
    </AdminPageStack>
  );
}
