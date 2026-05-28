import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPageStack({ children, className = "" }) {
  return <div className={`mx-auto max-w-4xl space-y-5 ${className}`}>{children}</div>;
}

export function AdminScreenHeader({ title, subtitle, backTo = "/admin" }) {
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

export function AdminSectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {title ? <h2 className="text-base font-bold text-slate-900">{title}</h2> : null}
      {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-3 space-y-3" : "space-y-3"}>{children}</div>
    </section>
  );
}

export function AdminHubCard({ icon: Icon, title, subtitle, color, to }) {
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

export const REQUEST_STATUS_LABEL = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak"
};

export const REQUEST_TYPE_LABEL = {
  premium: "Upgrade Premium",
  banner: "Iklan Banner",
  feed: "Iklan Feed"
};
