import { Users } from "lucide-react";
import { STORE_CATEGORIES } from "@/constants/storeCategories";

const ALL_CHIP = {
  idle: "border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 text-sky-800 hover:border-sky-300",
  active: "border-sky-600 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md"
};

const CATEGORY_CHIP_STYLES = [
  {
    idle: "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 text-violet-800 hover:border-violet-300",
    active: "border-violet-600 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md"
  },
  {
    idle: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-800 hover:border-emerald-300",
    active: "border-emerald-600 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md"
  },
  {
    idle: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 hover:border-amber-300",
    active: "border-amber-600 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md"
  }
];

function chipClass(active, styles) {
  return `inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
    active ? styles.active : styles.idle
  }`;
}

export default function StoreCategoryChips({ value, onChange, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-9 w-24 shrink-0 animate-pulse rounded-xl border bg-white ${
              i === 0
                ? "border-sky-200"
                : i === 1
                  ? "border-violet-200"
                  : i === 2
                    ? "border-emerald-200"
                    : "border-amber-200"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange("")}
        className={chipClass(value === "", ALL_CHIP)}
      >
        <Users size={16} />
        Semua
      </button>
      {STORE_CATEGORIES.map((c, index) => {
        const styles = CATEGORY_CHIP_STYLES[index] || ALL_CHIP;
        const active = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className={chipClass(active, styles)}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
