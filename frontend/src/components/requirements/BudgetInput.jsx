// src/components/requirements/BudgetInput.jsx

import { IndianRupee } from "lucide-react";

export default function BudgetInput({
  value,
  onChange,
  placeholder = "1500",
  min = "0",
  required = true,
  name = "budget",
  id = "budget",
  label = "Budget",
  hint = "Enter your expected budget for this custom request",
}) {
  const presets = [1000, 2500, 5000, 10000];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label} {required && <span className="text-rose">*</span>}
        </label>
        <span className="text-xs text-ink-muted">INR (₹)</span>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
          <span className="font-semibold text-base">₹</span>
        </div>

        <input
          type="number"
          id={id}
          name={name}
          min={min}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="
            w-full
            pl-9
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

      {hint && <p className="text-xs text-ink-soft">{hint}</p>}

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
          Suggested:
        </span>
        {presets.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() =>
              onChange({
                target: { name, value: amount },
              })
            }
            className={`
              px-2.5
              py-1
              rounded-lg
              text-xs
              font-medium
              transition-all
              ${
                Number(value) === amount
                  ? "bg-ink text-cream"
                  : "bg-white border border-border text-ink-soft hover:border-amber hover:text-ink"
              }
            `}
          >
            ₹{amount.toLocaleString("en-IN")}
          </button>
        ))}
      </div>
    </div>
  );
}
