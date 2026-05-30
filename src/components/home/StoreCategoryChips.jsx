import { Users } from "lucide-react";
import { STORE_CATEGORIES } from "@/constants/storeCategories";

export default function StoreCategoryChips({ value, onChange, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
          value === "" ? "border-blue-600 bg-white text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }`}
      >
        <Users size={16} />
        Semua
      </button>
      {STORE_CATEGORIES.map((c) => {
        const active = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              active ? "border-blue-600 bg-white text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
