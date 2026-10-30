import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Store,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role,
    };

    // Frontend-only authentication for now.
    // Django backend will replace this later.
    login(userData);

    if (role === "creator") {
      navigate("/creator-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">

      {/* ======================================================
          LEFT SIDE — BRAND / WORKSHOP
      ====================================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-forest text-cream">

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-cream/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 w-fit">
            <span className="font-display italic text-3xl text-cream">
              Craft
            </span>

            <span className="font-display font-semibold text-3xl text-amber -ml-2">
              Connect
            </span>

            <span className="w-2 h-2 rounded-full bg-amber mt-4" />
          </Link>

          {/* Main message */}
          <div className="max-w-lg">

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-cream/90">
              <Sparkles size={15} />
              Join the handmade community
            </span>

            <h1 className="font-display text-5xl xl:text-6xl leading-tight mt-6">
              Your next
              <br />

              <span className="italic text-amber">
                handmade story
              </span>

              <br />

              starts here.
            </h1>

            <p className="mt-6 text-cream/70 text-lg leading-relaxed max-w-md">
              Discover unique handmade pieces or share your own creations
              with people who appreciate the hands behind the work.
            </p>

            {/* Benefits */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Store size={17} />
                </span>

                <span className="text-sm text-cream/80">
                  Discover independent creators
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles size={17} />
                </span>

                <span className="text-sm text-cream/80">
                  Find genuinely handmade pieces
                </span>
              </div>

            </div>
          </div>

          {/* Bottom */}
          <p className="text-xs text-cream/40">
            Made for makers. Built for people who love handmade.
          </p>

        </div>
      </div>

      {/* ======================================================
          RIGHT SIDE — REGISTRATION FORM
      ====================================================== */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">

              <span className="font-display italic text-3xl text-ink">
                Craft
              </span>

              <span className="font-display font-semibold text-3xl text-amber-dark -ml-2">
                Connect
              </span>

              <span className="w-2 h-2 rounded-full bg-amber mt-4" />

            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Create your account
            </h2>

            <p className="text-ink-soft mt-2 text-sm">
              Join CraftConnect and become part of the community.
            </p>

          </div>

          {/* Form card */}
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ======================================================
                  NAME
              ====================================================== */}

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/40 text-ink placeholder:text-ink-soft/60 outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 transition"
                  />

                </div>
              </div>

              {/* ======================================================
                  EMAIL
              ====================================================== */}

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/40 text-ink placeholder:text-ink-soft/60 outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 transition"
                  />

                </div>
              </div>

              {/* ======================================================
                  PASSWORD
              ====================================================== */}

              <div>

                <label className="block text-sm font-medium text-ink mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-cream/40 text-ink placeholder:text-ink-soft/60 outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <p className="text-xs text-ink-soft mt-2">
                  Use at least 6 characters.
                </p>

              </div>

              {/* ======================================================
                  ROLE
              ====================================================== */}

              <div>

                <label className="block text-sm font-medium text-ink mb-2">
                  I want to join as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Customer */}
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === "customer"
                        ? "border-amber bg-amber-light/30 ring-2 ring-amber/10"
                        : "border-border bg-cream/30 hover:border-amber/50"
                    }`}
                  >
                    <div className="font-medium text-ink text-sm">
                      Customer
                    </div>

                    <div className="text-xs text-ink-soft mt-1">
                      Discover & shop crafts
                    </div>
                  </button>

                  {/* Creator */}
                  <button
                    type="button"
                    onClick={() => setRole("creator")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === "creator"
                        ? "border-amber bg-amber-light/30 ring-2 ring-amber/10"
                        : "border-border bg-cream/30 hover:border-amber/50"
                    }`}
                  >
                    <div className="font-medium text-ink text-sm">
                      Creator
                    </div>

                    <div className="text-xs text-ink-soft mt-1">
                      Sell your handmade work
                    </div>
                  </button>

                </div>
              </div>

              {/* ======================================================
                  TERMS
              ====================================================== */}

              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-[#B8763D]"
                />

                <span className="text-xs text-ink-soft leading-relaxed">
                  I agree to the CraftConnect terms and understand the
                  privacy policy.
                </span>

              </label>

              {/* ======================================================
                  SUBMIT
              ====================================================== */}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-amber-dark transition-colors"
              >
                Create account
                <ArrowRight size={17} />
              </button>

            </form>

            {/* Login link */}
            <div className="mt-6 pt-6 border-t border-border text-center">

              <p className="text-sm text-ink-soft">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-medium text-amber-dark hover:underline"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

          {/* Back to home */}
          <div className="text-center mt-6">

            <Link
              to="/"
              className="text-sm text-ink-soft hover:text-ink transition-colors"
            >
              ← Back to CraftConnect
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}