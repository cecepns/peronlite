import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { BANNER_REQUEST_STATUS, formatFeedPackageLabel } from "@/utils/banner";
import { formatRupiah } from "@/utils/format";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";
import Button from "@/components/ui/Button";
import PaymentProofUpload from "@/components/seller/PaymentProofUpload";
import PaymentMethodSection from "@/components/seller/PaymentMethodSection";
import SellerProductAsyncSelect from "@/components/seller/SellerProductAsyncSelect";

function formatOrderDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusBadgeClass(status) {
  if (status === "approved") return "bg-green-100 text-green-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-900";
}

export default function SellerFeedOrderPage() {
  const { user } = useAuth();
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [qrisImage, setQrisImage] = useState("");
  const [feedOrders, setFeedOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [pendingRequest, setPendingRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [priceRes, contactRes, mineRes] = await Promise.all([
      api.get(API_ENDPOINTS.FEED_PRICELIST),
      api.get(API_ENDPOINTS.ADMIN.CONTACT),
      api.get(`${API_ENDPOINTS.SELLER_REQUESTS.MINE}?request_type=feed`)
    ]);
    setPricelist(Array.isArray(priceRes.data) ? priceRes.data : []);
    setPaymentInstructions(contactRes.data?.feed_payment_instructions || "");
    setQrisImage(contactRes.data?.feed_qris_image || "");
    const orders = Array.isArray(mineRes.data) ? mineRes.data : [];
    setFeedOrders(orders);
    const pending = orders.find((r) => r.status === "pending");
    setPendingRequest(pending || null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const formLocked = Boolean(pendingRequest);

  const submitOrder = async () => {
    if (!selectedProduct?.value) {
      toast.error("Pilih produk yang akan diiklankan");
      return;
    }
    if (!selectedPackageId) {
      toast.error("Pilih paket iklan feed");
      return;
    }
    if (pendingRequest) {
      toast.error("Masih ada permintaan feed yang menunggu persetujuan admin");
      return;
    }
    if (!paymentProof) {
      toast.error("Upload bukti transfer terlebih dahulu");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("request_type", "feed");
      form.append("pricelist_id", String(selectedPackageId));
      form.append("product_id", String(selectedProduct.value));
      form.append("payment_proof", paymentProof);
      await api.post(API_ENDPOINTS.SELLER_REQUESTS.CREATE, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Permintaan iklan feed terkirim");
      setPaymentProof(null);
      setPaymentProofPreview("");
      setSelectedProduct(null);
      setSelectedPackageId("");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal mengirim permintaan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BannerPageStack>
      <ScreenHeader
        title="Order Iklan Feed"
        subtitle="Pilih produk biasa & paket, lalu kirim ke admin"
        backTo="/seller/feed"
      />

      {feedOrders.length > 0 ? (
        <SectionCard title={`Riwayat Order Iklan Feed (${feedOrders.length})`} subtitle="Semua permintaan feed yang pernah Anda kirim">
          <ul className="divide-y divide-slate-100">
            {feedOrders.map((order) => (
              <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{order.product_name || `Produk #${order.product_id}`}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{order.package_label || formatRupiah(order.package_price)}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatOrderDate(order.created_at)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(order.status)}`}>
                    {BANNER_REQUEST_STATUS[order.status] || order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : (
        <SectionCard title="Riwayat Order Iklan Feed">
          <p className="text-center text-sm text-slate-500">Belum ada order iklan feed.</p>
        </SectionCard>
      )}

      {pendingRequest ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">Permintaan Feed Menunggu</p>
          {pendingRequest.product_name ? (
            <p className="mt-1 text-sm text-slate-700">{pendingRequest.product_name}</p>
          ) : null}
          {pendingRequest.package_label ? (
            <p className="mt-0.5 text-sm text-slate-600">{pendingRequest.package_label}</p>
          ) : null}
          <p className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
            {BANNER_REQUEST_STATUS[pendingRequest.status] || pendingRequest.status}
          </p>
        </div>
      ) : null}

      {!formLocked ? (
        <>
          <SectionCard title="Pilih Produk" subtitle="Cari produk biasa Anda — yang feed-nya masih aktif tidak bisa dipilih">
            <SellerProductAsyncSelect
              sellerId={user.id}
              value={selectedProduct}
              onChange={setSelectedProduct}
              label=""
            />
          </SectionCard>

          <SectionCard title="Pilih Paket" subtitle="Centang satu paket untuk diajukan">
            {pricelist.length === 0 ? (
              <p className="text-center text-sm text-slate-500">Belum ada paket harga.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pricelist.map((item) => {
                  const selected = String(selectedPackageId) === String(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedPackageId(String(item.id))}
                        className={`flex w-full items-center justify-between gap-3 py-3 text-left transition hover:bg-slate-50 ${
                          selected ? "rounded-lg bg-teal-50 px-2 -mx-2" : ""
                        }`}
                      >
                        <span>
                          <span className="block text-base font-extrabold text-slate-900">{formatRupiah(item.price)}</span>
                          <span className="text-xs text-slate-500">{formatFeedPackageLabel(item)}</span>
                        </span>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white"
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
          </SectionCard>

          <SectionCard title="Upload Bukti Transfer" subtitle="Wajib — admin akan memverifikasi pembayaran dari bukti ini">
            <PaymentProofUpload
              file={paymentProof}
              preview={paymentProofPreview}
              onChange={(file, previewUrl) => {
                setPaymentProof(file);
                setPaymentProofPreview(previewUrl);
              }}
            />
            <Button variant="primary" className="mt-3 w-full" loading={submitting} onClick={submitOrder}>
              Kirim Permintaan Iklan Feed
            </Button>
          </SectionCard>
        </>
      ) : null}

      <PaymentMethodSection instructions={paymentInstructions} qrisImage={qrisImage} />
    </BannerPageStack>
  );
}
