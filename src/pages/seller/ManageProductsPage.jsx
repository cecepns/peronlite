import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/utils/format";
import { resolveImageUrl } from "@/utils/image";
import { parseRooftopItems } from "@/utils/product";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function ManageProductsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tipe") === "rooftop" ? "rooftop" : "regular";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const q = new URLSearchParams({
      seller_id: String(user.id),
      product_type: tab,
      limit: "100",
      offset: "0"
    }).toString();
    api
      .get(`${API_ENDPOINTS.PRODUCTS.LIST}?${q}`)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [user.id, tab]);

  const filtered = useMemo(() => products, [products]);

  const remove = async (id, name) => {
    if (!window.confirm(`Hapus "${name}"?`)) return;
    try {
      await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
      toast.success("Produk dihapus");
      load();
    } catch {
      toast.error("Gagal menghapus produk");
    }
  };

  return (
    <div className="space-y-4" data-intro-seller-page-produk>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Produk Saya</h1>
        <Link to={`/seller/produk/baru?tipe=${tab}`}>
          <Button>
            <Plus size={18} />
            Tambah {tab === "rooftop" ? "Roof Top" : "Produk"}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "regular", label: "Produk Biasa" },
          { id: "rooftop", label: "Roof Top" }
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSearchParams({ tipe: id })}
            className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
              tab === id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : !filtered.length ? (
        <EmptyState
          icon={Package}
          title={tab === "rooftop" ? "Belum ada Roof Top" : "Belum ada produk"}
          description="Tambahkan listing pertama Anda."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const items = parseRooftopItems(p);
            return (
              <div key={p.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <img src={resolveImageUrl(p.thumbnail)} alt="" className="h-20 w-20 rounded-lg bg-slate-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{p.name}</p>
                  {tab === "rooftop" && items.length ? (
                    <p className="text-xs text-slate-500">{items.length} komoditas</p>
                  ) : (
                    <p className="text-sm font-bold text-teal-700">{formatRupiah(p.price)}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Link to={`/seller/produk/${p.id}/edit?tipe=${tab}`} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50">
                      <Pencil size={16} />
                    </Link>
                    <button type="button" onClick={() => remove(p.id, p.name)} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
