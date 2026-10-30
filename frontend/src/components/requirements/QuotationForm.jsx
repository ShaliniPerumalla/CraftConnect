// src/components/requirements/QuotationForm.jsx

import { useState } from "react";
import {
  Send,
  Calendar,
  IndianRupee,
  Clock,
  Truck,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Wand2,
} from "lucide-react";

export default function QuotationForm({
  requirement,
  onSubmitQuotation,
  onCancel,
  currentCreator = {
    id: "c1",
    name: "Maren Holt",
    studioName: "Holt Artisan Woodcraft",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 4.9,
    reviewsCount: 52,
    location: "Hyderabad, Telangana",
    specialty: "Custom Wood & Resin Artisan",
  },
}) {
  const [formData, setFormData] = useState({
    price: 1250,
    productionTime: "5 days",
    estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    materials: "Epoxy Resin + Wood",
    deliveryCharge: 100,
    description:
      "I can create the requested design with premium high-gloss epoxy resin, polished teak wood backing, and embedded dried floral accents.",
    terms:
      "50% platform escrow payment upon confirmation. 2 design drafts submitted prior to casting. Crate packaging with insurance.",
    proposedDesign:
      "Chamfered teak base with crystal-clear resin cast, gold leaf calligraphy, and warm micro-LED backlight.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadExample = () => {
    setFormData({
      price: 1250,
      productionTime: "5 days",
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      materials: "Epoxy Resin + Wood",
      deliveryCharge: 100,
      description:
        "I can create the requested design with precision craftsmanship, crystal clarity UV-proof resin, and hand-rubbed oil wood finish.",
      terms:
        "50% advance via platform escrow. 2 revisions included. Safe delivery to Ongole with live tracking.",
      proposedDesign:
        "Live-edge wooden slab layered with clear marine-grade epoxy and custom 3D acrylic name inscription.",
    });
  };

  const totalPrice =
    (Number(formData.price) || 0) + (Number(formData.deliveryCharge) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg("Please enter a valid quotation price.");
      return;
    }

    if (!formData.materials.trim()) {
      setErrorMsg("Please list the materials you will use.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMsg("Please provide a description / message for the customer.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmitQuotation) {
        onSubmitQuotation({
          requirementId: requirement?.id || "REQ001",
          ...formData,
          price: Number(formData.price),
          deliveryCharge: Number(formData.deliveryCharge) || 0,
          totalPrice,
          creator: currentCreator,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send quotation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Top Banner referencing the requirement */}
      <div className="bg-cream/60 border border-border rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-dark block">
            Submitting Quotation For Requirement
          </span>
          <h3 className="font-display text-xl font-bold text-ink mt-0.5">
            #{requirement?.id || "REQ001"} — {requirement?.title || "Custom Resin Name Plate"}
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Client Budget: ₹
            {requirement?.budgetMin && requirement?.budgetMax
              ? `${requirement.budgetMin.toLocaleString("en-IN")}–₹${requirement.budgetMax.toLocaleString("en-IN")}`
              : Number(requirement?.budget || 1500).toLocaleString("en-IN")}
            {" • "}
            Location: {requirement?.deliveryLocation || "Ongole, Andhra Pradesh"}
          </p>
        </div>

        <button
          type="button"
          onClick={loadExample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border text-ink-soft hover:text-amber-dark text-xs font-medium transition-colors shadow-2xs self-start"
          title="Autofill standard quote"
        >
          <Wand2 size={12} className="text-amber-dark" />
          Load Demo Quote
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose/10 border border-rose/30 text-rose text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Quotation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price */}
          <div>
            <label
              htmlFor="quote-price"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Price (₹) <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-semibold text-sm">
                ₹
              </span>
              <input
                id="quote-price"
                type="number"
                name="price"
                min="100"
                step="50"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="1250"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-border bg-white text-ink font-semibold focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-ink-muted mt-1">Base artisan craft fee</p>
          </div>

          {/* Delivery charge */}
          <div>
            <label
              htmlFor="quote-delivery"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Delivery Charge (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-semibold text-sm">
                ₹
              </span>
              <input
                id="quote-delivery"
                type="number"
                name="deliveryCharge"
                min="0"
                step="10"
                value={formData.deliveryCharge}
                onChange={handleChange}
                placeholder="100"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-ink-muted mt-1">Shipping & packing</p>
          </div>

          {/* Production Time */}
          <div>
            <label
              htmlFor="quote-production-time"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Production Time <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <input
                id="quote-production-time"
                type="text"
                name="productionTime"
                required
                value={formData.productionTime}
                onChange={handleChange}
                placeholder="5 days"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-ink-muted mt-1">e.g. 5 days / 1 week</p>
          </div>

          {/* Estimated Completion Date */}
          <div>
            <label
              htmlFor="quote-completion-date"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Estimated Completion
            </label>
            <input
              id="quote-completion-date"
              type="date"
              name="estimatedCompletionDate"
              value={formData.estimatedCompletionDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs"
            />
            <p className="text-[11px] text-ink-muted mt-1">Ready for dispatch</p>
          </div>
        </div>

        {/* Materials */}
        <div>
          <label
            htmlFor="quote-materials"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Materials <span className="text-amber-dark">*</span>
          </label>
          <input
            id="quote-materials"
            type="text"
            name="materials"
            required
            value={formData.materials}
            onChange={handleChange}
            placeholder="Epoxy Resin + Wood"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs"
          />
          <p className="text-xs text-ink-muted mt-1">
            Specify wood species, resin grade, metals, pigments, or special finishes.
          </p>
        </div>

        {/* Description / Message */}
        <div>
          <label
            htmlFor="quote-description"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Description / Message <span className="text-amber-dark">*</span>
          </label>
          <textarea
            id="quote-description"
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="I can create the requested design..."
            className="w-full p-3.5 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs resize-y"
          />
        </div>

        {/* Proposed Design & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="quote-proposed-design"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Proposed Design Notes
            </label>
            <textarea
              id="quote-proposed-design"
              name="proposedDesign"
              rows="2"
              value={formData.proposedDesign}
              onChange={handleChange}
              placeholder="e.g. Hexagonal live-edge wood board with floating gold foil leaf..."
              className="w-full p-3 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="quote-terms"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Terms & Conditions
            </label>
            <textarea
              id="quote-terms"
              name="terms"
              rows="2"
              value={formData.terms}
              onChange={handleChange}
              placeholder="e.g. 50% escrow advance, 2 revisions included, insured transit..."
              className="w-full p-3 rounded-xl border border-border bg-white text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none text-sm shadow-2xs resize-y"
            />
          </div>
        </div>

        {/* Total Price Banner & Actions */}
        <div className="pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-ink-soft">Total Quoted Amount:</span>
            <span className="font-display text-2xl font-bold text-ink">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-ink-muted">
              (₹{formData.price || 0} craft + ₹{formData.deliveryCharge || 0} delivery)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-border bg-white text-ink text-xs font-semibold hover:bg-cream transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              id="submit-quotation-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-amber-dark text-white hover:bg-ink text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={14} />
              {isSubmitting ? "Sending..." : "Send Quotation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
