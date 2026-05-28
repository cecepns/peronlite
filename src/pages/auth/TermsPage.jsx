import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { DEFAULT_TERMS_SECTIONS } from "@/constants/defaultTerms";
import { BRAND_NAME } from "@/constants/brand";

export default function TermsPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTerms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.TERMS);
      const rows = Array.isArray(res.data?.sections) ? res.data.sections : [];
      setSections(rows.length ? rows : DEFAULT_TERMS_SECTIONS);
      setUpdatedAt(res.data?.updated_at || null);
    } catch {
      setSections(DEFAULT_TERMS_SECTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Mei 2026";

  return (
    <div>
      <div className="mb-4 rounded-xl bg-blue-50 p-4">
        <button type="button" onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-900">
          <ChevronLeft size={18} />
          Kembali
        </button>
        <div className="flex items-start gap-3">
          <FileText className="shrink-0 text-blue-600" size={24} />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Syarat & Ketentuan</h1>
            <p className="text-sm text-slate-600">Penggunaan aplikasi {BRAND_NAME} · Diperbarui {updatedLabel}</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-bold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
