// src/components/requirements/BudgetInput.jsx

import { useId } from "react";
import { IndianRupee, Sparkles } from "lucide-react";

const BUDGET_PRESETS = [
  { label: "₹1,000", value: 1000 },
  { label: "₹1,500", value: 1500 },
  { label: "₹2,500", value: 2500 },
  { label: "₹5,000", value: 5000 },
  { label: "₹10,000", value: 10000 },
];

const CATEGORY_GUIDES = {
  "Resin Art": "Typical custom resin projects: ₹1,000 – ₹3,500",
  "Woodwork": "Custom solid woodwork: ₹2,500 – ₹15,000+",
  "Pottery & Ceramics": "Handmade ceramic sets: ₹800 – ₹3,000",
  "Jewelry": "Artisanal custom jewelry: ₹1,200 – ₹8,000",
  "Textiles & Fiber Art": "Custom embroidery/macrame: ₹1,500 – ₹6,000",
  "Wall Art & Prints": "Original commissioned art: ₹2,000 – ₹12,000",
  "Wedding & Event Decor": "Custom decor packages: ₹5,000 – ₹30,000",
  "Leather Goods": "Hand-stitched leathercraft: ₹1,500 – ₹7,000",
};

export default function BudgetInput({
  value = "",
  onChange,
  category = "",
  label = "Budget",
  required = true,
  placeholder = "1250",
  name = "budget",
  helperText = "",
}) {
  const inputId = useId();

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (onChange) {
      onChange(rawValue);
    }
  };

  const handlePresetClick = (presetVal) => {
    if (onChange) {
      onChange(String(presetVal));
    }
  };

  const formatNumberWithCommas = (val) => {
    if (!val) return "";
    const num = parseInt(val, 10);
    return isNaN(num) ? "" : num.toLocaleString("en-IN");
  };

  const currentGuide = category ? CATEGORY_GUIDES[category] : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label} {required && <span className="text-amber-dark">*</span>}
        </label>
        {value ? (
          <span className="text-xs font-semibold text-amber-dark bg-amber/10 px-2.5 py-0.5 rounded-full">
            ₹ {formatNumberWithCommas(value)} INR
          </span>
        ) : (
          <span className="text-xs text-ink-muted">In Indian Rupees</span>
        )}
      </div>

      <div className="relative rounded-xl shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
          <IndianRupee size={17} className="text-amber-dark" />
        </div>
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-ink font-medium
            outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 transition-all
            placeholder:text-ink-muted/60
          "
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange && onChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-ink-muted hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset quick buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-ink-muted">Quick amounts:</span>
        {BUDGET_PRESETS.map((preset) => {
          const isSelected = String(preset.value) === String(value);
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`
                text-xs px-2.5 py-1 rounded-full border transition-all
                ${
                  isSelected
                    ? "bg-amber text-white border-amber font-medium shadow-xs"
                    : "bg-white border-border text-ink-soft hover:border-amber hover:text-amber-dark"
                }
              `}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Category guideline or custom helper */}
      {(currentGuide || helperText) && (
        <div className="flex items-center gap-1.5 text-xs text-ink-soft bg-cream/60 rounded-lg px-2.5 py-1.5 border border-border/50">
          <Sparkles size={12} className="text-amber-dark shrink-0" />
          <span>{helperText || currentGuide}</span>
        </div>
      )}
    </div>
  );
}
