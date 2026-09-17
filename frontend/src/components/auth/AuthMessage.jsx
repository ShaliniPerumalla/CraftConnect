import { Check, AlertCircle } from "lucide-react";

export default function AuthMessage({
  type = "success",
  title,
  description,
  action,
}) {
  const isSuccess = type === "success";

  return (
    <div className="text-center">

      {/* Icon */}
      <div
        className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center ${
          isSuccess ? "bg-forest/10" : "bg-rose/10"
        }`}
      >
        {isSuccess ? (
          <Check
            className="w-6 h-6 text-forest-dark"
            strokeWidth={2}
          />
        ) : (
          <AlertCircle
            className="w-6 h-6 text-rose"
            strokeWidth={2}
          />
        )}
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl text-ink mb-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-ink-soft text-[15px] leading-relaxed mb-8 max-w-sm mx-auto">
        {description}
      </p>

      {/* Action */}
      {action}

    </div>
  );
}
