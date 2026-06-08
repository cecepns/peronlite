import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import AppRoutes from "@/routes/AppRoutes";
import ScrollToTop from "@/components/layout/ScrollToTop";
import SplashScreen from "@/components/ui/SplashScreen";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SplashScreen />
        <ScrollToTop />
        <AppRoutes />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
