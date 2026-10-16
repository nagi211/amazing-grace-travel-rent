import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import CartDrawer from "./components/CartDrawer";
import EstimateChat from "./components/EstimateChat";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";

// Lazy-loaded: the admin dashboard (realtime Supabase, calendar, inventory,
// push notifications) is sizeable code that regular site visitors never
// need — keeping it out of the main bundle means the public pages (the ones
// that actually matter for SEO/page speed) load faster.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

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
        <ScrollToTop />
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
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={null}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
      <Analytics />
    </BrowserRouter>
  );
}
