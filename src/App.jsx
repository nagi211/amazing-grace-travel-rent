import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import CartDrawer from "./components/CartDrawer";
import EstimateChat from "./components/EstimateChat";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function PublicSite({ children }) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileActionBar />
      <CartDrawer />
      <EstimateChat />
    </CartProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicSite>
                <Home />
              </PublicSite>
            }
          />
          <Route
            path="/pricing"
            element={
              <PublicSite>
                <Pricing />
              </PublicSite>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
