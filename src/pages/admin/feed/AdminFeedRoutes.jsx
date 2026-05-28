import { Navigate, Route, Routes } from "react-router-dom";
import AdminFeedHubPage from "./AdminFeedHubPage";
import AdminFeedInfoPage from "./AdminFeedInfoPage";
import AdminFeedPricelistPage from "./AdminFeedPricelistPage";
import AdminFeedOrdersPage from "./AdminFeedOrdersPage";
import AdminFeedManagePage from "./AdminFeedManagePage";

export default function AdminFeedRoutes() {
  return (
    <Routes>
      <Route index element={<AdminFeedHubPage />} />
      <Route path="info" element={<AdminFeedInfoPage />} />
      <Route path="pricelist" element={<AdminFeedPricelistPage />} />
      <Route path="kelola" element={<AdminFeedManagePage />} />
      <Route path="orders" element={<AdminFeedOrdersPage />} />
      <Route path="*" element={<Navigate to="/admin/feed" replace />} />
    </Routes>
  );
}
