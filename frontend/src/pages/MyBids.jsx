import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Calendar,
  Truck,
  Eye,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { useCrafts } from "../context/CraftsContext";
import { useRequirementQuotation } from "../context/RequirementQuotationContext";
import { QuotationDetailModal } from "../components/requirements";

export default function MyBids() {
  const { user } = useAuth();
  const { creators } = useCrafts();
  const {
    quotations = [],
    requirements = [],
    getRequirementById,
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

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "accepted" | "rejected"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState(null);

  // Filter ONLY this logged-in creator's quotations
  const myQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const creatorIdMatch =
        String(q.creator?.id || "") === String(currentCreator?.id || "") ||
        String(q.creator?.id || "") === String(user?.id || "");
      const creatorNameMatch =
        q.creator?.name === currentCreator?.name ||
        q.creator?.name === user?.name ||
        q.creator?.username === user?.username;
      return creatorIdMatch || creatorNameMatch;
    });
  }, [quotations, currentCreator, user]);

  // Status counts
  const pendingCount = myQuotations.filter(
    (q) => String(q.status || "").toLowerCase() === "pending"
  ).length;
  const acceptedCount = myQuotations.filter(
    (q) => String(q.status || "").toLowerCase() === "accepted"
  ).length;
  const rejectedCount = myQuotations.filter((q) => {
    const s = String(q.status || "").toLowerCase();
    return s === "rejected" || s === "declined";
  }).length;

  // Filtered list
  const filteredBids = useMemo(() => {
    return myQuotations.filter((bid) => {
      const status = String(bid.status || "Pending").toLowerCase();

      // Status filter
      if (statusFilter === "pending" && status !== "pending") return false;
      if (statusFilter === "accepted" && status !== "accepted") return false;
      if (
        statusFilter === "rejected" &&
        status !== "rejected" &&
        status !== "declined"
      )
        return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const reqTitle = (
          bid.requirement_title ||
          getRequirementById(bid.requirementId)?.title ||
          ""
        ).toLowerCase();
        const desc = (bid.description || "").toLowerCase();
        const num = (bid.quoteNumber || bid.id || "").toLowerCase();
        return reqTitle.includes(q) || desc.includes(q) || num.includes(q);
      }

      return true;
    });
  }, [myQuotations, statusFilter, searchQuery, getRequirementById]);

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}
        <div className="border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/15 text-forest text-xs font-semibold uppercase tracking-wider mb-2">
                <FileText size={13} />
                Creator Quotations Ledger
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                My Submitted Bids
              </h1>
              <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-2xl">
                Track all formal quotations and proposals submitted to customer requests. Monitor proposal reviews, client decisions, and commissioned work.
              </p>
            </div>

            <Link
              to="/creator/requests"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors shadow-xs shrink-0 self-start md:self-auto"
            >
              <Sparkles size={14} className="text-amber-light" />
              Browse More Customer Requests
            </Link>
          </div>

          {/* ==================================================
              METRIC CARDS SUMMARY
          ================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Total Bids */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-xs text-ink-soft font-medium">Total Bids Placed</span>
              <p className="font-display text-2xl sm:text-3xl mt-1 font-bold">{myQuotations.length}</p>
            </div>

            {/* Pending Bids */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-xs text-amber-dark font-medium flex items-center gap-1.5">
                <Clock size={13} /> Under Client Review
              </span>
              <p className="font-display text-2xl sm:text-3xl mt-1 font-bold text-amber-dark">
                {pendingCount}
              </p>
            </div>

            {/* Accepted Bids */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-xs text-forest font-medium flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Accepted & Commissioned
              </span>
              <p className="font-display text-2xl sm:text-3xl mt-1 font-bold text-forest">
                {acceptedCount}
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-xs text-ink-soft font-medium">Win Rate</span>
              <p className="font-display text-2xl sm:text-3xl mt-1 font-bold">
                {myQuotations.length > 0
                  ? `${Math.round((acceptedCount / myQuotations.length) * 100)}%`
                  : "0%"}
              </p>
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
                placeholder="Search bids by product name or quote #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-border text-sm placeholder:text-ink-muted focus:outline-none focus:border-forest transition-colors shadow-xs"
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
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-border self-start">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-ink text-cream font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                All ({myQuotations.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "pending"
                    ? "bg-amber-dark text-white font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter("accepted")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "accepted"
                    ? "bg-forest text-white font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Accepted ({acceptedCount})
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === "rejected"
                    ? "bg-rose text-white font-semibold shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Declined ({rejectedCount})
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            QUOTATIONS LISTING
        ================================================== */}
        <div className="mt-8">
          {filteredBids.length === 0 ? (
            <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-xs">
              <FileText size={40} className="mx-auto text-ink-muted mb-3" />
              <h3 className="font-display text-2xl font-bold text-ink">
                No quotations found
              </h3>
              <p className="text-sm text-ink-soft max-w-md mx-auto mt-2">
                {myQuotations.length === 0
                  ? "You haven't submitted any bids yet. Discover open customer requests and submit your first quotation!"
                  : "No bids match your selected filter criteria. Try viewing all bids."}
              </p>
              <Link
                to="/creator/requests"
                className="mt-6 px-6 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors inline-flex items-center gap-2"
              >
                <Sparkles size={14} className="text-amber-light" />
                Browse Customer Requests
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBids.map((bid) => {
                const req = getRequirementById(bid.requirementId);
                const reqTitle =
                  bid.requirement_title || req?.title || `Customer Request ${bid.requirementId}`;

                const rawStatus = String(bid.status || "Pending").toLowerCase();
                const isAccepted = rawStatus === "accepted";
                const isDeclined = rawStatus === "rejected" || rawStatus === "declined";
                const isPending = !isAccepted && !isDeclined;

                const statusBadge = isAccepted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest/15 text-forest">
                    <CheckCircle2 size={13} />
                    Accepted
                  </span>
                ) : isDeclined ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose/15 text-rose">
                    <XCircle size={13} />
                    Declined
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber/15 text-amber-dark">
                    <Clock size={13} />
                    Under Review
                  </span>
                );

                return (
                  <div
                    key={bid.id}
                    className="bg-white border border-border rounded-3xl p-6 sm:p-7 shadow-xs hover:border-amber/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left: Requirement & Proposal Info */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {statusBadge}
                        <span className="text-xs font-mono text-ink-muted">
                          {bid.quoteNumber || bid.id}
                        </span>
                        <span className="text-xs text-ink-muted">
                          • Submitted on {new Date(bid.createdAt || Date.now()).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                          {reqTitle}
                        </h3>
                        {req?.category && (
                          <span className="text-xs font-semibold text-amber-dark block mt-0.5">
                            Category: {req.category}
                          </span>
                        )}
                      </div>

                      {bid.description && (
                        <p className="text-xs sm:text-sm text-ink-soft line-clamp-2 leading-relaxed bg-cream/30 p-3 rounded-xl border border-border/60">
                          <span className="font-semibold text-ink">Your Proposal: </span>
                          {bid.description}
                        </p>
                      )}

                      {/* Specs pills */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft pt-1">
                        {bid.productionTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-amber-dark" />
                            Production: <strong className="text-ink">{bid.productionTime}</strong>
                          </span>
                        )}
                        {bid.estimatedCompletionDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-forest" />
                            Estimated Completion:{" "}
                            <strong className="text-ink">{bid.estimatedCompletionDate}</strong>
                          </span>
                        )}
                        {bid.deliveryCharge ? (
                          <span className="flex items-center gap-1">
                            <Truck size={13} className="text-ink-soft" />
                            Delivery: ₹{bid.deliveryCharge}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: Pricing & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
                          Quoted Total
                        </span>
                        <span className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5 block">
                          ₹{Number(bid.totalPrice || bid.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedQuoteForModal(bid)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream transition-colors"
                        >
                          <Eye size={14} />
                          View Slip
                        </button>

                        {isAccepted && (
                          <Link
                            to="/creator/orders"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-forest text-white text-xs font-semibold hover:bg-forest/90 transition-colors shadow-xs"
                          >
                            <ShoppingBag size={14} />
                            Go to Orders
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          QUOTATION DETAIL SLIP MODAL
      ================================================== */}
      {selectedQuoteForModal && (
        <QuotationDetailModal
          quotation={selectedQuoteForModal}
          requirement={getRequirementById(selectedQuoteForModal.requirementId)}
          onClose={() => setSelectedQuoteForModal(null)}
        />
      )}

      <Footer />
    </div>
  );
}
