import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";

export default function ProductCard({ product, to }) {
  const href = to || `/jasa/${product.id}`;

  return (
    <Link
      to={href}
      className="block h-full w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <img
        src={resolveImageUrl(product.thumbnail || "")}
        alt={product.name}
        className="aspect-[4/3] w-full rounded-lg bg-slate-100 object-cover"
        loading="lazy"
      />
      <h3 className="mt-1.5 truncate text-sm font-bold text-slate-900">{product.name}</h3>
      {product.product_location_name ? (
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{product.product_location_name}</span>
        </div>
      ) : null}
      <p className="mt-1 text-sm font-bold text-teal-700">{formatRupiah(product.price)}</p>
    </Link>
  );
}
