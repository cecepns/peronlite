import AsyncSelect from "react-select/async";
import { ImageIcon } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#60a5fa" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px rgb(219 234 254)" : "none",
    "&:hover": { borderColor: "#93c5fd" }
  }),
  menu: (base) => ({ ...base, zIndex: 50, borderRadius: "0.5rem" }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a"
  }),
  placeholder: (base) => ({ ...base, fontSize: "0.875rem", color: "#94a3b8" }),
  singleValue: (base) => ({ ...base, fontSize: "0.875rem", color: "#0f172a" }),
  input: (base) => ({ ...base, fontSize: "0.875rem" })
};

function toOption(product) {
  const highlight = Number(product.is_highlight) === 1 ? " · Highlight" : "";
  return {
    value: product.id,
    label: `#${product.id} · ${product.name} — ${product.store_name || "Toko"}${highlight}`,
    product
  };
}

function ProductOptionContent({ product, compact }) {
  const thumb = product.thumbnail ? resolveImageUrl(product.thumbnail) : null;
  return (
    <div className={`flex min-w-0 items-center gap-3 ${compact ? "" : "py-0.5"}`}>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className={`shrink-0 rounded-lg border border-slate-200/80 bg-slate-100 object-cover ${compact ? "h-8 w-8" : "h-11 w-11"}`}
        />
      ) : (
        <span
          className={`flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 ${compact ? "h-8 w-8" : "h-11 w-11"}`}
        >
          <ImageIcon size={compact ? 16 : 20} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{product.name}</p>
        <p className="truncate text-xs opacity-80">
          ID #{product.id} · {product.store_name} · {product.seller_name} · {formatRupiah(product.price)}
        </p>
      </div>
    </div>
  );
}

async function loadProductOptions(inputValue) {
  const q = (inputValue || "").trim();
  if (q.length < 2) return [];
  const res = await api.get(
    `${API_ENDPOINTS.ADMIN.PRODUCTS}?search=${encodeURIComponent(q)}&limit=25`
  );
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map(toOption);
}

export default function AdminProductAsyncSelect({ value, onChange, placeholder, isDisabled }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-bold text-slate-700">Pilih Produk</span>
      <AsyncSelect
        cacheOptions
        defaultOptions={false}
        loadOptions={loadProductOptions}
        value={value}
        onChange={onChange}
        isClearable
        isDisabled={isDisabled}
        placeholder={placeholder || "Ketik min. 2 karakter (nama, toko, ID)..."}
        noOptionsMessage={({ inputValue }) =>
          (inputValue || "").trim().length < 2 ? "Ketik minimal 2 karakter untuk mencari" : "Produk tidak ditemukan"
        }
        loadingMessage={() => "Mencari produk..."}
        styles={selectStyles}
        formatOptionLabel={(option, { context }) => {
          const p = option.product;
          if (!p) return option.label;
          return <ProductOptionContent product={p} compact={context === "value"} />;
        }}
      />
    </div>
  );
}
