import AdminPricelistEditor from "@/pages/admin/shared/AdminPricelistEditor";
import { API_ENDPOINTS } from "@/utils/endpoints";

export default function AdminBannerPricelistPage() {
  return (
    <AdminPricelistEditor
      title="Pricelist Banner"
      subtitle="Paket harga & instruksi transfer"
      backTo="/admin/banner"
      listBasePath={API_ENDPOINTS.BANNER_PRICELIST}
      paymentFieldKey="banner_payment_instructions"
      packageLabelPrefix="Banner"
    />
  );
}
