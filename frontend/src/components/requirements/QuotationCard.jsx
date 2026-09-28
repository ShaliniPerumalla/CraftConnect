// src/components/requirements/QuotationCard.jsx

import {
  Star,
  Clock,
  Truck,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  Check,
  MessageSquare,
  IndianRupee,
} from "lucide-react";

export default function QuotationCard({
  quotation,
  onSelect,
  onView,
  isSelected = false,
  isCustomer = true,
  rank = null, // e.g. "Quotation 1"
}) {
  const {
    id,
    creatorName,
    creatorStudio,
    creatorAvatar,
    creatorRating = 4.8,
    creatorReviewsCount = 30,
    creatorBadge,
    price = 1200,
    deliveryCharge = 0,
    totalPrice = 1200,
    productionDays = 5,
    materials = "Epoxy Resin + Wood",
    message = "I can create the requested design...",
    terms,
    proposedImages = [],
    status = "pending",
  } = quotation;

  const displayTotal = totalPrice || (price + deliveryCharge);

  return (
    <div
      className={`
        relative rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between p-6
        ${
          isSelected
            ? "border-forest ring-2 ring-forest/30 shadow-[0_12px_35px_rgba(77,87,71,0.12)] bg-forest/5"
            : "border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-amber hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)]"
        }
      `}
    >
      {/* Top Banner for Rank or Selection */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {rank ? (
          <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-cream text-ink border border-border">
            {rank}
          </span>
        ) : (
          <span className="text-xs font-mono text-ink-muted">
            {id}
          </span>
        )}

        {isSelected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest text-white shadow-xs">
            <Check size={12} />
            <span>Selected Quotation</span>
          </span>
        ) : (
          creatorBadge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber/15 text-amber-dark">
              <Sparkles size={11} />
              <span>{creatorBadge}</span>
            </span>
          )
        )}
      </div>

      {/* Creator Profile */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border/70">
        <img
          src={
            creatorAvatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          }
          alt={creatorName}
          className="w-12 h-12 rounded-full object-cover border border-border shadow-xs shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-sm text-ink truncate">
              {creatorName}
            </h4>
          </div>
          <p className="text-xs text-ink-soft truncate">{creatorStudio}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="flex items-center gap-0.5 font-bold text-amber-dark">
              <Star size={13} className="fill-amber-dark text-amber-dark" />
              {creatorRating}
            </span>
            <span className="text-ink-muted">({creatorReviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Price & Timeline Prominent Row */}
      <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-cream/40 border border-border/60 mb-4 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-muted">Quoted Price</p>
          <p className="font-display text-xl font-bold text-ink mt-0.5">
            ₹{displayTotal.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-ink-muted">
            {deliveryCharge === 0 ? "Free Delivery" : `+ ₹${deliveryCharge} delivery`}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-muted">Production Time</p>
          <p className="font-display text-xl font-bold text-amber-dark mt-0.5">
            {productionDays} Days
          </p>
          <p className="text-[10px] text-ink-muted flex items-center justify-center gap-1">
            <Clock size={10} />
            Fast turn-around
          </p>
        </div>
      </div>

      {/* Materials */}
      <div className="mb-3 text-xs">
        <span className="text-ink-muted font-medium block mb-1">Materials:</span>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-border text-ink font-medium">
          <Layers size={12} className="text-amber-dark" />
          <span>{materials}</span>
        </div>
      </div>

      {/* Creator Message snippet */}
      <div className="mb-4 p-3 rounded-xl bg-cream/20 border border-border/50 text-xs text-ink-soft leading-relaxed italic">
        "{message.length > 120 ? `${message.slice(0, 120)}...` : message}"
      </div>

      {/* Proposed Design previews */}
      {proposedImages && proposedImages.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-muted font-medium mb-1.5">
            Proposed concept:
          </p>
          <div className="flex gap-2 overflow-hidden">
            {proposedImages.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={typeof img === "string" ? img : img.url}
                alt="Proposed preview"
                className="w-16 h-12 object-cover rounded-lg border border-border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border flex items-center gap-2 mt-auto">
        {onView && (
          <button
            type="button"
            onClick={() => onView(quotation)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-xs font-semibold hover:border-amber hover:text-amber-dark transition-all"
          >
            <Eye size={13} />
            <span>View Details</span>
          </button>
        )}

        {isCustomer && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(quotation)}
            className={`
              flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
              ${
                isSelected
                  ? "bg-forest text-white cursor-default shadow-xs"
                  : "bg-ink text-cream hover:bg-forest hover:shadow-md"
              }
            `}
          >
            <CheckCircle2 size={13} />
            <span>{isSelected ? "Selected" : "Select Quote"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
