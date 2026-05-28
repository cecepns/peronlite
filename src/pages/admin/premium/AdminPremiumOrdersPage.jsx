import AdminSellerRequestsPage from "@/pages/admin/shared/AdminSellerRequestsPage";

export default function AdminPremiumOrdersPage() {
  return (
    <AdminSellerRequestsPage
      requestType="premium"
      title="Order Premium"
      subtitle="Kelola permintaan upgrade premium dari seller"
      backTo="/admin/premium"
    />
  );
}
