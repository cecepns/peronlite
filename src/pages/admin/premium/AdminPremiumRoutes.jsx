import { Navigate, Route, Routes } from "react-router-dom";
import AdminPremiumHubPage from "./AdminPremiumHubPage";
import AdminPremiumInfoPage from "./AdminPremiumInfoPage";
import AdminPremiumPricelistPage from "./AdminPremiumPricelistPage";
import AdminPremiumOrdersPage from "./AdminPremiumOrdersPage";

export default function AdminPremiumRoutes() {
  return (
    <Routes>
      <Route index element={<AdminPremiumHubPage />} />
      <Route path="info" element={<AdminPremiumInfoPage />} />
      <Route path="pricelist" element={<AdminPremiumPricelistPage />} />
      <Route path="orders" element={<AdminPremiumOrdersPage />} />
      <Route path="*" element={<Navigate to="/admin/premium" replace />} />
    </Routes>
  );
}
