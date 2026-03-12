import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  LogOut,
  Package,
  Save,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Order } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerUserProfile,
  useOrdersByEmail,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

interface ProfileSheetProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  Shipped: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  Delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status] ?? {
      label: status,
      className: "bg-muted text-muted-foreground border-border",
    }
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sc = getStatusConfig(order.status);

  return (
    <div
      data-ocid={`profile.order.item.${index}`}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Order #{order.id.toString()}
            </p>
            <p className="text-xs text-muted-foreground">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.className}`}
          >
            {sc.label}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Items
          </p>
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-foreground">
                {item.productName} × {item.quantity.toString()}
              </span>
              <span className="text-muted-foreground">
                ₹{(item.unitPrice * Number(item.quantity)).toFixed(2)}
              </span>
            </div>
          ))}
          <Separator className="my-1" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span className="text-primary">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
          {order.shippingAddress && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Ship to
              </p>
              <p className="text-xs text-foreground">{order.shippingAddress}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfileSheet({
  open,
  onClose,
  onLogout,
}: ProfileSheetProps) {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const email = profile?.email ?? "";
  const { data: orders, isLoading: ordersLoading } = useOrdersByEmail(email);

  const startEdit = () => {
    setEditName(profile?.name ?? "");
    setEditEmail(profile?.email ?? "");
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    await saveProfile.mutateAsync({ name: editName, email: editEmail });
    setEditing(false);
  };

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principalStr
    ? `${principalStr.slice(0, 8)}...${principalStr.slice(-4)}`
    : "";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        data-ocid="profile.sheet"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-tight">
                My Profile
              </p>
              {shortPrincipal && (
                <p className="text-xs text-muted-foreground font-mono">
                  {shortPrincipal}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-5 space-y-6">
            {/* Profile details */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Account Details
                </h3>
                {!editing && !profileLoading && (
                  <Button
                    data-ocid="profile.edit_button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-primary hover:text-primary"
                    onClick={startEdit}
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                )}
              </div>

              {profileLoading ? (
                <div data-ocid="profile.loading_state" className="space-y-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ) : editing ? (
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="profile-name"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="profile-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="profile-email"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Email
                    </Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-9"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      data-ocid="profile.save_button"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={handleSave}
                      disabled={saveProfile.isPending}
                    >
                      <Save className="h-3.5 w-3.5" />
                      {saveProfile.isPending ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      data-ocid="profile.cancel_button"
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={cancelEdit}
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-muted/40 border border-border">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.name || (
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-muted/40 border border-border">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.email || (
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </section>

            <Separator />

            {/* Orders */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                My Orders
              </h3>

              {ordersLoading || profileLoading ? (
                <div data-ocid="profile.loading_state" className="space-y-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : !email ? (
                <div
                  data-ocid="profile.empty_state"
                  className="flex flex-col items-center gap-2 py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add your email to see your orders
                  </p>
                </div>
              ) : orders && orders.length > 0 ? (
                <div data-ocid="profile.orders_list" className="space-y-2">
                  {orders.map((order, i) => (
                    <OrderRow
                      key={order.id.toString()}
                      order={order}
                      index={i + 1}
                    />
                  ))}
                </div>
              ) : (
                <div
                  data-ocid="profile.empty_state"
                  className="flex flex-col items-center gap-2 py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    Your orders will appear here once you shop
                  </p>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <Button
            data-ocid="profile.logout_button"
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
