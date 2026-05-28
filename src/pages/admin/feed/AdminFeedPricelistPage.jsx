import AdminPricelistEditor from "@/pages/admin/shared/AdminPricelistEditor";
import { API_ENDPOINTS } from "@/utils/endpoints";

export default function AdminFeedPricelistPage() {
  return (
    <AdminPricelistEditor
      title="Pricelist Iklan Feed"
      subtitle="Paket highlight produk di beranda"
      backTo="/admin/feed"
      listBasePath={API_ENDPOINTS.FEED_PRICELIST}
      paymentFieldKey="feed_payment_instructions"
      packageLabelPrefix="Feed"
    />
  );
}
