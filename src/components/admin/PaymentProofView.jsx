import { ExternalLink, FileText } from "lucide-react";
import { isPdfPath, resolveImageUrl } from "@/utils/image";

export default function PaymentProofView({ path, className = "" }) {
  if (!path) return null;

  const url = resolveImageUrl(path);
  const isPdf = isPdfPath(path);

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-semibold text-slate-700">Bukti Transfer</p>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          <FileText size={18} />
          Buka bukti transfer (PDF)
          <ExternalLink size={14} />
        </a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="block max-w-sm">
          <img src={url} alt="Bukti transfer" className="max-h-56 w-full rounded-xl border border-slate-200 object-contain bg-slate-50" />
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
            Lihat ukuran penuh
            <ExternalLink size={12} />
          </span>
        </a>
      )}
    </div>
  );
}
