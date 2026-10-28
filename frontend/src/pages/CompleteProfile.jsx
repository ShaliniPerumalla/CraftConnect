/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  User,
  Save,
  ShieldCheck,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { updateProfile } from "../services/authService";

const initialState = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    setFormData((previous) => ({
      ...previous,
      name: user.name || previous.name || "",
      phone: user.phone || previous.phone || "",
      address: user.address || previous.address || "",
      city: user.city || previous.city || "",
      state: user.state || previous.state || "",
      pincode: user.pincode || previous.pincode || "",
    }));
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    const missing = Object.entries(payload).filter(([, value]) => !value);

    if (missing.length > 0) {
      setError("Please fill in all required profile details before continuing.");
      setLoading(false);
      return;
    }

    try {
      const response = await updateProfile(payload);
      const updatedUser = {
        ...user,
        ...response.user,
        ...payload,
        profile_complete: true,
      };

      login(updatedUser);

      if (user?.role === "creator") {
        navigate("/creator-dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      const responseData = err.response?.data;
      const message =
        responseData?.detail ||
        responseData?.message ||
        "Unable to save your profile details right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-border bg-white shadow-sm overflow-hidden">
          <div className="bg-ink px-6 py-7 sm:px-8">
            <div className="flex items-center gap-3 text-amber">
              <ShieldCheck size={20} />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold">
                Account setup
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl mt-4 text-cream">
              Complete your profile
            </h1>

            <p className="mt-3 text-sm text-cream/70 max-w-xl">
              Please add your contact and address details so we can support orders,
              delivery, and communication smoothly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Full name</label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone number</label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-border bg-cream/80 py-3 pl-11 pr-4 text-sm text-ink-soft outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-4 text-ink-soft"
                  />
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no, street, area"
                    required
                    className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Guntur"
                  required
                  className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Andhra Pradesh"
                  required
                  className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="522001"
                  required
                  className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-amber-dark disabled:opacity-70"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save and continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
