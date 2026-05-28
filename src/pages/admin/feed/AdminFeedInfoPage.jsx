import AdminInfoEditor from "@/pages/admin/shared/AdminInfoEditor";

export default function AdminFeedInfoPage() {
  return (
    <AdminInfoEditor
      title="Apa itu Iklan Feed?"
      subtitle="Konten penjelasan untuk seller"
      backTo="/admin/feed"
      fieldKey="feed_info_text"
      placeholder="Iklan feed menampilkan produk Anda di section Iklan Produk pada beranda..."
    />
  );
}
