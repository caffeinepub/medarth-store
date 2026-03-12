import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Principal } from "@dfinity/principal";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { UserRole } from "../backend.d";
import ProductForm from "../components/ProductForm";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOrders,
  useAllProducts,
  useAssignUserRole,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function parseShippingData(raw: string) {
  try {
    const d = JSON.parse(raw);
    return {
      phone: d.phone || "",
      shipping: d.shipping || raw,
      billing: d.billing || d.shipping || raw,
      paymentStatus: d.paymentStatus || "Pending",
    };
  } catch {
    return { phone: "", shipping: raw, billing: raw, paymentStatus: "Pending" };
  }
}

function OrderStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Processing: "bg-blue-100 text-blue-800 border-blue-200",
    Shipped: "bg-purple-100 text-purple-800 border-purple-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  const cls = colorMap[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Paid: "bg-green-100 text-green-800 border-green-200",
    Failed: "bg-red-100 text-red-800 border-red-200",
  };
  const cls = colorMap[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {status}
    </span>
  );
}

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products = [] } = useAllProducts();
  const { data: orders = [] } = useAllOrders();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const assignUserRole = useAssignUserRole();
  const { identity, login, isLoggingIn } = useInternetIdentity();

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [principalInput, setPrincipalInput] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderItems = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  if (checkingAdmin) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.error_state"
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-4 rounded-full bg-primary/10">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              {identity
                ? "Your account doesn't have admin privileges. Please contact the store owner."
                : "Please log in with your Internet Identity to access the admin panel."}
            </p>
          </div>
          {!identity && (
            <Button
              data-ocid="admin.login_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-2"
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoggingIn ? "Connecting…" : "Login with Internet Identity"}
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  const handleSave = async (product: Product) => {
    try {
      if (editProduct) {
        await updateProduct.mutateAsync(product);
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(product);
        toast.success("Product created!");
      }
      setFormOpen(false);
      setEditProduct(null);
    } catch {
      toast.error("Failed to save product.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleGrantAdmin = async () => {
    const trimmed = principalInput.trim();
    if (!trimmed) {
      toast.error("Please enter a Principal ID.");
      return;
    }
    try {
      const principal = Principal.fromText(trimmed);
      await assignUserRole.mutateAsync({
        principal: principal as any,
        role: UserRole.admin,
      });
      toast.success("Admin access granted successfully!");
      setPrincipalInput("");
    } catch {
      toast.error(
        "Failed to grant admin access. Check that the Principal ID is valid.",
      );
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Manage products, orders, and user access
        </p>
      </motion.div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger data-ocid="admin.products_tab" value="products">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.orders_tab" value="orders">
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.users_tab" value="users">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">All Products</h2>
            <Button
              data-ocid="admin.add_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => {
                setEditProduct(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow
                    data-ocid={`admin.product.item.${i + 1}`}
                    key={product.id}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/assets/generated/product-moisturizer.dim_600x600.jpg";
                          }}
                        />
                        <span className="font-medium text-sm">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{product.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{product.stock.toString()}</TableCell>
                    <TableCell>
                      {product.isFeatured && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">
                          Yes
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          data-ocid={`admin.product.edit_button.${i + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-primary"
                          onClick={() => {
                            setEditProduct(product);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          data-ocid={`admin.product.delete_button.${i + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg">All Orders</h2>
            <span className="text-sm text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </span>
          </div>

          {orders.length === 0 ? (
            <div
              data-ocid="admin.order.empty_state"
              className="text-center py-20 border border-dashed border-border rounded-xl"
            >
              <Package className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Orders will appear here once customers start purchasing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const parsed = parseShippingData(order.shippingAddress);
                const isExpanded = expandedOrders.has(order.id.toString());
                const orderIdStr = order.id.toString();

                return (
                  <motion.div
                    key={orderIdStr}
                    data-ocid={`admin.order.item.${i + 1}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border border-border rounded-xl overflow-hidden shadow-sm"
                  >
                    {/* Card Header */}
                    <div className="bg-muted/40 px-5 py-4 flex flex-wrap items-center gap-3 justify-between border-b border-border">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs bg-background border border-border px-2 py-1 rounded-md text-muted-foreground">
                          #{orderIdStr.slice(-8).toUpperCase()}
                        </span>
                        <span className="font-semibold text-foreground">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                        <PaymentStatusBadge status={parsed.paymentStatus} />
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            updateOrderStatus.mutateAsync({
                              orderId: order.id,
                              status: v,
                            })
                          }
                        >
                          <SelectTrigger
                            data-ocid={`admin.order.status_select.${i + 1}`}
                            className="h-8 w-36 text-xs"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4 space-y-4">
                      {/* Customer Info */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                          Customer
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Name
                              </p>
                              <p className="text-sm font-medium">
                                {order.customerName || "—"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Email
                              </p>
                              <p className="text-sm font-medium break-all">
                                {order.customerEmail || "—"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Phone
                              </p>
                              <p className="text-sm font-medium">
                                {parsed.phone || "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                          Addresses
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              <p className="text-xs font-semibold text-foreground">
                                Shipping Address
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {parsed.shipping || "—"}
                            </p>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              <p className="text-xs font-semibold text-foreground">
                                Billing Address
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {parsed.billing || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items toggle */}
                      <div>
                        <button
                          type="button"
                          data-ocid={`admin.order.items_toggle.${i + 1}`}
                          onClick={() => toggleOrderItems(orderIdStr)}
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                        >
                          <Package className="h-3.5 w-3.5" />
                          View Items ({order.items.length})
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 border border-border rounded-lg overflow-hidden"
                          >
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50 text-xs text-muted-foreground">
                                  <th className="text-left px-3 py-2 font-semibold">
                                    Product
                                  </th>
                                  <th className="text-right px-3 py-2 font-semibold">
                                    Qty
                                  </th>
                                  <th className="text-right px-3 py-2 font-semibold">
                                    Unit Price
                                  </th>
                                  <th className="text-right px-3 py-2 font-semibold">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, j) => (
                                  <tr
                                    key={`${item.productName}-${j}`}
                                    className="border-t border-border hover:bg-muted/20 transition-colors"
                                  >
                                    <td className="px-3 py-2 font-medium">
                                      {item.productName}
                                    </td>
                                    <td className="px-3 py-2 text-right text-muted-foreground">
                                      {item.quantity.toString()}
                                    </td>
                                    <td className="px-3 py-2 text-right text-muted-foreground">
                                      ₹{item.unitPrice.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold">
                                      ₹
                                      {(
                                        item.unitPrice * Number(item.quantity)
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2 border-border bg-muted/30">
                                  <td
                                    colSpan={3}
                                    className="px-3 py-2 text-right font-semibold"
                                  >
                                    Total
                                  </td>
                                  <td className="px-3 py-2 text-right font-bold text-primary">
                                    ₹{order.totalAmount.toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="space-y-8">
            {/* Grant Admin Access */}
            <div className="border border-border rounded-xl p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Grant Admin Access</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Enter the Internet Identity Principal ID of the user you want to
                promote to admin. They can find their Principal ID on their
                profile page after logging in.
              </p>
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="principal-input">Principal ID</Label>
                  <Input
                    id="principal-input"
                    data-ocid="admin.grant_principal_input"
                    value={principalInput}
                    onChange={(e) => setPrincipalInput(e.target.value)}
                    placeholder="e.g. aaaaa-aa..."
                    className="font-mono text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleGrantAdmin()}
                  />
                </div>
                <Button
                  data-ocid="admin.grant_admin_button"
                  onClick={handleGrantAdmin}
                  disabled={assignUserRole.isPending || !principalInput.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 whitespace-nowrap"
                >
                  {assignUserRole.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Grant Admin
                </Button>
              </div>
            </div>

            {/* How to find Principal ID */}
            <div className="border border-border rounded-xl p-5 bg-primary/5">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                How to find a user's Principal ID
              </h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>
                  Ask the user to log in to this app using Internet Identity.
                </li>
                <li>Have them go to their profile/account page.</li>
                <li>
                  Their Principal ID will be displayed there — they can copy and
                  send it to you.
                </li>
                <li>Paste it above and click "Grant Admin".</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Form */}
      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSave}
        product={editProduct}
        isSaving={createProduct.isPending || updateProduct.isPending}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.product.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.product.delete_button"
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
