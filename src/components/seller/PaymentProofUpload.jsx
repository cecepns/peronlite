import { useEffect } from "react";
import { FileImage, Upload } from "lucide-react";
import { isPdfPath } from "@/utils/image";

export default function PaymentProofUpload({ file, preview, onChange, disabled, accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf" }) {
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    onChange(picked, URL.createObjectURL(picked));
    e.target.value = "";
  };

  const clear = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    onChange(null, "");
  };

  const showPdf = file && (file.type === "application/pdf" || isPdfPath(file.name));

  return (
    <div className="space-y-2">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-300 hover:bg-blue-50/50 ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {preview && !showPdf ? (
          <img src={preview} alt="Preview bukti transfer" className="max-h-52 w-full object-contain p-2" />
        ) : preview && showPdf ? (
          <span className="flex flex-col items-center gap-2 py-10 text-slate-600">
            <FileImage size={32} className="text-blue-600" />
            <span className="max-w-full truncate px-4 text-sm font-semibold">{file?.name || "Bukti transfer.pdf"}</span>
            <span className="text-xs text-slate-500">File PDF siap diunggah</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-2 py-10 text-slate-500">
            <Upload size={28} />
            <span className="text-sm font-semibold">Upload bukti transfer</span>
            <span className="text-xs text-slate-400">JPG, PNG, WebP, atau PDF (maks. 5 MB)</span>
          </span>
        )}
        <input type="file" accept={accept} className="hidden" onChange={onPick} disabled={disabled} />
      </label>
      {file ? (
        <button
          type="button"
          disabled={disabled}
          onClick={clear}
          className="text-xs font-semibold text-red-600 hover:text-red-700"
        >
          Hapus file
        </button>
      ) : null}
    </div>
  );
}
