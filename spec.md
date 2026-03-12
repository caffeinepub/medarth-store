# Medarth Store

## Current State
- Admin orders tab shows a basic table: Order ID, Customer Name, Email, Total, Status dropdown
- Backend Order type has: id, customerName, customerEmail, shippingAddress, items, totalAmount, status
- Checkout form only collects: name, email, shipping address
- No phone number or billing address is stored on orders
- PaymentStatus field does not exist on Order

## Requested Changes (Diff)

### Add
- `phone` field to Order type in backend
- `billingAddress` field to Order type in backend
- `paymentStatus` field to Order type in backend (default: "Pending")
- Phone and billing address inputs in CheckoutModal
- "Same as shipping" checkbox for billing address in CheckoutModal
- Comprehensive order cards in admin Orders tab showing all fields

### Modify
- `placeOrder` backend function to accept phone and billingAddress parameters
- CheckoutModal form state to include phone and billingAddress
- Admin Orders tab: replace basic table rows with rich expandable card layout showing all customer and delivery details
- `useQueries` hook for placeOrder to pass new fields

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate backend with updated Order type (add phone, billingAddress, paymentStatus fields) and updated placeOrder signature
2. Update CheckoutModal to collect phone and billingAddress (with same-as-shipping checkbox)
3. Redesign admin Orders tab with card-per-order layout or expanded table showing:
   - Order ID, date/time, total, order status (editable), payment status
   - Customer: name, email, phone
   - Shipping address, billing address
   - Items ordered (product name, qty, price)
