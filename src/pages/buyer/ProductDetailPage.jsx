import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah, getInitial, stripHtml } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import { buildWhatsAppUrl } from "@/utils/phone";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { BRAND_NAME } from "@/constants/brand";
import { isRooftopProduct, parseRooftopItems } from "@/utils/product";

function ProductGallery({ images, name, activeIndex, onSelect }) {
  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400 lg:aspect-square lg:min-h-[420px]">
        Tidak ada gambar
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
        <img
          src={resolveImageUrl(images[activeIndex]?.image)}
          alt={name}
          className="aspect-[4/3] w-full object-cover lg:aspect-square lg:min-h-[420px]"
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={() => onSelect((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-white lg:left-3 lg:h-10 lg:w-10"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={() => onSelect((activeIndex + 1) % images.length)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-white lg:right-3 lg:h-10 lg:w-10"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Gambar ${i + 1}`}
                  onClick={() => onSelect(i)}
                  className={`h-1.5 rounded-full transition ${i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="hidden gap-2 lg:grid lg:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => onSelect(i)}
              className={`overflow-hidden rounded-lg ring-2 transition ${i === activeIndex ? "ring-blue-600" : "ring-transparent hover:ring-slate-300"}`}
            >
              <img src={resolveImageUrl(img.image)} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function WhatsAppContactButton({ waUrl, className = "" }) {
  return (
    <Button
      className={`w-full py-3.5 text-base ${className}`}
      variant="seller"
      disabled={!waUrl}
      onClick={() => {
        if (!waUrl) {
          toast.error("Nomor WhatsApp seller belum tersedia");
          return;
        }
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }}
    >
      <WhatsAppIcon size={22} />
      Hubungi Seller via WhatsApp
    </Button>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
    api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id)).then((res) => setDetail(res.data));
  }, [id]);

  const onShare = async () => {
    if (!detail) return;
    const url = `${window.location.origin}/jasa/${detail.slug || detail.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: detail.name, text: `Lihat komoditas ini di ${BRAND_NAME}: ${detail.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link disalin");
      }
    } catch {
      toast.error("Gagal membagikan link");
    }
  };

  if (!detail) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const images = detail.images || [];
  const rooftopItems = parseRooftopItems(detail);
  const isRooftop = isRooftopProduct(detail);
  const waUrl = buildWhatsAppUrl(detail.seller_phone, `Halo, saya tertarik dengan komoditas "${detail.name}" di ${BRAND_NAME}.`);

  return (
    <div className="pb-24 lg:pb-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-800 hover:text-blue-900"
      >
        <ChevronLeft size={20} />
        Kembali
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 xl:gap-10">
        {/* Kiri: galeri gambar */}
        <div className="lg:sticky lg:top-4">
          <ProductGallery images={images} name={detail.name} activeIndex={imageIndex} onSelect={setImageIndex} />
        </div>

        {/* Kanan: toko + detail produk */}
        <div className="mt-4 space-y-4 lg:mt-0">
          {detail.seller_user_id ? (
            <Link
              to={`/toko/${detail.seller_user_id}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {getInitial(detail.store_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Penjual</p>
                <p className="truncate text-lg font-bold text-slate-900">{detail.store_name || "-"}</p>
                <p className="line-clamp-2 text-sm text-slate-500">{detail.store_address || "-"}</p>
              </div>
              <ChevronRight className="shrink-0 text-slate-400" size={22} />
            </Link>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold leading-tight text-slate-900 lg:text-3xl">{detail.name}</h1>
              <button
                type="button"
                onClick={onShare}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
              >
                <Share2 size={16} />
                Bagikan
              </button>
            </div>
            {isRooftop && rooftopItems.length ? (
              <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
                {rooftopItems.map((item) => (
                  <li key={`${item.name}-${item.price}`} className="flex justify-between gap-3 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="font-bold text-teal-700">{formatRupiah(item.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-2xl font-bold text-teal-700">{formatRupiah(detail.price)}</p>
            )}
            {detail.product_location_name ? (
              <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                <MapPin size={18} className="shrink-0 text-slate-400" />
                {detail.product_location_name}
              </div>
            ) : null}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h2 className="text-sm font-bold text-slate-700">Deskripsi</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 lg:text-base">
                {stripHtml(detail.description) || "Tidak ada deskripsi."}
              </p>
            </div>
          </div>

          {/* Desktop: CTA di dalam kolom kanan (bukan fixed viewport) */}
          <div className="hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <WhatsAppContactButton waUrl={waUrl} />
          </div>
        </div>
      </div>

      {/* Mobile: fixed bar hanya di layar kecil, full width tanpa offset sidebar salah */}
      <div
        className="fixed inset-x-0 bottom-16 z-40 border-t border-slate-200 bg-white px-3 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <WhatsAppContactButton waUrl={waUrl} />
        </div>
      </div>
    </div>
  );
}
