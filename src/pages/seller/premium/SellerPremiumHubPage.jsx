import { CircleDollarSign, Info, Sparkles } from "lucide-react";
import { BannerPageStack, HubCard } from "@/components/banner/BannerUi";

export default function SellerPremiumHubPage() {
  return (
    <BannerPageStack>
      <div className="space-y-3.5" data-intro-seller-page-premium>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-700" size={22} />
            <h1 className="text-xl font-bold text-violet-900">Paket Premium</h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Tingkatkan visibilitas komoditas dan toko kamu di Peronline dengan akun premium.
          </p>
        </div>

        <p className="text-sm text-slate-600">Status premium & trial lihat di halaman Akun.</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Menu Premium</p>
        <HubCard
          icon={Info}
          title="Apa itu Premium?"
          subtitle="Pelajari manfaat akun premium"
          color="#7c3aed"
          to="/seller/premium/info"
        />
        <HubCard
          icon={CircleDollarSign}
          title="Pricelist Harga & Cara Order"
          subtitle="Lihat paket harga & cara bayar"
          color="#2563eb"
          to="/seller/premium/pricelist"
        />
      </div>
    </BannerPageStack>
  );
}
