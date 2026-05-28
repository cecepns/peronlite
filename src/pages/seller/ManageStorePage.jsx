import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ManageStorePage() {
  const { user } = useAuth();
  const [store, setStore] = useState({
    name: "",
    description: "",
    address: "",
    address_detail: "",
    phone: "",
    province_code: "",
    province_name: "",
    regency_code: "",
    regency_name: "",
    district_code: "",
    district_name: "",
    village_code: "",
    village_name: ""
  });
  const [logo, setLogo] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(API_ENDPOINTS.REGIONS.PROVINCES).then((res) => setProvinces(res.data || [])).catch(() => null);
    api
      .get(API_ENDPOINTS.STORE.DETAIL(user.id))
      .then((res) => {
        if (!res.data) return;
        setStore((prev) => ({ ...prev, ...res.data, address_detail: res.data.address_detail || "" }));
      })
      .catch(() => null);
  }, [user.id]);

  useEffect(() => {
    if (!store.province_code) {
      setRegencies([]);
      return;
    }
    api.get(API_ENDPOINTS.REGIONS.REGENCIES(store.province_code)).then((res) => setRegencies(res.data || []));
  }, [store.province_code]);

  useEffect(() => {
    if (!store.regency_code) {
      setDistricts([]);
      return;
    }
    api.get(API_ENDPOINTS.REGIONS.DISTRICTS(store.regency_code)).then((res) => setDistricts(res.data || []));
  }, [store.regency_code]);

  useEffect(() => {
    if (!store.district_code) {
      setVillages([]);
      return;
    }
    api.get(API_ENDPOINTS.REGIONS.VILLAGES(store.district_code)).then((res) => setVillages(res.data || []));
  }, [store.district_code]);

  const updateField = (key, value, extra = {}) => {
    setStore((prev) => ({ ...prev, [key]: value, ...extra }));
  };

  const saveStore = async (e) => {
    e.preventDefault();
    const composedAddress = [store.village_name, store.district_name, store.regency_name, store.province_name, store.address_detail]
      .filter(Boolean)
      .join(", ");
    const form = new FormData();
    Object.entries({ ...store, address: composedAddress }).forEach(([key, value]) => form.append(key, value || ""));
    form.append("user_id", String(user.id));
    if (logo) form.append("logo", logo);
    setSaving(true);
    try {
      if (store.id) await api.put(API_ENDPOINTS.STORE.UPDATE(store.id), form, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post(API_ENDPOINTS.STORE.CREATE, form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Toko disimpan");
      const res = await api.get(API_ENDPOINTS.STORE.DETAIL(user.id));
      if (res.data) setStore((prev) => ({ ...prev, ...res.data }));
    } catch {
      toast.error("Gagal menyimpan toko");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={saveStore}
      data-intro-seller-page-toko
      className="mx-auto max-w-2xl space-y-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <h1 className="text-xl font-bold text-slate-900">Kelola Toko</h1>
      <Input label="Nama toko" value={store.name} onChange={(e) => updateField("name", e.target.value)} required />
      <label className="block text-sm font-semibold text-slate-700">Deskripsi</label>
      <textarea
        value={store.description}
        onChange={(e) => updateField("description", e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
      />
      <Input label="Telepon / WhatsApp" value={store.phone} onChange={(e) => updateField("phone", e.target.value)} />
      <label className="block text-sm font-semibold text-slate-700">Logo toko</label>
      <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="text-sm" />
      <label className="block text-sm font-semibold text-slate-700">Provinsi</label>
      <select
        value={store.province_code}
        onChange={(e) => {
          const p = provinces.find((x) => x.code === e.target.value);
          updateField("province_code", e.target.value, {
            province_name: p?.name || "",
            regency_code: "",
            regency_name: "",
            district_code: "",
            district_name: "",
            village_code: "",
            village_name: ""
          });
        }}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">Pilih provinsi</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>
      <label className="block text-sm font-semibold text-slate-700">Kabupaten / Kota</label>
      <select
        value={store.regency_code}
        onChange={(e) => {
          const r = regencies.find((x) => x.code === e.target.value);
          updateField("regency_code", e.target.value, {
            regency_name: r?.name || "",
            district_code: "",
            district_name: "",
            village_code: "",
            village_name: ""
          });
        }}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">Pilih kab/kota</option>
        {regencies.map((r) => (
          <option key={r.code} value={r.code}>
            {r.name}
          </option>
        ))}
      </select>
      <label className="block text-sm font-semibold text-slate-700">Kecamatan</label>
      <select
        value={store.district_code}
        onChange={(e) => {
          const d = districts.find((x) => x.code === e.target.value);
          updateField("district_code", e.target.value, { district_name: d?.name || "", village_code: "", village_name: "" });
        }}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">Pilih kecamatan</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>
      <label className="block text-sm font-semibold text-slate-700">Kelurahan</label>
      <select
        value={store.village_code}
        onChange={(e) => {
          const v = villages.find((x) => x.code === e.target.value);
          updateField("village_code", e.target.value, { village_name: v?.name || "" });
        }}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">Pilih kelurahan</option>
        {villages.map((v) => (
          <option key={v.code} value={v.code}>
            {v.name}
          </option>
        ))}
      </select>
      <Input label="Detail alamat" value={store.address_detail} onChange={(e) => updateField("address_detail", e.target.value)} />
      <Button type="submit" loading={saving} className="w-full">
        Simpan Toko
      </Button>
    </form>
  );
}
