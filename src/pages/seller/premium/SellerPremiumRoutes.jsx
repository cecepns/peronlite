import { Navigate, Route, Routes } from "react-router-dom";
import SellerPremiumHubPage from "./SellerPremiumHubPage";
import SellerPremiumInfoPage from "./SellerPremiumInfoPage";
import SellerPremiumPricelistPage from "./SellerPremiumPricelistPage";

export default function SellerPremiumRoutes() {
  return (
    <Routes>
      <Route index element={<SellerPremiumHubPage />} />
      <Route path="info" element={<SellerPremiumInfoPage />} />
      <Route path="pricelist" element={<SellerPremiumPricelistPage />} />
      <Route path="*" element={<Navigate to="/seller/premium" replace />} />
    </Routes>
  );
}
