// src/components/requirements/QuotationForm.jsx

import { useState } from "react";
import {
  Send,
  Calendar,
  Clock,
  IndianRupee,
  Layers,
  Truck,
  FileText,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";
import FileUpload from "./FileUpload";

const SAMPLE_CREATORS = [
  {
    id: "creator-aarav",
    name: "Aarav Sharma",
    studio: "Vedic Resin & Craft Studio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewsCount: 64,
    location: "Hyderabad, India",
    badge: "Master Artisan",
  },
  {
    id: "creator-priya",
    name: "Priya Nair",
    studio: "Nair Handmade Clay & Resin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviewsCount: 42,
    location: "Bangalore, India",
    badge: "Verified Maker",
  },
  {
    id: "creator-maren",
    name: "Maren Holt",
    studio: "Heritage Wood & Resin Works",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewsCount: 88,
    location: "Chennai, India",
    badge: "Top Rated Maker",
  },
];

export default function QuotationForm({
  requirement,
  onSubmit,
  onCancel,
}) {
  const [selectedCreator, setSelectedCreator] = useState(SAMPLE_CREATORS[0]);

  const [formData, setFormData] = useState({
    price: "1250",
    productionDays: "5",
    materials: "Epoxy Resin + Wood",
    deliveryCharge: "100",
    message: "I can create the requested design using high-clarity non-yellowing epoxy resin, premium natural seasoned teak wood, and hand-painted metallic gold accents.",
    terms: "50% advance to commence, 1 digital design preview included before casting, bubble-wrapped insured delivery.",
    estimatedCompletionDate: "",
  });

  const [proposedDesignImages, setProposedDesignImages] = useState([
    {
      id: "quote-prop-1",
      name: "Concept Resin Finish Sample",
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      isPreset: true,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const basePriceNum = parseInt(formData.price || "0", 10) || 0;
  const deliveryNum = parseInt(formData.deliveryCharge || "0", 10) || 0;
  const totalAmount = basePriceNum + deliveryNum;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.price || basePriceNum <= 0) {
      newErrors.price = "Please specify a valid price.";
    }
    if (!formData.productionDays || parseInt(formData.productionDays, 10) <= 0) {
      newErrors.productionDays = "Please enter estimated production time.";
    }
    if (!formData.materials.trim()) {
      newErrors.materials = "Please specify the materials to be used.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please include a personalized message or pitch.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const calculatedCompletion = new Date();
    calculatedCompletion.setDate(
      calculatedCompletion.getDate() + parseInt(formData.productionDays, 10)
    );

    const quotePayload = {
      id: `QUO-${Date.now().toString().slice(-4)}`,
      requirementId: requirement?.id,
      creatorId: selectedCreator.id,
      creatorName: selectedCreator.name,
      creatorStudio: selectedCreator.studio,
      creatorAvatar: selectedCreator.avatar,
      creatorRating: selectedCreator.rating,
      creatorReviewsCount: selectedCreator.reviewsCount,
      creatorLocation: selectedCreator.location,
      creatorBadge: selectedCreator.badge,
      price: basePriceNum,
      deliveryCharge: deliveryNum,
      totalPrice: totalAmount,
      productionDays: parseInt(formData.productionDays, 10),
      estimatedCompletionDate: calculatedCompletion.toISOString().split("T")[0],
      materials: formData.materials,
      message: formData.message,
      terms: formData.terms,
      proposedImages: proposedDesignImages,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setSubmitting(false);
      if (onSubmit) {
        onSubmit(quotePayload);
      }
    }, 450);
  };

  return (
    <div className="bg-white border border-border rounded-[2rem] p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.08)] relative overflow-hidden">
      {/* Decorative accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber via-forest to-amber-dark" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>MakerMatch Quotation Proposal</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Send Quotation
          </h2>
          {requirement && (
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              For requirement:{" "}
              <strong className="text-ink font-semibold">
                {requirement.id} – {requirement.title}
              </strong>{" "}
              (Target Budget: {requirement.budget || `₹${requirement.budgetValue}`})
            </p>
          )}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start sm:self-center p-2 rounded-full text-ink-soft hover:text-ink hover:bg-cream transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Creator Identity Selector */}
        <div className="p-4 rounded-2xl bg-cream/40 border border-border">
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-2">
            Send as Creator Profile:
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {SAMPLE_CREATORS.map((cr) => {
              const isSelected = selectedCreator.id === cr.id;
              return (
                <button
                  key={cr.id}
                  type="button"
                  onClick={() => setSelectedCreator(cr)}
                  className={`
                    p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                    ${
                      isSelected
                        ? "bg-white border-amber ring-2 ring-amber/20 shadow-xs"
                        : "bg-white/60 border-border hover:border-amber/50"
                    }
                  `}
                >
                  <img
                    src={cr.avatar}
                    alt={cr.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate">{cr.name}</p>
                    <p className="text-[11px] text-ink-muted truncate">{cr.studio}</p>
                    <p className="text-[11px] text-amber-dark font-medium mt-0.5">
                      ⭐ {cr.rating} ({cr.reviewsCount})
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Price and Delivery Charge */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quote-price" className="block text-sm font-medium text-ink">
                Price (₹) <span className="text-amber-dark">*</span>
              </label>
              <span className="text-xs text-ink-muted">Crafting & Materials</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
                <IndianRupee size={16} className="text-amber-dark" />
              </div>
              <input
                id="quote-price"
                name="price"
                type="number"
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="1250"
                className={`
                  w-full pl-9 pr-4 py-3 rounded-xl border bg-cream/30 text-ink font-medium
                  outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                  ${errors.price ? "border-rose" : "border-border"}
                `}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-rose mt-1 font-medium">{errors.price}</p>
            )}
          </div>

          {/* Delivery charge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quote-delivery" className="block text-sm font-medium text-ink">
                Delivery Charge (₹)
              </label>
              <span className="text-xs text-ink-muted">Enter 0 for Free Delivery</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
                <Truck size={16} className="text-forest" />
              </div>
              <input
                id="quote-delivery"
                name="deliveryCharge"
                type="number"
                min="0"
                value={formData.deliveryCharge}
                onChange={handleChange}
                placeholder="100"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-cream/30 text-ink font-medium outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2-Column: Production Time & Materials */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Production Time / Estimated completion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quote-production" className="block text-sm font-medium text-ink">
                Production Time <span className="text-amber-dark">*</span>
              </label>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Clock size={12} />
                Days to craft
              </span>
            </div>
            <div className="relative">
              <input
                id="quote-production"
                name="productionDays"
                type="number"
                min="1"
                max="90"
                value={formData.productionDays}
                onChange={handleChange}
                placeholder="5"
                className={`
                  w-full px-4 py-3 rounded-xl border bg-cream/30 text-ink font-medium
                  outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                  ${errors.productionDays ? "border-rose" : "border-border"}
                `}
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-ink-muted pointer-events-none">
                Days
              </span>
            </div>
            {errors.productionDays && (
              <p className="text-xs text-rose mt-1 font-medium">{errors.productionDays}</p>
            )}
          </div>

          {/* Materials */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quote-materials" className="block text-sm font-medium text-ink">
                Materials <span className="text-amber-dark">*</span>
              </label>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Layers size={12} />
                e.g. Epoxy Resin + Wood
              </span>
            </div>
            <input
              id="quote-materials"
              name="materials"
              type="text"
              value={formData.materials}
              onChange={handleChange}
              placeholder="Epoxy Resin + Wood"
              className={`
                w-full px-4 py-3 rounded-xl border bg-cream/30 text-ink font-medium
                outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                ${errors.materials ? "border-rose" : "border-border"}
              `}
            />
            {errors.materials && (
              <p className="text-xs text-rose mt-1 font-medium">{errors.materials}</p>
            )}
          </div>
        </div>

        {/* Message / Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="quote-message" className="block text-sm font-medium text-ink">
              Message / Pitch to Customer <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted">Explain your craftsmanship approach</span>
          </div>
          <textarea
            id="quote-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="I can create the requested design using high clarity resin and solid teak..."
            className={`
              w-full px-4 py-3 rounded-xl border bg-cream/30 text-ink leading-relaxed
              outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all resize-none
              ${errors.message ? "border-rose" : "border-border"}
            `}
          />
          {errors.message && (
            <p className="text-xs text-rose mt-1 font-medium">{errors.message}</p>
          )}
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="quote-terms" className="block text-sm font-medium text-ink">
              Terms & Conditions
            </label>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <ShieldCheck size={12} />
              Revisions & deposit policy
            </span>
          </div>
          <input
            id="quote-terms"
            name="terms"
            type="text"
            value={formData.terms}
            onChange={handleChange}
            placeholder="50% advance, 1 revision included, safe packaging"
            className="w-full px-4 py-3 rounded-xl border border-border bg-cream/30 text-ink font-medium outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all"
          />
        </div>

        {/* Proposed Design / Visual Reference Upload */}
        <div className="p-4 rounded-2xl bg-cream/20 border border-border/80">
          <FileUpload
            files={proposedDesignImages}
            onFilesChange={setProposedDesignImages}
            label="Proposed Design Sketches or References"
            description="Attach concept artwork, mockup renders, or photos of similar items you've crafted."
          />
        </div>

        {/* Live Calculation Summary Banner */}
        <div className="rounded-2xl bg-cream p-5 border border-amber/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase font-semibold tracking-wider text-amber-dark">
              Quotation Summary
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span>Base: ₹{basePriceNum.toLocaleString("en-IN")}</span>
              <span>+</span>
              <span>Delivery: ₹{deliveryNum.toLocaleString("en-IN")}</span>
              <span>•</span>
              <span>Time: {formData.productionDays || "0"} Days</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink-muted block">Customer Total:</span>
            <span className="text-2xl font-bold font-display text-ink">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-border">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-border bg-white text-ink font-medium text-sm hover:bg-cream transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="
              w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5
              rounded-full bg-ink text-cream text-sm font-medium shadow-md
              hover:bg-amber-dark hover:-translate-y-0.5 hover:shadow-lg transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                <span>Sending Quotation...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Send Quotation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
