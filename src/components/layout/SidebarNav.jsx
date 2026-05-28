import { NavLink } from "react-router-dom";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Home,
  Image,
  LayoutGrid,
  Megaphone,
  Settings,
  Sparkles,
  Store,
  UserCircle,
  Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSidebarLayout } from "@/context/SidebarLayoutContext";
import BrandLogo from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/constants/brand";

function navItemClass({ isActive }, expanded) {
  const base = expanded
    ? "gap-3 px-3"
    : "justify-center px-2.5";
  return `flex items-center rounded-lg py-2.5 text-sm font-semibold transition ${base} ${
    isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;
}

export default function SidebarNav() {
  const { user } = useAuth();
  const { expanded, toggle, asideClass } = useSidebarLayout();
  const role = user?.role;

  if (!user || role === "buyer") return null;

  const sellerLinks = [
    { to: "/", label: "Home", icon: Home, end: true, introKey: "seller-nav-home" },
    { to: "/seller/iklan", label: "Iklan Saya", icon: LayoutGrid, introKey: "seller-nav-iklan" },
    { to: "/seller/toko", label: "Toko", icon: Store, introKey: "seller-nav-toko" },
    { to: "/seller/produk", label: "Produk", icon: FolderTree, introKey: "seller-nav-produk" },
    { to: "/seller/banner", label: "Banner", icon: Image, introKey: "seller-nav-banner" },
    { to: "/seller/feed", label: "Iklan Feed", icon: Megaphone, introKey: "seller-nav-feed" },
    { to: "/akun", label: "Akun", icon: UserCircle, introKey: "seller-nav-akun" }
  ];

  const adminLinks = [
    { to: "/", label: "Home", icon: Home, end: true, introKey: "admin-nav-home" },
    { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true, introKey: "admin-nav-dashboard" },
    { to: "/admin/users", label: "Users", icon: Users, introKey: "admin-nav-users" },
    { to: "/admin/categories", label: "Komoditas", icon: FolderTree, introKey: "admin-nav-categories" },
    { to: "/admin/banner", label: "Iklan Banner", icon: Image, introKey: "admin-nav-banner" },
    { to: "/admin/feed", label: "Iklan Feed", icon: LayoutGrid, introKey: "admin-nav-feed" },
    { to: "/admin/premium", label: "Premium", icon: Sparkles, introKey: "admin-nav-premium" },
    { to: "/admin/announcements", label: "Pengumuman", icon: Bell, introKey: "admin-nav-announcements" },
    { to: "/admin/settings", label: "Settings", icon: Settings, introKey: "admin-nav-settings" },
    { to: "/akun", label: "Akun", icon: UserCircle, introKey: "admin-nav-akun" }
  ];

  const links = role === "admin" ? adminLinks : sellerLinks;

  return (
    <aside
      data-intro-seller-sidebar={role === "seller" ? "" : undefined}
      data-intro-admin-sidebar={role === "admin" ? "" : undefined}
      className={`hidden shrink-0 border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:transition-[width] lg:duration-300 lg:ease-in-out ${asideClass} ${
        expanded ? "p-4" : "px-2 py-4"
      }`}
    >
      <div
        className={`mb-4 flex shrink-0 items-center ${expanded ? "justify-between gap-2" : "flex-col justify-center gap-3"}`}
      >
        <BrandLogo
          className={`object-contain ${expanded ? "h-10 w-auto max-w-[140px]" : "h-9 w-9"}`}
        />
        <span className="sr-only">{BRAND_NAME}</span>
        <button
          type="button"
          onClick={toggle}
          className={`flex shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 ${
            expanded ? "h-9 w-9" : "h-8 w-8"
          }`}
          aria-label={expanded ? "Ciutkan sidebar" : "Perluas sidebar"}
          title={expanded ? "Ciutkan sidebar" : "Perluas sidebar"}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end, introKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={!expanded ? label : undefined}
            className={(state) => navItemClass(state, expanded)}
            {...(introKey ? { [`data-intro-${introKey}`]: "" } : {})}
          >
            <Icon size={18} className="shrink-0" />
            {expanded ? <span className="truncate">{label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
