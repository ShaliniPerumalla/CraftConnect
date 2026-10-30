import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthMessage from "../components/auth/AuthMessage";

export default function ForgotPassword() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);

    // Frontend-only simulation
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  }

  return (
    <AuthLayout>
      <div
        className={`transition-all duration-500 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        {sent ? (
          <AuthMessage
            type="success"
            title="Check your inbox"
            description="If an account exists with that email, we've sent instructions to reset your password."
            action={
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-dark hover:text-amber transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            }
          />
        ) : (
          <>
            <h1 className="font-display text-3xl text-ink mb-2">
              Forgot your password?
            </h1>

            <p className="text-ink-soft text-[15px] mb-8 leading-relaxed">
              Enter the email associated with your CraftConnect account
              and we'll help you get back in.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <AuthInput
                id="email"
                name="email"
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                error={error}
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink text-cream font-medium py-3.5 transition-all duration-200 hover:bg-amber disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send reset link"}

                {!submitting && (
                  <ArrowRight
                    className="w-4 h-4"
                    strokeWidth={2}
                  />
                )}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
