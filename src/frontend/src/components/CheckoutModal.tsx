import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [orderId, setOrderId] = useState<bigint | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shipping: "",
    billing: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: BigInt(i.quantity),
        unitPrice: i.product.price,
      }));
      const billingAddr = sameAsShipping ? form.shipping : form.billing;
      const shippingAddressJson = JSON.stringify({
        phone: form.phone,
        shipping: form.shipping,
        billing: billingAddr,
        paymentStatus: "Pending",
      });
      const id = await placeOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: shippingAddressJson,
        items: orderItems,
      });
      setOrderId(id);
      clearCart();
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleClose = () => {
    setOrderId(null);
    setForm({ name: "", email: "", phone: "", shipping: "", billing: "" });
    setSameAsShipping(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {orderId ? "Order Confirmed!" : "Checkout"}
          </DialogTitle>
        </DialogHeader>

        {orderId ? (
          <div
            data-ocid="order.success_state"
            className="text-center py-8 space-y-4"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-lg">
                Thank you for your order!
              </p>
              <p className="text-muted-foreground mt-1">
                Order #{orderId.toString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send a confirmation to {form.email}. Your order will arrive
              in 3–5 business days.
            </p>
            <Button
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleClose}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">
                Order Summary
              </p>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Contact Details
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-name">Full Name *</Label>
                  <Input
                    id="checkout-name"
                    data-ocid="checkout.input"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-email">Email *</Label>
                  <Input
                    id="checkout-email"
                    data-ocid="checkout.input"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-phone">Phone Number *</Label>
                  <Input
                    id="checkout-phone"
                    data-ocid="checkout.input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Shipping Address
              </p>
              <Textarea
                id="checkout-shipping"
                data-ocid="checkout.textarea"
                placeholder="House/Flat no., Street, City, State, Pincode"
                required
                rows={3}
                value={form.shipping}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shipping: e.target.value }))
                }
              />
            </div>

            {/* Billing Address */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Billing Address
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="same-as-shipping"
                    data-ocid="checkout.checkbox"
                    checked={sameAsShipping}
                    onCheckedChange={(v) => setSameAsShipping(!!v)}
                  />
                  <Label
                    htmlFor="same-as-shipping"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Same as shipping
                  </Label>
                </div>
              </div>
              {!sameAsShipping && (
                <Textarea
                  id="checkout-billing"
                  data-ocid="checkout.textarea"
                  placeholder="House/Flat no., Street, City, State, Pincode"
                  required
                  rows={3}
                  value={form.billing}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, billing: e.target.value }))
                  }
                />
              )}
              {sameAsShipping && (
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  {form.shipping || "(same as shipping address)"}
                </p>
              )}
            </div>

            <Button
              data-ocid="checkout.submit_button"
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              disabled={placeOrder.isPending || items.length === 0}
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                  Order...
                </>
              ) : (
                `Place Order — ₹${subtotal.toLocaleString()}`
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
