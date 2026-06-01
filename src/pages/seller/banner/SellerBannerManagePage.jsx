import { useCallback, useEffect, useMemo, useState } from "react";
import { AlignLeft, Check, ImageIcon, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { BANNER_REQUEST_STATUS, formatBannerPackageLabel, isTextBanner } from "@/utils/banner";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import { BannerPageStack, FormField, ScreenHeader, SectionCard, StatusBadge } from "@/components/banner/BannerUi";
import PaymentProofUpload from "@/components/seller/PaymentProofUpload";

export default function SellerBannerManagePage() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [linkType, setLinkType] = useState("product");
  const [linkId, setLinkId] = useState("");
  const [pricelistId, setPricelistId] = useState("");
  const [title, setTitle] = useState("");
  const [bannerMediaType, setBannerMediaType] = useState("image");
  const [description, setDescription] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pendingRequest, setPendingRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bannerPage, setBannerPage] = useState(1);
  const [bannerLimit, setBannerLimit] = useState(10);
  const [bannerPagination, setBannerPagination] = useState({ total: 0, totalPages: 1 });

  const loadBanners = useCallback(async () => {
    const q = new URLSearchParams({
      all: "1",
      mine: "1",
      user_id: String(user.id),
      paginate: "1",
      page: String(bannerPage),
      limit: String(bannerLimit)
    }).toString();
    const bannerRes = await api.get(`${API_ENDPOINTS.BANNERS}?${q}`);
    const payload = bannerRes.data;
    if (payload?.success) {
      setBanners(Array.isArray(payload.data) ? payload.data : []);
      setBannerPagination(payload.pagination || { total: 0, totalPages: 1 });
    } else {
      setBanners(Array.isArray(payload) ? payload : []);
    }
  }, [user.id, bannerPage, bannerLimit]);

  const loadProducts = useCallback(async () => {
    const res = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?seller_id=${user.id}`);
    setProducts(Array.isArray(res.data) ? res.data : []);
  }, [user.id]);

  const loadMeta = useCallback(async () => {
    const [priceRes, contactRes, mineRes] = await Promise.all([
      api.get(API_ENDPOINTS.BANNER_PRICELIST),
      api.get(API_ENDPOINTS.ADMIN.CONTACT),
      api.get(API_ENDPOINTS.SELLER_REQUESTS.MINE)
    ]);
    setPricelist(Array.isArray(priceRes.data) ? priceRes.data : []);
    setPaymentInstructions(contactRes.data?.banner_payment_instructions || "");
    const pending = (mineRes.data || []).find((r) => r.request_type === "banner" && r.status === "pending");
    setPendingRequest(pending || null);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadBanners(), loadProducts(), loadMeta()]);
  }, [loadBanners, loadProducts, loadMeta]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (linkType === "store") setLinkId(String(user.id));
  }, [linkType, user.id]);

  const onLinkTypeChange = (type) => {
    setLinkType(type);
    if (type === "store") {
      setLinkId(String(user.id));
      setProductSearch("");
    } else {
      setLinkId("");
    }
  };

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, productSearch]);

  const selectedPackage = useMemo(
    () => pricelist.find((item) => String(item.id) === String(pricelistId)),
    [pricelist, pricelistId]
  );

  const formLocked = Boolean(pendingRequest);

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle("");
    setBannerMediaType("image");
    setDescription("");
    setLinkId("");
    setProductSearch("");
    setPricelistId("");
    setPaymentProof(null);
    setPaymentProofPreview("");
    setImage(null);
    setImagePreview("");
    setLinkType("product");
  };

  const onBannerMediaTypeChange = (type) => {
    setBannerMediaType(type);
    if (type === "image") {
      setDescription("");
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const submitBannerOrder = async (e) => {
    e.preventDefault();
    if (pendingRequest) {
      toast.error("Masih ada order banner yang menunggu persetujuan admin");
      return;
    }
    if (!title.trim()) {
      toast.error("Judul banner wajib diisi");
      return;
    }
    if (bannerMediaType === "image" && !image) {
      toast.error("Gambar banner wajib dipilih");
      return;
    }
    if (bannerMediaType === "text" && !description.trim()) {
      toast.error("Deskripsi banner wajib diisi");
      return;
    }
    if (linkType === "product" && !linkId) {
      toast.error("Pilih produk tujuan klik banner");
      return;
    }
    if (!pricelistId) {
      toast.error("Pilih paket iklan banner");
      return;
    }
    if (!paymentProof) {
      toast.error("Upload bukti transfer terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("link_type", linkType);
      form.append("title", title.trim());
      form.append("link_id", linkType === "store" ? String(user.id) : linkId);
      form.append("is_active", "0");
      form.append("user_id", String(user.id));
      if (bannerMediaType === "image" && image) {
        form.append("image", image);
      }
      if (bannerMediaType === "text") {
        form.append("description", description.trim());
      }

      const bannerRes = await api.post(API_ENDPOINTS.BANNERS, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const bannerId = bannerRes.data?.id;
      const packageLabel = selectedPackage ? formatBannerPackageLabel(selectedPackage) : "";
      const orderNote = bannerId ? `Banner #${bannerId} · ${title.trim()}` : title.trim();

      const orderForm = new FormData();
      orderForm.append("request_type", "banner");
      orderForm.append("pricelist_id", String(pricelistId));
      orderForm.append("note", orderNote);
      orderForm.append("payment_proof", paymentProof);
      await api.post(API_ENDPOINTS.SELLER_REQUESTS.CREATE, orderForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(packageLabel ? `Banner & order terkirim · ${packageLabel}` : "Banner & order iklan terkirim");
      resetForm();
      await refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal mengirim banner & order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BannerPageStack>
      <ScreenHeader title="Manage Iklan Banner Saya" subtitle={`${banners.length} banner · pasang & order di sini`} />

      {pendingRequest ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-900">Order Banner Sedang Diproses</p>
          <p className="mt-1 text-sm text-amber-800">{pendingRequest.package_label}</p>
          <p className="mt-2 text-xs font-bold uppercase text-amber-700">
            {BANNER_REQUEST_STATUS[pendingRequest.status] || pendingRequest.status}
          </p>
          <p className="mt-2 text-xs text-slate-600">Tunggu persetujuan admin sebelum mengirim order banner baru.</p>
        </div>
      ) : null}

      <SectionCard title="Order Iklan Banner" subtitle="Upload banner, pilih tujuan klik, lalu pilih paket tayang">
        <form onSubmit={submitBannerOrder} className="space-y-4">
          <FormField label="Judul Campaign">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul banner" disabled={formLocked} />
          </FormField>

          <FormField label="Tipe Banner" hint="Pilih banner bergambar atau teks saja (tanpa gambar).">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={formLocked}
                onClick={() => onBannerMediaTypeChange("image")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                  bannerMediaType === "image"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <ImageIcon size={18} />
                Dengan Gambar
              </button>
              <button
                type="button"
                disabled={formLocked}
                onClick={() => onBannerMediaTypeChange("text")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                  bannerMediaType === "text"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <AlignLeft size={18} />
                Teks Saja
              </button>
            </div>
          </FormField>

          {bannerMediaType === "image" ? (
            <FormField label="Gambar Banner">
              <label
                className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 ${formLocked ? "pointer-events-none opacity-60" : ""}`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-36 w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-2 py-8 text-slate-500">
                    <ImageIcon size={28} />
                    <span className="text-sm font-semibold">Pilih gambar banner</span>
                  </span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onPickImage} disabled={formLocked} />
              </label>
            </FormField>
          ) : (
            <FormField label="Deskripsi Banner" hint="Teks ini ditampilkan di beranda sebagai banner (tanpa gambar).">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Jagung kering GKP stok baru — hubungi kami hari ini!"
                disabled={formLocked}
                rows={4}
                maxLength={500}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-right text-xs text-slate-400">{description.length}/500</p>
            </FormField>
          )}

          <FormField label="Tujuan Klik">
            <select
              value={linkType}
              onChange={(e) => onLinkTypeChange(e.target.value)}
              disabled={formLocked}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              <option value="product">Produk</option>
              <option value="store">Toko</option>
            </select>
          </FormField>

          {linkType === "store" ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
              <p className="font-bold text-green-800">Toko Anda (otomatis)</p>
              <p className="mt-1 text-green-700">Banner akan mengarah ke halaman toko kamu saat diklik.</p>
            </div>
          ) : (
            <FormField label="Pilih Produk" hint="Cari dan pilih produk yang akan dibuka saat banner diklik.">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Cari nama produk..."
                  disabled={formLocked}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-100 p-1">
                {filteredProducts.length === 0 ? (
                  <p className="px-2 py-4 text-center text-sm text-slate-500">
                    {products.length === 0
                      ? "Belum ada produk. Tambahkan produk di menu Toko terlebih dahulu."
                      : "Produk tidak ditemukan."}
                  </p>
                ) : (
                  filteredProducts.map((item) => {
                    const selected = String(linkId) === String(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={formLocked}
                        onClick={() => setLinkId(String(item.id))}
                        className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                          selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        {item.thumbnail ? (
                          <img src={resolveImageUrl(item.thumbnail)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <ImageIcon size={20} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 text-sm font-bold text-slate-900">{item.name}</span>
                          <span className="text-xs text-slate-500">{formatRupiah(item.price)}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                          }`}
                        >
                          {selected ? <Check size={12} strokeWidth={3} /> : null}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </FormField>
          )}

          <FormField label="Paket Iklan Banner" hint="Pilih satu paket — lihat detail lengkap di menu Price List.">
            {pricelist.length === 0 ? (
              <p className="text-center text-sm text-slate-500">Belum ada paket harga.</p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50">
                {pricelist.map((item) => {
                  const selected = String(pricelistId) === String(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={formLocked}
                        onClick={() => setPricelistId(String(item.id))}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-white ${
                          selected ? "bg-blue-50" : ""
                        }`}
                      >
                        <span>
                          <span className="block text-base font-extrabold text-slate-900">{formatRupiah(item.price)}</span>
                          <span className="text-xs text-slate-500">{formatBannerPackageLabel(item)}</span>
                        </span>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected ? <Check size={14} strokeWidth={3} /> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {selectedPackage ? (
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                <p className="font-bold text-blue-900">{formatBannerPackageLabel(selectedPackage)}</p>
                <p className="mt-1 text-slate-600">
                  Banner akan tayang {selectedPackage.duration_days} hari setelah admin menyetujui pembayaran.
                </p>
              </div>
            ) : null}
          </FormField>

          <FormField label="Upload Bukti Transfer" hint="Wajib — admin memverifikasi pembayaran dari bukti transfer ini.">
            <PaymentProofUpload
              file={paymentProof}
              preview={paymentProofPreview}
              disabled={formLocked}
              onChange={(file, previewUrl) => {
                setPaymentProof(file);
                setPaymentProofPreview(previewUrl);
              }}
            />
          </FormField>

          {paymentInstructions ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{paymentInstructions}</p>
          ) : null}

          <Button type="submit" loading={submitting} disabled={formLocked} className="w-full">
            Kirim Permintaan Iklan Banner
          </Button>
        </form>
      </SectionCard>

      <h2 className="text-lg font-extrabold text-slate-900">Riwayat Banner Saya</h2>
      {bannerPagination.total > 0 ? (
        <Pagination
          page={bannerPage}
          totalPages={bannerPagination.totalPages || 1}
          limit={bannerLimit}
          onPageChange={setBannerPage}
          onLimitChange={(n) => {
            setBannerLimit(n);
            setBannerPage(1);
          }}
        />
      ) : null}
      {banners.length === 0 ? (
        <SectionCard>
          <p className="text-center text-sm text-slate-500">Belum ada banner.</p>
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {banners.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex gap-3">
                {item.image ? (
                  <img src={resolveImageUrl(item.image)} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                ) : isTextBanner(item) ? (
                  <span className="flex h-16 w-24 shrink-0 flex-col justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-2 text-[10px] font-semibold leading-tight text-white line-clamp-4">
                    {item.description}
                  </span>
                ) : (
                  <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <ImageIcon size={24} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900">{item.title || `Banner #${item.id}`}</p>
                    <StatusBadge active={!!item.is_active} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Expired: {item.expires_at ? new Date(item.expires_at).toLocaleDateString("id-ID") : "Menunggu admin"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Link: {item.link_type === "product" ? "Produk" : "Toko"}
                    {item.link_id ? ` #${item.link_id}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </BannerPageStack>
  );
}
