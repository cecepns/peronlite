import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useDebounce } from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";

const ROLES = ["buyer", "seller", "admin"];

function formatDateId(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function PremiumBadge({ user }) {
  const active = user.is_premium_active;
  return (
    <div className="space-y-0.5">
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
          active ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-600"
        }`}
      >
        {active ? "Premium" : "Basic"}
      </span>
      {user.role === "seller" && user.premium_trial_ends_at ? (
        <p className="text-[10px] text-slate-500">Trial: {formatDateId(user.premium_trial_ends_at)}</p>
      ) : null}
      {user.is_premium ? <p className="text-[10px] text-slate-500">S/d: {formatDateId(user.premium_expires_at)}</p> : null}
    </div>
  );
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "buyer", password: "" });
  const [saving, setSaving] = useState(false);
  const [premiumUser, setPremiumUser] = useState(null);
  const [premiumExpires, setPremiumExpires] = useState("");
  const [premiumSaving, setPremiumSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API_ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      setUsers(res.data?.data || []);
      const p = res.data?.pagination || {};
      setPagination({
        page: p.page || page,
        limit: p.limit || limit,
        total: p.total || 0,
        totalPages: p.total_pages || p.totalPages || 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  useEffect(() => {
    loadUsers();
  }, [page, search, limit]);

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", role: user.role || "buyer", password: "" });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    try {
      const payload = { name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role };
      if (editForm.password) payload.password = editForm.password;
      await api.put(API_ENDPOINTS.USERS.UPDATE(editUser.id), payload);
      toast.success("User diupdate");
      setEditUser(null);
      loadUsers();
    } catch {
      toast.error("Gagal update user");
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (id, name) => {
    if (!window.confirm(`Hapus user "${name}"?`)) return;
    try {
      await api.delete(API_ENDPOINTS.USERS.DELETE(id));
      toast.success("User dihapus");
      loadUsers();
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  const updatePremium = async (userId, isPremium, expiresAt = null) => {
    try {
      await api.patch(API_ENDPOINTS.USERS.PREMIUM(userId), {
        is_premium: isPremium,
        premium_expires_at: expiresAt
      });
      toast.success("Status premium diupdate");
      setPremiumUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal update premium");
    }
  };

  const openPremiumUpgrade = (user) => {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 1);
    setPremiumExpires(defaultDate.toISOString().slice(0, 10));
    setPremiumUser(user);
  };

  const confirmPremiumUpgrade = async (e) => {
    e.preventDefault();
    if (!premiumUser || !premiumExpires) {
      toast.error("Tanggal expired wajib diisi");
      return;
    }
    setPremiumSaving(true);
    try {
      await updatePremium(premiumUser.id, true, premiumExpires);
    } finally {
      setPremiumSaving(false);
    }
  };

  const downgradePremium = async (user) => {
    if (!window.confirm(`Downgrade premium untuk "${user.name}"?`)) return;
    await updatePremium(user.id, false, null);
  };

  return (
    <div className="space-y-4" data-intro-admin-page-users>
      <h1 className="text-xl font-bold text-slate-900">Kelola User</h1>
      <Input placeholder="Cari nama, email, atau HP..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : !users.length ? (
        <EmptyState icon={Users} title="Tidak ada user" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <PremiumBadge user={u} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        title="Edit user"
                        onClick={() => openEdit(u)}
                        className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100"
                      >
                        <Pencil size={16} />
                      </button>
                      {u.is_premium ? (
                        <button
                          type="button"
                          title="Downgrade premium"
                          onClick={() => downgradePremium(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                        >
                          <ArrowDownCircle size={16} />
                          Downgrade
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Upgrade premium"
                          onClick={() => openPremiumUpgrade(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100"
                        >
                          <ArrowUpCircle size={16} />
                          Upgrade
                        </button>
                      )}
                      <button
                        type="button"
                        title="Hapus user"
                        onClick={() => removeUser(u.id, u.name)}
                        className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4">
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(v) => {
                setLimit(v);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      <Modal open={Boolean(editUser)} onClose={() => setEditUser(null)} title="Edit User">
        <form onSubmit={saveEdit} className="space-y-3">
          <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama" />
          <Input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" />
          <Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="HP" />
          <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm">
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Input type="password" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password baru (opsional)" />
          <Button type="submit" loading={saving} className="w-full">
            Simpan
          </Button>
        </form>
      </Modal>

      <Modal open={Boolean(premiumUser)} onClose={() => setPremiumUser(null)} title={`Upgrade Premium — ${premiumUser?.name || ""}`}>
        <form onSubmit={confirmPremiumUpgrade} className="space-y-3">
          <p className="text-sm text-slate-600">Set tanggal berakhirnya paket premium untuk user ini.</p>
          <label className="block text-sm font-bold text-slate-700">Berlaku sampai</label>
          <input
            type="date"
            value={premiumExpires}
            onChange={(e) => setPremiumExpires(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
          <Button type="submit" loading={premiumSaving} className="w-full">
            Aktifkan Premium
          </Button>
        </form>
      </Modal>
    </div>
  );
}
