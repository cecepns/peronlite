import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BrandLogo from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/constants/brand";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Anda harus menyetujui Syarat dan Ketentuan");
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, phone, password, role: ["buyer", "seller"].includes(role) ? role : "buyer" });
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <BrandLogo className="h-20 w-auto max-w-[180px]" />
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">Buat Akun</h1>
          <div className="space-y-3">
            <Input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Nomor HP (opsional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller (Penjual Komoditas)</option>
            </select>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-2.5">
            <button
              type="button"
              onClick={() => setAgreedTerms((v) => !v)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${agreedTerms ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}
            >
              {agreedTerms ? <Check size={14} /> : null}
            </button>
            <span className="text-xs leading-relaxed text-slate-500">
              Saya telah membaca dan menyetujui{" "}
              <Link to="/syarat-ketentuan" className="font-bold text-blue-600 underline">
                Syarat dan Ketentuan
              </Link>{" "}
              penggunaan aplikasi {BRAND_NAME}.
            </span>
          </label>
          <Button type="submit" loading={loading} disabled={!agreedTerms} className="mt-4 w-full">
            Register
          </Button>
          <p className="mt-4 text-center text-sm">
            <Link to="/login" className="font-semibold text-blue-600">
              Sudah punya akun? Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
