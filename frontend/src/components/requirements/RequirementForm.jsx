// src/components/requirements/RequirementForm.jsx

import { useState } from "react";
import { Send, Sparkles, MapPin, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import FileUpload from "./FileUpload";
import BudgetInput from "./BudgetInput";
import { useRequirements } from "../../context/RequirementsContext";

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
];

export default function RequirementForm({ onSuccess }) {
  const { addRequirement } = useRequirements();

  const [formData, setFormData] = useState({
    category: "Resin Art",
    title: "",
    description: "",
    budget: "1250",
    requiredDate: "",
    location: "Ongole",
    customerName: "Current Customer",
    customerEmail: "customer@makermatch.com",
  });

  const [images, setImages] = useState([]);
  const [submittedReq, setSubmittedReq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addRequirement({
        ...formData,
        referenceImages: images,
      });

      setIsSubmitting(false);
      setSubmittedReq(created);

      if (onSuccess) {
        onSuccess(created);
      }
    }, 400);
  };

  const handleReset = () => {
    setSubmittedReq(null);
    setFormData({
      category: "Resin Art",
      title: "",
      description: "",
      budget: "1250",
      requiredDate: "",
      location: "Ongole",
      customerName: "Current Customer",
      customerEmail: "customer@makermatch.com",
    });
    setImages([]);
  };

  if (submittedReq) {
    return (
      <div className="bg-white border border-border rounded-[2rem] p-8 sm:p-12 text-center shadow-[0_12px_45px_rgba(0,0,0,0.06)] animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-forest/15 text-forest flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber/15 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
          Requirement Published
        </span>

        <h3 className="font-display text-3xl text-ink">
          {submittedReq.title}
        </h3>

        <p className="text-sm text-ink-soft mt-2 max-w-md mx-auto">
          Your custom requirement <span className="font-semibold text-ink">#{submittedReq.id}</span> has been broadcast to verified creators in{" "}
          <span className="font-semibold text-ink">{submittedReq.location}</span>. Creators will review your idea and submit quotations shortly.
        </p>

        <div className="bg-cream/70 border border-border rounded-2xl p-4 my-6 max-w-md mx-auto text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink-soft">Category:</span>
            <span className="font-semibold text-ink">{submittedReq.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Target Budget:</span>
            <span className="font-semibold text-ink">₹{Number(submittedReq.budget).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Delivery Target:</span>
            <span className="font-semibold text-ink">{submittedReq.requiredDate || "Flexible"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Status:</span>
            <span className="font-semibold text-amber-dark">{submittedReq.status}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-full border border-border text-sm font-medium text-ink hover:border-amber hover:bg-cream transition-all"
          >
            Post Another Requirement
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border rounded-[2rem] p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.05)] space-y-6"
    >
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-dark" />
          <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
            Customer Requirement Page
          </p>
        </div>
        <h2 className="font-display text-3xl text-ink mt-2">
          Create Custom Requirement
        </h2>
        <p className="text-sm text-ink-soft mt-1">
          Explain what you want and connect with specialized handmade creators who will submit custom quotations.
        </p>
      </div>

      {/* Product Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-ink mb-2"
        >
          Product Category <span className="text-rose">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="
            w-full
            px-4
            py-3.5
            rounded-xl
            border
            border-border
            bg-cream/60
            text-ink
            font-medium
            outline-none
            focus:border-amber
            focus:ring-2
            focus:ring-amber/10
            transition-all
          "
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* What do you want? (Title) */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-ink mb-2"
        >
          What do you want? <span className="text-rose">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Custom birthday gift, Custom resin name plate"
          className="
            w-full
            px-4
            py-3.5
            rounded-xl
            border
            border-border
            bg-cream/60
            text-ink
            font-medium
            placeholder:text-ink-muted
            outline-none
            focus:border-amber
            focus:ring-2
            focus:ring-amber/10
            transition-all
          "
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-ink"
          >
            Description <span className="text-rose">*</span>
          </label>
          <span className="text-xs text-ink-muted">Detailed specifications</span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="I want a customized resin name plate with golden lettering, oceanic swirl colors, dimensions 12x6 inches..."
          className="
            w-full
            px-4
            py-3.5
            rounded-xl
            border
            border-border
            bg-cream/60
            text-ink
            placeholder:text-ink-muted
            outline-none
            focus:border-amber
            focus:ring-2
            focus:ring-amber/10
            transition-all
            resize-none
          "
        />
      </div>

      {/* Upload Reference Images */}
      <FileUpload images={images} onChange={setImages} />

      {/* Budget & Date Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Budget */}
        <BudgetInput
          value={formData.budget}
          onChange={handleChange}
          placeholder="1250"
        />

        {/* Required Date */}
        <div className="space-y-2">
          <label
            htmlFor="requiredDate"
            className="block text-sm font-medium text-ink"
          >
            Required Date <span className="text-rose">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              id="requiredDate"
              name="requiredDate"
              min={new Date().toISOString().split("T")[0]}
              value={formData.requiredDate}
              onChange={handleChange}
              required
              className="
                w-full
                pl-10
                pr-4
                py-3.5
                rounded-xl
                border
                border-border
                bg-cream/60
                text-ink
                font-medium
                outline-none
                focus:border-amber
                focus:ring-2
                focus:ring-amber/10
                transition-all
              "
            />
          </div>
          <p className="text-xs text-ink-soft">When do you need the custom craft delivered?</p>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-ink"
        >
          Delivery Location <span className="text-rose">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Ongole, Hyderabad, Bangalore"
            className="
              w-full
              pl-10
              pr-4
              py-3.5
              rounded-xl
              border
              border-border
              bg-cream/60
              text-ink
              font-medium
              placeholder:text-ink-muted
              outline-none
              focus:border-amber
              focus:ring-2
              focus:ring-amber/10
              transition-all
            "
          />
        </div>
        <p className="text-xs text-ink-soft">Creators use your location to calculate accurate delivery charges and timelines.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full
          flex
          items-center
          justify-center
          gap-2.5
          px-6
          py-4
          rounded-full
          bg-ink
          text-cream
          text-sm
          font-medium
          shadow-lg
          hover:bg-amber-dark
          hover:shadow-xl
          transition-all
          disabled:opacity-60
          cursor-pointer
        "
      >
        <Send size={18} />
        {isSubmitting ? "Submitting Requirement..." : "Submit Requirement"}
      </button>
    </form>
  );
}
