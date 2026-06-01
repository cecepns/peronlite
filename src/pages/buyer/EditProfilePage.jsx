import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { resolveImageUrl } from "@/utils/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/akun", { replace: true });
      return;
    }
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user, navigate]);

  if (!user) return null;

  const avatarUri = avatarPreview || (user.avatar ? resolveImageUrl(user.avatar) : "https://i.pravatar.cc/200?img=12");

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      if (phone) form.append("phone", phone);
      if (avatarFile) form.append("avatar", avatarFile);
      const res = await api.put(API_ENDPOINTS.USERS.UPDATE(user.id), form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser(res.data);
      setAvatarFile(null);
      toast.success("Profile diupdate");
      navigate("/akun");
    } catch {
      toast.error("Gagal update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <Link
        to="/akun"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Kembali ke Akun
      </Link>
      <h1 className="text-lg font-extrabold text-slate-900">Edit Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Perbarui nama, email, nomor HP, dan foto profil.</p>

      <img src={avatarUri} alt="" className="mx-auto mt-5 h-24 w-24 rounded-full bg-slate-200 object-cover" />
      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-bold text-blue-600">
        <Camera size={18} />
        Ganti Foto Profil
        <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
      </label>
      <div className="mt-4 space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nomor HP" />
      </div>
      <Button variant="primary" className="mt-4 w-full" loading={saving} onClick={saveProfile}>
        <CheckCircle size={18} />
        Simpan Profile
      </Button>
    </div>
  );
}
