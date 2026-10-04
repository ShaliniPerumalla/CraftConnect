// src/components/requirements/QuotationComparison.jsx

import { useState } from "react";
import { Star, Clock, Check, Eye, X, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useRequirements } from "../../context/RequirementsContext";

export default function QuotationComparison({
  requirement,
  onBack,
  onQuotationAccepted,
}) {
  const { acceptQuotation } = useRequirements();
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null);
  const [confirmModalQuote, setConfirmModalQuote] = useState(null);

  if (!requirement || !requirement.quotations || requirement.quotations.length === 0) {
    return (
      <div className="bg-white border border-border rounded-3xl p-10 text-center">
        <AlertCircle size={36} className="mx-auto text-amber-dark mb-3" />
        <h3 className="font-display text-2xl text-ink">No Quotations Yet</h3>
        <p className="text-sm text-ink-soft mt-2">
          Waiting for creators to submit custom quotations for #{requirement?.id}.
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-6 px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:border-amber transition-colors"
          >
            Back to Requirements
          </button>
        )}
      </div>
    );
  }

  const { quotations } = requirement;

  // Find lowest price and fastest production time for badges
  const minPrice = Math.min(...quotations.map((q) => Number(q.price)));
  const minDays = Math.min(...quotations.map((q) => Number(q.productionDays)));

  const handleSelect = (quote) => {
    setConfirmModalQuote(quote);
  };

  const confirmAcceptance = () => {
    if (!confirmModalQuote) return;
    acceptQuotation(requirement.id, confirmModalQuote.id);
    if (onQuotationAccepted) {
      onQuotationAccepted(confirmModalQuote);
    }
    setConfirmModalQuote(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-amber-dark transition-colors mb-2"
            >
              <ArrowLeft size={14} /> Back to Requirements
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber/10 text-amber-dark">
              #{requirement.id}
            </span>
            <span className="text-xs text-ink-soft uppercase tracking-wider">
              {requirement.category}
            </span>
          </div>
          <h2 className="font-display text-3xl text-ink mt-1">
            Customer Quotation Comparison
          </h2>
          <p className="text-sm text-ink-soft mt-1">
            Compare offers received for "{requirement.title}" and select the best creator for your custom order.
          </p>
        </div>

        <div className="bg-cream border border-border rounded-2xl px-5 py-3 text-right">
          <span className="text-xs text-ink-soft block">Target Budget</span>
          <span className="font-display text-xl text-ink font-bold">
            ₹{Number(requirement.budget).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Side-by-side Table/Cards (Desktop Comparison Layout) */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[760px] grid grid-cols-3 gap-6">
          {quotations.map((quote, index) => {
            const isLowestPrice = Number(quote.price) === minPrice;
            const isFastest = Number(quote.productionDays) === minDays;
            const isAccepted =
              quote.status === "Accepted" ||
              requirement.acceptedQuotation?.id === quote.id;

            return (
              <div
                key={quote.id}
                className={`
                  bg-white
                  border
                  rounded-3xl
                  p-6
                  flex
                  flex-col
                  justify-between
                  relative
                  transition-all
                  shadow-sm
                  ${
                    isAccepted
                      ? "border-forest ring-2 ring-forest/30 bg-forest/5"
                      : "border-border hover:border-amber/50 hover:shadow-md"
                  }
                `}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-sm font-bold text-ink">
                    Quotation {index + 1}
                  </span>
                  {isLowestPrice && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest/15 text-forest">
                      Best Price
                    </span>
                  )}
                  {isFastest && !isLowestPrice && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber/15 text-amber-dark">
                      Fastest
                    </span>
                  )}
                  {isAccepted && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest text-white">
                      Selected
                    </span>
                  )}
                </div>

                {/* Creator Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <img
                    src={quote.creatorAvatar || "https://i.pravatar.cc/150?img=32"}
                    alt={quote.creatorName}
                    className="w-11 h-11 rounded-2xl object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm text-ink truncate">
                      {quote.creatorName}
                    </h4>
                    <p className="text-[11px] text-ink-soft truncate">
                      {quote.creatorSpecialty}
                    </p>
                  </div>
                </div>

                {/* The 3 Core Comparison Metrics (Price, Days, Rating) */}
                <div className="py-5 space-y-4 border-b border-border">
                  {/* Price */}
                  <div className="text-center bg-cream/50 rounded-2xl p-3 border border-border/50">
                    <span className="text-[11px] text-ink-muted uppercase tracking-wider block font-medium">
                      Price
                    </span>
                    <span className="font-display text-3xl font-bold text-ink block mt-0.5">
                      ₹{Number(quote.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-ink-soft block mt-0.5">
                      + ₹{Number(quote.deliveryCharge || 0)} Delivery
                    </span>
                  </div>

                  {/* Production Days */}
                  <div className="flex items-center justify-between px-2 text-xs">
                    <span className="text-ink-soft flex items-center gap-1">
                      <Clock size={14} className="text-amber-dark" /> Production
                    </span>
                    <span className="font-bold text-ink font-display text-sm">
                      {quote.productionDays} Days
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between px-2 text-xs">
                    <span className="text-ink-soft flex items-center gap-1">
                      <Star size={14} className="fill-amber-dark text-amber-dark" /> Rating
                    </span>
                    <span className="font-bold text-amber-dark font-display text-sm">
                      ⭐ {Number(quote.creatorRating || 4.8).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Materials & Message Snippet */}
                <div className="py-4 space-y-2 text-xs text-ink-soft">
                  <p className="line-clamp-2">
                    <strong className="text-ink font-semibold">Material: </strong>
                    {quote.materials}
                  </p>
                  <p className="italic line-clamp-2">
                    "{quote.message}"
                  </p>
                </div>

                {/* Actions: [View] and [Select] */}
                <div className="pt-4 border-t border-border space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuoteDetail(quote)}
                    className="
                      w-full
                      py-2.5
                      rounded-xl
                      border
                      border-border
                      bg-cream/40
                      text-xs
                      font-medium
                      text-ink
                      hover:border-amber
                      hover:text-amber-dark
                      hover:bg-cream
                      transition-all
                      flex
                      items-center
                      justify-center
                      gap-1.5
                    "
                  >
                    <Eye size={13} />
                    <span>View Details</span>
                  </button>

                  {isAccepted ? (
                    <div className="w-full py-2.5 text-center text-xs font-bold text-forest uppercase tracking-wider flex items-center justify-center gap-1">
                      <Check size={14} /> Selected
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(quote)}
                      className="
                        w-full
                        py-2.5
                        rounded-xl
                        bg-ink
                        text-cream
                        text-xs
                        font-semibold
                        hover:bg-amber-dark
                        transition-all
                        shadow-sm
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        gap-1.5
                      "
                    >
                      <Check size={14} />
                      <span>Select This Offer</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-border rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedQuoteDetail(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <img
                src={selectedQuoteDetail.creatorAvatar}
                alt={selectedQuoteDetail.creatorName}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-display text-xl text-ink">
                  {selectedQuoteDetail.creatorName}
                </h3>
                <p className="text-xs text-ink-soft">
                  {selectedQuoteDetail.creatorSpecialty}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-dark mt-1">
                  <Star size={12} className="fill-amber-dark text-amber-dark" />
                  {selectedQuoteDetail.creatorRating} Creator Rating
                </div>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-cream/60 p-3.5 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Proposed Price:</span>
                  <span className="font-bold text-ink text-sm">
                    ₹{Number(selectedQuoteDetail.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Production Time:</span>
                  <span className="font-bold text-ink">
                    {selectedQuoteDetail.productionDays} Days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Delivery Fee:</span>
                  <span className="font-bold text-ink">
                    ₹{Number(selectedQuoteDetail.deliveryCharge || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-ink block mb-1">Materials:</span>
                <p className="text-ink-soft bg-cream/40 p-2.5 rounded-xl border border-border">
                  {selectedQuoteDetail.materials}
                </p>
              </div>

              <div>
                <span className="font-semibold text-ink block mb-1">Proposed Design:</span>
                <p className="text-ink-soft bg-cream/40 p-2.5 rounded-xl border border-border">
                  {selectedQuoteDetail.proposedDesign || "As discussed in requirement"}
                </p>
              </div>

              <div>
                <span className="font-semibold text-ink block mb-1">Creator Note:</span>
                <p className="text-ink-soft italic bg-cream/40 p-2.5 rounded-xl border border-border">
                  "{selectedQuoteDetail.message}"
                </p>
              </div>

              {selectedQuoteDetail.terms && (
                <div>
                  <span className="font-semibold text-ink block mb-1">Terms:</span>
                  <p className="text-ink-soft text-[11px]">
                    {selectedQuoteDetail.terms}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedQuoteDetail(null)}
                className="px-4 py-2 rounded-full border border-border text-xs font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = selectedQuoteDetail;
                  setSelectedQuoteDetail(null);
                  handleSelect(q);
                }}
                className="px-6 py-2 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark"
              >
                Select This Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-border rounded-[2rem] p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber/15 text-amber-dark flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>

            <h3 className="font-display text-2xl text-ink">
              Confirm Creator Selection
            </h3>

            <p className="text-sm text-ink-soft mt-2">
              Are you sure you want to select <strong>{confirmModalQuote.creatorName}</strong>'s quotation of{" "}
              <strong>₹{Number(confirmModalQuote.price).toLocaleString("en-IN")}</strong> for this project?
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmModalQuote(null)}
                className="px-5 py-2.5 rounded-full border border-border text-xs font-medium text-ink hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAcceptance}
                className="px-6 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-forest transition-colors"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
