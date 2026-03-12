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
import { Loader2, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import ProductForm from "../components/ProductForm";
import {
  useAllOrders,
  useAllProducts,
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

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products = [] } = useAllProducts();
  const { data: orders = [] } = useAllOrders();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
      >
        <ShieldCheck className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mt-2">
            Please log in with an admin account to access this panel.
          </p>
        </div>
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage products and orders</p>
      </motion.div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger data-ocid="admin.products_tab" value="products">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.orders_tab" value="orders">
            Orders ({orders.length})
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
          <h2 className="font-semibold text-lg mb-4">All Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No orders yet.
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow
                      data-ocid={`admin.order.item.${i + 1}`}
                      key={order.id.toString()}
                    >
                      <TableCell className="font-mono text-xs">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {order.customerEmail}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
