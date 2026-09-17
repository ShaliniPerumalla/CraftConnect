
// src/pages/Orders.jsx

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Temporary order data for the frontend.
// Later this can be replaced with real backend/database data.
const orders = [
  {
    id: "CC-1001",
    craftName: "Handmade Ceramic Vase",
    creator: "Ananya Ceramics",
    price: 1499,
    quantity: 1,
    date: "12 Aug 2026",
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&auto=format&fit=crop",
  },
  {
    id: "CC-1002",
    craftName: "Handcrafted Wooden Bowl",
    creator: "Arjun Woodworks",
    price: 899,
    quantity: 2,
    date: "10 Aug 2026",
    status: "Shipped",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&auto=format&fit=crop",
  },
  {
    id: "CC-1003",
    craftName: "Handmade Silver Earrings",
    creator: "Meera Jewellery",
    price: 2199,
    quantity: 1,
    date: "08 Aug 2026",
    status: "Processing",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop",
  },
];

// Return the correct icon for each order status.
function StatusIcon({ status }) {
  if (status === "Delivered") {
    return <CheckCircle size={16} />;
  }

  if (status === "Shipped") {
    return <Truck size={16} />;
  }

  return <Clock3 size={16} />;
}

// Return styling based on order status.
function getStatusClass(status) {
  if (status === "Delivered") {
    return "bg-forest/10 text-forest";
  }

  if (status === "Shipped") {
    return "bg-amber/15 text-amber-dark";
  }

  return "bg-ink/5 text-ink-soft";
}

export default function Orders() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      {/* Main navigation */}
      <Navbar />

      <main>
        {/* ============================= */}
        {/* PAGE HEADER */}
        {/* ============================= */}

        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="mt-7">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-dark">
                Your CraftConnect
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3">
                My Orders
              </h1>

              <p className="text-ink-soft text-base sm:text-lg mt-4 max-w-2xl">
                Keep track of the handmade pieces you have ordered from
                independent creators.
              </p>
            </div>
          </div>
        </section>

        {/* ============================= */}
        {/* ORDERS SECTION */}
        {/* ============================= */}

        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {orders.length === 0 ? (
              /* ============================= */
              /* EMPTY ORDERS STATE */
              /* ============================= */

              <div className="bg-white border border-border rounded-3xl p-10 sm:p-14 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber/10 flex items-center justify-center">
                  <ShoppingBag
                    size={28}
                    className="text-amber-dark"
                  />
                </div>

                <h2 className="font-display text-3xl mt-6">
                  No orders yet
                </h2>

                <p className="text-ink-soft mt-3 max-w-md mx-auto">
                  Your handmade purchases will appear here after you
                  place an order.
                </p>

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center mt-7 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                >
                  Explore crafts
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Number of orders */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink-soft">
                    {orders.length} orders
                  </p>

                  <Link
                    to="/explore"
                    className="text-sm font-medium text-amber-dark hover:underline"
                  >
                    Continue shopping
                  </Link>
                </div>

                {/* ============================= */}
                {/* ORDER CARDS */}
                {/* ============================= */}

                {orders.map((order) => {
                  const total = order.price * order.quantity;

                  return (
                    <article
                      key={order.id}
                      className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-sm"
                    >
                      {/* Order top information */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">
                            Order
                          </p>

                          <p className="font-semibold text-sm mt-1">
                            #{order.id}
                          </p>
                        </div>

                        {/* Order status */}
                        <div
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            ${getStatusClass(order.status)}
                          `}
                        >
                          <StatusIcon status={order.status} />
                          {order.status}
                        </div>
                      </div>

                      {/* ============================= */}
                      {/* PRODUCT INFORMATION */}
                      {/* ============================= */}

                      <div className="flex flex-col sm:flex-row gap-5 pt-5">
                        {/* Product image */}
                        <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-cream shrink-0">
                          <img
                            src={order.image}
                            alt={order.craftName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-amber-dark font-medium">
                            Handmade craft
                          </p>

                          <h2 className="font-display text-2xl mt-1">
                            {order.craftName}
                          </h2>

                          <p className="text-sm text-ink-soft mt-1">
                            By {order.creator}
                          </p>

                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-ink-soft">
                            <span>
                              Quantity:{" "}
                              <strong className="text-ink">
                                {order.quantity}
                              </strong>
                            </span>

                            <span>
                              Ordered:{" "}
                              <strong className="text-ink">
                                {order.date}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* ============================= */}
                        {/* PRICE */}
                        {/* ============================= */}

                        <div className="sm:text-right shrink-0">
                          <p className="text-xs text-ink-soft">
                            Total
                          </p>

                          <p className="font-display text-2xl mt-1">
                            ₹{total.toLocaleString("en-IN")}
                          </p>

                          <p className="text-xs text-ink-soft mt-1">
                            ₹{order.price.toLocaleString("en-IN")} ×{" "}
                            {order.quantity}
                          </p>
                        </div>
                      </div>

                      {/* ============================= */}
                      {/* ORDER ACTIONS */}
                      {/* ============================= */}

                      <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-border">
                        {/* 
                          VIEW ORDER
                          This now opens:
                          /orders/CC-1001
                          /orders/CC-1002
                          /orders/CC-1003
                        */}
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                        >
                          <Package size={16} />
                          View order
                        </Link>

                        {/* 
                          TRACK ORDER
                          This opens the same order details page,
                          where the complete tracking timeline is shown.
                        */}
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border text-ink text-sm font-medium hover:border-amber hover:text-amber-dark transition-colors"
                        >
                          <Truck size={16} />
                          Track order
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}