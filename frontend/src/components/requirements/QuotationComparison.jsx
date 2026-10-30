// src/components/requirements/QuotationComparison.jsx

import { useState } from "react";
import {
  Sparkles,
  Check,
  Star,
  Clock,
  Truck,
  Eye,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
} from "lucide-react";

import QuotationCard from "./QuotationCard";

export default function QuotationComparison({
  requirement,
  quotations = [],
  onSelectQuotation,
  onViewQuotation,
  onClose,
}) {
  const [selectedQuoteForConfirm, setSelectedQuoteForConfirm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  if (!quotations || quotations.length === 0) {
    return (
      <div className="bg-white border border-border rounded-3xl p-8 text-center">
        <Clock size={36} className="text-amber-dark mx-auto mb-3" />
        <h3 className="font-display text-xl font-semibold text-ink">
          Waiting for Quotations
        </h3>
        <p className="text-xs text-ink-soft max-w-md mx-auto mt-2">
          Your custom requirement #{requirement?.id} is live! Creators are reviewing your design specifications and will submit tailored quotations shortly.
        </p>
      </div>
    );
  }

  // Find lowest price, fastest time, highest rating
  const sortedByPrice = [...quotations].sort((a, b) => a.price - b.price);
  const bestValueId = sortedByPrice[0]?.id;

  const getDays = (str) => parseInt(str) || 999;
  const sortedByDays = [...quotations].sort(
    (a, b) => getDays(a.productionTime) - getDays(b.productionTime)
  );
  const fastestId = sortedByDays[0]?.id;

  const sortedByRating = [...quotations].sort(
    (a, b) => (b.creator?.rating || 0) - (a.creator?.rating || 0)
  );
  const topRatedId = sortedByRating[0]?.id;

  const handleSelectClick = (quote) => {
    setSelectedQuoteForConfirm(quote);
  };

  const handleConfirmAcceptance = () => {
    if (!selectedQuoteForConfirm) return;
    setIsProcessing(true);

    setTimeout(() => {
      if (onSelectQuotation) {
        onSelectQuotation(selectedQuoteForConfirm.id);
      }
      setIsProcessing(false);
      setConfirmedSuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Customer Quotation Comparison
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Compare Quotations for #{requirement?.id}
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            {requirement?.title} • Target Budget: ₹
            {Number(requirement?.budget || 0).toLocaleString("en-IN")} • Location: {requirement?.deliveryLocation}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cream border border-border text-ink">
            {quotations.length} Quotation{quotations.length > 1 ? "s" : ""} Available
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream border border-border text-ink-soft hover:text-ink transition-colors"
              title="Close Comparison"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Responsive Quotation Columns (Side by Side comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quotations.map((quote, index) => {
          const isSelected =
            quote.status === "Accepted" ||
            requirement?.acceptedQuotationId === quote.id;

          return (
            <div key={quote.id} className="flex flex-col">
              <div className="text-center pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-soft">
                  Quotation {index + 1}
                </span>
              </div>
              <QuotationCard
                quotation={quote}
                isSelected={isSelected}
                isBestValue={quote.id === bestValueId && quotations.length > 1}
                isFastest={quote.id === fastestId && quotations.length > 1}
                isTopRated={quote.id === topRatedId && quotations.length > 1}
                onView={() => onViewQuotation && onViewQuotation(quote)}
                onSelect={() => handleSelectClick(quote)}
                showSelectButton={!isSelected}
              />
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-xs overflow-hidden">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">
          Detailed Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="p-3.5 font-semibold text-ink-soft">Attribute</th>
                {quotations.map((q, idx) => (
                  <th key={q.id} className="p-3.5 font-bold text-ink">
                    Quotation {idx + 1} ({q.creator?.name?.split(" ")[0]})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Quoted Price</td>
                {quotations.map((q) => (
                  <td key={q.id} className="p-3.5 font-display text-base font-bold text-ink">
                    ₹{Number(q.price).toLocaleString("en-IN")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Production Time</td>
                {quotations.map((q) => (
                  <td key={q.id} className="p-3.5 font-semibold text-ink">
                    {q.productionTime}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Artisan Rating</td>
                {quotations.map((q) => (
                  <td key={q.id} className="p-3.5">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-amber-dark text-xs">
                      <Star size={13} className="fill-amber text-amber shrink-0" />
                      <span>{q.creator?.rating || "4.8"}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Delivery Charge</td>
                {quotations.map((q) => (
                  <td key={q.id} className="p-3.5 text-ink">
                    ₹{q.deliveryCharge}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Materials</td>
                {quotations.map((q) => (
                  <td key={q.id} className="p-3.5 text-ink-soft max-w-[200px]">
                    {q.materials}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-ink-soft">Action</td>
                {quotations.map((q) => {
                  const isAccepted =
                    q.status === "Accepted" ||
                    requirement?.acceptedQuotationId === q.id;

                  return (
                    <td key={q.id} className="p-3.5">
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest text-white text-xs font-semibold">
                          <Check size={12} /> Commissioned
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewQuotation && onViewQuotation(q)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-white text-ink text-xs font-medium hover:bg-cream"
                          >
                            [View]
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectClick(q)}
                            className="px-3 py-1.5 rounded-lg bg-ink text-cream hover:bg-forest text-xs font-semibold shadow-2xs"
                          >
                            [Select]
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal when [Select] is clicked */}
      {selectedQuoteForConfirm && !confirmedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedQuoteForConfirm(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber-dark mb-4">
              <ShieldCheck size={24} />
            </div>

            <h3 className="font-display text-2xl font-bold text-ink">
              Commission This Artisan?
            </h3>
            <p className="text-xs text-ink-soft mt-1">
              You are selecting {selectedQuoteForConfirm.creator?.name}'s quotation for #{requirement?.id}.
            </p>

            <div className="bg-cream/60 rounded-2xl p-4 my-5 border border-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-soft">Artisan:</span>
                <span className="font-semibold text-ink">
                  {selectedQuoteForConfirm.creator?.name} (⭐{selectedQuoteForConfirm.creator?.rating})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Quoted Craft Fee:</span>
                <span className="font-semibold text-ink">
                  ₹{Number(selectedQuoteForConfirm.price).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Delivery to {requirement?.deliveryLocation}:</span>
                <span className="font-semibold text-ink">
                  ₹{selectedQuoteForConfirm.deliveryCharge}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm">
                <span className="font-bold text-ink">Total Commission:</span>
                <span className="font-bold font-display text-ink text-base">
                  ₹{Number(selectedQuoteForConfirm.totalPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Production Turnaround:</span>
                <span className="font-medium text-forest">
                  {selectedQuoteForConfirm.productionTime}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed mb-6">
              🔒 <strong>Platform Escrow Protection:</strong> Your payment is held safely and only disbursed to the creator once the custom piece is crafted to your satisfaction.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedQuoteForConfirm(null)}
                className="flex-1 py-3 rounded-full border border-border text-xs font-semibold hover:bg-cream transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAcceptance}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-full bg-forest text-white hover:bg-forest-dark text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? "Commissioning..." : "Confirm & Commission"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {confirmedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-forest/15 text-forest flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="font-display text-2xl font-bold text-ink">
              Quotation Accepted!
            </h3>
            <p className="text-xs text-ink-soft mt-2 leading-relaxed">
              Congratulations! {selectedQuoteForConfirm?.creator?.name} has been notified and will begin production of your custom piece. A tracked order has been added to your Orders dashboard.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setConfirmedSuccess(false);
                  setSelectedQuoteForConfirm(null);
                  if (onClose) onClose();
                }}
                className="w-full py-3 rounded-full bg-ink text-cream hover:bg-amber-dark text-xs font-semibold shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
