import { useState } from "react";
import { QrCode } from "lucide-react";
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
            className={`inline-flex items-center gap-1 text-sm font-bold text-blue-600 underline-offset-2 hover:underline ${instructions ? "mt-3" : ""}`}
          >
            <QrCode size={16} />
            Lihat gambar QRIS
          </button>
        ) : null}
      </SectionCard>

      <Modal open={qrisOpen} onClose={() => setQrisOpen(false)} title="QRIS Pembayaran" size="md" mobileCenter>
        <img
          src={resolveImageUrl(qrisImage)}
          alt="QRIS pembayaran"
          className="mx-auto max-h-[70dvh] w-full rounded-lg object-contain"
        />
        <p className="mt-3 text-center text-xs text-slate-500">Screenshot atau scan QRIS sesuai instruksi di atas.</p>
      </Modal>
    </>
  );
}
