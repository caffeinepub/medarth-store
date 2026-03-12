import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
  onDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  onDetails,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <motion.div
      data-ocid={`product.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-card transition-shadow"
      onClick={() => onDetails(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/generated/product-moisturizer.dim_600x600.jpg";
          }}
        />
        {product.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
            Featured
          </Badge>
        )}
        {Number(product.stock) === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <Badge
            variant="outline"
            className="text-xs text-primary border-primary/30 bg-primary/5 mb-2"
          >
            {product.category}
          </Badge>
          <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-display text-xl font-semibold text-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          <Button
            data-ocid={`product.add_button.${index + 1}`}
            size="sm"
            className={`rounded-full gap-1.5 transition-all ${
              adding
                ? "bg-green-600 text-white"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
            onClick={handleAdd}
            disabled={Number(product.stock) === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {adding ? "Added!" : "Add"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
