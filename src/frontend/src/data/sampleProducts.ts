import type { Product } from "../backend.d";

export const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Hydra-Repair Daily Moisturizer",
    description:
      "A science-backed daily moisturizer formulated with hyaluronic acid, ceramides, and niacinamide. Clinically proven to restore the skin barrier and deliver 72-hour hydration without clogging pores. Suitable for all skin types including sensitive and acne-prone.",
    category: "Moisturizers",
    price: 1299,
    stock: BigInt(48),
    imageUrl: "/assets/generated/product-moisturizer.dim_600x600.jpg",
    isFeatured: true,
  },
  {
    id: "p2",
    name: "BrightC Vitamin C Serum",
    description:
      "Potent 15% Vitamin C with 1% Vitamin E and 0.5% Ferulic Acid. This dermatologist-formulated brightening serum fades hyperpigmentation, reduces fine lines, and visibly evens skin tone in 4 weeks. Stable formula with extended shelf life.",
    category: "Serums",
    price: 1899,
    stock: BigInt(32),
    imageUrl: "/assets/generated/product-serum.dim_600x600.jpg",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "DermShield SPF 50 PA++++",
    description:
      "Broad-spectrum mineral + chemical hybrid sunscreen offering SPF 50 PA++++ protection. Ultra-light matte finish, no white cast. Contains zinc oxide and tinosorb filters. Reef-safe formula ideal for daily urban use.",
    category: "Sunscreens",
    price: 999,
    stock: BigInt(75),
    imageUrl: "/assets/generated/product-sunscreen.dim_600x600.jpg",
    isFeatured: true,
  },
  {
    id: "p4",
    name: "PureGlow Amino Acid Cleanser",
    description:
      "pH-balanced gentle face wash with amino acid surfactants, panthenol, and aloe vera. Cleanses thoroughly without stripping the skin's natural moisture barrier. Fragrance-free, dye-free, dermatologist-tested. Ideal for twice-daily use.",
    category: "Cleansers",
    price: 699,
    stock: BigInt(90),
    imageUrl: "/assets/generated/product-cleanser.dim_600x600.jpg",
    isFeatured: false,
  },
  {
    id: "p5",
    name: "RetinolX 0.5% Night Treatment",
    description:
      "Advanced retinol treatment encapsulated for slow release throughout the night. Formulated with 0.5% pure retinol, squalane, and bakuchiol to minimize irritation while accelerating cell turnover, reducing wrinkles, and refining skin texture.",
    category: "Treatments",
    price: 2499,
    stock: BigInt(20),
    imageUrl: "/assets/generated/product-treatment.dim_600x600.jpg",
    isFeatured: true,
  },
  {
    id: "p6",
    name: "AzeClear 10% Azelaic Serum",
    description:
      "Multi-action azelaic acid serum at 10% concentration. Clinically effective against acne, rosacea-related redness, and post-inflammatory hyperpigmentation. Lightweight gel texture absorbs instantly. Suitable for use alongside retinoids.",
    category: "Treatments",
    price: 1599,
    stock: BigInt(38),
    imageUrl: "/assets/generated/product-treatment.dim_600x600.jpg",
    isFeatured: false,
  },
];
