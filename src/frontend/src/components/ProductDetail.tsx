import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetail({
  product,
  open,
  onClose,
}: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-2xl">
            {product.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/generated/product-moisturizer.dim_600x600.jpg";
              }}
            />
            {product.isFeatured && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 bg-primary/5"
              >
                {product.category}
              </Badge>
              <Badge
                variant={
                  Number(product.stock) > 0 ? "secondary" : "destructive"
                }
              >
                {Number(product.stock) > 0
                  ? `${product.stock.toString()} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>

            <div className="font-display text-3xl font-semibold text-foreground">
              ₹{product.price.toLocaleString()}
            </div>
          </div>

          {/* Quantity + Add */}
          {Number(product.stock) > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() =>
                      setQuantity((q) => Math.min(Number(product.stock), q + 1))
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                data-ocid="product.add_button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart — ₹{(product.price * quantity).toLocaleString()}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
