import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-cream">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between bg-ink text-cream overflow-hidden px-12 py-14">

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 -left-16 w-56 h-56 rounded-full bg-forest/20 blur-3xl" />

        <div className="pointer-events-none absolute top-1/3 right-10 w-2 h-2 rounded-full bg-amber-light" />

        <div className="pointer-events-none absolute top-1/2 right-24 w-1.5 h-1.5 rounded-full bg-forest-dark" />

        <div className="pointer-events-none absolute bottom-1/3 left-16 w-1 h-1 rounded-full bg-amber" />

        {/* Logo */}
        <Link
          to="/"
          className="relative flex items-center gap-2 w-fit"
        >
          <span className="font-display text-2xl tracking-tight">
            CraftConnect
          </span>

          <Sparkles
            className="w-4 h-4 text-amber-light"
            strokeWidth={1.5}
          />
        </Link>

        {/* Main branding text */}
        <div className="relative max-w-sm">

          <p className="font-display text-4xl leading-[1.15] mb-6">
            Come back to the things made by hand.
          </p>

          <p className="text-cream/70 text-[15px] leading-relaxed">
            A quiet marketplace for pottery, woodwork, textiles and jewelry —
            each piece carrying the hand of the person who made it.
          </p>

        </div>

        {/* Craft categories */}
        <div className="relative flex items-center gap-6 text-cream/50 text-xs tracking-wide uppercase">

          <span>Pottery</span>

          <span className="w-1 h-1 rounded-full bg-cream/30" />

          <span>Woodwork</span>

          <span className="w-1 h-1 rounded-full bg-cream/30" />

          <span>Textiles</span>

        </div>

      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center pt-8">

          <Link
            to="/"
            className="font-display text-xl text-ink tracking-tight"
          >
            CraftConnect
          </Link>

        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">

          <div className="w-full max-w-md sm:bg-white sm:border sm:border-border sm:rounded-2xl sm:shadow-sm sm:p-10 sm:py-12">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}
