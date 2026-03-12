import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../backend.d";

const CATEGORIES = [
  "Moisturizers",
  "Serums",
  "Sunscreens",
  "Cleansers",
  "Treatments",
];

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  product?: Product | null;
  isSaving?: boolean;
}

const defaultProduct = (): Product => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  price: 0,
  stock: BigInt(0),
  imageUrl: "",
  category: "Moisturizers",
  isFeatured: false,
});

export default function ProductForm({
  open,
  onClose,
  onSave,
  product,
  isSaving,
}: ProductFormProps) {
  const [form, setForm] = useState<Product>(defaultProduct());

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when dialog opens/closes
  useEffect(() => {
    setForm(product ? { ...product } : defaultProduct());
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Product Name</Label>
            <Input
              id="pf-name"
              data-ocid="product_form.input"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Hydra-Repair Moisturizer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-desc">Description</Label>
            <Textarea
              id="pf-desc"
              data-ocid="product_form.input"
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">Price (₹)</Label>
              <Input
                id="pf-price"
                data-ocid="product_form.input"
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-stock">Stock</Label>
              <Input
                id="pf-stock"
                data-ocid="product_form.input"
                type="number"
                required
                min={0}
                value={form.stock.toString()}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: BigInt(e.target.value || 0) }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger data-ocid="product_form.input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-image">Image URL</Label>
            <Input
              id="pf-image"
              data-ocid="product_form.input"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="pf-featured"
              checked={form.isFeatured}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
            />
            <Label htmlFor="pf-featured">Featured product</Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              data-ocid="product_form.cancel_button"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              data-ocid="product_form.submit_button"
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
