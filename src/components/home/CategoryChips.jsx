import { LayoutGrid } from "lucide-react";
import { resolveImageUrl } from "@/utils/image";

const chipBase =
  "inline-flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center transition min-w-[4.5rem] max-w-[5.5rem] sm:min-w-[5rem] sm:max-w-[6rem]";

function chipClass(active) {
  return `${chipBase} ${
    active
      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
  }`;
}

export default function CategoryChips({ categories, value, onChange, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[4.25rem] w-[4.5rem] shrink-0 animate-pulse rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button type="button" onClick={() => onChange("")} className={chipClass(value === "")}>
        <LayoutGrid size={20} className="shrink-0" />
        <span className="line-clamp-2 text-[10px] font-bold leading-tight sm:text-[11px]">Semua</span>
      </button>
      {categories.map((c) => {
        const active = value === String(c.id);
        return (
          <button key={c.id} type="button" onClick={() => onChange(String(c.id))} className={chipClass(active)}>
            {c.icon ? (
              <img src={resolveImageUrl(c.icon)} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                {c.name?.charAt(0) || "?"}
              </span>
            )}
            <span className="line-clamp-2 w-full text-[10px] font-bold leading-[1.15] sm:text-[11px]">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
