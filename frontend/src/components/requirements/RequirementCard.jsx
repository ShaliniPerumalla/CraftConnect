// src/components/requirements/RequirementCard.jsx

import { Calendar, MapPin, IndianRupee, MessageSquare, Clock, ArrowRight, CheckCircle2, ChevronRight, Eye } from "lucide-react";

export default function RequirementCard({
  requirement,
  viewMode = "customer", // "customer" | "creator"
  onView,
  onSendQuotation,
  onCompare,
}) {
  const {
    id,
    title,
    category,
    description,
    budget,
    budgetMin,
    budgetMax,
    requiredDate,
    location,
    status,
    quotations = [],
    referenceImages = [],
  } = requirement;

  const getStatusBadge = (currentStatus) => {
    switch (currentStatus) {
      case "Waiting for Quotations":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/15 text-amber-dark border border-amber/30">
            <Clock size={12} />
            Waiting for Quotations
          </span>
        );
      case "Quotations Received":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest/15 text-forest-dark border border-forest/30">
            <MessageSquare size={12} />
            Quotations Received ({quotations.length})
          </span>
        );
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest text-cream">
            <CheckCircle2 size={12} />
            Quotation Accepted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ink/10 text-ink">
            {currentStatus}
          </span>
        );
    }
  };

  const budgetDisplay =
    budgetMin && budgetMax && budgetMin !== budgetMax
      ? `₹${budgetMin.toLocaleString("en-IN")}–₹${budgetMax.toLocaleString("en-IN")}`
      : `₹${Number(budget || 0).toLocaleString("en-IN")}`;

  const formattedDate = requiredDate
    ? new Date(requiredDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "Flexible";

  return (
    <div className="bg-white border border-border rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] hover:border-amber/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Header: ID, Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-dark bg-amber/10 px-2.5 py-1 rounded-lg">
              #{id}
            </span>
            <span className="text-xs uppercase tracking-wider text-ink-soft font-medium">
              {category}
            </span>
          </div>

          <div>{getStatusBadge(status)}</div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-amber-dark transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description snippet */}
        <p className="text-sm text-ink-soft mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Image Preview strip if any */}
        {referenceImages && referenceImages.length > 0 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {referenceImages.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Reference"
                className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
              />
            ))}
            {referenceImages.length > 3 && (
              <div className="w-14 h-14 rounded-xl bg-cream border border-border flex items-center justify-center text-xs font-semibold text-ink-soft shrink-0">
                +{referenceImages.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-4 my-4 border-y border-border/80 text-xs">
          <div>
            <span className="text-ink-muted block text-[11px]">Budget</span>
            <span className="font-semibold text-ink mt-0.5 block">
              {budgetDisplay}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[11px]">Delivery</span>
            <span className="font-semibold text-ink mt-0.5 block flex items-center gap-1">
              <Calendar size={12} className="text-amber-dark" />
              {formattedDate}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[11px]">Location</span>
            <span className="font-semibold text-ink mt-0.5 block flex items-center gap-1 truncate">
              <MapPin size={12} className="text-forest" />
              {location || "All India"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        {viewMode === "customer" ? (
          <div className="flex items-center justify-between gap-3">
            {status === "Quotations Received" && quotations.length > 0 ? (
              <button
                type="button"
                onClick={() => onCompare?.(requirement)}
                className="
                  flex-1
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-3
                  rounded-xl
                  bg-amber-dark
                  text-white
                  text-xs
                  font-medium
                  hover:bg-ink
                  transition-all
                  shadow-sm
                "
              >
                <span>Compare {quotations.length} Quotations</span>
                <ArrowRight size={14} />
              </button>
            ) : status === "Accepted" ? (
              <button
                type="button"
                onClick={() => onView?.(requirement)}
                className="
                  flex-1
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-3
                  rounded-xl
                  bg-forest/15
                  text-forest-dark
                  text-xs
                  font-semibold
                  border
                  border-forest/20
                  hover:bg-forest
                  hover:text-white
                  transition-all
                "
              >
                <span>View Accepted Quotation</span>
                <CheckCircle2 size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onView?.(requirement)}
                className="
                  flex-1
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-3
                  rounded-xl
                  bg-cream
                  border
                  border-border
                  text-xs
                  font-medium
                  text-ink
                  hover:border-amber
                  hover:text-amber-dark
                  transition-all
                "
              >
                <span>View Requirement</span>
                <Eye size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onView?.(requirement)}
              className="
                w-10
                h-10
                rounded-xl
                border
                border-border
                flex
                items-center
                justify-center
                text-ink-soft
                hover:border-amber
                hover:text-ink
                hover:bg-cream
                transition-all
              "
              title="Details"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* Creator View */
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onView?.(requirement)}
              className="
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-3.5
                py-2.5
                rounded-xl
                border
                border-border
                bg-cream/40
                text-ink
                text-xs
                font-medium
                hover:border-amber
                hover:bg-cream
                transition-all
              "
            >
              <Eye size={14} />
              <span>View Requirement</span>
            </button>

            <button
              type="button"
              onClick={() => onSendQuotation?.(requirement)}
              className="
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-3.5
                py-2.5
                rounded-xl
                bg-ink
                text-cream
                text-xs
                font-medium
                hover:bg-amber-dark
                transition-all
                shadow-sm
              "
            >
              <MessageSquare size={14} />
              <span>Send Quotation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
