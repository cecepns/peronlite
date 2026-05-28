import AdminInfoEditor from "@/pages/admin/shared/AdminInfoEditor";

export default function AdminPremiumInfoPage() {
  return (
    <AdminInfoEditor
      title="Apa itu Premium?"
      subtitle="Konten penjelasan untuk seller"
      backTo="/admin/premium"
      fieldKey="premium_info_text"
      placeholder="Paket premium memberikan visibilitas lebih tinggi..."
    />
  );
}
