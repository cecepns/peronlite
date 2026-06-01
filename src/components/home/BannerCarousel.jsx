import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "@/utils/image";
import { isTextBanner } from "@/utils/banner";
import { BANNER_HEIGHT_CLASS } from "./bannerConstants";

import "./banner-carousel.css";

const NAV_BTN =
  "pointer-events-auto absolute top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/95 text-blue-700 shadow-md backdrop-blur-sm transition hover:bg-blue-50 active:scale-95 sm:h-10 sm:w-10";

export default function BannerCarousel({ banners }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const canNavigate = banners.length > 1;

  const syncIndexFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(next, banners.length - 1));
    indexRef.current = clamped;
    setActiveIndex(clamped);
  }, [banners.length]);

  const scrollToIndex = useCallback(
    (target, smooth = true) => {
      const el = trackRef.current;
      if (!el || !banners.length) return;
      const next = ((target % banners.length) + banners.length) % banners.length;
      const left = next * el.clientWidth;
      el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      indexRef.current = next;
      setActiveIndex(next);
    },
    [banners.length]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const onResize = () => {
      scrollToIndex(indexRef.current, false);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollToIndex, banners]);

  useEffect(() => {
    scrollToIndex(0, false);
  }, [banners, scrollToIndex]);

  useEffect(() => {
    if (!canNavigate) return undefined;
    const timer = setInterval(() => {
      scrollToIndex(indexRef.current + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [canNavigate, scrollToIndex, banners.length]);

  const onBannerPress = (item) => {
    const linkId = item.link_id != null && item.link_id !== "" ? Number(item.link_id) : NaN;
    if (Number.isNaN(linkId)) return;
    if (item.link_type === "product") navigate(`/produk/${linkId}`);
    if (item.link_type === "store") navigate(`/toko/${linkId}`);
  };

  if (!banners.length) return null;

  return (
    <div
      className={`banner-carousel relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm ${BANNER_HEIGHT_CLASS}`}
      aria-roledescription="carousel"
      aria-label="Banner promosi"
    >
      <div
        ref={trackRef}
        className="banner-carousel__track"
        onScroll={syncIndexFromScroll}
      >
        {banners.map((item) => {
          const textBanner = isTextBanner(item);
          return (
            <div key={item.id} className="banner-carousel__slide">
              <button
                type="button"
                disabled={!item.link_id}
                onClick={() => onBannerPress(item)}
                className={`h-full w-full disabled:cursor-default ${textBanner ? "" : "bg-slate-200"}`}
              >
                {textBanner ? (
                  <div className="banner-carousel__text-slide">
                    {item.title ? <p className="banner-carousel__text-title">{item.title}</p> : null}
                    <p className="banner-carousel__text-body">{item.description}</p>
                  </div>
                ) : (
                  <img src={resolveImageUrl(item.image)} alt={item.title || ""} draggable={false} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {canNavigate ? (
        <>
          <button
            type="button"
            aria-label="Banner sebelumnya"
            onClick={() => scrollToIndex(activeIndex - 1)}
            className={`${NAV_BTN} left-2`}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Banner berikutnya"
            onClick={() => scrollToIndex(activeIndex + 1)}
            className={`${NAV_BTN} right-2`}
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-20 flex justify-center gap-1.5">
            {banners.map((b, i) => (
              <span
                key={b.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
