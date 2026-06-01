import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import BrandLogo from "@/components/brand/BrandLogo";

const PAGE_SIZE = 20;

function buildQuery({ offset, search, category, regencyCode, storeCategory }) {
  const params = new URLSearchParams({
    product_type: "regular",
    is_highlight: "1",
    search: search || "",
    category_id: category || "",
    regency_code: regencyCode || "",
    limit: String(PAGE_SIZE),
    offset: String(offset)
  });
  if (storeCategory) params.set("store_category", storeCategory);
  return params.toString();
}

export default function ProductAdsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fetchGen = useRef(0);
  const loadMoreRef = useRef(null);
  const loadMoreFnRef = useRef(() => {});

  const loadInitial = useCallback(async () => {
    fetchGen.current += 1;
    const gen = fetchGen.current;
    setLoading(true);
    setPageIndex(0);
    setHasMore(true);
    try {
      const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ offset: 0 })}`);
      if (gen !== fetchGen.current) return;
      const rows = Array.isArray(res.data) ? res.data : [];
      setProducts(rows);
      setHasMore(rows.length >= PAGE_SIZE);
    } catch {
      if (gen !== fetchGen.current) return;
      setProducts([]);
      setHasMore(false);
    } finally {
      if (gen === fetchGen.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    const genAtStart = fetchGen.current;
    setLoadingMore(true);
    try {
      const nextPageIndex = pageIndex + 1;
      const offset = nextPageIndex * PAGE_SIZE;
      const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ offset })}`);
      if (genAtStart !== fetchGen.current) return;
      const rows = Array.isArray(res.data) ? res.data : [];
      if (!rows.length) {
        setHasMore(false);
        return;
      }
      setProducts((prev) => [...prev, ...rows]);
      setPageIndex(nextPageIndex);
      setHasMore(rows.length >= PAGE_SIZE);
    } catch {
      if (genAtStart !== fetchGen.current) return;
      setHasMore(false);
    } finally {
      if (genAtStart === fetchGen.current) setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, pageIndex]);

  loadMoreFnRef.current = loadMore;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreFnRef.current();
      },
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 px-4 pb-6 pt-3 sm:px-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
        <div className="pointer-events-none absolute -bottom-6 left-1/4 h-24 w-24 rounded-full bg-white/15" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft size={16} />
              Beranda
            </Link>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm">
                  <Megaphone className="text-amber-800" size={20} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-800/80">Promosi</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Iklan Produk</h1>
              <p className="mt-1 max-w-md text-sm font-medium text-slate-800/90">
                Semua produk beriklan yang ditampilkan di beranda — dipromosikan langsung oleh penjual.
              </p>
            </div>
            <BrandLogo className="hidden h-12 w-auto shrink-0 opacity-90 sm:block" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl py-4 sm:py-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="min-w-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((p) => (
                <div key={p.id} className="min-w-0">
                  <ProductCard product={p} />
                </div>
              ))}
        </div>

        {!loading && !products.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Megaphone size={28} />
            </span>
            <p className="mt-4 text-base font-bold text-slate-800">Belum ada iklan produk aktif</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Produk iklan akan muncul di sini setelah penjual mengaktifkan paket iklan feed.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600"
            >
              <ChevronLeft size={16} />
              Kembali ke beranda
            </Link>
          </div>
        ) : null}

        <div
          ref={loadMoreRef}
          className={`flex justify-center py-4 ${!hasMore ? "pointer-events-none invisible h-0 py-0" : ""}`}
          aria-hidden={!hasMore}
        >
          {loadingMore && hasMore ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
