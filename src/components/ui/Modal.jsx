import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "md", mobileCenter = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-5xl"
  }[size];

  const overlayClass = mobileCenter
    ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    : "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4";
  const panelClass = mobileCenter
    ? `w-full ${sizeClass} max-h-[85dvh] overflow-y-auto rounded-2xl bg-white shadow-xl`
    : `w-full ${sizeClass} max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl`;

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className={panelClass} onClick={(e) => e.stopPropagation()}>
        {title ? (
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>
        ) : null}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
