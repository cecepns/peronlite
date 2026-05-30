import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, MapPin, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProductImageUpload from "@/components/product/ProductImageUpload";
import RegencySearchModal from "@/components/regency/RegencySearchModal";
import { parseRooftopItems } from "@/utils/product";

const emptyItem = () => ({ name: "", price: "" });

function makeFileEntry(file) {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file)
  };
}

export default function ProductFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isRooftop = searchParams.get("tipe") === "rooftop";
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category_id: "", description: "" });
  const [serviceRegencyCode, setServiceRegencyCode] = useState("");
  const [serviceRegencyLabel, setServiceRegencyLabel] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [rooftopItems, setRooftopItems] = useState([emptyItem(), emptyItem(), emptyItem()]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(API_ENDPOINTS.CATEGORIES.LIST).then((res) => setCategories(res.data || []));
    api
      .get(API_ENDPOINTS.STORE.DETAIL(user.id))
      .then((res) => {
        if (!res.data || isEdit) return;
        if (res.data.regency_code) {
          setServiceRegencyCode(res.data.regency_code);
          setServiceRegencyLabel(res.data.regency_name || "");
        }
      })
      .catch(() => null);
    if (!isEdit) return;
    api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id)).then((res) => {
      const d = res.data;
      setForm({
        name: d.name || "",
        price: String(d.price || ""),
        category_id: String(d.category_id || ""),
        description: d.description || ""
      });
      if (d.service_regency_code) {
        setServiceRegencyCode(d.service_regency_code);
        setServiceRegencyLabel(d.service_regency_name || d.product_location_name || "");
      }
      const items = parseRooftopItems(d);
      if (items.length) setRooftopItems(items.map((i) => ({ name: i.name, price: String(i.price) })));
      const imgs = Array.isArray(d.images) ? d.images : d.thumbnail ? [{ id: 0, image: d.thumbnail }] : [];
      setExistingImages(imgs.filter((img) => img?.image));
    });
  }, [id, isEdit, user.id]);

  const addFiles = useCallback(
    (files) => {
      if (!files.length) return;
      if (isRooftop) {
        setNewFiles((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.preview));
          return [makeFileEntry(files[0])];
        });
        return;
      }
      setNewFiles((prev) => {
        const room = 10 - existingImages.length - prev.length;
        const next = [...prev, ...files.slice(0, Math.max(0, room)).map(makeFileEntry)];
        return next;
      });
    },
    [isRooftop, existingImages.length]
  );

  const removeNewFile = useCallback((fileId) => {
    setNewFiles((prev) => {
      const target = prev.find((p) => p.id === fileId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== fileId);
    });
  }, []);

  const hasAnyImage = existingImages.length > 0 || newFiles.length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category_id", form.category_id);
    fd.append("description", form.description);
    fd.append("product_type", isRooftop ? "rooftop" : "regular");
    if (serviceRegencyCode) {
      fd.append("service_regency_code", serviceRegencyCode);
      fd.append("service_regency_name", serviceRegencyLabel);
    }
    if (isRooftop) {
      const cleaned = rooftopItems
        .map((i) => ({ name: i.name.trim(), price: Number(i.price) }))
        .filter((i) => i.name && i.price > 0);
      if (!cleaned.length) {
        toast.error("Isi minimal satu komoditas");
        return;
      }
      fd.append("rooftop_items", JSON.stringify(cleaned));
      if (!hasAnyImage) {
        toast.error("Gambar thumbnail wajib");
        return;
      }
    } else {
      fd.append("price", form.price);
    }
    newFiles.forEach((item) => fd.append("images", item.file));
    setSaving(true);
    try {
      if (isEdit) await api.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), fd, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post(API_ENDPOINTS.PRODUCTS.CREATE, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(isEdit ? "Produk diupdate" : "Produk ditambahkan");
      navigate(`/seller/produk?tipe=${isRooftop ? "rooftop" : "regular"}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const uploadHint = isEdit
    ? "Foto baru akan mengganti semua foto lama setelah disimpan."
    : isRooftop
      ? "Thumbnail tampil di kartu Roof Top."
      : "Bisa pilih beberapa foto sekaligus.";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">
        {isEdit ? "Edit" : "Tambah"} {isRooftop ? "Roof Top" : "Produk Biasa"}
      </h1>

      <Input label="Nama / Judul" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />

      {!isRooftop ? (
        <Input label="Harga (angka)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-700">Daftar Komoditas (max 10)</p>
          {rooftopItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nama komoditas"
                value={item.name}
                onChange={(e) =>
                  setRooftopItems((rows) => rows.map((r, i) => (i === index ? { ...r, name: e.target.value } : r)))
                }
              />
              <Input
                type="number"
                placeholder="Harga"
                value={item.price}
                onChange={(e) =>
                  setRooftopItems((rows) => rows.map((r, i) => (i === index ? { ...r, price: e.target.value } : r)))
                }
              />
              {rooftopItems.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setRooftopItems((rows) => rows.filter((_, i) => i !== index))}
                  className="shrink-0 rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          ))}
          {rooftopItems.length < 10 ? (
            <Button type="button" variant="outline" className="w-full" onClick={() => setRooftopItems((r) => [...r, emptyItem()])}>
              <Plus size={16} />
              Tambah baris
            </Button>
          ) : null}
        </div>
      )}

      <div className="space-y-1.5">
        <span className="text-sm font-bold text-slate-700">Asal daerah komoditas</span>
        <button
          type="button"
          onClick={() => setLocationOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
        >
          <span className="inline-flex min-w-0 items-center gap-2 truncate">
            <MapPin size={18} className="shrink-0 text-blue-600" />
            {serviceRegencyLabel || "Pilih kabupaten / kota"}
          </span>
          <ChevronDown size={18} className="shrink-0 text-slate-500" />
        </button>
        <p className="text-xs text-slate-500">Default mengikuti lokasi toko. Bisa diubah per produk.</p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-bold text-slate-700">Komoditas</span>
        <select
          value={form.category_id}
          onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          required
        >
          <option value="">Pilih komoditas</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-bold text-slate-700">{isRooftop ? "Tagline / deskripsi singkat" : "Deskripsi"}</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <ProductImageUpload
        label={isRooftop ? "Gambar thumbnail" : "Gambar produk"}
        hint={uploadHint}
        multiple={!isRooftop}
        max={isRooftop ? 1 : 10}
        existingImages={existingImages}
        newFiles={newFiles}
        onAddFiles={addFiles}
        onRemoveNew={removeNewFile}
        disabled={saving}
      />

      <RegencySearchModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        selectedCode={serviceRegencyCode || undefined}
        title="Asal daerah komoditas"
        onSelect={({ code, name, province_name }) => {
          setServiceRegencyCode(code || "");
          setServiceRegencyLabel(!code ? "" : province_name ? `${name} · ${province_name}` : name);
        }}
      />

      <div className="flex gap-2 border-t border-slate-100 pt-2">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Batal
        </Button>
        <Button type="submit" loading={saving} className="flex-1 sm:flex-none">
          Simpan
        </Button>
      </div>
    </form>
  );
}
