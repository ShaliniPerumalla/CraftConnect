import { Link } from "react-router-dom";
import {
  CheckCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">

      <div className="w-full max-w-lg">

        <div className="bg-white border border-border rounded-[32px] p-8 sm:p-12 text-center shadow-sm">

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">

            <CheckCircle
              size={44}
              className="text-green-600"
            />

          </div>

          {/* Heading */}
          <p className="text-xs uppercase tracking-[0.2em] text-forest font-medium mt-7">
            Order Confirmed
          </p>

          <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">
            Thank You!
          </h1>

          <p className="text-ink-soft leading-relaxed mt-4">
            Your handmade order has been placed successfully.
            Thank you for supporting independent creators.
          </p>

          {/* Order Number */}
          <div className="mt-7 p-4 rounded-2xl bg-cream">

            <p className="text-xs text-ink-soft">
              Order Number
            </p>

            <p className="font-medium text-ink mt-1">
              #CC-{Date.now().toString().slice(-6)}
            </p>

          </div>

          {/* Buttons */}
          <div className="mt-7 space-y-3">

            <Link
              to="/explore"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-ink text-white font-medium hover:bg-amber transition-colors"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-ink font-medium hover:bg-cream transition-colors"
            >
              Back to Home
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
