import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import PasswordStrength from "../components/auth/PasswordStrength";
import AuthMessage from "../components/auth/AuthMessage";
import { resetPassword } from "../services/authService";

function validate({ password, confirmPassword }) {
  const errors = {};

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Use at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [mounted] = useState(true);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validate(form);

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!token) {
      setSubmitError("The reset link is missing or invalid.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, form.password, form.confirmPassword);
      setDone(true);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "We could not reset your password. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
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
        {done ? (
          <AuthMessage
            type="success"
            title="Password updated"
            description="Your password has been successfully changed."
            action={
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl bg-ink text-cream font-medium py-3 px-6 transition-all duration-200 hover:bg-amber"
              >
                Sign in
                <ArrowRight
                  className="w-4 h-4"
                  strokeWidth={2}
                />
              </button>
            }
          />
        ) : (
          <>
            <h1 className="font-display text-3xl text-ink mb-2">
              Set a new password
            </h1>

            <p className="text-ink-soft text-[15px] mb-8">
              Choose a new password for your CraftConnect account.
            </p>

            {submitError && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <div>
                <PasswordInput
                  id="password"
                  name="password"
                  label="New password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="new-password"
                />

                <PasswordStrength
                  password={form.password}
                />
              </div>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink text-cream font-medium py-3.5 transition-all duration-200 hover:bg-amber disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Updating…"
                  : "Reset password"}

                {!submitting && (
                  <ArrowRight
                    className="w-4 h-4"
                    strokeWidth={2}
                  />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

