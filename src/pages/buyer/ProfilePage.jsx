import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  FileText,
  LogOut,
  MessageCircle,
  Pencil,
  Search,
  Sparkles,
  UserPlus
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { resolveImageUrl } from "@/utils/image";
import { buildWhatsAppUrl } from "@/utils/phone";
import Button from "@/components/ui/Button";
import BrandLogo from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/constants/brand";

function GuestProfile({ adminContacts }) {
  const features = [
    { icon: Search, text: "Cari komoditas pertanian terdekat" },
    { icon: Building2, text: "Buka toko & jual komoditas hasil bumi" },
    { icon: Sparkles, text: "Upgrade premium untuk visibilitas" }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="relative bg-gradient-to-b from-emerald-50 to-green-100/60 px-5 pb-12 pt-8 text-center sm:px-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-emerald-600/10" />
        <div className="pointer-events-none absolute -bottom-8 left-4 h-28 w-28 rounded-full bg-lime-400/15" />
        <BrandLogo className="relative mx-auto h-28 w-auto max-w-[220px]" />
        <h1 className="relative mt-3 text-2xl font-extrabold text-slate-900">Selamat Datang di {BRAND_NAME}</h1>
        <p className="relative mx-auto mt-2 max-w-sm text-sm text-slate-600">
          Jelajahi dulu tanpa akun. Masuk saat siap membeli atau mulai berjualan.
        </p>
      </div>
      <div className="-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
        <h2 className="mt-2 font-bold text-slate-900">Kenapa perlu akun?</h2>
        <ul className="mt-3 space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={20} />
              </span>
              <span className="text-sm font-medium text-slate-600">{text}</span>
            </li>
          ))}
        </ul>
        <Link to="/login" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-700/30">
          Masuk ke Akun
          <ArrowRight size={20} />
        </Link>
        <Link
          to="/daftar"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 py-3.5 text-base font-bold text-emerald-800"
        >
          <UserPlus size={20} />
          Buat Akun Baru
        </Link>
        {adminContacts?.length ? (
          <div className="mt-3 space-y-2">
            {adminContacts.map(({ label, url }) =>
              url ? (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3.5 text-base font-bold text-green-700"
                >
                  <MessageCircle size={20} />
                  {label}
                </a>
              ) : null
            )}
          </div>
        ) : null}
        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
          Dengan mendaftar, kamu setuju{" "}
          <Link to="/syarat-ketentuan" className="font-bold text-blue-600">
            Syarat dan Ketentuan
          </Link>{" "}
          {BRAND_NAME}.
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, becomeSeller } = useAuth();
  const navigate = useNavigate();
  const [switchingRole, setSwitchingRole] = useState(false);
  const [adminWhatsapp, setAdminWhatsapp] = useState("");
  const [adminWhatsapp2, setAdminWhatsapp2] = useState("");

  useEffect(() => {
    api
      .get(API_ENDPOINTS.ADMIN.CONTACT)
      .then((res) => {
        setAdminWhatsapp(res.data?.whatsapp || "");
        setAdminWhatsapp2(res.data?.whatsapp_2 || "");
      })
      .catch(() => {
        setAdminWhatsapp("");
        setAdminWhatsapp2("");
      });
  }, []);

  const buildAdminContact = (phone, label) => {
    const url = buildWhatsAppUrl(phone, `Halo ${label} ${BRAND_NAME}, saya butuh bantuan.`);
    return url ? { label, url } : null;
  };

  const adminContacts = [
    buildAdminContact(adminWhatsapp, "Admin 1"),
    buildAdminContact(adminWhatsapp2, "Admin 2")
  ].filter(Boolean);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-md">
        <GuestProfile adminContacts={adminContacts} />
      </div>
    );
  }

  const avatarUri = user.avatar ? resolveImageUrl(user.avatar) : "https://i.pravatar.cc/200?img=12";

  const onBecomeSeller = async () => {
    setSwitchingRole(true);
    try {
      await becomeSeller();
      navigate("/seller/toko");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal mengubah role");
    } finally {
      setSwitchingRole(false);
    }
  };

  const premiumActive = user?.is_premium_active || user?.is_premium;
  const trialActive = user?.is_trial_active;
  const expiresLabel = user?.premium_expires_at
    ? new Date(user.premium_expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const adminWaUrl = buildWhatsAppUrl(adminWhatsapp, `Halo Admin ${BRAND_NAME}, saya butuh bantuan.`);
  const adminWaUrl2 = buildWhatsAppUrl(adminWhatsapp2, `Halo Admin 2 ${BRAND_NAME}, saya butuh bantuan.`);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" data-intro-account>
      <img src={avatarUri} alt="" className="mx-auto h-24 w-24 rounded-full bg-slate-200 object-cover" />
      <div className="mt-3 text-center">
        <p className="text-lg font-extrabold text-slate-900">{user.name}</p>
        <p className="text-sm text-slate-500">{user.email}</p>
        {user.phone ? <p className="text-sm text-slate-500">{user.phone}</p> : null}
      </div>

      {user.role === "seller" ? (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            premiumActive ? "border-green-200 bg-green-50 text-green-900" : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            <Sparkles size={18} />
            Status Premium: {premiumActive ? "Aktif" : "Tidak Aktif"}
          </div>
          {!premiumActive && trialActive ? (
            <p className="mt-1 text-xs opacity-90">Trial masih berjalan.</p>
          ) : null}
          {!premiumActive && !trialActive ? (
            <p className="mt-1 text-xs opacity-90">Produk tidak tampil di beranda buyer. Order premium untuk aktivasi.</p>
          ) : null}
          {premiumActive && expiresLabel ? (
            <p className="mt-1 text-xs opacity-90">Berlaku sampai {expiresLabel}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/akun/edit")}>
          <Pencil size={18} />
          Edit Profile
        </Button>
        {user.role === "buyer" ? (
          <Button variant="seller" className="w-full" loading={switchingRole} onClick={onBecomeSeller}>
            <Building2 size={18} />
            Jadi Penjual Komoditas (Seller)
          </Button>
        ) : null}
        {user.role === "seller" ? (
          <Button variant="premium" className="w-full" onClick={() => navigate("/seller/premium")}>
            <Sparkles size={18} />
            Order Premium
          </Button>
        ) : null}
        {adminWaUrl ? (
          <Button
            variant="outline"
            className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => window.open(adminWaUrl, "_blank", "noopener,noreferrer")}
          >
            <MessageCircle size={18} />
            Hubungi Admin 1
          </Button>
        ) : null}
        {adminWaUrl2 ? (
          <Button
            variant="outline"
            className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => window.open(adminWaUrl2, "_blank", "noopener,noreferrer")}
          >
            <MessageCircle size={18} />
            Hubungi Admin 2
          </Button>
        ) : null}
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/syarat-ketentuan")}>
          <FileText size={18} />
          Syarat & Ketentuan Aplikasi
        </Button>
        <Button variant="danger" className="w-full" onClick={logout}>
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}
