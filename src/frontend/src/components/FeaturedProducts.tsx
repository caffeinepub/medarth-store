import { motion } from "motion/react";
import type { Product } from "../backend.d";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FeaturedProducts({
  products,
  onProductClick,
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4">
            Editor's Picks
          </div>
          <h2 className="font-display text-4xl font-semibold text-foreground mb-3">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Bestsellers loved by dermatologists and customers alike
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onDetails={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
