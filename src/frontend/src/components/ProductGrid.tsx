import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  "All",
  "Moisturizers",
  "Serums",
  "Sunscreens",
  "Cleansers",
  "Treatments",
];

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="shop" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-4xl font-semibold text-foreground mb-3">
            Our Products
          </h2>
          <p className="text-muted-foreground">
            Evidence-based formulas for every skin concern
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              data-ocid="category.tab"
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className={`rounded-full transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No products in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onDetails={onProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
