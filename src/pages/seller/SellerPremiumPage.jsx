import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { formatRupiah } from "@/utils/format";
import { BRAND_NAME } from "@/constants/brand";

/** Ringkasan pricelist untuk admin (kelola penuh di mobile admin). */
export default function SellerPremiumPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get(API_ENDPOINTS.PREMIUM_PRICELIST).then((res) => setItems(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-violet-600" />
        <h1 className="text-xl font-bold text-slate-900">Order Premium</h1>
      </div>
      <p className="text-sm text-slate-600">Tingkatkan visibilitas komoditas Anda di {BRAND_NAME}. Hubungi admin untuk aktivasi setelah memilih paket.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4">
            <p className="font-bold text-slate-900">{item.name || `Paket ${item.duration_days} hari`}</p>
            <p className="mt-1 text-lg font-extrabold text-violet-700">{formatRupiah(item.price)}</p>
            {item.duration_days ? <p className="text-xs text-slate-500">{item.duration_days} hari aktif</p> : null}
          </div>
        ))}
      </div>
      {!items.length ? <p className="text-sm text-slate-500">Pricelist premium belum tersedia.</p> : null}
    </div>
  );
}
