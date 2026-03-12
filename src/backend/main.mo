import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : Text;
    category : Text;
    stock : Nat;
    isFeatured : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };
  };

  type OrderItem = {
    productId : Text;
    productName : Text;
    quantity : Nat;
    unitPrice : Float;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Text;
    items : [OrderItem];
    totalAmount : Float;
    status : Text;
  };

  public type UserEntry = {
    principal : Principal;
    role : Text;
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  public shared ({ caller }) func assignUserRole(user : Principal, role : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    let userRole : AccessControl.UserRole = switch (role) {
      case ("admin") { #admin };
      case ("user") { #user };
      case (_) { Runtime.trap("Invalid role. Use 'admin' or 'user'") };
    };
    AccessControl.assignRole(accessControlState, caller, user, userRole);
  };

  public query ({ caller }) func getAllUsers() : async [UserEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list users");
    };
    accessControlState.userRoles.entries().map(
      func((p, r) : (Principal, AccessControl.UserRole)) : UserEntry {
        let roleText = switch (r) {
          case (#admin) { "admin" };
          case (#user) { "user" };
          case (#guest) { "guest" };
        };
        { principal = p; role = roleText };
      }
    ).toArray();
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    products.remove(productId);
  };

  public query (_) func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query (_) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query (_) func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().filter(
      func(product) {
        product.category == category;
      }
    );
    filtered.toArray().sort();
  };

  public query (_) func getFeaturedProducts() : async [Product] {
    let filtered = products.values().filter(
      func(product) {
        product.isFeatured;
      }
    );
    filtered.toArray().sort();
  };

  public shared ({ caller }) func placeOrder(
    customerName : Text,
    customerEmail : Text,
    shippingAddress : Text,
    items : [OrderItem]
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    var totalAmount = 0.0;
    for (item in items.values()) {
      totalAmount += item.unitPrice * item.quantity.toFloat();
    };

    let order = {
      id = nextOrderId;
      customerName;
      customerEmail;
      shippingAddress;
      items;
      totalAmount;
      status = "pending";
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };

    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case null {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          customerName = order.customerName;
          customerEmail = order.customerEmail;
          shippingAddress = order.shippingAddress;
          items = order.items;
          totalAmount = order.totalAmount;
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrdersByEmail(email : Text) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query orders");
    };

    let filtered = orders.values().filter(
      func(order) {
        order.customerEmail == email;
      }
    );
    filtered.toArray();
  };
};
