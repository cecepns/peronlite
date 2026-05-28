import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import Modal from "@/components/ui/Modal";

const normalize = (s = "") => s.toLowerCase().trim();

export default function RegencySearchModal({ open, onClose, onSelect, title = "Pilih kabupaten / kota", selectedCode }) {
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState([]);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.REGIONS.ALL_REGENCIES, { timeout: 180000 });
      setAll(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAll([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    if (!all.length) load();
  }, [open, all.length, load]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return all;
    return all.filter(
      (r) =>
        normalize(r.name).includes(q) ||
        normalize(r.province_name || "").includes(q) ||
        normalize(`${r.name} ${r.province_name || ""}`).includes(q)
    );
  }, [all, query]);

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari kota, kabupaten, atau provinsi..."
        className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <ul className="max-h-[50dvh] overflow-y-auto rounded-lg border border-slate-100">
          <li>
            <button
              type="button"
              className={`w-full border-b border-slate-50 px-3 py-3 text-left hover:bg-blue-50 ${!selectedCode ? "bg-blue-50" : ""}`}
              onClick={() => {
                onSelect({ code: "", name: "", province_name: "" });
                onClose();
              }}
            >
              <span className="font-semibold text-slate-900">Semua Kota</span>
            </button>
          </li>
          {filtered.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                className={`w-full border-b border-slate-50 px-3 py-3 text-left hover:bg-blue-50 ${selectedCode === item.code ? "bg-blue-50" : ""}`}
                onClick={() => {
                  onSelect({ code: item.code, name: item.name, province_name: item.province_name });
                  onClose();
                }}
              >
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.province_name}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
