import { Heart, Leaf } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer id="about" className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-display text-xl font-semibold">
                Medarth
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Science-backed dermatology skincare. Every product formulated with
              clinical precision and skin-first ethics.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-background/90">Products</h4>
            <ul className="space-y-2 text-sm text-background/60">
              {[
                "Moisturizers",
                "Serums",
                "Sunscreens",
                "Cleansers",
                "Treatments",
              ].map((cat) => (
                <li key={cat}>
                  <a
                    href="#shop"
                    className="hover:text-background transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-background/90">
              Our Promise
            </h4>
            <ul className="space-y-2 text-sm text-background/60">
              {[
                "Dermatologist Tested",
                "Fragrance-Free Formulas",
                "No Harmful Ingredients",
                "Cruelty-Free",
                "Clinically Proven",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-background/40">
          <span>© {year} Medarth. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-background/60 transition-colors"
          >
            Built with <Heart className="h-3 w-3 mx-0.5" /> using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
