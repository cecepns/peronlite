import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ChevronLeft, MapPin, Phone, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import ProductCard from "@/components/product/ProductCard";
import { getInitial, stripHtml } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import { BRAND_NAME } from "@/constants/brand";

const PAGE_SIZE = 20;

export default function StoreFrontPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  const handleShareStore = async () => {
    if (!store) return;
    const shareUrl = window.location.href;
    const shareData = {
      title: `Kunjungi Toko ${store.name} di ${BRAND_NAME}`,
      text: `Dapatkan produk komoditas hasil bumi terbaik dari ${store.name}!`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Toko berhasil dibagikan!");
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Link toko disalin!"))
      .catch(() => toast.error("Gagal menyalin link"));
  };

  const loadProducts = useCallback(
    async (offset, append) => {
      const query = new URLSearchParams({
        seller_id: String(userId),
        limit: String(PAGE_SIZE),
        offset: String(offset)
      }).toString();
      const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${query}`);
      const rows = Array.isArray(res.data) ? res.data : [];
      if (append) setProducts((prev) => [...prev, ...rows]);
      else setProducts(rows);
      setHasMore(rows.length >= PAGE_SIZE);
      return rows.length;
    },
    [userId]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPageIndex(0);
      setHasMore(true);
      try {
        const res = await api.get(API_ENDPOINTS.STORE.DETAIL(userId));
        setStore(res.data);
        await loadProducts(0, false);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, loadProducts]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = pageIndex + 1;
      const n = await loadProducts(next * PAGE_SIZE, true);
      if (n > 0) setPageIndex(next);
      if (n < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, pageIndex, loadProducts]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const locationLine = store?.regency_name
    ? [store.regency_name, store.address].filter(Boolean).join(" · ")
    : store?.address || "";
  const plainDesc = store?.description ? stripHtml(store.description) : "";

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-3 flex items-center border-b border-slate-200 bg-white px-3 py-2.5 sm:-mx-4 sm:px-4">
        <button type="button" onClick={() => navigate(-1)} className="rounded-lg p-1 hover:bg-slate-100">
          <ChevronLeft size={26} />
        </button>
        <h1 className="flex-1 truncate text-center text-base font-bold">{store?.name || "Etalase toko"}</h1>
        {store ? (
          <button type="button" onClick={handleShareStore} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900" title="Bagikan Toko">
            <Share2 size={22} />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : store ? (
        <>
          <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <div className="mx-auto mb-3 w-fit rounded-full border-4 border-blue-100 bg-white p-1 shadow-sm">
              {store.logo ? (
                <img src={resolveImageUrl(store.logo)} alt="" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-extrabold text-blue-700">
                  {getInitial(store.name)}
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                <h2 className="text-xl font-extrabold text-slate-900">{store.name}</h2>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">Etalase produk dan layanan</p>
            </div>

            {(locationLine || store.phone) && (
              <div className="mt-4 space-y-2">
                {locationLine ? (
                  <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Lokasi</p>
                      <p className="text-sm text-slate-600">{locationLine}</p>
                    </div>
                  </div>
                ) : null}
                {store.phone ? (
                  <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">WhatsApp / Telp</p>
                      <p className="text-sm text-slate-600">{store.phone}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {plainDesc ? (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tentang toko</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{plainDesc}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Produk</h3>
            {products.length > 0 ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-extrabold text-blue-800">
                {hasMore ? `${products.length}+` : products.length}
              </span>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!products.length ? <p className="py-8 text-center text-sm text-slate-500">Belum ada produk di etalase ini.</p> : null}
          <div ref={loadMoreRef} className="py-4 text-center">
            {loadingMore ? (
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            ) : null}
          </div>
        </>
      ) : (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Building2 size={40} className="mx-auto text-slate-300" />
          <p className="mt-3 font-bold text-slate-600">Toko tidak ditemukan</p>
          <p className="mt-1 text-sm text-slate-400">Penjual mungkin belum mengatur profil toko.</p>
        </div>
      )}
    </div>
  );
}
