import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BannerPageStack({ children }) {
  return <div className="mx-auto max-w-3xl space-y-5">{children}</div>;
}

export function ScreenHeader({ title, subtitle, backTo = "/seller/banner" }) {
  return (
    <div className="space-y-1">
      <Link to={backTo} className="inline-flex items-center gap-1 py-1 text-sm font-semibold text-blue-900 hover:text-blue-700">
        <ChevronLeft size={20} />
        Kembali
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {title ? <h2 className="text-base font-bold text-slate-900">{title}</h2> : null}
      {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-3 space-y-3" : "space-y-3"}>{children}</div>
    </section>
  );
}

export function FormField({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-bold text-slate-700">{label}</span> : null}
      {children}
      {hint ? <span className="block text-xs leading-relaxed text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function StatusBadge({ active }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
        active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

export function HubCard({ icon: Icon, title, subtitle, color, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
        <Icon size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-xs leading-relaxed text-slate-500">{subtitle}</p>
      </span>
      <ChevronRight className="shrink-0 text-slate-400" size={20} />
    </Link>
  );
}
