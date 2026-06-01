import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import "./banner-carousel.css";

const NAV_BTN =
  "pointer-events-auto absolute top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-amber-200 bg-white/95 text-amber-800 shadow-md backdrop-blur-sm transition hover:bg-amber-50 active:scale-95 sm:h-9 sm:w-9";

const HEIGHT_CLASS = "h-[148px] sm:h-[168px]";

export default function AdProductCarousel({ products, viewAllTo = "/iklan-produk" }) {
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const canNavigate = products.length > 1;

  const syncIndexFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(next, products.length - 1));
    indexRef.current = clamped;
    setActiveIndex(clamped);
  }, [products.length]);

  const scrollToIndex = useCallback(
    (target, smooth = true) => {
      const el = trackRef.current;
      if (!el || !products.length) return;
      const next = ((target % products.length) + products.length) % products.length;
      const left = next * el.clientWidth;
      el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      indexRef.current = next;
      setActiveIndex(next);
    },
    [products.length]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const onResize = () => scrollToIndex(indexRef.current, false);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollToIndex, products]);

  useEffect(() => {
    scrollToIndex(0, false);
  }, [products, scrollToIndex]);

  useEffect(() => {
    if (!canNavigate) return undefined;
    const timer = setInterval(() => scrollToIndex(indexRef.current + 1), 4500);
    return () => clearInterval(timer);
  }, [canNavigate, scrollToIndex, products.length]);

  if (!products.length) return null;

  return (
    <section className="min-w-0 space-y-2" aria-labelledby="home-ads-heading">
      <div className="flex items-center justify-between gap-2">
        <h2 id="home-ads-heading" className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          Iklan Produk
        </h2>
        {viewAllTo ? (
          <Link to={viewAllTo} className="shrink-0 text-xs font-bold text-blue-600 hover:underline">
            Lihat semua
          </Link>
        ) : null}
      </div>
      <div
        className={`banner-carousel relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm ${HEIGHT_CLASS}`}
        aria-roledescription="carousel"
        aria-label="Iklan produk"
      >
        <div ref={trackRef} className="banner-carousel__track" onScroll={syncIndexFromScroll}>
          {products.map((product) => {
            const href = `/jasa/${product.slug || product.id}`;
            return (
              <div key={product.id} className="banner-carousel__slide">
                <Link to={href} className="flex h-full w-full gap-3 p-3 sm:p-3.5">
                  <img
                    src={resolveImageUrl(product.thumbnail || "")}
                    alt={product.name}
                    className="h-full w-[38%] max-w-[140px] shrink-0 rounded-xl object-cover"
                    draggable={false}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="mb-1 inline-block w-fit rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                      Iklan
                    </span>
                    <p className="line-clamp-2 text-base font-bold leading-snug text-slate-900 sm:text-lg">{product.name}</p>
                    {product.product_location_name ? (
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{product.product_location_name}</span>
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-lg font-extrabold text-teal-700">{formatRupiah(product.price)}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {canNavigate ? (
          <>
            <button
              type="button"
              aria-label="Iklan sebelumnya"
              onClick={() => scrollToIndex(activeIndex - 1)}
              className={`${NAV_BTN} left-2`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Iklan berikutnya"
              onClick={() => scrollToIndex(activeIndex + 1)}
              className={`${NAV_BTN} right-2`}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
              {products.map((p, i) => (
                <span
                  key={p.id}
                  className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-5 bg-amber-500" : "w-1.5 bg-amber-300/80"}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
