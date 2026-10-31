// src/pages/CreatorOrders.jsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Search,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
  Sparkles,
  Upload,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { useOrders } from "../context/OrdersContext";

export default function CreatorOrders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, uploadDesign, refreshOrders } = useOrders();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Design modal state
  const [activeUploadOrder, setActiveUploadOrder] = useState(null);
  const [designUrl, setDesignUrl] = useState("");
  const [designNotes, setDesignNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Dispatch / Tracking modal state
  const [activeDispatchOrder, setActiveDispatchOrder] = useState(null);
  const [courierName, setCourierName] = useState("BlueDart");
  const [trackingNum, setTrackingNum] = useState("");

  // ======================================================
  // CREATOR ASSIGNED ORDERS
  // ======================================================
  const creatorOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders.filter((order) => {
      if (!user) return true;
      if (user.role === "creator") {
        return (
          order.creatorId === user.id ||
          order.creator === user.name ||
          order.creator === user.username ||
          true // in dev demo show all assigned orders
        );
      }
      return true;
    });
  }, [orders, user]);

  // ======================================================
  // FILTER ORDERS
  // ======================================================
  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return creatorOrders.filter((order) => {
      const statusTitle = order.status || "";
      const matchesFilter =
        filter === "All" ||
        statusTitle.toLowerCase() === filter.toLowerCase() ||
        (filter === "Processing" && (statusTitle === "Processing" || statusTitle === "In Production"));

      const matchesSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchValue)) ||
        order.customer?.name?.toLowerCase().includes(searchValue) ||
        order.craftName?.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [creatorOrders, search, filter]);

  // ======================================================
  // STATS
  // ======================================================
  const pendingCount = creatorOrders.filter(
    (o) => o.status === "Pending" || o.status === "Design Stage" || o.status === "Design Review"
  ).length;

  const processingCount = creatorOrders.filter(
    (o) => o.status === "Processing" || o.status === "Ready for Delivery"
  ).length;

  const shippedCount = creatorOrders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = creatorOrders.filter((o) => o.status === "Delivered").length;

  function StatusIcon({ status }) {
    if (status === "Pending") return <Clock3 size={15} />;
    if (status === "Design Stage" || status === "Design Review") return <Sparkles size={15} />;
    if (status === "Processing" || status === "Ready for Delivery") return <Package size={15} />;
    if (status === "Shipped") return <Truck size={15} />;
    if (status === "Delivered") return <CheckCircle2 size={15} />;
    if (status === "Cancelled") return <XCircle size={15} />;
    return <Clock3 size={15} />;
  }

  function getStatusStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-amber/10 text-amber-dark border-amber/20";
      case "Design Stage":
      case "Design Review":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Processing":
      case "Ready for Delivery":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-forest/10 text-forest border-forest/20";
      case "Cancelled":
        return "bg-rose/10 text-rose border-rose/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  const handleDesignSubmit = async (e) => {
    e.preventDefault();
    if (!designUrl) return;
    setIsUploading(true);
    try {
      await uploadDesign(activeUploadOrder.id, {
        design_file_url: designUrl,
        design_notes: designNotes,
      });
      setActiveUploadOrder(null);
      setDesignUrl("");
      setDesignNotes("");
      refreshOrders();
    } catch (err) {
      alert("Design upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatus(activeDispatchOrder.id, "shipped", {
        tracking_number: trackingNum,
        courier_name: courierName,
      });
      setActiveDispatchOrder(null);
      setTrackingNum("");
      refreshOrders();
    } catch (err) {
      alert("Status update failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main>
        {/* HEADER */}
        <section className="border-b border-border bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
              to="/creator-dashboard"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} /> Back to dashboard
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
                  Creator Studio
                </p>
                <h1 className="font-display text-4xl sm:text-5xl mt-2">Assigned Orders</h1>
                <p className="text-sm text-ink-soft mt-2 max-w-xl">
                  Manage design proofs, progress custom commissions into production, and track deliveries.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-border flex items-center justify-center">
                  <ShoppingBag size={20} className="text-amber-dark" />
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Active workload</p>
                  <p className="text-sm font-semibold">{creatorOrders.length} Commissions</p>
                </div>
              </div>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-ink-soft">Pending / Design</p>
                <p className="font-display text-2xl mt-1 text-amber-dark">{pendingCount}</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-ink-soft">In Production</p>
                <p className="font-display text-2xl mt-1 text-blue-700">{processingCount}</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-ink-soft">In Transit</p>
                <p className="font-display text-2xl mt-1 text-purple-700">{shippedCount}</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-ink-soft">Completed</p>
                <p className="font-display text-2xl mt-1 text-forest">{deliveredCount}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTERS */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-border rounded-3xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-3.5 top-3.5 text-ink-soft" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders, customers, pieces..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-border bg-card outline-none focus:border-amber-dark"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                {["All", "Pending", "Processing", "Shipped", "Delivered"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilter(st)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      filter === st
                        ? "bg-ink text-white border-ink"
                        : "bg-white border-border text-ink-soft hover:border-amber-dark"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* ORDERS LIST */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-sm">
                <Package size={38} className="mx-auto text-ink-soft" />
                <h2 className="font-display text-2xl mt-4">No commissions found</h2>
                <p className="text-xs text-ink-soft mt-1">Accepted quotations and orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const raw = (order.rawStatus || order.status || "").toLowerCase();
                  return (
                    <article
                      key={order.id}
                      className="bg-white border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center shrink-0 border border-border">
                            <Package size={22} className="text-amber-dark" />
                          </div>

                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium text-base">#{order.orderNumber || order.id}</h3>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${getStatusStyle(
                                  order.status
                                )}`}
                              >
                                <StatusIcon status={order.status} />
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-ink-soft mt-1">
                              Ordered by <strong>{order.customer?.name}</strong> · {order.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-ink-soft">Earnings</p>
                            <p className="font-display text-2xl text-forest">₹{order.total || order.price}</p>
                          </div>
                          <Link
                            to={`/orders/${order.id}`}
                            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-amber-dark hover:text-amber-dark transition"
                            title="View tracker"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>

                      {/* COMMISSION DETAILS */}
                      <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-xs">
                        <div>
                          <p className="text-ink-soft uppercase tracking-wider font-semibold text-[10px]">Craft Piece</p>
                          <p className="font-medium text-ink mt-0.5">{order.craftName}</p>
                        </div>
                        <div>
                          <p className="text-ink-soft uppercase tracking-wider font-semibold text-[10px]">Delivery Info</p>
                          <p className="font-medium text-ink mt-0.5 truncate">{order.address}</p>
                        </div>
                        <div>
                          <p className="text-ink-soft uppercase tracking-wider font-semibold text-[10px]">Design Status</p>
                          <p className="font-medium text-amber-dark mt-0.5 capitalize">
                            {order.design_status || "Pending Upload"}
                          </p>
                        </div>
                      </div>

                      {/* STAGE ACTION CONTROLS */}
                      <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-ink-soft">
                          {raw === "pending" || raw.includes("design") ? (
                            <span>Needs design upload or revision</span>
                          ) : raw === "production" ? (
                            <span>Commission is actively being handcrafted</span>
                          ) : raw === "ready_for_delivery" ? (
                            <span>Ready to be dispatched</span>
                          ) : raw === "shipped" ? (
                            <span>In transit to customer</span>
                          ) : (
                            <span>Delivered & Completed</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Upload Design Proof */}
                          {(raw === "pending" || raw.includes("design")) && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveUploadOrder(order);
                                setDesignUrl(order.design_file_url || "");
                                setDesignNotes(order.design_notes || "");
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-dark text-white text-xs font-medium hover:bg-amber-800 transition shadow-sm"
                            >
                              <Upload size={14} />
                              {order.design_file_url ? "Update Design Mockup" : "Upload Design Mockup"}
                            </button>
                          )}

                          {/* Move to Production (if skipping design or approved) */}
                          {raw === "pending" && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "production")}
                              className="px-4 py-2 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90 transition"
                            >
                              Direct to Production
                            </button>
                          )}

                          {/* Ready for Delivery */}
                          {raw === "production" && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "ready_for_delivery")}
                              className="px-4 py-2 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90 transition"
                            >
                              Mark Ready for Delivery
                            </button>
                          )}

                          {/* Dispatch & Ship */}
                          {raw === "ready_for_delivery" && (
                            <button
                              type="button"
                              onClick={() => setActiveDispatchOrder(order)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition"
                            >
                              <Truck size={14} />
                              Dispatch / Add Tracking
                            </button>
                          )}

                          {/* Mark Delivered */}
                          {raw === "shipped" && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="px-4 py-2 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90 transition"
                            >
                              Confirm Delivery
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* DESIGN UPLOAD MODAL */}
      {activeUploadOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-border max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display text-2xl text-ink">Upload Design Mockup</h3>
            <p className="text-xs text-ink-soft mt-1">
              Order #{activeUploadOrder.orderNumber || activeUploadOrder.id} ({activeUploadOrder.craftName})
            </p>

            <form onSubmit={handleDesignSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1">Design Preview Image URL</label>
                <input
                  type="url"
                  required
                  value={designUrl}
                  onChange={(e) => setDesignUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or cloud image"
                  className="w-full text-xs p-2.5 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1">Notes for Customer</label>
                <textarea
                  rows={3}
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  placeholder="Explain your concept, dimensions, wood/fabric choice, etc."
                  className="w-full text-xs p-3 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadOrder(null)}
                  className="px-4 py-2 rounded-full border border-border text-xs text-ink-soft hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90"
                >
                  {isUploading ? "Uploading..." : "Submit to Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH / TRACKING MODAL */}
      {activeDispatchOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-border max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-display text-xl text-ink">Dispatch Order</h3>
            <p className="text-xs text-ink-soft mt-1">
              Provide tracking details for the customer.
            </p>

            <form onSubmit={handleDispatchSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1">Courier Service</label>
                <input
                  type="text"
                  required
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. BlueDart, DTDC, IndiaPost"
                  className="w-full text-xs p-2.5 rounded-2xl border border-border bg-card focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  required
                  value={trackingNum}
                  onChange={(e) => setTrackingNum(e.target.value)}
                  placeholder="e.g. TRK987654321"
                  className="w-full text-xs p-2.5 rounded-2xl border border-border bg-card focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDispatchOrder(null)}
                  className="px-4 py-2 rounded-full border border-border text-xs text-ink-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-medium hover:bg-purple-700"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
