import { LayoutGrid } from "lucide-react";
import { resolveImageUrl } from "@/utils/image";

export default function CategoryChips({ categories, value, onChange, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
          value === "" ? "border-blue-600 bg-white text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }`}
      >
        <LayoutGrid size={16} />
        Semua
      </button>
      {categories.map((c) => {
        const active = value === String(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(String(c.id))}
            className={`inline-flex max-w-[140px] shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              active ? "border-blue-600 bg-white text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {c.icon ? <img src={resolveImageUrl(c.icon)} alt="" className="h-5 w-5 rounded object-cover" /> : null}
            <span className="truncate">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
