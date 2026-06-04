import { useState } from "react";
import { ChevronRight, QrCode } from "lucide-react";
import { SectionCard } from "@/components/banner/BannerUi";
import Modal from "@/components/ui/Modal";
import { resolveImageUrl } from "@/utils/image";

export default function PaymentMethodSection({ instructions, qrisImage, title = "Cara Order & Bayar" }) {
  const [qrisOpen, setQrisOpen] = useState(false);

  if (!instructions && !qrisImage) return null;

  return (
    <>
      <SectionCard title={title}>
        {instructions ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{instructions}</p>
        ) : null}

        {qrisImage ? (
          <button
            type="button"
            onClick={() => setQrisOpen(true)}
            className={`group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-4 text-left transition hover:border-blue-400 hover:shadow-sm ${
              instructions ? "mt-4" : ""
            }`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-blue-100">
              <QrCode size={24} className="text-blue-600" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-900">Lihat gambar QRIS</span>
              <span className="mt-0.5 block text-xs text-slate-500">Ketuk untuk membuka & scan kode pembayaran</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </button>
        ) : null}
      </SectionCard>

      <Modal open={qrisOpen} onClose={() => setQrisOpen(false)} title="QRIS Pembayaran" size="md" mobileCenter>
        <div className="overflow-hidden rounded-xl bg-slate-100">
          <img
            src={resolveImageUrl(qrisImage)}
            alt="QRIS pembayaran"
            className="mx-auto max-h-[70dvh] w-full object-contain p-2"
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">Screenshot atau scan QRIS sesuai instruksi di atas.</p>
      </Modal>
    </>
  );
}
