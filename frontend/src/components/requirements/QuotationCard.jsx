// src/components/requirements/QuotationCard.jsx

import { Star, Clock, Truck, Package, Check, ShieldCheck, User } from "lucide-react";

export default function QuotationCard({
  quotation,
  onSelect,
  isAccepted = false,
  isSelected = false,
  showSelectButton = true,
}) {
  const {
    id,
    creatorName,
    creatorAvatar,
    creatorSpecialty,
    creatorRating = 4.8,
    price,
    productionDays,
    materials,
    deliveryCharge = 0,
    message,
    terms,
    proposedDesign,
  } = quotation;

  return (
    <div
      className={`
        bg-white
        border
        rounded-3xl
        p-6
        transition-all
        flex
        flex-col
        justify-between
        relative
        ${
          isAccepted
            ? "border-forest bg-forest/5 shadow-md ring-2 ring-forest/20"
            : isSelected
            ? "border-amber bg-amber/5 shadow-md ring-2 ring-amber/20"
            : "border-border hover:border-amber/50 hover:shadow-lg"
        }
      `}
    >
      {/* Accepted Badge */}
      {isAccepted && (
        <span className="absolute -top-3 right-6 bg-forest text-cream text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Check size={12} /> Accepted Choice
        </span>
      )}

      <div>
        {/* Creator Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-border">
          <img
            src={creatorAvatar || "https://i.pravatar.cc/150?img=32"}
            alt={creatorName}
            className="w-12 h-12 rounded-2xl object-cover border border-border shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-base text-ink truncate font-medium">
              {creatorName}
            </h4>
            <p className="text-xs text-ink-soft truncate">{creatorSpecialty}</p>
          </div>
          <div className="flex items-center gap-1 bg-amber/15 text-amber-dark px-2.5 py-1 rounded-xl text-xs font-bold">
            <Star size={13} className="fill-amber-dark text-amber-dark" />
            <span>{Number(creatorRating).toFixed(1)}</span>
          </div>
        </div>

        {/* Price & Production Highlight */}
        <div className="grid grid-cols-2 gap-3 py-4 my-2 border-b border-border bg-cream/30 rounded-2xl p-3">
          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block font-medium">
              Quotation Price
            </span>
            <span className="font-display text-2xl text-ink font-bold block mt-0.5">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-ink-soft">
              + ₹{Number(deliveryCharge).toLocaleString("en-IN")} delivery
            </span>
          </div>

          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block font-medium">
              Production Time
            </span>
            <span className="font-display text-2xl text-ink font-bold block mt-0.5 flex items-center gap-1">
              <Clock size={18} className="text-amber-dark" />
              {productionDays} Days
            </span>
            <span className="text-[11px] text-forest font-medium">
              Ready to create
            </span>
          </div>
        </div>

        {/* Materials */}
        {materials && (
          <div className="text-xs py-2 flex items-start gap-2 text-ink-soft">
            <Package size={14} className="text-amber-dark shrink-0 mt-0.5" />
            <span>
              <strong className="text-ink font-semibold">Materials:</strong> {materials}
            </span>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-2 text-xs italic text-ink-soft bg-cream/50 rounded-xl p-3 border border-border/60">
            "{message}"
          </div>
        )}

        {/* Proposed Design Note */}
        {proposedDesign && (
          <div className="mt-2 text-xs text-ink-soft">
            <strong className="text-ink font-medium">Proposed Design: </strong>
            <span>{proposedDesign}</span>
          </div>
        )}
      </div>

      {/* Footer / Action */}
      {showSelectButton && (
        <div className="pt-5 mt-4 border-t border-border">
          {isAccepted ? (
            <div className="w-full py-2.5 text-center text-xs font-bold text-forest uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Check size={16} /> Selected Quotation
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelect?.(quotation)}
              className="
                w-full
                py-3
                rounded-xl
                bg-ink
                text-cream
                text-xs
                font-semibold
                hover:bg-amber-dark
                transition-all
                shadow-sm
                cursor-pointer
              "
            >
              Select This Quotation
            </button>
          )}
        </div>
      )}
    </div>
  );
}
