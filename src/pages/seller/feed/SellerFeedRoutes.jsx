import { Navigate, Route, Routes } from "react-router-dom";
import SellerFeedHubPage from "./SellerFeedHubPage";
import SellerFeedInfoPage from "./SellerFeedInfoPage";
import SellerFeedPricelistPage from "./SellerFeedPricelistPage";
import SellerFeedOrderPage from "./SellerFeedOrderPage";

export default function SellerFeedRoutes() {
  return (
    <Routes>
      <Route index element={<SellerFeedHubPage />} />
      <Route path="info" element={<SellerFeedInfoPage />} />
      <Route path="pricelist" element={<SellerFeedPricelistPage />} />
      <Route path="order" element={<SellerFeedOrderPage />} />
      <Route path="*" element={<Navigate to="/seller/feed" replace />} />
    </Routes>
  );
}
