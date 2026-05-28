import AdminSellerRequestsPage from "@/pages/admin/shared/AdminSellerRequestsPage";

export default function AdminBannerOrdersPage() {
  return (
    <AdminSellerRequestsPage
      requestType="banner"
      title="Order Iklan Banner"
      subtitle="Kelola permintaan pemasangan banner dari seller"
      backTo="/admin/banner"
    />
  );
}
