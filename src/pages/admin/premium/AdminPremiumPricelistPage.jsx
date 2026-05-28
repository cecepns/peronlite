import AdminPricelistEditor from "@/pages/admin/shared/AdminPricelistEditor";
import { API_ENDPOINTS } from "@/utils/endpoints";

export default function AdminPremiumPricelistPage() {
  return (
    <AdminPricelistEditor
      title="Pricelist Premium"
      subtitle="Paket harga & instruksi transfer"
      backTo="/admin/premium"
      listBasePath={API_ENDPOINTS.PREMIUM_PRICELIST}
      paymentFieldKey="premium_payment_instructions"
      packageLabelPrefix="Premium"
    />
  );
}
