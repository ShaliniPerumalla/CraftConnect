
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Hammer,
} from "lucide-react";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = {
        ...data.user,
        role: data.user?.role ? String(data.user.role).toLowerCase() : data.user?.role,
      };
      const accessToken = data.tokens?.access;
      const refreshToken = data.tokens?.refresh;

      if (!user || !accessToken || !refreshToken) {
        throw new Error("The server returned an unexpected login response.");
      }

      if (user.role && user.role !== role.toLowerCase()) {
        throw new Error(
          `This account is registered as a ${user.role}. Please select the matching role.`
        );
      }

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      login(user);

      if (!user.profile_complete) {
        navigate("/complete-profile", { replace: true });
        return;
      }

      if (user.role === "creator") {
        navigate("/creator-dashboard", { replace: true });
      } else if (user.role === "customer") {
        navigate("/profile", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const responseData = err.response?.data;

      let message =
        responseData?.detail ||
        responseData?.message ||
        err.message ||
        "Login failed. Please try again.";

      if (responseData && typeof responseData === "object") {
        const fieldErrors = Object.entries(responseData)
          .filter(([, value]) => Array.isArray(value))
          .map(([field, value]) => `${field}: ${value.join(" ")}`);

        if (fieldErrors.length) {
          message = fieldErrors.join(" ");
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="fixed top-0 left-0 w-72 h-72 bg-terracotta-light/30 rounded-full blur-3xl -z-0" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-sage-light/30 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-xl border border-border">
        <div className="hidden lg:flex relative bg-ink text-cream p-12 flex-col justify-between overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-terracotta/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sage/20 blur-2xl" />

          <div className="relative">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display italic text-3xl">Craft</span>
              <span className="font-display font-semibold text-3xl text-terracotta-light -ml-2">
                Connect
              </span>
            </Link>

            <div className="mt-20 max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-terracotta/20 flex items-center justify-center">
                <Hammer size={27} className="text-terracotta-light" />
              </div>

              <h1 className="font-display text-5xl leading-tight mt-7">
                Welcome back to the
                <span className="italic text-terracotta-light">
                  {" "}workshop.
                </span>
              </h1>

              <p className="text-cream/65 mt-6 text-base leading-relaxed">
                Discover handmade pieces, reconnect with your favourite
                creators, and keep the story behind every craft alive.
              </p>
            </div>
          </div>

          <p className="relative text-xs text-cream/40">
            Handmade with care. Connected with people.
          </p>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display italic text-2xl text-ink">Craft</span>
              <span className="font-display font-semibold text-2xl text-terracotta-dark -ml-2">
                Connect
              </span>
            </Link>
          </div>

          <div>
            <p className="text-sm font-medium text-terracotta-dark">
              Welcome back
            </p>
            <h2 className="font-display text-4xl text-ink mt-2">
              Sign in to CraftConnect
            </h2>
            <p className="text-sm text-ink-soft mt-3">
              Continue discovering and supporting independent creators.
            </p>
          </div>

          <div className="mt-8">
            <label className="text-sm font-medium text-ink">I am a</label>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === "customer"
                    ? "border-terracotta bg-terracotta-light/20"
                    : "border-border hover:border-terracotta/50"
                }`}
              >
                <p className="font-medium text-ink">Customer</p>
                <p className="text-xs text-ink-soft mt-1">
                  I want to discover crafts
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === "creator"
                    ? "border-sage bg-sage-light/30"
                    : "border-border hover:border-sage/50"
                }`}
              >
                <p className="font-medium text-ink">Creator</p>
                <p className="text-xs text-ink-soft mt-1">
                  I want to sell my work
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email address
              </label>
              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/40 text-ink placeholder:text-ink-soft/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-ink">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-terracotta-dark hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-cream/40 text-ink placeholder:text-ink-soft/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-ink-soft">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-terracotta-dark hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
