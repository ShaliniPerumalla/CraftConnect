import { AlertCircle } from "lucide-react";

export default function AuthInput({
  id,
  label,
  type = "text",
  icon: Icon,
  error,
  rightElement,
  ...props
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink mb-1.5"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/70 pointer-events-none"
            strokeWidth={1.75}
          />
        )}

        <input
          id={id}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-cream/60 py-3 text-[15px] text-ink placeholder:text-ink-soft/50 outline-none transition-all duration-200
            ${Icon ? "pl-10" : "pl-4"}
            ${rightElement ? "pr-11" : "pr-4"}
            ${
              error
                ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/15"
                : "border-border focus:border-amber focus:ring-2 focus:ring-amber/15"
            }
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs text-rose"
        >
          <AlertCircle
            className="w-3.5 h-3.5"
            strokeWidth={2}
          />
          {error}
        </p>
      )}
    </div>
  );
}
