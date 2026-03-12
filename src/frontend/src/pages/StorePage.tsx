import { useState } from "react";
import type { Product } from "../backend.d";
import FeaturedProducts from "../components/FeaturedProducts";
import HeroSection from "../components/HeroSection";
import ProductDetail from "../components/ProductDetail";
import ProductGrid from "../components/ProductGrid";
import { useAllProducts, useFeaturedProducts } from "../hooks/useQueries";

export default function StorePage() {
  const { data: allProducts = [] } = useAllProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const scrollToShop = () => {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <HeroSection onShopNow={scrollToShop} />
      <FeaturedProducts
        products={featuredProducts}
        onProductClick={setSelectedProduct}
      />
      <ProductGrid products={allProducts} onProductClick={setSelectedProduct} />
      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
