export default function CartSummary({
  subtotal,
  shipping,
  total,
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">

      <h2 className="font-display text-2xl text-ink">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">
            Subtotal
          </span>

          <span className="text-ink">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">
            Shipping
          </span>

          <span className="text-ink">
            ${shipping.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-border pt-4 flex justify-between">
          <span className="font-medium text-ink">
            Total
          </span>

          <span className="font-display text-2xl text-ink">
            ${total.toFixed(2)}
          </span>
        </div>

      </div>

      <button
        className="w-full mt-6 py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-amber-dark transition-colors"
        onClick={() => alert("Checkout module coming next!")}
      >
        Proceed to Checkout
      </button>

    </div>
  );
}
