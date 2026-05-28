import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, FolderTree, Image, LayoutGrid, Settings, Sparkles, Users } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN.STATS).then((res) => setStats(res.data)).catch(() => setStats(null));
  }, []);

  const cards = [
    { to: "/admin/users", icon: Users, label: "Kelola User" },
    { to: "/admin/categories", icon: FolderTree, label: "Komoditas" },
    { to: "/admin/banner", icon: Image, label: "Iklan Banner" },
    { to: "/admin/feed", icon: LayoutGrid, label: "Iklan Feed" },
    { to: "/admin/premium", icon: Sparkles, label: "Premium" },
    { to: "/admin/announcements", icon: Bell, label: "Pengumuman" },
    { to: "/admin/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Dashboard Admin</h1>
      {stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-intro-admin-stats>
          {Object.entries(stats).map(([key, val]) => {
            const isPending = key === "pending_requests";
            const CardTag = isPending ? "button" : "div";
            return (
              <CardTag
                key={key}
                type={isPending ? "button" : undefined}
                onClick={isPending ? () => navigate("/admin/banner/orders") : undefined}
                className={`rounded-xl border bg-white p-3 text-center ${
                  isPending ? "border-amber-200 bg-amber-50 hover:bg-amber-100" : "border-slate-200"
                }`}
              >
                <p className={`text-2xl font-extrabold ${isPending ? "text-amber-700" : "text-blue-600"}`}>{val}</p>
                <p className="text-xs font-semibold uppercase text-slate-500">{key.replace(/_/g, " ")}</p>
                {isPending ? <p className="mt-1 text-[10px] font-semibold text-amber-800">Ketuk untuk kelola</p> : null}
              </CardTag>
            );
          })}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-intro-admin-menu>
        {cards.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-200">
            <Icon className="text-blue-600" size={22} />
            <span className="font-bold text-slate-900">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
