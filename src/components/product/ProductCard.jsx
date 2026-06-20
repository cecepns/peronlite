import { Link } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";

export default function ProductCard({ product, to, showPremiumBadge = false }) {
  const href = to || `/produk/${product.slug || product.id}`;
  const isPremium =
    showPremiumBadge || Number(product.seller_is_premium_paid) === 1 || Number(product.is_premium) === 1;

  return (
    <Link
      to={href}
      className="relative block h-full w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      {isPremium ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-0.5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
          <Sparkles size={10} />
          Premium
        </span>
      ) : null}
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
