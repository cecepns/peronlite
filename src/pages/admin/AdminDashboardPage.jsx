import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FolderTree, Image, LayoutGrid, Settings, Sparkles, Users } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";

const STAT_CARDS = [
  { key: "total_users", label: "Total Users", accent: "text-blue-600" },
  { key: "total_premium", label: "Premium Aktif", accent: "text-violet-600" },
  { key: "total_banner_premium", label: "Banner Aktif", accent: "text-green-600" },
  { key: "total_feed_active", label: "Feed Aktif", accent: "text-teal-600" }
];

const PENDING_CARDS = [
  {
    key: "pending_premium",
    label: "Order Premium",
    sub: "Permintaan upgrade premium",
    to: "/admin/premium/orders",
    accent: "text-violet-700",
    border: "border-violet-200 bg-violet-50 hover:bg-violet-100"
  },
  {
    key: "pending_feed",
    label: "Order Iklan Feed",
    sub: "Permintaan iklan feed",
    to: "/admin/feed/orders",
    accent: "text-teal-700",
    border: "border-teal-200 bg-teal-50 hover:bg-teal-100"
  },
  {
    key: "pending_banner",
    label: "Order Iklan Banner",
    sub: "Permintaan iklan banner",
    to: "/admin/banner/orders",
    accent: "text-amber-700",
    border: "border-amber-200 bg-amber-50 hover:bg-amber-100"
  }
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.STATS).then((res) => setStats(res.data)).catch(() => setStats(null));
  }, []);

  const menuCards = [
    { to: "/admin/users", icon: Users, label: "Kelola User" },
    { to: "/admin/categories", icon: FolderTree, label: "Komoditas" },
    { to: "/admin/banner", icon: Image, label: "Iklan Banner" },
    { to: "/admin/feed", icon: LayoutGrid, label: "Iklan Feed" },
    { to: "/admin/premium", icon: Sparkles, label: "Premium" },
    { to: "/admin/announcements", icon: Bell, label: "Pengumuman" },
    { to: "/admin/settings", icon: Settings, label: "Settings" }
  ];

  const totalPending = Number(stats?.pending_requests || 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Dashboard Admin</h1>
        {totalPending > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <Bell size={14} />
            {totalPending} permintaan pending
          </span>
        ) : null}
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-intro-admin-stats>
            {STAT_CARDS.map(({ key, label, accent }) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className={`text-2xl font-extrabold ${accent}`}>{stats[key] ?? 0}</p>
                <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Permintaan Pending</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PENDING_CARDS.map(({ key, label, sub, to, accent, border }) => {
                const val = Number(stats[key] || 0);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigate(to)}
                    className={`rounded-xl border p-3 text-left transition ${border}`}
                  >
                    <p className={`text-2xl font-extrabold ${accent}`}>{val}</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-600">{sub}</p>
                    {val > 0 ? <p className="mt-1 text-[10px] font-semibold text-slate-500">Ketuk untuk kelola →</p> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-intro-admin-menu>
        {menuCards.map(({ to, icon: Icon, label }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200"
          >
            <Icon className="text-blue-600" size={22} />
            <span className="font-bold text-slate-900">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
