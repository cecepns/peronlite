import AsyncSelect from "react-select/async";
import { ImageIcon } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import { isFeedAdActive } from "@/utils/product";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#14b8a6" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px rgb(204 251 241)" : "none",
    "&:hover": { borderColor: "#5eead4" }
  }),
  menu: (base) => ({ ...base, zIndex: 50, borderRadius: "0.5rem" }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: state.isDisabled
      ? "#f8fafc"
      : state.isSelected
        ? "#0d9488"
        : state.isFocused
          ? "#f0fdfa"
          : "#fff",
    color: state.isDisabled ? "#94a3b8" : state.isSelected ? "#fff" : "#0f172a",
    cursor: state.isDisabled ? "not-allowed" : "default"
  }),
  placeholder: (base) => ({ ...base, fontSize: "0.875rem", color: "#94a3b8" }),
  singleValue: (base) => ({ ...base, fontSize: "0.875rem", color: "#0f172a" }),
  input: (base) => ({ ...base, fontSize: "0.875rem" })
};

export function toSellerProductOption(product) {
  const feedActive = isFeedAdActive(product);
  return {
    value: product.id,
    label: `#${product.id} · ${product.name} · ${formatRupiah(product.price)}${feedActive ? " (feed aktif)" : ""}`,
    product,
    isDisabled: feedActive
  };
}

function ProductOptionContent({ product, compact }) {
  const thumb = product.thumbnail ? resolveImageUrl(product.thumbnail) : null;
  const feedActive = isFeedAdActive(product);

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
          ID #{product.id} · {formatRupiah(product.price)}
          {feedActive ? " · Feed sudah aktif" : ""}
        </p>
      </div>
    </div>
  );
}

export default function SellerProductAsyncSelect({
  sellerId,
  value,
  onChange,
  isDisabled,
  placeholder,
  label = "Pilih Produk"
}) {
  const loadOptions = async (inputValue) => {
    const q = (inputValue || "").trim();
    if (q.length < 2) return [];
    const params = new URLSearchParams({
      seller_id: String(sellerId),
      product_type: "regular",
      search: q,
      limit: "25"
    });
    const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${params}`);
    const rows = Array.isArray(res.data) ? res.data : [];
    return rows.map(toSellerProductOption);
  };

  return (
    <div className="space-y-1.5">
      {label ? <span className="text-sm font-bold text-slate-700">{label}</span> : null}
      <AsyncSelect
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
        value={value}
        onChange={onChange}
        isClearable
        isDisabled={isDisabled}
        isOptionDisabled={(option) => Boolean(option.isDisabled)}
        placeholder={placeholder || "Ketik min. 2 karakter nama produk..."}
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
