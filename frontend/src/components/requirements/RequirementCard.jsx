// src/components/requirements/RequirementCard.jsx

import {
  Calendar,
  MapPin,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Sparkles,
  Send,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

export default function RequirementCard({
  requirement,
  role = "customer", // "customer" | "creator"
  onView,
  onSendQuotation,
  onCompare,
  onViewQuotations,
}) {
  const {
    id,
    title,
    category,
    status = "Waiting for Quotations",
    budget,
    budgetValue,
    requiredDate,
    location,
    deliveryLocation,
    description,
    images = [],
    quotations = [],
    customerName,
    createdAt,
  } = requirement;

  const quoteCount = quotations.length;
  const displayLocation = deliveryLocation || location || "Pan India";

  // Format delivery date nicely (e.g., "25 Sept 2026")
  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return "Flexible";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Status badge styling
  const renderStatusBadge = () => {
    if (status === "Quotations Received" || quoteCount > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest/10 text-forest border border-forest/20">
          <Sparkles size={13} className="text-forest animate-pulse" />
          <span>Quotations Received ({quoteCount})</span>
        </span>
      );
    }
    if (status === "In Production" || status === "Quotation Accepted") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/15 text-amber-dark border border-amber/30">
          <ShieldCheck size={13} className="text-amber-dark" />
          <span>In Production</span>
        </span>
      );
    }
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
          <CheckCircle2 size={13} className="text-teal-700" />
          <span>Completed</span>
        </span>
      );
    }
    // Default: Waiting for Quotations
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-amber-dark border border-amber/20">
        <Clock3 size={13} className="text-amber-dark" />
        <span>Waiting for Quotations</span>
      </span>
    );
  };

  return (
    <div className="group bg-white border border-border rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:border-amber/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header: ID & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-cream border border-border text-ink-soft">
              {id.startsWith("#") ? id : `#${id}`}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cream-dark text-ink-soft font-medium">
              {category}
            </span>
          </div>
          {renderStatusBadge()}
        </div>

        {/* Title */}
        <h3 className="font-display text-xl sm:text-2xl text-ink font-semibold group-hover:text-amber-dark transition-colors line-clamp-2 mb-3">
          {title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-2 mb-5">
          {description}
        </p>

        {/* Key Spec Badges: Budget, Delivery, Location */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-3 px-3.5 rounded-xl bg-cream/40 border border-border/60 mb-5 text-xs text-ink-soft">
          {/* Budget */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-border/80 flex items-center justify-center text-amber-dark shrink-0">
              <IndianRupee size={13} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-muted">Budget</p>
              <p className="font-semibold text-ink truncate">
                {budget || `₹${budgetValue?.toLocaleString("en-IN") || "Negotiable"}`}
              </p>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-border/80 flex items-center justify-center text-amber-dark shrink-0">
              <Calendar size={13} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-muted">Delivery</p>
              <p className="font-semibold text-ink truncate">
                {formatDeliveryDate(requiredDate)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-border/80 flex items-center justify-center text-amber-dark shrink-0">
              <MapPin size={13} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-muted">Location</p>
              <p className="font-semibold text-ink truncate">{displayLocation}</p>
            </div>
          </div>
        </div>

        {/* Reference Images Thumbnails */}
        {images && images.length > 0 && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex -space-x-2 overflow-hidden">
              {images.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === "string" ? img : img.url}
                  alt="Reference thumbnail"
                  className="inline-block h-8 w-8 rounded-lg object-cover ring-2 ring-white shadow-xs"
                />
              ))}
            </div>
            <span className="text-[11px] text-ink-muted font-medium flex items-center gap-1">
              <ImageIcon size={12} />
              {images.length} {images.length === 1 ? "reference image" : "reference images"}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-border mt-2">
        {role === "creator" ? (
          /* ================= CREATOR ACTIONS ================= */
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onView && onView(requirement)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-xs font-semibold hover:border-amber hover:text-amber-dark transition-all"
            >
              <Eye size={14} />
              <span>View Requirement</span>
            </button>
            <button
              type="button"
              onClick={() => onSendQuotation && onSendQuotation(requirement)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink text-cream text-xs font-semibold hover:bg-amber-dark hover:shadow-md transition-all"
            >
              <Send size={14} />
              <span>Send Quotation</span>
            </button>
          </div>
        ) : (
          /* ================= CUSTOMER ACTIONS ================= */
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onView && onView(requirement)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-xs font-semibold hover:border-amber hover:text-amber-dark transition-all"
            >
              <Eye size={14} />
              <span>View Details</span>
            </button>

            {quoteCount > 0 ? (
              <button
                type="button"
                onClick={() => onCompare && onCompare(requirement)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-dark hover:shadow-md transition-all"
              >
                <Sparkles size={14} />
                <span>Compare Quotes ({quoteCount})</span>
              </button>
            ) : (
              <span className="text-[11px] text-ink-muted italic px-2">
                Awaiting creator bids
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
