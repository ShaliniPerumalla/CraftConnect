// src/pages/CreatorDashboard.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { creators } from "../utils/mockData";
import { useCrafts } from "../context/CraftsContext";

export default function CreatorDashboard() {
  const { crafts } = useCrafts();

  // Temporary logged-in creator
  const currentCreator = creators.find(
    (creator) => creator.id === "c1"
  );

  // Only show this creator's crafts
  const myCrafts = crafts.filter(
    (craft) =>
      craft.creatorId === currentCreator?.id
  );

  const totalStock = myCrafts.reduce(
    (total, craft) =>
      total + Number(craft.stock || 0),
    0
  );

  const totalValue = myCrafts.reduce(
    (total, craft) =>
      total +
      Number(craft.price || 0) *
        Number(craft.stock || 0),
    0
  );

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="border-b border-border bg-cream">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
              Creator Studio
            </p>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-3">

              <div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl">
                  Welcome back, {currentCreator?.name || "Creator"}
                </h1>

                <p className="text-sm text-ink-soft mt-3 max-w-xl">
                  Manage your handmade products, inventory and
                  creator storefront from one place.
                </p>

              </div>

              <Link
                to="/creator/add-craft"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
              >
                <Plus size={17} />
                Add New Craft
              </Link>

            </div>

          </div>

        </section>

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <section className="py-10">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Crafts */}

              <div className="bg-white border border-border rounded-3xl p-6">

                <div className="w-11 h-11 rounded-2xl bg-amber/10 flex items-center justify-center">
                  <Package
                    size={21}
                    className="text-amber-dark"
                  />
                </div>

                <p className="text-sm text-ink-soft mt-5">
                  My Crafts
                </p>

                <p className="font-display text-3xl mt-1">
                  {myCrafts.length}
                </p>

              </div>

              {/* Stock */}

              <div className="bg-white border border-border rounded-3xl p-6">

                <div className="w-11 h-11 rounded-2xl bg-forest/10 flex items-center justify-center">
                  <ShoppingBag
                    size={21}
                    className="text-forest"
                  />
                </div>

                <p className="text-sm text-ink-soft mt-5">
                  Total Stock
                </p>

                <p className="font-display text-3xl mt-1">
                  {totalStock}
                </p>

              </div>

              {/* Value */}

              <div className="bg-white border border-border rounded-3xl p-6">

                <div className="w-11 h-11 rounded-2xl bg-rose/10 flex items-center justify-center">
                  <TrendingUp
                    size={21}
                    className="text-rose"
                  />
                </div>

                <p className="text-sm text-ink-soft mt-5">
                  Inventory Value
                </p>

                <p className="font-display text-3xl mt-1">
                  ₹{totalValue.toLocaleString("en-IN")}
                </p>

              </div>

              {/* Creator */}

              <div className="bg-white border border-border rounded-3xl p-6">

                <div className="w-11 h-11 rounded-2xl bg-ink/5 flex items-center justify-center">
                  <Users
                    size={21}
                    className="text-ink"
                  />
                </div>

                <p className="text-sm text-ink-soft mt-5">
                  Creator Rating
                </p>

                <p className="font-display text-3xl mt-1">
                  {currentCreator?.rating || "5.0"}
                </p>

              </div>

            </div>

            {/* ==================================================
                MANAGE CRAFTS CARD
            ================================================== */}

            <div className="mt-8">

              <div className="bg-white border border-border rounded-[28px] p-6 sm:p-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-amber/10 flex items-center justify-center">
                      <Package
                        size={25}
                        className="text-amber-dark"
                      />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold">
                        Creator Products
                      </p>

                      <h2 className="font-display text-3xl mt-2">
                        Manage My Crafts
                      </h2>

                      <p className="text-sm text-ink-soft mt-2 max-w-xl">
                        View your handmade products, update prices
                        and stock, edit product information, or
                        remove products from your storefront.
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">

                    <Link
                      to="/creator/crafts"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                    >
                      View My Crafts
                      <ArrowRight size={16} />
                    </Link>

                    <Link
                      to="/creator/add-craft"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-medium hover:border-amber hover:text-amber-dark transition-colors"
                    >
                      <Plus size={16} />
                      Add Craft
                    </Link>

                  </div>

                </div>

              </div>

            </div>

              {/* ==================================================
              MANAGE ORDERS
              ================================================== */}

            <div className="mt-6">

              <div className="bg-white border border-border rounded-[28px] p-6 sm:p-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-forest/10 flex items-center justify-center">
                      <ShoppingBag
                        size={25}
                        className="text-forest"
                        />
                    </div>

                    <div>

                    <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Order Management
                    </p>

                    <h2 className="font-display text-3xl mt-2">
                    Manage Orders
                    </h2>

                    <p className="text-sm text-ink-soft mt-2 max-w-xl">
                    View customer orders, check order details and
                    update delivery status from one place.
                    </p>

                </div>

              </div>

              <Link
              to="/creator/orders"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
              >
              View Orders
              <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </div>

            {/* ==================================================
                RECENT CRAFTS
            ================================================== */}

            <div className="mt-10">

              <div className="flex items-end justify-between gap-4 mb-6">

                <div>

                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Your Products
                  </p>

                  <h2 className="font-display text-3xl mt-2">
                    Recent Crafts
                  </h2>

                </div>

                {myCrafts.length > 0 && (
                  <Link
                    to="/creator/crafts"
                    className="text-sm font-medium text-amber-dark hover:underline"
                  >
                    View all
                  </Link>
                )}

              </div>

              {myCrafts.length === 0 ? (

                <div className="bg-white border border-border rounded-3xl p-10 text-center">

                  <Package
                    size={35}
                    className="mx-auto text-ink-soft"
                  />

                  <h3 className="font-display text-2xl mt-4">
                    No crafts yet
                  </h3>

                  <p className="text-sm text-ink-soft mt-2">
                    Add your first handmade product to get started.
                  </p>

                  <Link
                    to="/creator/add-craft"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Your First Craft
                  </Link>

                </div>

              ) : (

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                  {myCrafts.slice(0, 3).map((craft) => (

                    <div
                      key={craft.id}
                      className="bg-white border border-border rounded-3xl overflow-hidden"
                    >

                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">

                        <img
                          src={craft.image}
                          alt={craft.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />

                      </div>

                      <div className="p-5">

                        <p className="text-xs uppercase tracking-[0.15em] text-forest font-semibold">
                          {craft.category}
                        </p>

                        <h3 className="font-display text-xl mt-2 line-clamp-1">
                          {craft.name}
                        </h3>

                        <div className="flex items-center justify-between mt-4">

                          <span className="font-display text-lg">
                            ₹
                            {Number(craft.price).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          <span className="text-xs text-forest font-medium">
                            {Number(craft.stock || 0)} in stock
                          </span>

                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-5">

                          <Link
                            to={`/craft/${craft.id}`}
                            className="text-center py-2.5 rounded-xl border border-border text-xs font-medium hover:border-amber hover:text-amber-dark transition-colors"
                          >
                            View
                          </Link>

                          <Link
                            to={`/creator/edit-craft/${craft.id}`}
                            className="text-center py-2.5 rounded-xl bg-ink text-cream text-xs font-medium hover:bg-amber-dark transition-colors"
                          >
                            Edit
                          </Link>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}