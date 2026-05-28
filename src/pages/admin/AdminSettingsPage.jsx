import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [termsSections, setTermsSections] = useState([{ title: "", body: "" }]);
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => setWhatsapp(res.data?.whatsapp || ""));
    api.get(API_ENDPOINTS.TERMS).then((res) => {
      const rows = res.data?.sections;
      if (Array.isArray(rows) && rows.length) setTermsSections(rows);
    });
  }, []);

  const saveContact = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await api.put(API_ENDPOINTS.ADMIN.CONTACT, { whatsapp });
      toast.success("Kontak disimpan");
    } catch {
      toast.error("Gagal menyimpan kontak");
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <div className="space-y-6" data-intro-admin-page-settings>
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      <form onSubmit={saveContact} className="max-w-md space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Phone size={20} className="text-blue-600" />
          Kontak Admin
        </div>
        <Input label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="628..." />
        <Button type="submit" loading={savingContact}>
          Simpan Kontak
        </Button>
      </form>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 font-bold">
          <FileText size={20} className="text-blue-600" />
          Syarat & Ketentuan
        </div>
        <p className="mt-1 text-sm text-slate-500">Kelola teks S&K yang ditampilkan di aplikasi.</p>
        <Link to="/syarat-ketentuan" className="mt-3 inline-block text-sm font-semibold text-blue-600">
          Lihat halaman S&K →
        </Link>
        <p className="mt-2 text-xs text-slate-400">{termsSections.length} section terdaftar di API.</p>
      </div>
    </div>
  );
}
