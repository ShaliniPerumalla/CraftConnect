// src/components/requirements/BudgetInput.jsx

import { useState } from "react";
import { IndianRupee, Sparkles } from "lucide-react";

const BUDGET_PRESETS = [
  { label: "₹500", value: 500 },
  { label: "₹1,000", value: 1000 },
  { label: "₹1,500", value: 1500 },
  { label: "₹2,500", value: 2500 },
  { label: "₹5,000", value: 500 },
  { label: "₹10,000+", value: 10000 },
];

export default function BudgetInput({
  value,
  onChange,
  minValue,
  onMinChange,
  maxValue,
  onMaxChange,
  label = "Budget",
  category = "Resin Art",
  required = true,
}) {
  const [showRange, setShowRange] = useState(false);

  // Suggested price guidelines based on category
  const getCategoryGuidance = (cat) => {
    switch (cat) {
      case "Resin Art":
        return "Typical resin nameplates & clocks: ₹800 – ₹2,500";
      case "Woodwork":
        return "Handmade wooden accents & furniture: ₹1,500 – ₹8,000";
      case "Pottery & Ceramics":
        return "Custom stoneware sets: ₹1,200 – ₹4,000";
      case "Jewelry":
        return "Bespoke handcrafted silver/resin jewelry: ₹600 – ₹3,500";
      default:
        return "Artisan custom crafts typically range ₹1,000 – ₹5,000";
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">
          {label} <span className="text-amber-dark">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowRange(!showRange)}
          className="text-xs text-amber-dark hover:underline font-medium"
        >
          {showRange ? "Switch to single budget" : "Specify price range (Min - Max)"}
        </button>
      </div>

      {!showRange ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
            <span className="font-semibold text-sm">₹</span>
          </div>
          <input
            id="budget-input"
            type="number"
            min="100"
            step="50"
            required={required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="1500"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all shadow-2xs font-medium"
          />
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-ink-muted pointer-events-none">
            INR
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-semibold text-xs">
              Min ₹
            </span>
            <input
              type="number"
              min="100"
              step="50"
              value={minValue || ""}
              onChange={(e) => onMinChange && onMinChange(e.target.value)}
              placeholder="1000"
              className="w-full pl-12 pr-3 py-3 rounded-xl border border-border bg-white text-ink text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-semibold text-xs">
              Max ₹
            </span>
            <input
              type="number"
              min="100"
              step="50"
              value={maxValue || ""}
              onChange={(e) => onMaxChange && onMaxChange(e.target.value)}
              placeholder="1500"
              className="w-full pl-12 pr-3 py-3 rounded-xl border border-border bg-white text-ink text-sm focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-ink-muted font-medium mr-1">
          Quick select:
        </span>
        {BUDGET_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onChange(preset.value);
              if (onMinChange) onMinChange(Math.round(preset.value * 0.85));
              if (onMaxChange) onMaxChange(Math.round(preset.value * 1.15));
            }}
            className={`
              px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
              ${
                Number(value) === preset.value
                  ? "bg-amber/15 border-amber text-amber-dark font-semibold shadow-2xs"
                  : "bg-white/80 border-border text-ink-soft hover:border-amber/60 hover:text-ink"
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Category Benchmark Hint */}
      <p className="flex items-center gap-1.5 text-xs text-forest font-medium pt-0.5">
        <Sparkles size={12} className="shrink-0 text-amber-dark" />
        <span>{getCategoryGuidance(category)}</span>
      </p>
    </div>
  );
}
