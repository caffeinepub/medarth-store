import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: bigint;
    unitPrice: number;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    totalAmount: number;
    shippingAddress: string;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    isFeatured: boolean;
    category: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getOrdersByEmail(email: string): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, customerEmail: string, shippingAddress: string, items: Array<OrderItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, newStatus: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
