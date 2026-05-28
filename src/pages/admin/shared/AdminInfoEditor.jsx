import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import Button from "@/components/ui/Button";
import { AdminPageStack, AdminScreenHeader, AdminSectionCard } from "@/components/admin/AdminPageUi";

export default function AdminInfoEditor({ title, subtitle, backTo, fieldKey, placeholder }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => setText(res.data?.[fieldKey] || ""));
  }, [fieldKey]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(API_ENDPOINTS.ADMIN.CONTACT, { [fieldKey]: text });
      toast.success("Penjelasan disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageStack>
      <AdminScreenHeader title={title} subtitle={subtitle} backTo={backTo} />
      <form onSubmit={onSave}>
        <AdminSectionCard title="Isi Penjelasan" subtitle="Ditampilkan ke seller saat order.">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
          <Button type="submit" loading={saving} className="w-full sm:w-auto">
            Simpan Penjelasan
          </Button>
        </AdminSectionCard>
      </form>
    </AdminPageStack>
  );
}
