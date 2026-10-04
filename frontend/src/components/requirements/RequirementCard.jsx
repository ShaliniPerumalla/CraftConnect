// src/components/requirements/RequirementCard.jsx

import {
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Eye,
  CheckCircle,
  FileCheck,
  AlertCircle,
} from "lucide-react";

export default function RequirementCard({
  requirement,
  quotations = [],
  viewRole = "customer", // "customer" or "creator"
  onViewRequirement,
  onSendQuotation,
  onCompareQuotations,
  onSelectRequirement,
}) {
  const quoteCount = quotations.length;

  // Format delivery date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Flexible";
    try {
      const d = new Date(dateStr);
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
  const getStatusBadge = () => {
    if (requirement.status === "Quotation Accepted") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/15 text-forest font-semibold text-xs border border-forest/30">
          <CheckCircle size={12} />
          Quotation Accepted
        </span>
      );
    }
    if (quoteCount > 0 || requirement.status === "Quotations Received") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber-dark font-semibold text-xs border border-amber/30 animate-pulse">
          <Sparkles size={12} />
          Quotations Received ({quoteCount})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/5 text-ink-soft font-semibold text-xs border border-border">
        <Clock size={12} />
        Waiting for Quotations
      </span>
    );
  };

  const mainImage =
    requirement.images && requirement.images.length > 0
      ? requirement.images[0]
      : "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top bar: ID & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cream border border-border text-ink">
              #{requirement.id}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-cream-dark/60 text-ink-soft">
              {requirement.category}
            </span>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Card Body: Image & Details */}
        <div className="flex gap-4 mt-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream shrink-0 border border-border relative">
            <img
              src={mainImage}
              alt={requirement.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {requirement.images && requirement.images.length > 1 && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                +{requirement.images.length - 1}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink leading-snug line-clamp-1 group-hover:text-amber-dark transition-colors">
              {requirement.title}
            </h3>

            {requirement.whatDoYouWant && (
              <p className="text-xs font-medium text-amber-dark mt-0.5 line-clamp-1">
                {requirement.whatDoYouWant}
              </p>
            )}

            <p className="text-xs text-ink-soft mt-1.5 line-clamp-2 leading-relaxed">
              {requirement.description}
            </p>
          </div>
        </div>

        {/* Meta Pills: Budget, Delivery, Location */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/80 text-xs">
          {/* Budget */}
          <div className="bg-cream/50 rounded-xl p-2.5 border border-border/50">
            <span className="text-[11px] text-ink-muted block font-medium">
              Budget
            </span>
            <span className="font-semibold text-ink text-sm flex items-center gap-0.5 mt-0.5">
              ₹
              {requirement.budgetMin && requirement.budgetMax
                ? `${requirement.budgetMin.toLocaleString("en-IN")}–₹${requirement.budgetMax.toLocaleString("en-IN")}`
                : Number(requirement.budget).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Delivery Date */}
          <div className="bg-cream/50 rounded-xl p-2.5 border border-border/50">
            <span className="text-[11px] text-ink-muted block font-medium">
              Delivery
            </span>
            <span className="font-semibold text-ink text-sm flex items-center gap-1 mt-0.5 truncate">
              <Calendar size={13} className="text-amber-dark shrink-0" />
              {formatDate(requirement.requiredDate)}
            </span>
          </div>

          {/* Location */}
          <div className="col-span-2 sm:col-span-1 bg-cream/50 rounded-xl p-2.5 border border-border/50">
            <span className="text-[11px] text-ink-muted block font-medium">
              Location
            </span>
            <span className="font-semibold text-ink text-sm flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={13} className="text-forest shrink-0" />
              {requirement.deliveryLocation || "Ongole"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        {/* Customer View Actions */}
        {viewRole === "customer" ? (
          <>
            <button
              type="button"
              onClick={() => onViewRequirement && onViewRequirement(requirement)}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink font-medium"
            >
              <Eye size={14} />
              View Details
            </button>

            {quoteCount > 0 ? (
              <button
                type="button"
                onClick={() =>
                  onCompareQuotations && onCompareQuotations(requirement)
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold shadow-xs hover:shadow transition-all"
              >
                <Sparkles size={13} className="text-amber-light" />
                Compare {quoteCount} Quotation{quoteCount > 1 ? "s" : ""}
                <ArrowRight size={13} />
              </button>
            ) : (
              <span className="text-xs text-ink-muted italic">
                Awaiting creator bids...
              </span>
            )}
          </>
        ) : (
          /* Creator View Actions */
          <>
            <button
              type="button"
              onClick={() => onViewRequirement && onViewRequirement(requirement)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-white text-ink text-xs font-medium hover:bg-cream transition-colors"
            >
              <Eye size={14} />
              View Requirement
            </button>

            <button
              type="button"
              onClick={() => onSendQuotation && onSendQuotation(requirement)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-dark text-white hover:bg-ink text-xs font-semibold shadow-xs hover:shadow transition-all"
            >
              <Send size={13} />
              Send Quotation
            </button>
          </>
        )}
      </div>
    </div>
  );
}
