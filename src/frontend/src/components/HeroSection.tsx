import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onShopNow: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          {/* Text content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4">
                <Leaf className="h-3 w-3" />
                Dermatologist Formulated
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground">
                Science-backed
                <br />
                <span className="text-primary italic">skincare</span> for
                <br />
                healthy skin.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              Clinically proven formulas crafted by dermatologists. Every
              ingredient chosen with purpose — for real, visible results you can
              trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center gap-4"
            >
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full gap-2 shadow-elevated"
                onClick={onShopNow}
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Free shipping on ₹1999+
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-8 pt-4 border-t border-border"
            >
              {[
                { value: "50K+", label: "Happy customers" },
                { value: "98%", label: "Dermatologist approved" },
                { value: "0", label: "Harmful ingredients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src="/assets/generated/medarth-hero.dim_1200x500.jpg"
                alt="Medarth skincare products"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-card"
            >
              <div className="text-xs text-muted-foreground mb-1">
                Clinical efficacy
              </div>
              <div className="font-display text-lg font-semibold text-foreground">
                Proven Results
              </div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="w-2 h-2 rounded-full bg-primary" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
