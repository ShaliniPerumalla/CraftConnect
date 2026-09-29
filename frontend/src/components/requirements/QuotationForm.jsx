// src/components/requirements/QuotationForm.jsx

import { useState } from "react";
import { X, Send, IndianRupee, Clock, Package, Truck, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { useRequirements } from "../../context/RequirementsContext";

export default function QuotationForm({
  requirement,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { submitQuotation } = useRequirements();

  const [formData, setFormData] = useState({
    price: "1250",
    productionDays: "5",
    materials: "Epoxy Resin + Wood",
    deliveryCharge: "100",
    terms: "Includes 2 revisions; 50% advance before cutting; safe padded shipping.",
    proposedDesign:
      "Handcrafted ocean-wave swirl epoxy resin over seasoned teakwood base with precision laser-cut brass accents.",
    message: "I can create the requested design with premium high-clarity resin and teak wood.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !requirement) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = submitQuotation(requirement.id, {
        ...formData,
        creatorId: "c1",
        creatorName: "Maren Holt",
        creatorAvatar: "https://i.pravatar.cc/150?img=32",
        creatorSpecialty: "Resin & Woodcraft Artisan",
        creatorRating: 4.9,
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        if (onSuccess) onSuccess(created);
        onClose();
        setSubmitted(false);
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-border rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cream border border-border flex items-center justify-center text-ink-soft hover:text-ink hover:border-amber transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-forest/15 text-forest flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-display text-2xl text-ink">
              Quotation Sent Successfully!
            </h3>
            <p className="text-sm text-ink-soft mt-2">
              Your quotation of ₹{Number(formData.price).toLocaleString("en-IN")} has been sent to the customer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-dark" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-dark">
                  Creator Quotation
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-ink mt-1">
                Send Quotation
              </h2>

              <div className="bg-cream/60 border border-border rounded-xl p-3 mt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-ink-soft">Responding to: </span>
                  <span className="font-bold text-ink">#{requirement.id} - {requirement.title}</span>
                </div>
                <div className="text-amber-dark font-semibold">
                  Budget: ₹{Number(requirement.budget).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Price & Production Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Price (₹) <span className="text-rose">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-ink-soft">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="1250"
                    className="w-full pl-8 pr-3 py-3 rounded-xl border border-border bg-cream/50 text-sm font-semibold text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Production Time (Days) <span className="text-rose">*</span>
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="number"
                    name="productionDays"
                    value={formData.productionDays}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="5"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-cream/50 text-sm font-semibold text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
                  />
                </div>
              </div>
            </div>

            {/* Materials & Delivery Charge */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Materials <span className="text-rose">*</span>
                </label>
                <div className="relative">
                  <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="text"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    required
                    placeholder="Epoxy Resin + Wood"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-cream/50 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  Delivery Charge (₹)
                </label>
                <div className="relative">
                  <Truck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="number"
                    name="deliveryCharge"
                    value={formData.deliveryCharge}
                    onChange={handleChange}
                    min="0"
                    placeholder="100"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-cream/50 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
                  />
                </div>
              </div>
            </div>

            {/* Message / Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Message / Description <span className="text-rose">*</span>
              </label>
              <textarea
                name="message"
                rows={2}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="I can create the requested design..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 resize-none"
              />
            </div>

            {/* Proposed Design */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Proposed Design Details
              </label>
              <input
                type="text"
                name="proposedDesign"
                value={formData.proposedDesign}
                onChange={handleChange}
                placeholder="Handcrafted epoxy swirl over solid wood..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Terms & Conditions
              </label>
              <input
                type="text"
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                placeholder="Includes 2 revisions; 50% advance..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/10"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-border text-xs font-medium text-ink hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-2.5
                  rounded-full
                  bg-ink
                  text-cream
                  text-xs
                  font-medium
                  hover:bg-amber-dark
                  transition-all
                  shadow-md
                  disabled:opacity-60
                  cursor-pointer
                "
              >
                <Send size={14} />
                {isSubmitting ? "Sending..." : "Send Quotation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
