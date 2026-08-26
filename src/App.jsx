import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <MobileActionBar />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
