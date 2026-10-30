// src/pages/OrderDetails.jsx
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  Star,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Temporary order data.
// Later this can come from your backend/database.
const orders = [
  {
    id: "CC-1001",
    craftName: "Handmade Ceramic Vase",
    creator: "Ananya Ceramics",
    creatorId: "c5",
    price: 1499,
    quantity: 1,
    date: "12 Aug 2026",
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
  {
    id: "CC-1002",
    craftName: "Handcrafted Wooden Bowl",
    creator: "Arjun Woodworks",
    creatorId: "c6",
    price: 899,
    quantity: 2,
    date: "10 Aug 2026",
    status: "Shipped",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
  {
    id: "CC-1003",
    craftName: "Handmade Silver Earrings",
    creator: "Meera Jewellery",
    creatorId: "c7",
    price: 2199,
    quantity: 1,
    date: "08 Aug 2026",
    status: "Processing",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
];

// Tracking steps used for every order.
const trackingSteps = [
  {
    key: "placed",
    title: "Order placed",
    description: "Your order has been received.",
  },
  {
    key: "processing",
    title: "Processing",
    description: "The creator is preparing your handmade piece.",
  },
  {
    key: "shipped",
    title: "Shipped",
    description: "Your package has left the creator.",
  },
  {
    key: "out",
    title: "Out for delivery",
    description: "Your package is on its way to you.",
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Your handmade piece has been delivered.",
  },
];

// Return how far the order has progressed.
function getProgress(status) {
  if (status === "Delivered") {
    return 4;
  }

  if (status === "Shipped") {
    return 2;
  }

  return 1;
}

// Icon for each tracking step.
function StepIcon({ index, currentStep }) {
  if (index <= currentStep) {
    return <CheckCircle size={18} />;
  }

  if (index === 2) {
    return <Truck size={18} />;
  }

  if (index === 4) {
    return <Package size={18} />;
  }

  return <Clock3 size={18} />;
}

export default function OrderDetails() {
  // Read the order ID from /orders/:id
  const { id } = useParams();

  // Find the selected order.
  const order = orders.find((item) => item.id === id);

  // Handle an invalid order ID.
  if (!order) {
    return (
      <div className="min-h-screen bg-cream font-body text-ink">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-border rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber/10 flex items-center justify-center">
              <ShoppingBag
                size={28}
                className="text-amber-dark"
              />
            </div>

            <h1 className="font-display text-3xl mt-6">
              Order not found
            </h1>

            <p className="text-ink-soft mt-3">
              We couldn't find an order with this order number.
            </p>

            <Link
              to="/orders"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to orders
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const currentStep = getProgress(order.status);
  const total = order.price * order.quantity;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      {/* Main navigation */}
      <Navbar />

      <main>
        {/* Page header */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to orders
            </Link>

            <div className="mt-7">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-dark">
                Order details
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <h1 className="font-display text-4xl sm:text-5xl">
                  #{order.id}
                </h1>

                <span
                  className={`
                    px-3 py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      order.status === "Delivered"
                        ? "bg-forest/10 text-forest"
                        : order.status === "Shipped"
                        ? "bg-amber/15 text-amber-dark"
                        : "bg-ink/5 text-ink-soft"
                    }
                  `}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-ink-soft mt-3">
                Ordered on {order.date}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">

              {/* Product details */}
              <div className="space-y-6">

                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Your handmade piece
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 mt-6">
                    <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-cream shrink-0">
                      <img
                        src={order.image}
                        alt={order.craftName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="font-display text-3xl">
                        {order.craftName}
                      </h2>

                      <p className="text-sm text-ink-soft mt-2">
                        Made by {order.creator}
                      </p>

                      <div className="mt-6 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-ink-soft">
                            Price
                          </span>

                          <span className="font-medium">
                            ₹{order.price.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-ink-soft">
                            Quantity
                          </span>

                          <span className="font-medium">
                            {order.quantity}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 pt-3 border-t border-border">
                          <span className="font-medium">
                            Total
                          </span>

                          <span className="font-display text-xl">
                            ₹{total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review / Complaint actions */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Need help?
                  </p>

                  <h2 className="font-display text-2xl mt-2">
                    {order.status === "Delivered"
                      ? "How was your experience?"
                      : "Something not right?"}
                  </h2>

                  <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                    You can share your experience with the creator
                    or report an issue with this order.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    {/* REVIEW BUTTON */}
                    {order.status === "Delivered" && (
                      <Link
                        to={`/creator/${order.creatorId}`}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-5
                          py-3
                          rounded-full
                          bg-ink
                          text-cream
                          text-sm
                          font-medium
                          hover:bg-amber-dark
                          transition-colors
                        "
                      >
                        <Star size={16} />
                        Rate this creator
                      </Link>
                    )}

                    {/* COMPLAINT BUTTON */}
                    <Link
                      to={`/complaints?order=${order.id}`}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        rounded-full
                        border
                        border-border-dark
                        text-ink
                        text-sm
                        font-medium
                        hover:bg-cream
                        transition-colors
                      "
                    >
                      <AlertTriangle size={16} />
                      Report an issue
                    </Link>

                  </div>
                </div>

                {/* Delivery address */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                      <MapPin
                        size={19}
                        className="text-amber-dark"
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">
                        Delivery address
                      </p>

                      <p className="font-medium mt-1">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Tracking */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 h-fit">
                <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                  Order tracking
                </p>

                <h2 className="font-display text-3xl mt-2">
                  Where is your craft?
                </h2>

                <div className="mt-8">
                  {trackingSteps.map((step, index) => {
                    const completed = index <= currentStep;
                    const isLast =
                      index === trackingSteps.length - 1;

                    return (
                      <div
                        key={step.key}
                        className="flex gap-4"
                      >
                        {/* Timeline icon and line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`
                              w-10
                              h-10
                              rounded-full
                              flex
                              items-center
                              justify-center
                              shrink-0
                              ${
                                completed
                                  ? "bg-forest text-white"
                                  : "bg-cream text-ink-soft"
                              }
                            `}
                          >
                            <StepIcon
                              index={index}
                              currentStep={currentStep}
                            />
                          </div>

                          {!isLast && (
                            <div
                              className={`
                                w-px
                                h-12
                                ${
                                  index < currentStep
                                    ? "bg-forest"
                                    : "bg-border"
                                }
                              `}
                            />
                          )}
                        </div>

                        {/* Step information */}
                        <div className="pb-7">
                          <h3
                            className={`font-medium ${
                              completed
                                ? "text-ink"
                                : "text-ink-soft"
                            }`}
                          >
                            {step.title}
                          </h3>

                          <p className="text-sm text-ink-soft mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current status */}
                <div className="mt-2 p-4 rounded-2xl bg-cream border border-border">
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">
                    Current status
                  </p>

                  <p className="font-medium mt-1">
                    {order.status === "Delivered"
                      ? "Your craft has been delivered."
                      : order.status === "Shipped"
                      ? "Your craft is on its way."
                      : "Your creator is preparing your craft."}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}