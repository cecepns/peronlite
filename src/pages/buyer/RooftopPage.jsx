import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, Filter, MapPin, Search, Sprout, X } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import CategoryChips from "@/components/home/CategoryChips";
import StoreCategoryChips from "@/components/home/StoreCategoryChips";
import AdProductCarousel from "@/components/home/AdProductCarousel";
import RooftopSellerCard from "@/components/rooftop/RooftopSellerCard";
import RegencySearchModal from "@/components/regency/RegencySearchModal";
import Modal from "@/components/ui/Modal";
import BrandLogo from "@/components/brand/BrandLogo";

const PAGE_SIZE = 20;

function buildRooftopQuery({ keyword, category, regencyCode, storeCategory, offset, storeSearch }) {
  const q = new URLSearchParams({
    product_type: "rooftop",
    search: keyword || "",
    category_id: category || "",
    regency_code: regencyCode || "",
    limit: String(PAGE_SIZE),
    offset: String(offset)
  });
  if (storeCategory) q.set("store_category", storeCategory);
  if (storeSearch) q.set("store_search", storeSearch);
  return q.toString();
}

function buildAdQuery({ keyword, category, regencyCode, storeCategory, storeSearch }) {
  const q = new URLSearchParams({
    product_type: "regular",
    is_highlight: "1",
    search: keyword || "",
    category_id: category || "",
    regency_code: regencyCode || "",
    limit: "20",
    offset: "0"
  });
  if (storeCategory) q.set("store_category", storeCategory);
  if (storeSearch) q.set("store_search", storeSearch);
  return q.toString();
}

export default function RooftopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [adProducts, setAdProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const keyword = useDebounce(keywordInput, 300);
  const [category, setCategory] = useState("");
  const [storeCategory, setStoreCategory] = useState(() => searchParams.get("store_category") || "");
  const [regencyCode, setRegencyCode] = useState("");
  const [regencyLabel, setRegencyLabel] = useState("");
  const [storeSearchInput, setStoreSearchInput] = useState("");
  const storeSearch = useDebounce(storeSearchInput, 300);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
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
      const [pRes, adRes, cRes] = await Promise.all([
        api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildRooftopQuery({ keyword, category, regencyCode, storeCategory, offset: 0, storeSearch })}`),
        api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildAdQuery({ keyword, category, regencyCode, storeCategory, storeSearch })}`),
        api.get(API_ENDPOINTS.CATEGORIES.LIST)
      ]);
      if (gen !== fetchGen.current) return;
      const rows = Array.isArray(pRes.data) ? pRes.data : [];
      setItems(rows);
      setAdProducts(Array.isArray(adRes.data) ? adRes.data : []);
      setHasMore(rows.length >= PAGE_SIZE);
      setCategories(cRes.data || []);
    } finally {
      if (gen === fetchGen.current) setLoading(false);
    }
  }, [keyword, category, regencyCode, storeCategory, storeSearch]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (storeCategory) next.set("store_category", storeCategory);
        else next.delete("store_category");
        return next;
      },
      { replace: true }
    );
  }, [storeCategory, setSearchParams]);

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
      const pRes = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${buildRooftopQuery({ keyword, category, regencyCode, storeCategory, offset, storeSearch })}`
      );
      if (genAtStart !== fetchGen.current) return;
      const rows = Array.isArray(pRes.data) ? pRes.data : [];
      if (!rows.length) {
        setHasMore(false);
        return;
      }
      setItems((prev) => [...prev, ...rows]);
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

  const clearFilters = () => {
    setCategory("");
    setStoreCategory("");
    setRegencyCode("");
    setRegencyLabel("");
    setStoreSearchInput("");
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFD700] via-[#f5c400] to-[#e6b800] px-4 pb-6 pt-3 sm:px-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
        <div className="pointer-events-none absolute -bottom-6 left-1/4 h-24 w-24 rounded-full bg-white/15" />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur"
            >
              <ChevronLeft size={16} />
              Beranda
            </Link>
            <button
              type="button"
              onClick={() => setLocationOpen(true)}
              className="inline-flex min-w-0 max-w-[50%] items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur"
            >
              <MapPin size={14} className="shrink-0 text-amber-700" />
              <span className="truncate">{regencyLabel || "Semua kota"}</span>
              <ChevronDown size={12} className="shrink-0 opacity-70" />
            </button>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-sm">
                  <Sprout className="text-green-800" size={20} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-800/80">Hasil Bumi</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Roof Top</h1>
              <p className="mt-1 max-w-md text-sm font-medium text-slate-800/90">
                Daftar penjual komoditas pertanian — harga langsung dari seller.
              </p>
            </div>
            <BrandLogo className="hidden h-12 w-auto shrink-0 opacity-90 sm:block" />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <div className="mx-auto max-w-2xl space-y-2.5">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Cari penjual atau komoditas..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-10 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition ${
                hasActiveFilters
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
              aria-label="Filter"
            >
              <Filter size={20} />
            </button>
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2">
              {regencyCode ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                  <MapPin size={12} />
                  {regencyLabel}
                  <button type="button" onClick={() => { setRegencyCode(""); setRegencyLabel(""); }} aria-label="Hapus filter kota">
                    <X size={12} />
                  </button>
                </span>
              ) : null}
              {category ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900">
                  {categories.find((c) => String(c.id) === category)?.name || "Komoditas"}
                  <button type="button" onClick={() => setCategory("")} aria-label="Hapus filter komoditas">
                    <X size={12} />
                  </button>
                </span>
              ) : null}
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-slate-500 underline">
                Reset semua
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-2 px-3 py-3 sm:px-4">
      <StoreCategoryChips value={storeCategory} onChange={setStoreCategory} loading={loading} />
        {!loading && adProducts.length > 0 ? (
          <AdProductCarousel products={adProducts} viewAllTo="/iklan-produk" />
        ) : null}
        <CategoryChips categories={categories} value={category} onChange={setCategory} loading={loading} />
      </div>

      <main className="mx-auto max-w-2xl space-y-3 px-3 pb-10 sm:px-4">
        {!loading ? (
          <p className="text-xs font-semibold text-slate-500">
            {items.length} penjual{items.length !== 1 ? "" : ""} ditemukan
          </p>
        ) : null}

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border-2 border-amber-200/50 bg-white" />
          ))
        ) : items.length ? (
          items.map((p) => <RooftopSellerCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Sprout className="mx-auto text-amber-500" size={40} />
            <p className="mt-3 font-bold text-slate-800">Belum ada listing Roof Top</p>
            <p className="mt-1 text-sm text-slate-500">Coba ubah filter kota atau kata kunci pencarian.</p>
            {hasActiveFilters ? (
              <button type="button" onClick={clearFilters} className="mt-4 text-sm font-bold text-amber-700 underline">
                Reset filter
              </button>
            ) : null}
          </div>
        )}

        <div
          ref={loadMoreRef}
          className={`flex justify-center py-4 ${!hasMore || loading ? "pointer-events-none invisible h-0 py-0" : ""}`}
          aria-hidden={!hasMore || loading}
        >
          {loadingMore && hasMore ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          ) : null}
        </div>
      </main>

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

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Roof Top">
        <label className="mb-2 block text-sm font-bold text-slate-700">Nama Toko</label>
        <input
          type="text"
          value={storeSearchInput}
          onChange={(e) => setStoreSearchInput(e.target.value)}
          placeholder="Cari nama toko..."
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        <label className="mb-2 block text-sm font-bold text-slate-700">Komoditas</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Semua komoditas</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="mb-2 block text-sm font-bold text-slate-700">Kategori Toko</label>
        <select
          value={storeCategory}
          onChange={(e) => setStoreCategory(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Semua (Supplier / Petani / Transportir)</option>
          <option value="supplier">Supplier</option>
          <option value="petani">Petani</option>
          <option value="transportir">Transportir</option>
        </select>
        <label className="mb-2 block text-sm font-bold text-slate-700">Kabupaten / Kota</label>
        <button
          type="button"
          onClick={() => {
            setFilterOpen(false);
            setLocationOpen(true);
          }}
          className="mb-2 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left text-sm font-semibold"
        >
          <span className="inline-flex items-center gap-2 truncate">
            <MapPin size={18} className="shrink-0 text-amber-600" />
            {regencyLabel || "Semua kota"}
          </span>
          <ChevronDown size={18} className="shrink-0 text-slate-500" />
        </button>
        <p className="mb-4 text-xs text-slate-500">Cari kabupaten/kota di seluruh Indonesia.</p>
        <button
          type="button"
          onClick={() => {
            clearFilters();
            setFilterOpen(false);
          }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-700"
        >
          Reset filter
        </button>
      </Modal>
    </div>
  );
}
