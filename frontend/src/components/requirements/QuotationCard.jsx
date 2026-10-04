// src/components/requirements/QuotationCard.jsx

import {
  Star,
  Clock,
  Truck,
  CheckCircle,
  FileText,
  ShieldCheck,
  Eye,
  Check,
  Sparkles,
} from "lucide-react";

export default function QuotationCard({
  quotation,
  onView,
  onSelect,
  isSelected = false,
  isBestValue = false,
  isFastest = false,
  isTopRated = false,
  showSelectButton = true,
}) {
  const {
    creator = {},
    price = 0,
    deliveryCharge = 0,
    totalPrice = price + deliveryCharge,
    productionTime = "5 Days",
    materials = "Epoxy Resin + Wood",
    description = "",
    terms = "",
    status = "Pending",
  } = quotation;

  return (
    <div
      className={`
        bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-300 relative flex flex-col justify-between
        ${
          isSelected || status === "Accepted"
            ? "border-forest ring-2 ring-forest/20 shadow-md bg-forest/5"
            : "border-border hover:border-amber/60 hover:shadow-md"
        }
      `}
    >
      {/* Top Ribbons for Value / Speed / Rating */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          {isBestValue && (
            <span className="px-2.5 py-0.5 rounded-full bg-forest/10 text-forest text-[11px] font-semibold tracking-wide border border-forest/20">
              Best Value
            </span>
          )}
          {isFastest && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber/15 text-amber-dark text-[11px] font-semibold tracking-wide border border-amber/30">
              ⚡ Fastest
            </span>
          )}
          {isTopRated && (
            <span className="px-2.5 py-0.5 rounded-full bg-ink/10 text-ink text-[11px] font-semibold tracking-wide border border-border">
              ★ Top Rated
            </span>
          )}
        </div>

        {status === "Accepted" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest text-white text-[11px] font-semibold">
            <Check size={12} /> Selected Quote
          </span>
        )}
      </div>

      <div>
        {/* Creator Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <img
            src={creator.avatar || "https://i.pravatar.cc/150?img=32"}
            alt={creator.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-semibold text-ink text-base truncate">
              {creator.name}
            </h4>
            <p className="text-xs text-ink-muted truncate">
              {creator.studioName || creator.specialty || "Verified Maker"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber/10 text-amber-dark text-xs font-bold">
                <Star size={11} className="fill-amber text-amber" />
                {creator.rating || "4.8"}
              </span>
              <span className="text-[11px] text-ink-muted">
                ({creator.reviewsCount || 40}+ reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="mt-4 p-3.5 bg-cream/50 rounded-xl border border-border/60">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-ink-soft">Quoted Price:</span>
            <span className="font-display text-2xl font-bold text-ink">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-muted mt-1 pt-1.5 border-t border-border/40">
            <span>Delivery Charge:</span>
            <span className="font-medium text-ink">
              {deliveryCharge > 0 ? `+ ₹${deliveryCharge}` : "Free Delivery"}
            </span>
          </div>
        </div>

        {/* Specs: Production Time & Materials */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="bg-white border border-border/80 rounded-lg p-2 flex items-center gap-2">
            <Clock size={14} className="text-amber-dark shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-ink-muted block leading-none">
                Production
              </span>
              <span className="font-semibold text-ink truncate block">
                {productionTime}
              </span>
            </div>
          </div>

          <div className="bg-white border border-border/80 rounded-lg p-2 flex items-center gap-2">
            <Truck size={14} className="text-forest shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-ink-muted block leading-none">
                Delivery
              </span>
              <span className="font-semibold text-ink truncate block">
                ₹{deliveryCharge}
              </span>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block mb-1">
            Materials:
          </span>
          <p className="text-xs text-ink bg-cream/30 p-2 rounded-lg border border-border/40 line-clamp-2">
            {materials}
          </p>
        </div>

        {/* Creator Message Snippet */}
        {description && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block mb-1">
              Maker Note:
            </span>
            <p className="text-xs text-ink-soft italic bg-cream/20 p-2.5 rounded-lg border border-border/40 line-clamp-2">
              "{description}"
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-border flex items-center gap-2.5">
        {onView && (
          <button
            type="button"
            onClick={() => onView(quotation)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-border bg-white text-ink hover:bg-cream text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={13} />
            View
          </button>
        )}

        {showSelectButton && status !== "Accepted" && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(quotation)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-ink text-cream hover:bg-forest text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Check size={13} />
            Select
          </button>
        )}
      </div>
    </div>
  );
}
