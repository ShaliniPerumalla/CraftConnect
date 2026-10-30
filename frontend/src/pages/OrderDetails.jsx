// src/pages/OrderDetails.jsx

import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
  PackageCheck,
  Eye,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import Module 4 Components
import OrderTimeline from "../components/order-lifecycle/OrderTimeline";
import DesignApproval from "../components/order-lifecycle/DesignApproval";
import ProductionTracker from "../components/order-lifecycle/ProductionTracker";
import DeliveryTracking from "../components/order-lifecycle/DeliveryTracking";

const orders = [
  {
    id: "CC-1001",
    craftName: "Handmade Ceramic Vase",
    creator: "Ananya Ceramics",
    price: 1499,
    quantity: 1,
    date: "12 Aug 2026",
    status: "DELIVERY",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
  {
    id: "CC-1002",
    craftName: "Handcrafted Wooden Bowl",
    creator: "Arjun Woodworks",
    price: 899,
    quantity: 2,
    date: "10 Aug 2026",
    status: "PRODUCTION",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
  {
    id: "CC-1003",
    craftName: "Handmade Silver Earrings",
    creator: "Meera Jewellery",
    price: 2199,
    quantity: 1,
    date: "08 Aug 2026",
    status: "DESIGN",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop",
    address: "Vijayawada, Andhra Pradesh, India",
  },
];

export default function OrderDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL view parameter determines what renders ("details" vs "track")
  const activeTab = searchParams.get("view") || "details";

  // Flexible ID lookup: normalizes ORD-1001 to CC-1001 and provides fallback
  const normalizedSearchId = id ? id.toUpperCase().replace("ORD-", "CC-") : "";
  const order =
    orders.find(
      (item) =>
        item.id.toUpperCase() === id?.toUpperCase() ||
        item.id === normalizedSearchId
    ) || orders[0];

  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "DESIGN"
  );
  const [designVersion, setDesignVersion] = useState(1);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream font-body text-ink">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-border rounded-3xl p-10">
            <ShoppingBag size={28} className="mx-auto text-amber-dark mb-4" />
            <h1 className="font-display text-3xl">Order not found</h1>
            <p className="text-ink-soft mt-3">
              We couldn't find an order with this order number.
            </p>
            <Link
              to="/customer-profile"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
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

  const total = order.price * order.quantity;

  const handleApproveDesign = () => {
    setCurrentStatus("PRODUCTION");
  };

  const handleRequestRevision = (note) => {
    alert(`Revision requested: "${note}". The creator will update the design.`);
    setDesignVersion((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main>
        {/* Header section */}
        <section className="border-b border-border bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              to="/customer-profile"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Back to orders
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-dark">
                  Order Management
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="font-display text-3xl sm:text-4xl">
                    #{order.id}
                  </h1>
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber/15 text-amber-dark border border-amber/30">
                    {currentStatus}
                  </span>
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setSearchParams({ view: "details" })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "details"
                        ? "bg-white text-ink shadow-sm font-bold"
                        : "text-gray-500 hover:text-ink"
                    }`}
                  >
                    <Eye size={16} />
                    View Order
                  </button>
                  <button
                    onClick={() => setSearchParams({ view: "track" })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "track"
                        ? "bg-white text-ink shadow-sm font-bold"
                        : "text-gray-500 hover:text-ink"
                    }`}
                  >
                    <PackageCheck size={16} />
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MODE 1: VIEW ORDER DETAILS ONLY ================= */}
        {activeTab === "details" && (
          <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Product Information Card */}
              <div className="md:col-span-2 bg-white border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xs uppercase tracking-[0.18em] text-forest font-semibold mb-6">
                  Purchased Item Summary
                </h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={order.image}
                    alt={order.craftName}
                    className="w-full sm:w-44 h-44 rounded-2xl object-cover bg-cream shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="font-display text-2xl">{order.craftName}</h2>
                    <p className="text-sm text-ink-soft mt-1">
                      Creator: {order.creator}
                    </p>

                    <div className="mt-6 space-y-2 text-sm border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="text-ink-soft">Unit Price</span>
                        <span>₹{order.price.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-soft">Quantity</span>
                        <span>{order.quantity}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                        <span>Total Paid</span>
                        <span className="text-amber-dark">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center mb-4">
                    <MapPin size={19} className="text-amber-dark" />
                  </div>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-ink-soft font-semibold">
                    Delivery Address
                  </h3>
                  <p className="font-medium mt-2 text-sm leading-relaxed">
                    {order.address}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border text-xs text-ink-soft">
                  Order Date: {order.date}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= MODE 2: TRACK ORDER LIFECYCLE ONLY ================= */}
        {activeTab === "track" && (
          <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Visual Lifecycle Progress Timeline */}
            <OrderTimeline currentStatus={currentStatus} />

            {/* Stage-Specific Detailed View */}
            {currentStatus === "DESIGN" && (
              <DesignApproval
                version={designVersion}
                onApprove={handleApproveDesign}
                onRequestRevision={handleRequestRevision}
              />
            )}

            {currentStatus === "PRODUCTION" && <ProductionTracker />}

            {(currentStatus === "DELIVERY" ||
              currentStatus === "COMPLETED") && (
              <DeliveryTracking
                status={
                  currentStatus === "COMPLETED"
                    ? "Delivered"
                    : "Out for Delivery"
                }
              />
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}