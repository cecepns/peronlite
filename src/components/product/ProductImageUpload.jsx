import { useRef } from "react";
import { ImageIcon, Plus, X } from "lucide-react";
import { resolveImageUrl } from "@/utils/image";

/**
 * @param {{ multiple?: boolean, max?: number, newFiles: Array<{id:string,file:File,preview:string}>, onAddFiles: (files: File[]) => void, onRemoveNew: (id: string) => void, existingImages?: Array<{id?: number, image: string}>, disabled?: boolean, label?: string, hint?: string }} props
 */
export default function ProductImageUpload({
  multiple = true,
  max = 10,
  newFiles,
  onAddFiles,
  onRemoveNew,
  existingImages = [],
  disabled = false,
  label = "Gambar produk",
  hint
}) {
  const inputRef = useRef(null);
  const totalCount = existingImages.length + newFiles.length;
  const atLimit = totalCount >= max;
  const canAddMore = multiple ? !atLimit : newFiles.length === 0 && existingImages.length === 0;

  const onInputChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const allowed = multiple ? picked.slice(0, max - totalCount) : [picked[0]];
    onAddFiles(allowed);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
        {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {existingImages.map((img) => (
            <div key={`ex-${img.id || img.image}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img src={resolveImageUrl(img.image)} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                Foto saat ini
              </span>
            </div>
          ))}
          {newFiles.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-blue-300 bg-blue-50">
              <img src={item.preview} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                Baru
              </span>
              {!disabled ? (
                <button
                  type="button"
                  onClick={() => onRemoveNew(item.id)}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                  aria-label="Hapus gambar"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {canAddMore ? (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition hover:border-blue-400 hover:bg-blue-50/50 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ImageIcon className="text-slate-400" size={32} />
          <span className="mt-2 text-sm font-semibold text-slate-700">
            {multiple ? "Ketuk untuk pilih gambar" : "Ketuk untuk pilih thumbnail"}
          </span>
          <span className="mt-1 text-xs text-slate-500">
            {multiple ? `JPG, PNG · maks. ${max} foto` : "Satu gambar · JPG atau PNG"}
          </span>
          {!multiple && newFiles.length === 0 && existingImages.length === 0 ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              <Plus size={12} />
              Wajib diisi
            </span>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={disabled}
            onChange={onInputChange}
          />
        </label>
      ) : null}

      {atLimit && multiple ? <p className="text-xs text-amber-700">Maksimal {max} gambar.</p> : null}
    </div>
  );
}
