import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Filter, MapPin, Sprout, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import BannerCarousel from "@/components/home/BannerCarousel";
import { BANNER_HEIGHT_CLASS } from "@/components/home/bannerConstants";
import CategoryChips from "@/components/home/CategoryChips";
import StoreCategoryChips from "@/components/home/StoreCategoryChips";
import ProductCard from "@/components/product/ProductCard";
import AdProductCarousel from "@/components/home/AdProductCarousel";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import RegencySearchModal from "@/components/regency/RegencySearchModal";
import Modal from "@/components/ui/Modal";
import BrandLogo from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/constants/brand";

const PAGE_SIZE = 20;

function buildQuery({ keyword, category, regencyCode, storeCategory, offset, productType, isHighlight }) {
  const params = new URLSearchParams({
    search: keyword || "",
    category_id: category || "",
    regency_code: regencyCode || "",
    limit: String(PAGE_SIZE),
    offset: String(offset)
  });
  if (storeCategory) params.set("store_category", storeCategory);
  if (productType) params.set("product_type", productType);
  if (isHighlight !== undefined) params.set("is_highlight", isHighlight ? "1" : "0");
  return params.toString();
}

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [adProducts, setAdProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [regencyCode, setRegencyCode] = useState("");
  const [regencyLabel, setRegencyLabel] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const fetchGen = useRef(0);
  const loadMoreRef = useRef(null);
  const loadMoreFnRef = useRef(() => {});

  const loadInitial = useCallback(async () => {
    fetchGen.current += 1;
    const gen = fetchGen.current;
    setLoading(true);
    setFetchError(null);
    setPageIndex(0);
    setHasMore(true);
    try {
      const base = { keyword, category, regencyCode, storeCategory, offset: 0 };
      const bannerParams = storeCategory ? `?store_category=${encodeURIComponent(storeCategory)}` : "";
      const [pRes, adRes, bRes, cRes] = await Promise.all([
        api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ ...base, productType: "regular", isHighlight: false })}`),
        api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ ...base, productType: "regular", isHighlight: true })}`),
        api.get(`${API_ENDPOINTS.BANNERS}${bannerParams}`),
        api.get(API_ENDPOINTS.CATEGORIES.LIST)
      ]);
      if (gen !== fetchGen.current) return;
      const rows = Array.isArray(pRes.data) ? pRes.data : [];
      setProducts(rows);
      setAdProducts(Array.isArray(adRes.data) ? adRes.data : []);
      setHasMore(rows.length >= PAGE_SIZE);
      setBanners(bRes.data || []);
      setCategories(cRes.data || []);
    } catch (err) {
      if (gen !== fetchGen.current) return;
      setFetchError(err?.response?.data?.message || err?.message || "Gagal memuat data");
      setProducts([]);
      setAdProducts([]);
      setHasMore(false);
    } finally {
      if (gen === fetchGen.current) setLoading(false);
    }
  }, [keyword, category, regencyCode, storeCategory]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || fetchError) return;
    const genAtStart = fetchGen.current;
    setLoadingMore(true);
    try {
      const nextPageIndex = pageIndex + 1;
      const offset = nextPageIndex * PAGE_SIZE;
      const pRes = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${buildQuery({ keyword, category, regencyCode, storeCategory, offset, productType: "regular", isHighlight: false })}`
      );
      if (genAtStart !== fetchGen.current) return;
      const rows = Array.isArray(pRes.data) ? pRes.data : [];
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
  }, [loading, loadingMore, hasMore, fetchError, pageIndex, keyword, category, regencyCode, storeCategory]);

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
    <div className="-mx-3 min-h-full min-w-0 bg-white px-3 pb-6 sm:-mx-4 sm:px-4">
      <header className="space-y-2.5 pb-1 pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo className="h-14 w-auto shrink-0" />
            <h1 className="sr-only">{BRAND_NAME}</h1>
          </div>
          <Link
            to="/akun"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label={user ? "Buka halaman akun" : "Masuk atau daftar akun"}
          >
            <UserCircle size={22} className="text-blue-600" />
            <span className="hidden sm:inline">{user ? "Akun" : "Masuk"}</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setLocationOpen(true)}
          className="inline-flex max-w-full items-center gap-1 text-sm text-slate-400"
        >
          <MapPin size={16} />
          <span className="truncate">{regencyLabel || "Semua Kota"}</span>
          <ChevronDown size={14} />
        </button>
      </header>

      <div
        className="sticky top-0 z-30 -mx-3 mb-3 space-y-2 border-b border-slate-100 bg-white px-3 py-2.5 shadow-sm sm:-mx-4 sm:px-4"
        aria-label="Pencarian dan filter komoditas"
      >
        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari komoditas pertanian..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-700"
            aria-label="Buka filter produk"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="min-w-0 space-y-3">
      <div data-intro-home-categories>
        <CategoryChips categories={categories} value={category} onChange={setCategory} loading={loading} />
      </div>
      <StoreCategoryChips value={storeCategory} onChange={setStoreCategory} loading={loading} />
      <section data-intro-home-banner className="w-full min-w-0 max-w-full shrink-0" aria-label="Banner promosi">
        {loading ? (
          <div className={`w-full max-w-full animate-pulse rounded-2xl border border-slate-200 bg-white ${BANNER_HEIGHT_CLASS}`} />
        ) : banners.length > 0 ? (
          <BannerCarousel banners={banners} />
        ) : null}
      </section>

      <Link
        to={storeCategory ? `/roof-top?store_category=${encodeURIComponent(storeCategory)}` : "/roof-top"}
        data-intro-home-rooftop
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-[#FFD700] via-[#f5c400] to-[#ffe566] px-4 py-4 shadow-md transition hover:shadow-lg"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm">
          <Sprout className="text-green-800" size={26} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-800/70">Marketplace Hasil Bumi</span>
          <span className="block text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">Roof Top — Komoditas Pertanian</span>
          <span className="mt-0.5 block text-xs font-medium text-slate-800/80">Lihat daftar penjual & harga komoditas per daerah</span>
        </span>
        <ChevronRight size={22} className="shrink-0 text-slate-900 transition group-hover:translate-x-0.5" />
      </Link>

      {!loading && adProducts.length > 0 ? (
        <div data-intro-home-ads>
          <AdProductCarousel products={adProducts} />
        </div>
      ) : null}

      <section className="min-w-0 pt-1" aria-labelledby="home-komoditas-heading" data-intro-home-komoditas>
        <h2 id="home-komoditas-heading" className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          Komoditas Produk
        </h2>
      </section>

      <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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

      {!loading && fetchError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-red-800">{fetchError}</p>
          <button
            type="button"
            onClick={() => loadInitial()}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {!loading && !fetchError && !products.length ? (
        <p className="py-4 text-center text-sm text-slate-500">Belum ada komoditas ditemukan.</p>
      ) : null}

      <div
        ref={loadMoreRef}
        className={`flex justify-center py-4 ${!hasMore || fetchError ? "pointer-events-none invisible h-0 py-0" : ""}`}
        aria-hidden={!hasMore || !!fetchError}
      >
        {loadingMore && hasMore && !fetchError ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
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

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Produk">
        <label className="mb-3 block text-sm font-bold text-slate-700">Komoditas</label>
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
          {regencyLabel || "Semua Kota"}
          <ChevronDown size={18} className="text-slate-500" />
        </button>
        <p className="mb-4 text-xs text-slate-500">Semua kab/kota Indonesia — ketik untuk mencari di daftar.</p>
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setStoreCategory("");
            setRegencyCode("");
            setRegencyLabel("");
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700"
        >
          Reset Filter
        </button>
      </Modal>
    </div>
  );
}
