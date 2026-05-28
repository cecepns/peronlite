import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { buildWhatsAppUrl } from "@/utils/phone";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BrandLogo from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/constants/brand";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordUrl, setForgotPasswordUrl] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.ADMIN.CONTACT)
      .then((res) => {
        const url = buildWhatsAppUrl(
          res.data?.whatsapp,
          `Halo Admin, saya lupa password akun ${BRAND_NAME}. Mohon bantu reset password. Terima kasih.`
        );
        setForgotPasswordUrl(url);
      })
      .catch(() => setForgotPasswordUrl(""));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Email/HP dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate("/", { replace: true });
    } catch (error) {
      let message = error?.response?.data?.message || "Login gagal";
      if (error?.code === "ECONNABORTED") message = "Request timeout. Cek koneksi API.";
      else if (!error?.response) message = "Tidak bisa terhubung ke backend.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo className="h-24 w-auto max-w-[200px]" />
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/60">
            <div className="mb-5 text-center">
              <h1 className="text-xl font-bold text-slate-900">Selamat Datang</h1>
              <p className="mt-1 text-sm text-slate-500">Masuk dengan email atau nomor HP.</p>
            </div>
            <div className="space-y-3">
              <Input placeholder="Email atau Nomor HP" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoCapitalize="off" />
              <div>
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {forgotPasswordUrl ? (
                  <button type="button" onClick={() => window.open(forgotPasswordUrl, "_blank")} className="mt-2 ml-auto block text-xs font-semibold text-green-600">
                    Lupa password?
                  </button>
                ) : null}
              </div>
            </div>
            <Button type="submit" loading={loading} className="mt-5 w-full">
              Login
            </Button>
            <Link
              to="/"
              className="mt-3 flex w-full items-center justify-center gap-1 py-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              Kembali ke beranda
            </Link>
            <div className="mt-5 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link to="/daftar" className="font-bold text-blue-600">
                Daftar sekarang
              </Link>
            </div>
        </form>
      </div>
    </div>
  );
}
