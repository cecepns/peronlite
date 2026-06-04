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
  const [whatsapp2, setWhatsapp2] = useState("");
  const [termsText, setTermsText] = useState("");
  const [termsUpdatedAt, setTermsUpdatedAt] = useState(null);
  const [savingContact, setSavingContact] = useState(false);
  const [savingTerms, setSavingTerms] = useState(false);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.CONTACT).then((res) => {
      setWhatsapp(res.data?.whatsapp || "");
      setWhatsapp2(res.data?.whatsapp_2 || "");
      setTermsText(res.data?.terms_text || "");
      setTermsUpdatedAt(res.data?.terms_updated_at || null);
    });
  }, []);

  const saveContact = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await api.put(API_ENDPOINTS.ADMIN.CONTACT, { whatsapp, whatsapp_2: whatsapp2 });
      toast.success("Kontak disimpan");
    } catch {
      toast.error("Gagal menyimpan kontak");
    } finally {
      setSavingContact(false);
    }
  };

  const saveTerms = async (e) => {
    e.preventDefault();
    setSavingTerms(true);
    try {
      await api.put(API_ENDPOINTS.ADMIN.CONTACT, { terms_text: termsText || "" });
      const res = await api.get(API_ENDPOINTS.ADMIN.CONTACT);
      setTermsUpdatedAt(res.data?.terms_updated_at || null);
      toast.success("Syarat & ketentuan disimpan");
    } catch {
      toast.error("Gagal menyimpan syarat & ketentuan");
    } finally {
      setSavingTerms(false);
    }
  };

  const updatedLabel = termsUpdatedAt
    ? new Date(termsUpdatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-6" data-intro-admin-page-settings>
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>

      <form onSubmit={saveContact} className="max-w-md space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Phone size={20} className="text-blue-600" />
          Kontak Admin
        </div>
        <Input label="WhatsApp Admin 1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="628..." />
        <Input label="WhatsApp Admin 2 (opsional)" value={whatsapp2} onChange={(e) => setWhatsapp2(e.target.value)} placeholder="628..." />
        <p className="text-xs text-slate-500">Nomor admin ditampilkan di halaman profil & login untuk bantuan pengguna.</p>
        <Button type="submit" loading={savingContact}>
          Simpan Kontak
        </Button>
      </form>

      <form onSubmit={saveTerms} className="max-w-3xl space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <FileText size={20} className="text-blue-600" />
            Syarat & Ketentuan
          </div>
          <Link to="/syarat-ketentuan" className="text-sm font-semibold text-blue-600 hover:underline">
            Pratinjau halaman →
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          Format: judul dengan <code className="rounded bg-slate-100 px-1"># </code> di awal baris, paragraf di baris
          berikutnya. Pisahkan bagian dengan baris kosong.
        </p>
        {updatedLabel ? <p className="text-xs text-slate-400">Terakhir diperbarui: {updatedLabel}</p> : null}
        <textarea
          value={termsText}
          onChange={(e) => setTermsText(e.target.value)}
          rows={16}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder={"# 1. Ketentuan Umum\nIsi paragraf...\n\n# 2. Akun Pengguna\n..."}
        />
        <Button type="submit" loading={savingTerms}>
          Simpan Syarat & Ketentuan
        </Button>
      </form>
    </div>
  );
}
