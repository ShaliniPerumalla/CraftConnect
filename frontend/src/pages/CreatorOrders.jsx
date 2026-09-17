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
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { creators } from "../utils/mockData";
import { useOrders } from "../context/OrdersContext";

export default function CreatorOrders() {
  const { orders, updateOrderStatus } = useOrders();

  // Temporary logged-in creator
  const currentCreator = creators.find(
    (creator) => creator.id === "c1"
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // ======================================================
  // CREATOR ORDERS
  // ======================================================

  const creatorOrders = useMemo(() => {
    return orders.filter((order) =>
      order.items?.some(
        (item) =>
          item.creatorId === currentCreator?.id
      )
    );
  }, [orders, currentCreator?.id]);

  // ======================================================
  // FILTER ORDERS
  // ======================================================

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return creatorOrders.filter((order) => {
      const matchesFilter =
        filter === "All" ||
        order.status === filter;

      const matchesSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        order.items?.some((item) =>
          item.name
            ?.toLowerCase()
            .includes(searchValue)
        );

      return matchesFilter && matchesSearch;
    });
  }, [creatorOrders, search, filter]);

  // ======================================================
  // STATS
  // ======================================================

  const pendingCount = creatorOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = creatorOrders.filter(
    (order) => order.status === "Processing"
  ).length;

  const shippedCount = creatorOrders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredCount = creatorOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // ======================================================
  // STATUS ICON
  // ======================================================

  function StatusIcon({ status }) {
    if (status === "Pending") {
      return <Clock3 size={15} />;
    }

    if (status === "Processing") {
      return <Package size={15} />;
    }

    if (status === "Shipped") {
      return <Truck size={15} />;
    }

    if (status === "Delivered") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Cancelled") {
      return <XCircle size={15} />;
    }

    return <Clock3 size={15} />;
  }

  // ======================================================
  // STATUS STYLE
  // ======================================================

  function getStatusStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-amber/10 text-amber-dark border-amber/20";

      case "Processing":
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

  // ======================================================
  // UPDATE STATUS
  // ======================================================

  function handleStatusChange(orderId, status) {
    updateOrderStatus(orderId, status);
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="border-b border-border bg-cream">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <Link
              to="/creator-dashboard"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-7">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
                  Creator Studio
                </p>

                <h1 className="font-display text-4xl sm:text-5xl mt-2">
                  Orders
                </h1>

                <p className="text-sm text-ink-soft mt-2 max-w-xl">
                  Manage customer orders and keep your
                  handmade products moving smoothly.
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-white border border-border flex items-center justify-center">
                  <ShoppingBag
                    size={20}
                    className="text-amber-dark"
                  />
                </div>

                <div>
                  <p className="text-xs text-ink-soft">
                    Total orders
                  </p>

                  <p className="font-display text-2xl">
                    {creatorOrders.length}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="py-10">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <div className="bg-white border border-border rounded-3xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-ink-soft">
                      Pending
                    </p>

                    <p className="font-display text-3xl mt-1">
                      {pendingCount}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-amber/10 flex items-center justify-center">
                    <Clock3
                      size={19}
                      className="text-amber-dark"
                    />
                  </div>

                </div>
              </div>

              <div className="bg-white border border-border rounded-3xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-ink-soft">
                      Processing
                    </p>

                    <p className="font-display text-3xl mt-1">
                      {processingCount}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Package
                      size={19}
                      className="text-blue-700"
                    />
                  </div>

                </div>
              </div>

              <div className="bg-white border border-border rounded-3xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-ink-soft">
                      Shipped
                    </p>

                    <p className="font-display text-3xl mt-1">
                      {shippedCount}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Truck
                      size={19}
                      className="text-purple-700"
                    />
                  </div>

                </div>
              </div>

              <div className="bg-white border border-border rounded-3xl p-5">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-ink-soft">
                      Delivered
                    </p>

                    <p className="font-display text-3xl mt-1">
                      {deliveredCount}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-forest/10 flex items-center justify-center">
                    <CheckCircle2
                      size={19}
                      className="text-forest"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <div className="bg-white border border-border rounded-3xl p-4 mb-6">

              <div className="flex flex-col lg:flex-row gap-3">

                <div className="relative flex-1">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search orders, customers or crafts..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-cream border border-border text-sm outline-none focus:border-amber transition-colors"
                  />

                </div>

                <div className="flex gap-2 overflow-x-auto">

                  {[
                    "All",
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ].map((status) => (

                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilter(status)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-medium border transition-colors ${
                        filter === status
                          ? "bg-ink text-cream border-ink"
                          : "bg-white border-border text-ink-soft hover:border-amber hover:text-amber-dark"
                      }`}
                    >
                      {status}
                    </button>

                  ))}

                </div>

              </div>

            </div>

            {/* ==================================================
                ORDERS
            ================================================== */}

            {filteredOrders.length === 0 ? (

              <div className="bg-white border border-border rounded-3xl p-12 text-center">

                <Package
                  size={38}
                  className="mx-auto text-ink-soft"
                />

                <h2 className="font-display text-2xl mt-4">
                  No orders found
                </h2>

                <p className="text-sm text-ink-soft mt-2">
                  Try changing your search or filter.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {filteredOrders.map((order) => (

                  <article
                    key={order.id}
                    className="bg-white border border-border rounded-3xl p-5 sm:p-6 hover:shadow-md transition-shadow"
                  >

                    {/* TOP */}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center shrink-0">
                          <Package
                            size={20}
                            className="text-amber-dark"
                          />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="font-medium">
                              {order.id}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              <StatusIcon
                                status={order.status}
                              />

                              {order.status}
                            </span>

                          </div>

                          <p className="text-xs text-ink-soft mt-1">
                            {order.date}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="text-right">

                          <p className="text-xs text-ink-soft">
                            Order total
                          </p>

                          <p className="font-display text-2xl">
                            ₹
                            {Number(
                              order.total || 0
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-amber hover:text-amber-dark transition-colors"
                          aria-label={`View ${order.id}`}
                        >
                          <ChevronRight size={17} />
                        </Link>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="grid md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">

                      <div>

                        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                          Customer
                        </p>

                        <p className="text-sm font-medium mt-1">
                          {order.customer?.name ||
                            "Customer"}
                        </p>

                        <p className="text-xs text-ink-soft mt-0.5">
                          {order.customer?.email}
                        </p>

                      </div>

                      <div>

                        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                          Craft
                        </p>

                        <p className="text-sm font-medium mt-1 line-clamp-1">
                          {order.items?.[0]?.name ||
                            "Craft"}
                        </p>

                        <p className="text-xs text-ink-soft mt-0.5">
                          {order.items?.length || 0} item
                          {order.items?.length === 1
                            ? ""
                            : "s"}
                        </p>

                      </div>

                      <div>

                        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                          Payment
                        </p>

                        <p className="text-sm font-medium mt-1">
                          {order.paymentStatus ||
                            "Paid"}
                        </p>

                      </div>

                    </div>

                    {/* STATUS CONTROL */}

                    <div className="mt-5 pt-5 border-t border-border">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>

                          <p className="text-xs font-medium">
                            Update order status
                          </p>

                          <p className="text-[11px] text-ink-soft mt-1">
                            Keep the customer informed about
                            their order.
                          </p>

                        </div>

                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                          className="h-11 px-4 rounded-xl bg-cream border border-border text-sm outline-none focus:border-amber cursor-pointer"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}
