// src/components/requirements/RequirementForm.jsx

import { useState } from "react";
import {
  Send,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  FileText,
  CheckCircle2,
  HelpCircle,
  Wand2,
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
  "Candles & Bath",
  "Leather Goods",
  "Metal & Brass Craft",
];

export default function RequirementForm({
  onSubmitSuccess,
  onCancel,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    category: initialData?.category || "Resin Art",
    title: initialData?.title || "",
    whatDoYouWant: initialData?.whatDoYouWant || "",
    description: initialData?.description || "",
    budget: initialData?.budget || 1500,
    budgetMin: initialData?.budgetMin || 1000,
    budgetMax: initialData?.budgetMax || 1500,
    requiredDate: initialData?.requiredDate || "2026-10-15",
    deliveryLocation: initialData?.deliveryLocation || "Ongole, Andhra Pradesh",
    images: initialData?.images || [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    ],
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

  // Quick fill helper with the user's specific prompt example!
  const loadPromptExample = () => {
    setFormData({
      category: "Resin Art",
      title: "Custom Resin Name Plate",
      whatDoYouWant: "Custom birthday gift",
      description:
        "I want a customized resin name plate with real dried flowers, gold leaf accents, and glowing warm white LED backlighting. The family name should be 'The Sharmas'. Needs a smooth glass-like crystal finish.",
      budget: 1500,
      budgetMin: 1000,
      budgetMax: 1500,
      requiredDate: "2026-09-25",
      deliveryLocation: "Ongole, Andhra Pradesh",
      images: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.category) {
      setErrorMsg("Please select a product category.");
      return;
    }

    if (!formData.whatDoYouWant.trim()) {
      setErrorMsg("Please specify what you want made.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMsg("Please provide a description of your custom craft idea.");
      return;
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      setErrorMsg("Please enter a valid budget amount.");
      return;
    }

    if (!formData.deliveryLocation.trim()) {
      setErrorMsg("Please enter your delivery location or city.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...formData,
          title: formData.title || formData.whatDoYouWant,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit requirement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber via-amber-dark to-forest" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Step 1: Idea to Requirement
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Create Custom Requirement
          </h2>
          <p className="text-sm text-ink-soft mt-1">
            Explain what you want and verified artisan creators will send you competitive quotations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPromptExample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream border border-border text-ink-soft hover:text-amber-dark hover:border-amber/50 text-xs font-medium transition-all shadow-2xs self-start"
          title="Autofill with the Resin Name Plate example"
        >
          <Wand2 size={13} className="text-amber-dark" />
          Fill with Demo Example
        </button>
      </div>

      {errorMsg && (
        <div className="mt-6 p-4 rounded-xl bg-rose/10 border border-rose/30 text-rose text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Category */}
          <div>
            <label
              htmlFor="product-category"
              className="block text-sm font-medium text-ink mb-2"
            >
              Product Category <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <select
                id="product-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm appearance-none outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 shadow-2xs cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-soft">
                ▼
              </div>
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              Select the maker discipline best suited for this item.
            </p>
          </div>

          {/* What do you want? */}
          <div>
            <label
              htmlFor="what-do-you-want"
              className="block text-sm font-medium text-ink mb-2"
            >
              What do you want? <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <input
                id="what-do-you-want"
                type="text"
                name="whatDoYouWant"
                required
                value={formData.whatDoYouWant}
                onChange={handleChange}
                placeholder="e.g. Custom birthday gift / Custom Resin Name Plate"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-ink-muted focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              Short summary or occasion for your custom piece.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="custom-description"
              className="block text-sm font-medium text-ink"
            >
              Description <span className="text-amber-dark">*</span>
            </label>
            <span className="text-xs text-ink-muted">
              {formData.description.length} characters
            </span>
          </div>
          <textarea
            id="custom-description"
            name="description"
            rows="5"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="I want a customized resin name plate with gold flakes, dried white baby's breath flowers, and high-gloss teak wooden border..."
            className="w-full p-4 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-ink-muted focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs resize-y"
          />
          <p className="text-xs text-ink-soft mt-1.5">
            Tip: Include desired size/dimensions, color palette, custom lettering/names, and specific material requests.
          </p>
        </div>

        {/* Upload Reference Images Component */}
        <FileUpload
          images={formData.images}
          onChange={(newImages) =>
            setFormData((prev) => ({ ...prev, images: newImages }))
          }
          label="Upload Reference Images"
          hint="Upload sketches, design inspiration, or photo examples"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Budget Component */}
          <div>
            <BudgetInput
              value={formData.budget}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: val,
                  budgetMax: val,
                }))
              }
              minValue={formData.budgetMin}
              onMinChange={(val) =>
                setFormData((prev) => ({ ...prev, budgetMin: val }))
              }
              maxValue={formData.budgetMax}
              onMaxChange={(val) =>
                setFormData((prev) => ({ ...prev, budgetMax: val }))
              }
              category={formData.category}
              label="Budget (₹)"
            />
          </div>

          {/* Required Date */}
          <div>
            <label
              htmlFor="required-date"
              className="block text-sm font-medium text-ink mb-2"
            >
              Required Date <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <input
                id="required-date"
                type="date"
                name="requiredDate"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.requiredDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              Target completion & delivery deadline.
            </p>
          </div>

          {/* Delivery Location */}
          <div>
            <label
              htmlFor="delivery-location"
              className="block text-sm font-medium text-ink mb-2"
            >
              Delivery Location <span className="text-amber-dark">*</span>
            </label>
            <div className="relative">
              <input
                id="delivery-location"
                type="text"
                name="deliveryLocation"
                required
                value={formData.deliveryLocation}
                onChange={handleChange}
                placeholder="e.g. Ongole, Andhra Pradesh"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-ink-muted focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              City or destination for shipping calculations.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <CheckCircle2 size={16} className="text-forest" />
            <span>
              Escrow-protected: You only pay when you select & approve a quotation.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-full border border-border bg-white text-ink text-sm font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              id="submit-requirement-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={16} />
              {isSubmitting ? "Publishing..." : "Submit Requirement"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
