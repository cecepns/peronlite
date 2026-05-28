import { Navigate, Route, Routes } from "react-router-dom";
import AdminBannerHubPage from "./AdminBannerHubPage";
import AdminBannerInfoPage from "./AdminBannerInfoPage";
import AdminBannerPricelistPage from "./AdminBannerPricelistPage";
import AdminBannerManagePage from "./AdminBannerManagePage";
import AdminBannerOrdersPage from "./AdminBannerOrdersPage";

export default function AdminBannerRoutes() {
  return (
    <Routes>
      <Route index element={<AdminBannerHubPage />} />
      <Route path="info" element={<AdminBannerInfoPage />} />
      <Route path="pricelist" element={<AdminBannerPricelistPage />} />
      <Route path="kelola" element={<AdminBannerManagePage />} />
      <Route path="orders" element={<AdminBannerOrdersPage />} />
      <Route path="*" element={<Navigate to="/admin/banner" replace />} />
    </Routes>
  );
}
