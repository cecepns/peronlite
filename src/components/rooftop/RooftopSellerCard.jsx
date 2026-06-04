import { Link } from "react-router-dom";
import { MapPin, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import { parseRooftopItems } from "@/utils/product";
import { BRAND_NAME } from "@/constants/brand";

export default function RooftopSellerCard({ product }) {
  const items = parseRooftopItems(product).slice(0, 3);
  const location = product.product_location_name || product.store_regency_name || product.store_address || "";
  const href = `/produk/${product.slug || product.id}`;
  const storeLabel = product.store_name || product.name;

  const onShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const lines = items.map((i) => `${i.name} ${formatRupiah(i.price)}`).join(" · ");
    const text = `${storeLabel} — ${lines} (${BRAND_NAME})`;
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) await navigator.share({ title: storeLabel, text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success("Link disalin");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border-[3px] border-[#FFD700] bg-white shadow-md shadow-amber-100/50 transition hover:shadow-lg">
      <Link to={href} className="flex gap-3.5 p-3.5 sm:p-4">
        <div className="relative shrink-0">
          <img
            src={resolveImageUrl(product.thumbnail || "")}
            alt=""
            className="h-28 w-28 rounded-xl bg-slate-100 object-cover sm:h-32 sm:w-32"
            loading="lazy"
          />
          <span className="absolute -bottom-1 -right-1 rounded-md bg-[#FFD700] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-slate-900 shadow">
            Roof
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">{storeLabel}</h3>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{product.description}</p>
          ) : null}
          <ul className="mt-2 space-y-0.5 border-t border-slate-100 pt-2 sm:mt-2.5 sm:space-y-1">
            {items.map((item) => (
              <li key={`${item.name}-${item.price}`} className="flex items-start justify-between gap-2 text-[11px] leading-tight sm:text-xs">
                <span className="line-clamp-2 min-w-0 max-w-[58%] font-semibold text-slate-800">{item.name}</span>
                <span className="shrink-0 text-right text-[10px] font-extrabold tabular-nums text-slate-900 sm:text-[11px]">
                  {formatRupiah(item.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 border-t border-amber-100 bg-amber-50/40 px-3.5 py-2 sm:px-4">
        {location ? (
          <span className="inline-flex min-w-0 items-center gap-1 text-xs font-medium text-slate-600">
            <MapPin size={13} className="shrink-0 text-amber-700" />
            <span className="truncate">{location}</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400">Lokasi tidak tersedia</span>
        )}
        <button
          type="button"
          onClick={onShare}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Share2 size={14} />
          Bagikan
        </button>
      </div>
    </article>
  );
}
