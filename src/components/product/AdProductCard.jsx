import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";

/** Kartu iklan produk — ukuran lebih besar untuk feed highlight. */
export default function AdProductCard({ product, to }) {
  const href = to || `/jasa/${product.id}`;

  return (
    <Link
      to={href}
      className="flex min-w-0 gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-3 shadow-sm transition hover:border-amber-300 hover:shadow-md"
    >
      <img
        src={resolveImageUrl(product.thumbnail || "")}
        alt={product.name}
        className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 object-cover sm:h-28 sm:w-28"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <span className="mb-1 inline-block rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
          Iklan
        </span>
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">{product.name}</h3>
        {product.product_location_name ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{product.product_location_name}</span>
          </div>
        ) : null}
        <p className="mt-2 text-lg font-extrabold text-teal-700">{formatRupiah(product.price)}</p>
      </div>
    </Link>
  );
}
