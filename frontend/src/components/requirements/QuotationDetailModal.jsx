// src/components/requirements/QuotationDetailModal.jsx

import {
  X,
  Star,
  Clock,
  Truck,
  Check,
  ShieldCheck,
  Printer,
  Calendar,
  Layers,
  FileText,
  BadgeCheck,
} from "lucide-react";

export default function QuotationDetailModal({
  quotation,
  requirement,
  onClose,
  onSelect,
}) {
  if (!quotation) return null;

  const {
    creator = {},
    price = 0,
    deliveryCharge = 0,
    totalPrice = price + deliveryCharge,
    productionTime = "5 Days",
    estimatedCompletionDate,
    materials = "",
    description = "",
    terms = "",
    proposedDesign = "",
    status = "Pending",
  } = quotation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cream hover:bg-cream-dark flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Header / Brand */}
        <div className="flex items-start justify-between border-b border-border pb-5 pr-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-dark bg-amber/10 px-2.5 py-1 rounded-lg">
                Official Quotation Slip
              </span>
              <span className="text-xs font-mono text-ink-muted">
                #{quotation.quoteNumber || quotation.id}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mt-2">
              Quotation for {requirement?.title || "Custom Order"}
            </h3>
            <p className="text-xs text-ink-soft mt-0.5">
              Requirement Ref: #{requirement?.id || quotation.requirementId}
            </p>
          </div>
        </div>

        {/* Creator Info Card */}
        <div className="bg-cream/50 border border-border rounded-2xl p-4 my-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={creator.avatar || "https://i.pravatar.cc/150?img=32"}
              alt={creator.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-lg font-bold text-ink">
                  {creator.name}
                </h4>
                <BadgeCheck size={16} className="text-amber-dark" />
              </div>
              <p className="text-xs text-ink-soft">
                {creator.studioName || creator.specialty} • {creator.location}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber/15 text-amber-dark text-xs font-bold">
                  <Star size={11} className="fill-amber text-amber" />
                  {creator.rating} Rating
                </span>
                <span className="text-xs text-ink-muted">
                  ({creator.reviewsCount || 40}+ verified custom orders)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body: Itemized Details & Specs */}
        <div className="space-y-4 text-xs">
          {/* Proposal Description */}
          <div>
            <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-1">
              Artisan Proposal & Technique:
            </h5>
            <p className="p-3 rounded-xl bg-cream/30 border border-border/60 text-ink leading-relaxed text-xs">
              {description}
            </p>
          </div>

          {/* Proposed Design & Materials */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-1">
                Materials Used:
              </h5>
              <div className="p-3 rounded-xl bg-cream/30 border border-border/60 text-ink">
                {materials}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-1">
                Proposed Design Concept:
              </h5>
              <div className="p-3 rounded-xl bg-cream/30 border border-border/60 text-ink">
                {proposedDesign || "Crafted to custom customer dimensions and specs."}
              </div>
            </div>
          </div>

          {/* Timeline & Delivery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-cream/30 border border-border/60">
              <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                Production Time
              </span>
              <span className="font-bold text-ink text-sm mt-0.5 block">
                {productionTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cream/30 border border-border/60">
              <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                Est. Completion
              </span>
              <span className="font-bold text-ink text-sm mt-0.5 block">
                {estimatedCompletionDate || "5-7 Days"}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-cream/30 border border-border/60">
              <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                Delivery To
              </span>
              <span className="font-bold text-ink text-sm mt-0.5 block truncate">
                {requirement?.deliveryLocation || "Ongole"}
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          {terms && (
            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-1">
                Terms & Conditions:
              </h5>
              <p className="p-3 rounded-xl bg-cream/30 border border-border/60 text-ink-soft leading-relaxed">
                {terms}
              </p>
            </div>
          )}

          {/* Price Breakdown Table */}
          <div className="border border-border rounded-xl overflow-hidden mt-4">
            <div className="bg-cream/60 px-4 py-2.5 font-bold text-ink text-xs uppercase tracking-wider">
              Cost Breakdown
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-soft">Artisan Handcraft Fee:</span>
                <span className="font-medium text-ink">
                  ₹{Number(price).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Protective Packing & Insured Shipping:</span>
                <span className="font-medium text-ink">
                  ₹{deliveryCharge}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                <span className="text-ink">Grand Total:</span>
                <span className="font-display text-base text-amber-dark">
                  ₹{Number(totalPrice).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border bg-white text-ink text-xs font-semibold hover:bg-cream transition-colors"
          >
            <Printer size={14} />
            Print Quotation
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border bg-white text-ink text-xs font-semibold hover:bg-cream transition-colors"
            >
              Close
            </button>

            {status !== "Accepted" && onSelect && (
              <button
                type="button"
                onClick={() => {
                  onSelect(quotation);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-forest text-white text-xs font-semibold shadow-md hover:bg-forest-dark transition-all"
              >
                <Check size={14} />
                Select & Commission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
