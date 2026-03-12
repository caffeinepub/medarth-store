# Medarth Online Store

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Online store for Medarth, a dermatology/skincare brand
- Product catalog page with derma product listings (name, description, price, image, category)
- Product detail page
- Shopping cart (add/remove items, quantity control)
- Checkout flow (name, email, address, order summary)
- Admin panel (login-protected) to manage products: add, edit, delete
- Order management for admin
- Categories for derma products (e.g. Moisturizers, Serums, Sunscreens, Cleansers, Treatments)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Products CRUD (id, name, description, price, imageUrl, category, stock, featured)
2. Backend: Orders (id, customerInfo, items, total, status, timestamp)
3. Backend: Cart state managed on frontend
4. Backend: Admin authorization for product/order management
5. Frontend: Landing/hero section with Medarth branding
6. Frontend: Product catalog with category filter
7. Frontend: Product detail modal/page
8. Frontend: Shopping cart drawer
9. Frontend: Checkout form and order confirmation
10. Frontend: Admin dashboard (product management, order list)
