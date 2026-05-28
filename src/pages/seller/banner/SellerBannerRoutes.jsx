import { Navigate, Route, Routes } from "react-router-dom";
import SellerBannerHubPage from "./SellerBannerHubPage";
import SellerBannerInfoPage from "./SellerBannerInfoPage";
import SellerBannerPricelistPage from "./SellerBannerPricelistPage";
import SellerBannerManagePage from "./SellerBannerManagePage";

export default function SellerBannerRoutes() {
  return (
    <Routes>
      <Route index element={<SellerBannerHubPage />} />
      <Route path="info" element={<SellerBannerInfoPage />} />
      <Route path="pricelist" element={<SellerBannerPricelistPage />} />
      <Route path="kelola" element={<SellerBannerManagePage />} />
      <Route path="*" element={<Navigate to="/seller/banner" replace />} />
    </Routes>
  );
}
