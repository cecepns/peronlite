import AdminInfoEditor from "@/pages/admin/shared/AdminInfoEditor";

export default function AdminBannerInfoPage() {
  return (
    <AdminInfoEditor
      title="Apa itu Iklan Banner?"
      subtitle="Konten penjelasan untuk seller"
      backTo="/admin/banner"
      fieldKey="banner_info_text"
      placeholder="Iklan banner adalah promosi di carousel halaman utama..."
    />
  );
}
