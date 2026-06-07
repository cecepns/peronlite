import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, Filter, Megaphone } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import BrandLogo from "@/components/brand/BrandLogo";
import StoreCategoryChips from "@/components/home/StoreCategoryChips";
import CategoryChips from "@/components/home/CategoryChips";
import RegencySearchModal from "@/components/regency/RegencySearchModal";
import Modal from "@/components/ui/Modal";

const PAGE_SIZE = 20;

function buildQuery({ offset, search, category, regencyCode, storeCategory, storeSearch }) {
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
  if (storeSearch) params.set("store_search", storeSearch);
  return params.toString();
}

export default function ProductAdsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const keyword = useDebounce(keywordInput, 300);
  const [category, setCategory] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [regencyCode, setRegencyCode] = useState("");
  const [regencyLabel, setRegencyLabel] = useState("");
  const [storeSearchInput, setStoreSearchInput] = useState("");
  const storeSearch = useDebounce(storeSearchInput, 300);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fetchGen = useRef(0);
  const loadMoreRef = useRef(null);
  const loadMoreFnRef = useRef(() => {});

  useEffect(() => {
    api.get(API_ENDPOINTS.CATEGORIES.LIST).then((res) => setCategories(res.data || [])).catch(() => setCategories([]));
  }, []);

  const loadInitial = useCallback(async () => {
    fetchGen.current += 1;
    const gen = fetchGen.current;
    setLoading(true);
    setPageIndex(0);
    setHasMore(true);
    try {
      const res = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ offset: 0, search: keyword, category, regencyCode, storeCategory, storeSearch })}`
      );
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
  }, [keyword, category, regencyCode, storeCategory, storeSearch]);

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
      const res = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ offset, search: keyword, category, regencyCode, storeCategory, storeSearch })}`
      );
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
  }, [loading, loadingMore, hasMore, pageIndex, keyword, category, regencyCode, storeCategory, storeSearch]);

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

  const hasActiveFilters = Boolean(category || regencyCode || storeCategory || storeSearch);

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
        <div className="sticky top-0 z-20 -mx-3 mb-4 space-y-2 border-b border-slate-100 bg-white px-3 py-2.5 shadow-sm sm:-mx-0 sm:rounded-xl sm:border sm:px-3">
          <div className="flex gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Cari iklan produk..."
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                hasActiveFilters ? "border-amber-400 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-600"
              }`}
              aria-label="Buka filter"
            >
              <Filter size={20} />
            </button>
          </div>
          <StoreCategoryChips value={storeCategory} onChange={setStoreCategory} loading={loading} />
        </div>

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
              {hasActiveFilters || keyword
                ? "Tidak ada iklan untuk filter ini. Coba kata kunci atau filter lain."
                : "Produk iklan akan muncul di sini setelah penjual mengaktifkan paket iklan feed."}
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

      <RegencySearchModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        selectedCode={regencyCode || undefined}
        title="Filter kabupaten / kota"
        onSelect={({ code, name, province_name }) => {
          setRegencyCode(code || "");
          setRegencyLabel(!code ? "" : province_name ? `${name} · ${province_name}` : name);
        }}
      />

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Iklan Produk">
        <label className="mb-2 block text-sm font-bold text-slate-700">Nama Toko</label>
        <input
          type="text"
          value={storeSearchInput}
          onChange={(e) => setStoreSearchInput(e.target.value)}
          placeholder="Cari nama toko..."
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        <p className="mb-2 text-sm font-bold text-slate-700">Komoditas</p>
        <CategoryChips categories={categories} value={category} onChange={setCategory} loading={false} />
        <p className="mb-2 mt-4 text-sm font-bold text-slate-700">Kabupaten / Kota</p>
        <button
          type="button"
          onClick={() => {
            setFilterOpen(false);
            setLocationOpen(true);
          }}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left text-sm font-semibold"
        >
          {regencyLabel || "Semua Kota"}
          <ChevronDown size={18} className="text-slate-500" />
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setStoreCategory("");
            setRegencyCode("");
            setRegencyLabel("");
            setStoreSearchInput("");
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700"
        >
          Reset Filter
        </button>
      </Modal>
    </div>
  );
}
