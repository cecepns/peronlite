import { Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function HomeProductSection({
  id,
  title,
  subtitle,
  products = [],
  loading = false,
  emptyText = "Belum ada produk.",
  variant = "default",
}) {
  const isPremium = variant === "premium";

  return (
    <section className="min-w-0 pt-1" aria-labelledby={id}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isPremium ? (
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <Sparkles size={16} />
              </span>
            ) : null}
            <h2 id={id} className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h2>
          </div>
          {subtitle ? <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p> : null}
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-0">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div key={p.id} className="min-w-0">
                <ProductCard product={p} showPremiumBadge={isPremium || Number(p.seller_is_premium_paid) === 1} />
              </div>
            ))}
      </div>

      {!loading && !products.length ? (
        <p className="py-3 text-center text-sm text-slate-500">{emptyText}</p>
      ) : null}
    </section>
  );
}
