import { NavLink } from "react-router-dom";
import { Home, UserCircle, LayoutGrid, Image, Settings, Sprout } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${isActive ? "text-blue-600" : "text-slate-500"}`;

const rooftopLinkClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${isActive ? "text-amber-700" : "text-slate-500"}`;

export default function BottomNav() {
  const { user } = useAuth();
  const role = user?.role;

  if (!user) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg">
          <NavLink to="/" end className={linkClass}>
            <Home size={22} />
            Home
          </NavLink>
          <NavLink to="/roof-top" className={rooftopLinkClass}>
            <Sprout size={22} />
            Roof Top
          </NavLink>
          <NavLink to="/akun" className={linkClass}>
            <UserCircle size={22} />
            Akun
          </NavLink>
        </div>
      </nav>
    );
  }

  if (role === "seller") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl">
          <NavLink to="/" end className={linkClass} data-intro-mobile-seller-home>
            <Home size={20} />
            Home
          </NavLink>
          <NavLink to="/roof-top" className={rooftopLinkClass}>
            <Sprout size={20} />
            Roof Top
          </NavLink>
          <NavLink to="/seller/iklan" className={linkClass} data-intro-mobile-seller-iklan>
            <LayoutGrid size={20} />
            Iklan
          </NavLink>
          <NavLink to="/seller/banner" className={linkClass} data-intro-mobile-seller-banner>
            <Image size={20} />
            Banner
          </NavLink>
          <NavLink to="/akun" className={linkClass} data-intro-mobile-seller-akun>
            <UserCircle size={20} />
            Akun
          </NavLink>
        </div>
      </nav>
    );
  }

  if (role === "admin") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg">
          <NavLink to="/" end className={linkClass} data-intro-mobile-admin-home>
            <Home size={22} />
            Home
          </NavLink>
          <NavLink to="/roof-top" className={rooftopLinkClass}>
            <Sprout size={22} />
            Roof Top
          </NavLink>
          <NavLink to="/admin" end className={linkClass} data-intro-mobile-admin-dashboard>
            <LayoutGrid size={22} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/settings" className={linkClass} data-intro-mobile-admin-settings>
            <Settings size={22} />
            Settings
          </NavLink>
          <NavLink to="/akun" className={linkClass} data-intro-mobile-admin-akun>
            <UserCircle size={22} />
            Akun
          </NavLink>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg">
        <NavLink to="/" end className={linkClass}>
          <Home size={22} />
          Home
        </NavLink>
        <NavLink to="/roof-top" className={rooftopLinkClass}>
          <Sprout size={22} />
          Roof Top
        </NavLink>
        <NavLink to="/akun" className={linkClass}>
          <UserCircle size={22} />
          Akun
        </NavLink>
      </div>
    </nav>
  );
}
