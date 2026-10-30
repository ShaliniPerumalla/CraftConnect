// src/components/requirements/RequirementDetailModal.jsx

import {
  X,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Sparkles,
  Send,
  User,
  CheckCircle,
} from "lucide-react";

export default function RequirementDetailModal({
  requirement,
  quotations = [],
  viewRole = "customer",
  onClose,
  onSendQuotation,
  onCompareQuotations,
}) {
  if (!requirement) return null;

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

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-2 pr-10">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cream border border-border text-ink">
            #{requirement.id}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber/10 text-amber-dark">
            {requirement.category}
          </span>
          <span className="text-xs text-ink-muted">
            Submitted {new Date(requirement.createdAt || Date.now()).toLocaleDateString("en-IN")}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-ink">
          {requirement.title}
        </h3>

        {requirement.whatDoYouWant && (
          <p className="text-sm font-medium text-amber-dark mt-1">
            "{requirement.whatDoYouWant}"
          </p>
        )}

        {/* Reference Images Gallery */}
        {requirement.images && requirement.images.length > 0 && (
          <div className="my-5">
            <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block mb-2">
              Reference / Inspiration Photos ({requirement.images.length}):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {requirement.images.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-border aspect-square bg-cream group relative"
                >
                  <img
                    src={img}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                    Ref #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Description */}
        <div className="my-4">
          <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block mb-1">
            Description & Specifications:
          </span>
          <p className="p-4 rounded-xl bg-cream/40 border border-border/70 text-xs sm:text-sm text-ink leading-relaxed">
            {requirement.description}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 text-xs">
          <div className="p-3 rounded-xl bg-cream/40 border border-border/70">
            <span className="text-ink-muted block text-[10px] uppercase font-semibold">
              Client Budget
            </span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              ₹
              {requirement.budgetMin && requirement.budgetMax
                ? `${requirement.budgetMin.toLocaleString("en-IN")}–₹${requirement.budgetMax.toLocaleString("en-IN")}`
                : Number(requirement.budget).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-cream/40 border border-border/70">
            <span className="text-ink-muted block text-[10px] uppercase font-semibold">
              Required Delivery Date
            </span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {requirement.requiredDate || "Flexible"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-cream/40 border border-border/70">
            <span className="text-ink-muted block text-[10px] uppercase font-semibold">
              Delivery Destination
            </span>
            <span className="font-bold text-ink text-sm mt-0.5 block truncate">
              {requirement.deliveryLocation || "Ongole, Andhra Pradesh"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-cream transition-colors"
          >
            Close
          </button>

          {viewRole === "creator" ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSendQuotation) onSendQuotation(requirement);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-dark text-white hover:bg-ink text-xs font-semibold shadow-md transition-all"
            >
              <Send size={14} />
              Send Quotation For This Request
            </button>
          ) : (
            quotations.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onCompareQuotations) onCompareQuotations(requirement);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ink text-cream hover:bg-amber-dark text-xs font-semibold shadow-md transition-all"
              >
                <Sparkles size={14} className="text-amber-light" />
                Compare {quotations.length} Quotation{quotations.length > 1 ? "s" : ""}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
