import { X, ShoppingBag, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartToast({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[calc(100%-2rem)] max-w-sm animate-[slideIn_0.35s_ease-out]">
      <div className="bg-white border border-border rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent */}
        <div className="h-1 bg-amber" />

        <div className="p-4">

          {/* Header */}
          <div className="flex items-start justify-between">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <Check
                  size={16}
                  className="text-green-700"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-ink">
                  Added to your cart
                </p>

                <p className="text-xs text-ink-soft mt-0.5">
                  Your handmade piece is waiting for you.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-ink-soft hover:bg-cream hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X size={17} />
            </button>

          </div>

          {/* Product */}
          <div className="flex gap-3 mt-4 p-3 rounded-xl bg-cream">

            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />

            <div className="min-w-0 flex-1">

              <p className="font-medium text-sm text-ink line-clamp-2">
                {item.name}
              </p>

              <p className="text-xs text-ink-soft mt-1">
                {item.creator}
              </p>

              <p className="text-sm font-semibold text-amber-dark mt-1">
                ${item.price}
              </p>

            </div>

          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">

            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
            >
              <ShoppingBag size={15} />
              View Cart
            </Link>

            <button
              onClick={onClose}
              className="py-2.5 rounded-xl border border-border bg-white text-ink text-sm font-medium hover:bg-cream transition-colors"
            >
              Continue Shopping
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}