import { useEffect, useRef } from "react";
import { QrCode, Upload } from "lucide-react";
import { resolveImageUrl } from "@/utils/image";

export default function QrisImageUpload({ file, preview, savedPath, onChange, disabled }) {
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displaySrc = preview || (savedPath ? resolveImageUrl(savedPath) : "");
  const hasImage = Boolean(displaySrc);

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    onChange(picked, URL.createObjectURL(picked));
    e.target.value = "";
  };

  const clearPick = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    onChange(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          hasImage
            ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
            : "border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        {hasImage ? (
          <div className="relative w-full p-3">
            <img src={displaySrc} alt="Preview QRIS" className="mx-auto max-h-52 w-full max-w-xs rounded-lg border border-white/80 bg-white object-contain shadow-sm" />
            <span className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-blue-600">
              <Upload size={14} />
              Ketuk untuk ganti gambar
            </span>
          </div>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <QrCode size={28} className="text-blue-600" />
            </span>
            <span className="text-sm font-bold text-slate-700">Upload gambar QRIS</span>
            <span className="max-w-xs text-xs leading-relaxed text-slate-500">
              JPG, PNG, atau WebP · disarankan 800×450 px (16:9)
            </span>
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onPick}
          disabled={disabled}
        />
      </label>

      {file ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <p className="min-w-0 truncate text-xs font-medium text-slate-600">{file.name}</p>
          <button type="button" disabled={disabled} onClick={clearPick} className="shrink-0 text-xs font-bold text-red-600 hover:text-red-700">
            Batal pilih
          </button>
        </div>
      ) : null}
    </div>
  );
}
