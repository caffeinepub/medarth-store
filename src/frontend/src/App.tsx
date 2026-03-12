import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import StorePage from "./pages/StorePage";

type Page = "store" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("store");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar
          currentPage={page}
          onAdminClick={() => setPage("admin")}
          onStoreClick={() => setPage("store")}
        />

        <div className="flex-1">
          {page === "store" && <StorePage />}
          {page === "admin" && <AdminPage />}
        </div>

        {page === "store" && <Footer />}

        <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
        <Toaster richColors position="top-right" />
      </div>
    </CartProvider>
  );
}
