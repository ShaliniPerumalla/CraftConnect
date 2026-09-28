// src/components/requirements/RequirementForm.jsx

import { useState } from "react";
import {
  Send,
  Calendar,
  MapPin,
  Sparkles,
  HelpCircle,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";
import FileUpload from "./FileUpload";
import BudgetInput from "./BudgetInput";

const CATEGORIES = [
  "Resin Art",
  "Woodwork",
  "Pottery & Ceramics",
  "Jewelry",
  "Textiles & Fiber Art",
  "Wall Art & Prints",
  "Home Decor",
  "Wedding & Event Decor",
  "Candles & Bath",
  "Leather Goods",
];

export default function RequirementForm({
  onSubmit,
  onCancel,
  initialValues = null,
}) {
  const [formData, setFormData] = useState({
    category: initialValues?.category || "Resin Art",
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    budget: initialValues?.budget || "1250",
    requiredDate: initialValues?.requiredDate || "",
    deliveryLocation: initialValues?.deliveryLocation || "Ongole, Andhra Pradesh",
    specialNotes: initialValues?.specialNotes || "",
  });

  const [referenceImages, setReferenceImages] = useState(
    initialValues?.images || [
      {
        id: "default-ref-1",
        name: "Resin Ocean Waves Sample",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
        isPreset: true,
      },
    ]
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const setQuickDate = (daysAhead) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    setFormData((prev) => ({ ...prev, requiredDate: formatted }));
    if (errors.requiredDate) {
      setErrors((prev) => ({ ...prev, requiredDate: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.title.trim()) newErrors.title = "Please specify what you want made.";
    if (!formData.description.trim()) newErrors.description = "Please describe your custom requirement.";
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = "Please specify a budget.";
    if (!formData.requiredDate) newErrors.requiredDate = "Please choose a required delivery date.";
    if (!formData.deliveryLocation.trim()) newErrors.deliveryLocation = "Please enter your delivery location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const submissionPayload = {
      category: formData.category,
      title: formData.title,
      description: formData.description,
      budget: `₹${parseInt(formData.budget, 10).toLocaleString("en-IN")}`,
      budgetValue: parseInt(formData.budget, 10),
      requiredDate: formData.requiredDate,
      deliveryLocation: formData.deliveryLocation,
      location: formData.deliveryLocation,
      specialNotes: formData.specialNotes,
      images: referenceImages,
      status: "Waiting for Quotations",
      quotations: [],
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setSubmitting(false);
      if (onSubmit) {
        onSubmit(submissionPayload);
      }
    }, 400);
  };

  // Min date today for required date
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white border border-border rounded-[2rem] p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.06)] relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber via-amber-dark to-forest" />

      {/* Header */}
      <div className="pb-6 mb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={13} />
          <span>Custom Commission</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-semibold">
          Create Custom Requirement
        </h2>
        <p className="text-sm text-ink-soft mt-2 max-w-2xl leading-relaxed">
          Describe the handcrafted piece you dream of. Verified local creators will review
          your requirements and send you personalized price quotations, timelines, and designs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Product Category */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="req-category" className="block text-sm font-medium text-ink">
              Product Category <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Layers size={13} />
              Browse crafts
            </span>
          </div>
          <div className="relative">
            <select
              id="req-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`
                w-full px-4 py-3.5 rounded-xl border bg-cream/30 text-ink font-medium
                outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                ${errors.category ? "border-rose" : "border-border"}
              `}
            >
              <option value="" disabled>
                Select product category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-xs text-rose mt-1.5 font-medium">{errors.category}</p>
          )}
        </div>

        {/* What do you want? */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="req-title" className="block text-sm font-medium text-ink">
              What do you want? <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted">e.g., Custom birthday gift</span>
          </div>
          <input
            id="req-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Custom birthday gift"
            className={`
              w-full px-4 py-3.5 rounded-xl border bg-cream/30 text-ink font-medium
              outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
              placeholder:text-ink-muted/60
              ${errors.title ? "border-rose" : "border-border"}
            `}
          />
          {errors.title && (
            <p className="text-xs text-rose mt-1.5 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="req-desc" className="block text-sm font-medium text-ink">
              Description <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted">
              {formData.description.length} characters
            </span>
          </div>
          <textarea
            id="req-desc"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="I want a customized resin name plate with gold lettering, beach waves, and natural wood base for our front door..."
            className={`
              w-full px-4 py-3.5 rounded-xl border bg-cream/30 text-ink leading-relaxed
              outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all resize-none
              placeholder:text-ink-muted/60
              ${errors.description ? "border-rose" : "border-border"}
            `}
          />
          <p className="text-xs text-ink-soft mt-1.5">
            Tip: Include desired dimensions, color scheme, engraving names, or specific materials you prefer.
          </p>
          {errors.description && (
            <p className="text-xs text-rose mt-1 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Upload Reference Images */}
        <div className="p-5 rounded-2xl bg-cream/20 border border-border/80">
          <FileUpload
            files={referenceImages}
            onFilesChange={setReferenceImages}
            label="Upload Reference Images"
            description="Upload photos, sketches, or color palettes to help creators quote accurately."
            category={formData.category}
          />
        </div>

        {/* Two-column layout for Budget and Date */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Budget */}
          <div>
            <BudgetInput
              value={formData.budget}
              onChange={(newBudget) => {
                setFormData((prev) => ({ ...prev, budget: newBudget }));
                if (errors.budget) setErrors((prev) => ({ ...prev, budget: null }));
              }}
              category={formData.category}
              label="Budget"
              placeholder="1250"
            />
            {errors.budget && (
              <p className="text-xs text-rose mt-1.5 font-medium">{errors.budget}</p>
            )}
          </div>

          {/* Required Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="req-date" className="block text-sm font-medium text-ink">
                Required Date <span className="text-amber-dark">*</span>
              </label>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Calendar size={13} />
                DD/MM/YYYY
              </span>
            </div>
            <input
              id="req-date"
              name="requiredDate"
              type="date"
              min={todayStr}
              value={formData.requiredDate}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 rounded-xl border bg-white text-ink font-medium
                outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                ${errors.requiredDate ? "border-rose" : "border-border"}
              `}
            />

            {/* Quick date shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] text-ink-muted">Quick select:</span>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-white text-ink-soft hover:border-amber hover:text-amber-dark"
              >
                In 1 week
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(14)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-white text-ink-soft hover:border-amber hover:text-amber-dark"
              >
                In 2 weeks
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(30)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-white text-ink-soft hover:border-amber hover:text-amber-dark"
              >
                In 1 month
              </button>
            </div>

            {errors.requiredDate && (
              <p className="text-xs text-rose mt-1 font-medium">{errors.requiredDate}</p>
            )}
          </div>
        </div>

        {/* Delivery Location */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="req-location" className="block text-sm font-medium text-ink">
              Delivery Location <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <MapPin size={13} />
              City, State or Pin Code
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
              <MapPin size={17} className="text-amber-dark" />
            </div>
            <input
              id="req-location"
              name="deliveryLocation"
              type="text"
              value={formData.deliveryLocation}
              onChange={handleChange}
              placeholder="Ongole, Andhra Pradesh"
              className={`
                w-full pl-10 pr-4 py-3.5 rounded-xl border bg-cream/30 text-ink font-medium
                outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
                placeholder:text-ink-muted/60
                ${errors.deliveryLocation ? "border-rose" : "border-border"}
              `}
            />
          </div>
          {errors.deliveryLocation && (
            <p className="text-xs text-rose mt-1.5 font-medium">{errors.deliveryLocation}</p>
          )}
        </div>

        {/* Submit Actions */}
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
              w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4
              rounded-full bg-ink text-cream text-sm font-medium shadow-md
              hover:bg-amber-dark hover:-translate-y-0.5 hover:shadow-lg transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                <span>Posting Requirement...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Requirement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
