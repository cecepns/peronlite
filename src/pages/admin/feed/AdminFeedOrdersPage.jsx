import AdminSellerRequestsPage from "@/pages/admin/shared/AdminSellerRequestsPage";

export default function AdminFeedOrdersPage() {
  return (
    <AdminSellerRequestsPage
      requestType="feed"
      title="Order Iklan Feed"
      subtitle="Setujui untuk mengaktifkan highlight produk di beranda"
      backTo="/admin/feed"
    />
  );
}
