// src/components/requirements/QuotationComparison.jsx

import { useState } from "react";
import {
  Star,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Eye,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Layers,
  Award,
  Zap,
  Check,
  X,
  FileText,
} from "lucide-react";
import QuotationCard from "./QuotationCard";

export default function QuotationComparison({
  requirement,
  quotations = [],
  onSelectQuotation,
  onViewQuotation,
  onBack,
}) {
  const [selectedQuoteId, setSelectedQuoteId] = useState(
    requirement?.selectedQuotationId || null
  );
  const [activeModalQuote, setActiveModalQuote] = useState(null);
  const [acceptanceSuccess, setAcceptanceSuccess] = useState(false);

  // If no quotations are passed, fallback to requirement.quotations
  const quotesList = quotations.length > 0 ? quotations : requirement?.quotations || [];

  // Determine highlights (Lowest Price, Fastest, Highest Rating)
  let lowestPriceQuoteId = null;
  let fastestQuoteId = null;
  let highestRatingQuoteId = null;

  if (quotesList.length > 0) {
    let minPrice = Infinity;
    let minDays = Infinity;
    let maxRating = -1;

    quotesList.forEach((q) => {
      const price = q.totalPrice || q.price;
      if (price < minPrice) {
        minPrice = price;
        lowestPriceQuoteId = q.id;
      }
      if (q.productionDays < minDays) {
        minDays = q.productionDays;
        fastestQuoteId = q.id;
      }
      if (q.creatorRating > maxRating) {
        maxRating = q.creatorRating;
        highestRatingQuoteId = q.id;
      }
    });
  }

  const handleSelect = (quote) => {
    setSelectedQuoteId(quote.id);
    setAcceptanceSuccess(true);
    if (onSelectQuotation) {
      onSelectQuotation(quote, requirement);
    }
  };

  const handleView = (quote) => {
    setActiveModalQuote(quote);
    if (onViewQuotation) {
      onViewQuotation(quote);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Navigation & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-amber-dark mb-3 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to My Requirements</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-cream border border-border text-ink-soft">
              {requirement?.id || "#REQ"}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest/10 text-forest font-semibold">
              {quotesList.length} Quotations Received
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold mt-2">
            Quotation Comparison: {requirement?.title || "Custom Order"}
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Compare prices, delivery timelines, maker ratings, and proposed materials before selecting your artisan.
          </p>
        </div>

        {/* Target budget & location summary */}
        {requirement && (
          <div className="px-4 py-3 rounded-2xl bg-cream/50 border border-border text-xs text-ink-soft space-y-1 self-start">
            <p>
              <span className="text-ink-muted">Your Budget:</span>{" "}
              <strong className="text-ink font-semibold">{requirement.budget}</strong>
            </p>
            <p>
              <span className="text-ink-muted">Required by:</span>{" "}
              <strong className="text-ink font-semibold">
                {requirement.requiredDate || "Flexible"}
              </strong>
            </p>
            <p>
              <span className="text-ink-muted">Delivery:</span>{" "}
              <strong className="text-ink font-semibold">
                {requirement.deliveryLocation || requirement.location}
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Success Notification if accepted */}
      {acceptanceSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-forest/10 border border-forest/30 flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-forest">
                Quotation Accepted & Commission Confirmed!
              </h4>
              <p className="text-xs text-ink-soft mt-0.5">
                The creator has been notified to commence the design preparation. You can track progress in your custom orders.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAcceptanceSuccess(false)}
            className="text-xs text-forest hover:text-forest-dark font-medium underline underline-offset-2 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty State */}
      {quotesList.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-border rounded-[2rem] shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber/10 text-amber-dark flex items-center justify-center mb-4">
            <Clock size={28} />
          </div>
          <h3 className="font-display text-xl font-semibold text-ink">
            Waiting for Quotations
          </h3>
          <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto mt-2 leading-relaxed">
            Makers in your area are currently reviewing your custom requirements. You will receive notifications as soon as bids arrive!
          </p>
        </div>
      ) : (
        /* ================= SIDE-BY-SIDE COMPARISON MATRIX ================= */
        <div className="space-y-6">
          {/* Quick Highlighting Banner */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[680px] bg-white border border-border rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                {/* Table Header: Quotation 1, 2, 3 */}
                <thead>
                  <tr className="border-b border-border bg-cream/40">
                    <th className="p-4 sm:p-5 w-48 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Comparison Metric
                    </th>
                    {quotesList.map((q, idx) => {
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <th
                          key={q.id}
                          className={`p-4 sm:p-5 text-center transition-all ${
                            isSelected ? "bg-forest/10 border-x-2 border-forest" : ""
                          }`}
                        >
                          <div className="space-y-1.5">
                            <span className="inline-block text-xs font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-white border border-border text-ink">
                              Quotation {idx + 1}
                            </span>
                            <p className="text-xs font-semibold text-ink truncate">
                              {q.creatorName}
                            </p>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest uppercase tracking-wider">
                                <Check size={11} /> Selected
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {/* Row 1: PRICE */}
                  <tr className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                      <IndianRupee size={15} className="text-amber-dark shrink-0" />
                      <span>Total Price</span>
                    </td>
                    {quotesList.map((q) => {
                      const isLowest = q.id === lowestPriceQuoteId;
                      const isSelected = selectedQuoteId === q.id;
                      const total = q.totalPrice || q.price + (q.deliveryCharge || 0);
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center ${
                            isSelected ? "bg-forest/5 border-x-2 border-forest" : ""
                          }`}
                        >
                          <div className="font-display text-xl sm:text-2xl font-bold text-ink">
                            ₹{total.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">
                            {q.deliveryCharge === 0 ? "Free Delivery" : `+ ₹${q.deliveryCharge} delivery`}
                          </div>
                          {isLowest && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest/15 text-forest">
                              <Sparkles size={10} /> Best Price
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: PRODUCTION TIME */}
                  <tr className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                      <Clock size={15} className="text-amber-dark shrink-0" />
                      <span>Production Time</span>
                    </td>
                    {quotesList.map((q) => {
                      const isFastest = q.id === fastestQuoteId;
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center ${
                            isSelected ? "bg-forest/5 border-x-2 border-forest" : ""
                          }`}
                        >
                          <div className="font-display text-lg font-bold text-ink">
                            {q.productionDays} Days
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">
                            Estimated completion
                          </div>
                          {isFastest && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber/15 text-amber-dark">
                              <Zap size={10} /> Fastest Delivery
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: CREATOR RATING */}
                  <tr className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                      <Star size={15} className="text-amber-dark shrink-0" />
                      <span>Creator Rating</span>
                    </td>
                    {quotesList.map((q) => {
                      const isHighest = q.id === highestRatingQuoteId;
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center ${
                            isSelected ? "bg-forest/5 border-x-2 border-forest" : ""
                          }`}
                        >
                          <div className="inline-flex items-center gap-1 font-bold text-amber-dark text-base">
                            <Star size={15} className="fill-amber-dark text-amber-dark" />
                            <span>⭐ {q.creatorRating || 4.8}</span>
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">
                            {q.creatorReviewsCount || 35} reviews
                          </div>
                          {isHighest && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber/15 text-amber-dark">
                              <Award size={10} /> Top Rated
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 4: MATERIALS */}
                  <tr className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                      <Layers size={15} className="text-amber-dark shrink-0" />
                      <span>Materials</span>
                    </td>
                    {quotesList.map((q) => {
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center ${
                            isSelected ? "bg-forest/5 border-x-2 border-forest" : ""
                          }`}
                        >
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-cream/70 border border-border text-ink font-medium text-xs">
                            {q.materials || "Premium Custom Materials"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 5: TERMS & REVISIONS */}
                  <tr className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                      <ShieldCheck size={15} className="text-amber-dark shrink-0" />
                      <span>Terms & Revisions</span>
                    </td>
                    {quotesList.map((q) => {
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center text-xs text-ink-soft leading-relaxed ${
                            isSelected ? "bg-forest/5 border-x-2 border-forest" : ""
                          }`}
                        >
                          {q.terms || "Standard artisan guarantee, 1 revision included."}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 6: ACTION BUTTONS [View] and [Select] */}
                  <tr className="bg-cream/30">
                    <td className="p-4 sm:p-5 font-semibold text-ink">
                      Decision Action
                    </td>
                    {quotesList.map((q) => {
                      const isSelected = selectedQuoteId === q.id;
                      return (
                        <td
                          key={q.id}
                          className={`p-4 sm:p-5 text-center space-y-2 ${
                            isSelected ? "bg-forest/10 border-x-2 border-forest" : ""
                          }`}
                        >
                          {/* [View] button */}
                          <button
                            type="button"
                            onClick={() => handleView(q)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-ink text-xs font-semibold hover:border-amber hover:text-amber-dark transition-all"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          {/* [Select] button */}
                          <button
                            type="button"
                            onClick={() => handleSelect(q)}
                            className={`
                              w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs
                              ${
                                isSelected
                                  ? "bg-forest text-white cursor-default"
                                  : "bg-ink text-cream hover:bg-forest hover:shadow-md"
                              }
                            `}
                          >
                            <CheckCircle2 size={14} />
                            <span>{isSelected ? "Selected" : "Select Quote"}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards Section for Detailed View */}
          <div className="pt-4">
            <h3 className="font-display text-xl font-semibold text-ink mb-4">
              Detailed Quotation Cards
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotesList.map((quote, idx) => (
                <QuotationCard
                  key={quote.id}
                  quotation={quote}
                  rank={`Quotation ${idx + 1}`}
                  isSelected={selectedQuoteId === quote.id}
                  onSelect={handleSelect}
                  onView={handleView}
                  isCustomer={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Quotation Detail Modal */}
      {activeModalQuote && (
        <div
          onClick={() => setActiveModalQuote(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border my-8"
          >
            <button
              type="button"
              onClick={() => setActiveModalQuote(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-cream transition-colors"
            >
              <X size={18} />
            </button>

            {/* Creator Header */}
            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-border">
              <img
                src={activeModalQuote.creatorAvatar}
                alt={activeModalQuote.creatorName}
                className="w-14 h-14 rounded-full object-cover border border-border"
              />
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {activeModalQuote.creatorName}
                </h3>
                <p className="text-xs text-ink-soft">
                  {activeModalQuote.creatorStudio} • {activeModalQuote.creatorLocation}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-bold text-amber-dark flex items-center gap-1">
                    <Star size={13} className="fill-amber-dark text-amber-dark" />
                    {activeModalQuote.creatorRating}
                  </span>
                  <span className="text-ink-muted">
                    ({activeModalQuote.creatorReviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Turnaround Specs */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream/50 border border-border mb-5 text-center">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-muted">
                  Total Quoted Price
                </p>
                <p className="font-display text-2xl font-bold text-ink mt-0.5">
                  ₹{(activeModalQuote.totalPrice || activeModalQuote.price).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-ink-muted">
                  Base: ₹{activeModalQuote.price} + Delivery: ₹{activeModalQuote.deliveryCharge || 0}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-muted">
                  Production Time
                </p>
                <p className="font-display text-2xl font-bold text-amber-dark mt-0.5">
                  {activeModalQuote.productionDays} Days
                </p>
                <p className="text-[10px] text-ink-muted">
                  Delivery by {activeModalQuote.estimatedCompletionDate || "Scheduled Date"}
                </p>
              </div>
            </div>

            {/* Pitch Message */}
            <div className="space-y-4 mb-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-semibold text-ink mb-1">Artisan's Message:</h4>
                <p className="text-ink-soft bg-cream/20 p-3 rounded-xl border border-border/60 leading-relaxed italic">
                  "{activeModalQuote.message}"
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-ink mb-1">Materials Used:</h4>
                <p className="text-ink-soft">{activeModalQuote.materials}</p>
              </div>

              <div>
                <h4 className="font-semibold text-ink mb-1">Terms & Revisions:</h4>
                <p className="text-ink-soft">{activeModalQuote.terms}</p>
              </div>

              {activeModalQuote.proposedImages?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-ink mb-1.5">Proposed Design References:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeModalQuote.proposedImages.map((img, i) => (
                      <img
                        key={i}
                        src={typeof img === "string" ? img : img.url}
                        alt="Proposed reference"
                        className="w-full h-28 object-cover rounded-xl border border-border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveModalQuote(null)}
                className="px-5 py-2.5 rounded-full border border-border bg-white text-ink text-xs font-semibold hover:bg-cream"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelect(activeModalQuote);
                  setActiveModalQuote(null);
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark shadow-xs"
              >
                <CheckCircle2 size={14} />
                <span>Accept This Quotation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
