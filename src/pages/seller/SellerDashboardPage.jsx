import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image, LayoutGrid, Megaphone, Package, Sparkles, Store } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(API_ENDPOINTS.SELLER_STATS).then((res) => setStats(res.data)).catch(() => setStats(null));
  }, []);

  const cards = [
    { to: "/seller/produk", icon: LayoutGrid, label: "Kelola Produk", desc: "Biasa & Roof Top" },
    { to: "/seller/toko", icon: Store, label: "Profil Toko", desc: "Logo, alamat, kontak" },
    { to: "/seller/banner", icon: Image, label: "Iklan Banner", desc: "Promosi di beranda" },
    { to: "/seller/feed", icon: Megaphone, label: "Iklan Feed", desc: "Order produk di beranda" },
    { to: "/seller/premium", icon: Sparkles, label: "Premium", desc: "Paket & order" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Iklan Saya</h1>
        <p className="text-sm text-slate-500">Halo, {user?.name}.</p>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3" data-intro-seller-stats>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <Package className="mx-auto text-blue-600" size={22} />
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{stats.active_products}</p>
            <p className="text-xs font-semibold text-slate-500">Produk Aktif</p>
            <p className="mt-1 text-[10px] text-slate-400">
              {stats.regular_products} biasa · {stats.rooftop_products} roof top
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <Image className="mx-auto text-violet-600" size={22} />
            <p className="mt-2 text-2xl font-extrabold text-green-700">{stats.active_banners}</p>
            <p className="text-xs font-semibold text-slate-500">Banner Aktif</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <Megaphone className="mx-auto text-teal-600" size={22} />
            <p className="mt-2 text-2xl font-extrabold text-teal-700">{stats.active_feed_ads ?? 0}</p>
            <p className="text-xs font-semibold text-slate-500">Feed Aktif</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2" data-intro-seller-menu>
        {cards.map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200">
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Icon size={22} />
            </span>
            <div>
              <p className="font-bold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
