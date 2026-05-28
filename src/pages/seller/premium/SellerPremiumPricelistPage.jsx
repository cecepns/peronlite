import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah } from "@/utils/format";
import { PREMIUM_REQUEST_STATUS } from "@/utils/banner";
import { BannerPageStack, ScreenHeader, SectionCard } from "@/components/banner/BannerUi";
import Button from "@/components/ui/Button";
import PaymentProofUpload from "@/components/seller/PaymentProofUpload";

export default function SellerPremiumPricelistPage() {
  const [pricelist, setPricelist] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [myRequest, setMyRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [priceRes, contactRes, mineRes] = await Promise.all([
      api.get(API_ENDPOINTS.PREMIUM_PRICELIST),
      api.get(API_ENDPOINTS.ADMIN.CONTACT),
      api.get(API_ENDPOINTS.SELLER_REQUESTS.MINE)
    ]);
    setPricelist(Array.isArray(priceRes.data) ? priceRes.data : []);
    setPaymentInstructions(contactRes.data?.premium_payment_instructions || "");
    const pending = (Array.isArray(mineRes.data) ? mineRes.data : []).find(
      (r) => r.request_type === "premium" && r.status === "pending"
    );
    setMyRequest(pending || null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submitRequest = async () => {
    if (!selectedId) {
      toast.error("Pilih paket premium terlebih dahulu");
      return;
    }
    if (myRequest) {
      toast.error("Masih ada permintaan premium yang pending");
      return;
    }
    if (!paymentProof) {
      toast.error("Upload bukti transfer terlebih dahulu");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("request_type", "premium");
      form.append("pricelist_id", String(selectedId));
      form.append("payment_proof", paymentProof);
      await api.post(API_ENDPOINTS.SELLER_REQUESTS.CREATE, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Permintaan upgrade premium terkirim");
      setPaymentProof(null);
      setPaymentProofPreview("");
      setSelectedId(null);
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
        title="Pricelist Harga & Cara Order"
        subtitle="Pilih paket lalu kirim permintaan ke admin"
        backTo="/seller/premium"
      />

      {myRequest ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">Permintaan Premium Terakhir</p>
          {myRequest.package_label ? (
            <p className="mt-1 text-sm text-slate-700">{myRequest.package_label}</p>
          ) : null}
          <p className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
            {PREMIUM_REQUEST_STATUS[myRequest.status] || myRequest.status}
          </p>
        </div>
      ) : null}

      <SectionCard title="Pilih Paket Premium" subtitle="Centang satu paket untuk diajukan ke admin">
        {pricelist.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Belum ada paket harga.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pricelist.map((item) => {
              const selected = selectedId === item.id;
              const disabled = !!myRequest;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedId(item.id)}
                    className={`flex w-full items-center justify-between gap-3 py-3 text-left transition ${
                      disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"
                    } ${selected ? "rounded-lg bg-violet-50 px-2 -mx-2" : ""}`}
                  >
                    <span>
                      <span className="block text-base font-extrabold text-slate-900">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-xs text-slate-500">{item.duration_days} hari aktif</span>
                      {item.name ? <span className="mt-0.5 block text-xs font-medium text-violet-700">{item.name}</span> : null}
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white"
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

      {!myRequest ? (
        <SectionCard title="Upload Bukti Transfer" subtitle="Wajib — admin akan memverifikasi pembayaran dari bukti ini">
          <PaymentProofUpload
            file={paymentProof}
            preview={paymentProofPreview}
            onChange={(file, previewUrl) => {
              setPaymentProof(file);
              setPaymentProofPreview(previewUrl);
            }}
          />
          <Button variant="premium" className="mt-3 w-full" loading={submitting} onClick={submitRequest}>
            Kirim Permintaan Upgrade Premium
          </Button>
        </SectionCard>
      ) : null}

      {paymentInstructions ? (
        <SectionCard title="Cara Order & Bayar">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{paymentInstructions}</p>
        </SectionCard>
      ) : null}
    </BannerPageStack>
  );
}
