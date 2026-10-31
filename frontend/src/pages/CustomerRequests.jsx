import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Sparkles,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { useCrafts } from "../context/CraftsContext";
import { useRequirementQuotation } from "../context/RequirementQuotationContext";
import {
  QuotationForm,
  RequirementDetailModal,
} from "../components/requirements";

export default function CustomerRequests() {
  const { user } = useAuth();
  const { creators, categories } = useCrafts();
  const {
    requirements = [],
    quotations = [],
    submitQuotation,
    getQuotationsByRequirementId,
  } = useRequirementQuotation();

  const currentCreator = useMemo(() => {
    if (user) {
      const match = creators?.find(
        (c) =>
          c.user_id === user.id ||
          c.username === user.username ||
          c.name === user.name
      );
      if (match) return match;
    }
    return (
      creators?.[0] || {
        id: "c1",
        name: user?.name || "Independent Creator",
        studioName: "Artisan Studio",
      }
    );
  }, [user, creators]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("open"); // "all" | "open" | "my-bids"

  // Modals state
  const [biddingRequirement, setBiddingRequirement] = useState(null);
  const [inspectedRequirement, setInspectedRequirement] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Helper: check if logged in creator already submitted a bid for this requirement
  const hasSubmittedBid = (reqId) => {
    return quotations.some(
      (q) =>
        (q.requirementId === reqId ||
          String(q.requirement) === String(reqId) ||
          String(q.requirementId).replace(/\D/g, "") ===
            String(reqId).replace(/\D/g, "")) &&
        (String(q.creator?.id) === String(currentCreator?.id) ||
          q.creator?.name === currentCreator?.name ||
          q.creator?.name === user?.name)
    );
  };

  // Extract all categories present or fallback to defaults
  const categoryList = useMemo(() => {
    const defaultCats = [
      "All",
      "Woodwork",
      "Resin Art",
      "Pottery & Ceramics",
      "Leatherwork",
      "Textiles",
      "Jewelry",
      "Metalcraft",
    ];
    return defaultCats;
  }, []);

  // Filter requirements
  const filteredRequests = useMemo(() => {
    return requirements.filter((req) => {
      // 1. Category filter
      if (selectedCategory !== "All" && req.category !== selectedCategory) {
        return false;
      }

      // 2. Status filter
      const isAlreadyBidded = hasSubmittedBid(req.id);
      if (statusFilter === "open") {
        // Open requests available for creator participation
        const isOpenStatus =
          req.status === "open" ||
          req.status === "quoted" ||
          req.status === "Waiting for Quotations" ||
          req.status === "Quotations Received";
        if (!isOpenStatus) return false;
      } else if (statusFilter === "my-bids") {
        if (!isAlreadyBidded) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (req.title || "").toLowerCase().includes(q);
        const descMatch = (req.description || "").toLowerCase().includes(q);
        const whatMatch = (req.whatDoYouWant || "").toLowerCase().includes(q);
        const catMatch = (req.category || "").toLowerCase().includes(q);
        const locMatch = (req.deliveryLocation || "").toLowerCase().includes(q);
        return titleMatch || descMatch || whatMatch || catMatch || locMatch;
      }

      return true;
    });
  }, [requirements, selectedCategory, statusFilter, searchQuery, quotations, currentCreator, user]);

  const handleOpenBidModal = (req) => {
    setBiddingRequirement(req);
  };

  const handleSubmitBid = (quoteData) => {
    try {
      submitQuotation(quoteData);
      setBiddingRequirement(null);
      showToast(
        `Quotation of ₹${Number(quoteData.price).toLocaleString("en-IN")} submitted successfully for "${biddingRequirement?.title}"!`
      );
    } catch (err) {
      console.error(err);
      showToast("Could not submit quotation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream border border-forest px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-forest shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-cream/70 hover:text-white ml-2 text-xs"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}
        <div className="border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/15 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                Creator Opportunity Workspace
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Customer Requests
              </h1>
              <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-2xl">
                Browse open custom item specifications submitted by customers. Review design briefs, materials, and submit tailored bids directly to buyers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/creator/my-bids"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-border text-ink text-xs font-semibold hover:border-forest hover:text-forest transition-colors shadow-xs"
              >
                <FileText size={15} />
                View My Submitted Bids
              </Link>
            </div>
          </div>

          {/* ==================================================
              SEARCH & FILTER CONTROLS
          ================================================== */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="text"
                placeholder="Search requests by product name, materials, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-border text-sm placeholder:text-ink-muted focus:outline-none focus:border-amber-dark transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-border self-start">
              <button
                onClick={() => setStatusFilter("open")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "open"
                    ? "bg-ink text-cream font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Open Requests
              </button>
              <button
                onClick={() => setStatusFilter("my-bids")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "my-bids"
                    ? "bg-ink text-cream font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Bidded by Me
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-ink text-cream font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                All Requests
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter size={12} /> Category:
            </span>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-amber-dark text-white font-semibold shadow-xs"
                    : "bg-white border border-border text-ink-soft hover:border-amber hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================================
            CUSTOMER REQUESTS LISTING
        ================================================== */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Showing {filteredRequests.length} Customer Requirement{filteredRequests.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-xs">
              <Clock size={40} className="mx-auto text-ink-muted mb-3" />
              <h3 className="font-display text-2xl font-bold text-ink">
                No matching customer requests
              </h3>
              <p className="text-sm text-ink-soft max-w-md mx-auto mt-2">
                We couldn't find any customer requirements matching your selected filters. Try choosing a different category or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setStatusFilter("open");
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors inline-flex items-center gap-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((req) => {
                const reqQuotes = getQuotationsByRequirementId(req.id);
                const alreadyBidded = hasSubmittedBid(req.id);
                const isClosed =
                  req.status === "completed" ||
                  req.status === "cancelled" ||
                  req.status === "Quotation Accepted" ||
                  req.status === "accepted";

                return (
                  <div
                    key={req.id}
                    className="bg-white border border-border rounded-3xl overflow-hidden flex flex-col justify-between hover:border-amber/70 hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Optional Reference Image */}
                      {req.images && req.images.length > 0 && req.images[0] && (
                        <div className="aspect-[16/9] w-full overflow-hidden bg-cream relative">
                          <img
                            src={req.images[0]}
                            alt={req.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-ink shadow-xs">
                              {req.category}
                            </span>
                          </div>
                          {alreadyBidded && (
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-forest text-white shadow-xs flex items-center gap-1">
                                <CheckCircle2 size={12} /> Bid Submitted
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-6">
                        {/* Tags & Date */}
                        {(!req.images || req.images.length === 0) && (
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber/15 text-amber-dark">
                              {req.category}
                            </span>
                            {alreadyBidded && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-forest/15 text-forest flex items-center gap-1">
                                <CheckCircle2 size={12} /> Bid Placed
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
                          <span>
                            Posted {new Date(req.createdAt || Date.now()).toLocaleDateString("en-IN")}
                          </span>
                          <span>
                            {reqQuotes.length} quote{reqQuotes.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-xl font-bold text-ink line-clamp-1 group-hover:text-amber-dark transition-colors">
                          {req.title}
                        </h3>

                        {/* Customer Specifications / What do you want */}
                        {req.whatDoYouWant && (
                          <p className="text-xs font-semibold text-amber-dark mt-1 line-clamp-1">
                            "{req.whatDoYouWant}"
                          </p>
                        )}

                        {/* Description */}
                        <p className="text-xs text-ink-soft mt-2 line-clamp-3 leading-relaxed">
                          {req.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/80">
                          <div className="p-2.5 rounded-xl bg-cream/50">
                            <span className="text-[10px] uppercase font-bold text-ink-muted block">
                              Client Budget
                            </span>
                            <span className="text-sm font-bold text-ink mt-0.5 block">
                              ₹{Number(req.budget || 0).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-cream/50">
                            <span className="text-[10px] uppercase font-bold text-ink-muted block">
                              Target Date
                            </span>
                            <span className="text-sm font-bold text-ink mt-0.5 block truncate">
                              {req.requiredDate || req.deadline || "Flexible"}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        {req.deliveryLocation && (
                          <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-3 truncate">
                            <MapPin size={13} className="shrink-0 text-amber-dark" />
                            <span className="truncate">{req.deliveryLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 pt-0 border-t border-border/60 mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectedRequirement(req)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-border text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream transition-colors"
                      >
                        <Eye size={14} />
                        Details
                      </button>

                      {isClosed ? (
                        <span className="flex-1 text-center py-2.5 rounded-full bg-cream text-ink-muted text-xs font-semibold">
                          Closed
                        </span>
                      ) : alreadyBidded ? (
                        <Link
                          to="/creator/my-bids"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-forest/15 text-forest text-xs font-semibold hover:bg-forest/25 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                          View Bid
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBidModal(req)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-amber-dark text-white text-xs font-semibold hover:bg-ink transition-colors shadow-xs"
                        >
                          <Send size={13} />
                          Submit Bid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          SUBMIT BID MODAL (QuotationForm)
      ================================================== */}
      {biddingRequirement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8 animate-in fade-in zoom-in-95 duration-200 relative">
            <QuotationForm
              requirement={biddingRequirement}
              currentCreator={currentCreator}
              onSubmitQuotation={handleSubmitBid}
              onCancel={() => setBiddingRequirement(null)}
            />
          </div>
        </div>
      )}

      {/* ==================================================
          REQUIREMENT DETAIL MODAL
      ================================================== */}
      {inspectedRequirement && (
        <RequirementDetailModal
          requirement={inspectedRequirement}
          quotations={getQuotationsByRequirementId(inspectedRequirement.id)}
          viewRole="creator"
          onClose={() => setInspectedRequirement(null)}
          onSendQuotation={(req) => {
            setInspectedRequirement(null);
            handleOpenBidModal(req);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
