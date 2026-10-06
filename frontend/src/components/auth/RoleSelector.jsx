export default function RoleSelector({
  value,
  onChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">

      <button
        type="button"
        onClick={() => onChange("customer")}
        className={`rounded-xl border p-4 text-left transition ${
          value === "customer"
            ? "border-amber bg-amber/10"
            : "border-border"
        }`}
      >
        <p className="font-semibold text-ink">
          Customer
        </p>

        <p className="text-sm text-ink-soft mt-1">
          Find creators and order custom products.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange("creator")}
        className={`rounded-xl border p-4 text-left transition ${
          value === "creator"
            ? "border-amber bg-amber/10"
            : "border-border"
        }`}
      >
        <p className="font-semibold text-ink">
          Creator
        </p>

        <p className="text-sm text-ink-soft mt-1">
          Showcase your work and receive custom orders.
        </p>
      </button>

    </div>
  );
}