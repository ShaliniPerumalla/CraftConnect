import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Users,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  MapPin,
  IndianRupee,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCrafts } from "../context/CraftsContext";
import { useRequirementQuotation } from "../context/RequirementQuotationContext";
import useAuth from "../hooks/useAuth";
import { fetchCurrentCreatorProfile } from "../services/marketplaceService";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const { crafts, creators } = useCrafts();
  const { requirements = [], quotations = [] } = useRequirementQuotation();

  const [currentCreator, setCurrentCreator] = useState(() => {
    if (user) {
      const match = creators?.find(
        (c) =>
          c.user_id === user.id ||
          c.username === user.username ||
          c.name === user.name
      );
      if (match) return match;
    }
    return creators?.[0] || { name: user?.name || "Creator", id: "c1" };
  });

  useEffect(() => {
    fetchCurrentCreatorProfile()
      .then((profile) => {
        if (profile && profile.name) {
          setCurrentCreator(profile);
        }
      })
      .catch(() => {});
  }, [user]);

  // Only show this creator's crafts
  const myCrafts = crafts.filter(
    (craft) =>
      String(craft.creatorId) === String(currentCreator?.id) ||
      craft.creator === currentCreator?.name
  );

  // Customer requests that are open or accepting quotations
  const openRequests = requirements.filter(
    (req) =>
      req.status === "open" ||
      req.status === "quoted" ||
      req.status === "Waiting for Quotations" ||
      req.status === "Quotations Received"
  );

  // Quotations submitted by this creator
  const myBids = quotations.filter((q) => {
    const creatorIdMatch =
      String(q.creator?.id || "") === String(currentCreator?.id || "") ||
      String(q.creator?.id || "") === String(user?.id || "");
    const creatorNameMatch =
      q.creator?.name === currentCreator?.name ||
      q.creator?.name === user?.name ||
      q.creator?.username === user?.username;
    return creatorIdMatch || creatorNameMatch;
  });

  const acceptedBids = myBids.filter(
    (q) => String(q.status || "").toLowerCase() === "accepted"
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
                  Here is an overview of your active workshop: manage your handmade crafts, browse new customer requests, and track your submitted bids.
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/creator/requests"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-border bg-white text-ink text-sm font-medium hover:border-amber hover:text-amber-dark transition-colors shadow-xs"
                >
                  <Sparkles size={16} className="text-amber-dark" />
                  View Customer Requests
                </Link>

                <Link
                  to="/creator/add-craft"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors shadow-xs"
                >
                  <Plus size={17} />
                  Add New Craft
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            DASHBOARD STATS
        ================================================== */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Crafts */}
              <div className="bg-white border border-border rounded-3xl p-6 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-amber/10 flex items-center justify-center">
                  <Package size={21} className="text-amber-dark" />
                </div>
                <p className="text-sm text-ink-soft mt-5">Total Crafts</p>
                <p className="font-display text-3xl mt-1">{myCrafts.length}</p>
                <Link
                  to="/creator/my-crafts"
                  className="inline-flex items-center gap-1 text-xs text-amber-dark hover:underline font-medium mt-3"
                >
                  Manage inventory <ArrowRight size={12} />
                </Link>
              </div>

              {/* New Customer Requests */}
              <div className="bg-white border border-border rounded-3xl p-6 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-forest/10 flex items-center justify-center">
                  <Sparkles size={21} className="text-forest" />
                </div>
                <p className="text-sm text-ink-soft mt-5">Customer Requests</p>
                <p className="font-display text-3xl mt-1">{openRequests.length}</p>
                <Link
                  to="/creator/requests"
                  className="inline-flex items-center gap-1 text-xs text-forest hover:underline font-medium mt-3"
                >
                  Browse open requests <ArrowRight size={12} />
                </Link>
              </div>

              {/* Submitted Bids */}
              <div className="bg-white border border-border rounded-3xl p-6 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-ink/5 flex items-center justify-center">
                  <FileText size={21} className="text-ink" />
                </div>
                <p className="text-sm text-ink-soft mt-5">Submitted Bids</p>
                <p className="font-display text-3xl mt-1">{myBids.length}</p>
                <Link
                  to="/creator/my-bids"
                  className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink hover:underline font-medium mt-3"
                >
                  Track all bids <ArrowRight size={12} />
                </Link>
              </div>

              {/* Accepted Bids */}
              <div className="bg-white border border-border rounded-3xl p-6 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-rose/10 flex items-center justify-center">
                  <CheckCircle2 size={21} className="text-rose" />
                </div>
                <p className="text-sm text-ink-soft mt-5">Accepted Bids</p>
                <p className="font-display text-3xl mt-1">{acceptedBids.length}</p>
                <span className="text-xs text-ink-muted mt-3 block">
                  {myBids.length > 0
                    ? `${Math.round((acceptedBids.length / myBids.length) * 100)}% acceptance rate`
                    : "No active bids"}
                </span>
              </div>
            </div>

            {/* ==================================================
                WORKSPACES NAVIGATION CARDS
            ================================================== */}
            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              {/* Customer Requests Workspace */}
              <div className="bg-white border border-border rounded-[28px] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center mb-4">
                    <Sparkles size={24} className="text-amber-dark" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold">
                    Opportunities
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl mt-1">
                    Customer Requests
                  </h2>
                  <p className="text-sm text-ink-soft mt-2">
                    Discover open customer specifications for custom handmade items. Review budgets, required dates, and submit formal proposals.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-soft">
                    {openRequests.length} request{openRequests.length !== 1 ? "s" : ""} available
                  </span>
                  <Link
                    to="/creator/requests"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-medium hover:bg-amber-dark transition-colors"
                  >
                    Open Requests
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* My Crafts Workspace */}
              <div className="bg-white border border-border rounded-[28px] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center mb-4">
                    <Package size={24} className="text-forest" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Storefront
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl mt-1">
                    My Crafts
                  </h2>
                  <p className="text-sm text-ink-soft mt-2">
                    Manage your marketplace catalog, add new handmade crafts, update stock levels, edit descriptions, and control availability.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-soft">
                    {myCrafts.length} craft{myCrafts.length !== 1 ? "s" : ""} in portfolio
                  </span>
                  <Link
                    to="/creator/my-crafts"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-medium hover:bg-amber-dark transition-colors"
                  >
                    Manage Crafts
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ==================================================
                TWO-COLUMN RECENT ACTIVITIES: REQUESTS & BIDS
            ================================================== */}
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              {/* RECENT CUSTOMER REQUESTS */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold">
                      New Requirements
                    </p>
                    <h2 className="font-display text-2xl font-bold mt-1">
                      Recent Customer Requests
                    </h2>
                  </div>
                  {openRequests.length > 0 && (
                    <Link
                      to="/creator/requests"
                      className="text-xs font-semibold text-amber-dark hover:underline flex items-center gap-1"
                    >
                      View all ({openRequests.length}) <ArrowRight size={13} />
                    </Link>
                  )}
                </div>

                <div className="mt-5 space-y-3.5">
                  {openRequests.length === 0 ? (
                    <div className="text-center py-10">
                      <Clock size={32} className="mx-auto text-ink-muted mb-2" />
                      <p className="text-sm text-ink-soft">No active customer requests right now.</p>
                      <p className="text-xs text-ink-muted mt-1">Check back soon for new buyer postings.</p>
                    </div>
                  ) : (
                    openRequests.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl border border-border/80 bg-cream/30 hover:border-amber/60 hover:bg-cream/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber/15 text-amber-dark">
                              {req.category}
                            </span>
                            <span className="text-[11px] text-ink-muted">
                              {new Date(req.createdAt || Date.now()).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold text-ink mt-1 truncate">
                            {req.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft mt-1.5">
                            <span className="font-semibold text-forest flex items-center">
                              Budget: ₹{Number(req.budget || 0).toLocaleString("en-IN")}
                            </span>
                            {req.deliveryLocation && (
                              <span className="flex items-center gap-1 text-ink-muted truncate">
                                <MapPin size={12} /> {req.deliveryLocation}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          to="/creator/requests"
                          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors"
                        >
                          <Send size={12} />
                          Bid Now
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RECENT BIDDING ACTIVITIES */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                      Quotations
                    </p>
                    <h2 className="font-display text-2xl font-bold mt-1">
                      Recent Bidding Activities
                    </h2>
                  </div>
                  {myBids.length > 0 && (
                    <Link
                      to="/creator/my-bids"
                      className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
                    >
                      View all ({myBids.length}) <ArrowRight size={13} />
                    </Link>
                  )}
                </div>

                <div className="mt-5 space-y-3.5">
                  {myBids.length === 0 ? (
                    <div className="text-center py-10">
                      <FileText size={32} className="mx-auto text-ink-muted mb-2" />
                      <p className="text-sm text-ink-soft">No bids submitted yet.</p>
                      <Link
                        to="/creator/requests"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-amber-dark hover:underline"
                      >
                        Browse customer requests to submit your first bid <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : (
                    myBids.slice(0, 3).map((bid) => {
                      const status = String(bid.status || "Pending").toLowerCase();
                      const statusBadgeClass =
                        status === "accepted"
                          ? "bg-forest/15 text-forest font-bold"
                          : status === "rejected" || status === "declined"
                          ? "bg-rose/15 text-rose font-bold"
                          : "bg-amber/15 text-amber-dark font-bold";

                      return (
                        <div
                          key={bid.id}
                          className="p-4 rounded-2xl border border-border/80 bg-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md ${statusBadgeClass}`}>
                                {bid.status || "Pending"}
                              </span>
                              <span className="text-[11px] text-ink-muted">
                                {new Date(bid.createdAt || Date.now()).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                            <h4 className="font-display text-base font-bold text-ink mt-1 truncate">
                              {bid.requirement_title || `Requirement ${bid.requirementId}`}
                            </h4>
                            <p className="text-xs text-ink-soft mt-1">
                              Quoted Price: <span className="font-bold text-ink">₹{Number(bid.price || 0).toLocaleString("en-IN")}</span>
                              {bid.productionTime && ` • ${bid.productionTime}`}
                            </p>
                          </div>

                          <Link
                            to="/creator/my-bids"
                            className="shrink-0 text-xs font-semibold text-ink-soft hover:text-ink hover:underline self-end sm:self-center"
                          >
                            Details →
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================
                RECENT CRAFTS PORTFOLIO
            ================================================== */}
            <div className="mt-12">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Your Products
                  </p>
                  <h2 className="font-display text-3xl mt-1">Recent Crafts</h2>
                </div>

                {myCrafts.length > 0 && (
                  <Link
                    to="/creator/my-crafts"
                    className="text-sm font-medium text-amber-dark hover:underline"
                  >
                    View all ({myCrafts.length})
                  </Link>
                )}
              </div>

              {myCrafts.length === 0 ? (
                <div className="bg-white border border-border rounded-3xl p-10 text-center">
                  <Package size={35} className="mx-auto text-ink-soft" />
                  <h3 className="font-display text-2xl mt-4">No crafts yet</h3>
                  <p className="text-sm text-ink-soft mt-2">
                    Add your first handmade product to get started.
                  </p>
                  <Link
                    to="/creator/add-craft"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
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
                      className="bg-white border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
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
                            ₹{Number(craft.price).toLocaleString("en-IN")}
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