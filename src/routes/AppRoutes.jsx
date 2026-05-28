import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import HomePage from "@/pages/buyer/HomePage";
import RooftopPage from "@/pages/buyer/RooftopPage";
import ProductDetailPage from "@/pages/buyer/ProductDetailPage";
import StoreFrontPage from "@/pages/buyer/StoreFrontPage";
import ProfilePage from "@/pages/buyer/ProfilePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import TermsPage from "@/pages/auth/TermsPage";
import SellerDashboardPage from "@/pages/seller/SellerDashboardPage";
import ManageStorePage from "@/pages/seller/ManageStorePage";
import ManageProductsPage from "@/pages/seller/ManageProductsPage";
import ProductFormPage from "@/pages/seller/ProductFormPage";
import SellerBannerRoutes from "@/pages/seller/banner/SellerBannerRoutes";
import SellerPremiumRoutes from "@/pages/seller/premium/SellerPremiumRoutes";
import SellerFeedRoutes from "@/pages/seller/feed/SellerFeedRoutes";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ManageUsersPage from "@/pages/admin/ManageUsersPage";
import ManageCategoriesPage from "@/pages/admin/ManageCategoriesPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminBannerRoutes from "@/pages/admin/banner/AdminBannerRoutes";
import AdminPremiumRoutes from "@/pages/admin/premium/AdminPremiumRoutes";
import AdminFeedRoutes from "@/pages/admin/feed/AdminFeedRoutes";
import ManageAnnouncementsPage from "@/pages/admin/ManageAnnouncementsPage";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/daftar" element={<RegisterPage />} />

      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="jasa/:id" element={<ProductDetailPage />} />
        <Route path="toko/:userId" element={<StoreFrontPage />} />
        <Route path="akun" element={<ProfilePage />} />
        <Route path="roof-top" element={<RooftopPage />} />
        <Route path="syarat-ketentuan" element={<TermsPage />} />

        <Route
          path="seller/iklan"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/toko"
          element={
            <ProtectedRoute roles={["seller"]}>
              <ManageStorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/produk"
          element={
            <ProtectedRoute roles={["seller"]}>
              <ManageProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/produk/baru"
          element={
            <ProtectedRoute roles={["seller"]}>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/produk/:id/edit"
          element={
            <ProtectedRoute roles={["seller"]}>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/banner/*"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerBannerRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/premium/*"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerPremiumRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="seller/feed/*"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerFeedRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/banner/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminBannerRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/premium/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminPremiumRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/feed/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminFeedRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/announcements"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageAnnouncementsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
