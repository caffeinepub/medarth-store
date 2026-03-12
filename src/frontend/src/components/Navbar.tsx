import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

interface NavbarProps {
  onAdminClick?: () => void;
  currentPage: "store" | "admin";
  onStoreClick?: () => void;
}

export default function Navbar({
  onAdminClick,
  currentPage,
  onStoreClick,
}: NavbarProps) {
  const { totalItems, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={onStoreClick}
        >
          <img
            src="/assets/generated/medarth-logo-transparent.dim_400x120.png"
            alt="Medarth"
            className="h-8 w-auto"
          />
        </motion.div>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex items-center gap-8"
        >
          <button
            type="button"
            onClick={onStoreClick}
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            Home
          </button>
          <a
            data-ocid="nav.shop_link"
            href="#shop"
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            Shop
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            About
          </a>
          {currentPage !== "admin" && (
            <button
              type="button"
              data-ocid="nav.admin_link"
              onClick={onAdminClick}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Admin
            </button>
          )}
          {currentPage === "admin" && (
            <button
              type="button"
              onClick={onStoreClick}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              ← Store
            </button>
          )}
        </motion.div>

        {/* Cart button */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            data-ocid="nav.cart_button"
            variant="outline"
            size="icon"
            className="relative border-primary/30 hover:bg-primary/10"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-primary" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>
        </motion.div>
      </nav>
    </header>
  );
}
