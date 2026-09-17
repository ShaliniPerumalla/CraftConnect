import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("cod");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;

  const total = subtotal + shipping;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    navigate("/order-success");
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">

        <div className="bg-white border border-border rounded-3xl p-10 text-center max-w-md">

          <h1 className="font-display text-3xl text-ink">
            Your cart is empty
          </h1>

          <p className="text-ink-soft mt-3">
            Add something to your cart before checking out.
          </p>

          <Link
            to="/explore"
            className="inline-flex mt-6 px-6 py-3 rounded-xl bg-ink text-white font-medium"
          >
            Explore Crafts
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <Link
            to="/"
            className="font-display text-2xl text-ink"
          >
            Craft<span className="text-amber">Connect</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-sm text-green-600">
            <ShieldCheck size={17} />
            Secure Checkout
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-forest font-medium">
            Almost yours
          </p>

          <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">
            Checkout
          </h1>

          <p className="text-ink-soft mt-3">
            Complete your details and place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[1fr_400px] gap-8"
        >

          {/* Left */}
          <div className="space-y-6">

            {/* Shipping */}
            <section className="bg-white border border-border rounded-3xl p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-amber-light/30 flex items-center justify-center">
                  <MapPin
                    size={20}
                    className="text-amber-dark"
                  />
                </div>

                <div>
                  <h2 className="font-display text-2xl text-ink">
                    Shipping Details
                  </h2>

                  <p className="text-sm text-ink-soft">
                    Where should we send your order?
                  </p>
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  required
                  className="sm:col-span-2 w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-amber"
                />

              </div>

            </section>

            {/* Payment */}
            <section className="bg-white border border-border rounded-3xl p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-amber-light/30 flex items-center justify-center">
                  <CreditCard
                    size={20}
                    className="text-amber-dark"
                  />
                </div>

                <div>
                  <h2 className="font-display text-2xl text-ink">
                    Payment Method
                  </h2>

                  <p className="text-sm text-ink-soft">
                    Choose how you want to pay.
                  </p>
                </div>

              </div>

              {/* COD */}
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  payment === "cod"
                    ? "border-amber bg-amber-light/10"
                    : "border-border"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <div className="flex-1">
                  <p className="font-medium text-ink">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-ink-soft mt-1">
                    Pay when your handmade order arrives.
                  </p>
                </div>

                {payment === "cod" && (
                  <Check
                    size={19}
                    className="text-amber-dark"
                  />
                )}

              </label>

              {/* Demo Card */}
              <label
                className={`flex items-center gap-4 p-4 mt-3 rounded-2xl border cursor-pointer transition-colors ${
                  payment === "card"
                    ? "border-amber bg-amber-light/10"
                    : "border-border"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <div className="flex-1">
                  <p className="font-medium text-ink">
                    Card Payment
                  </p>

                  <p className="text-sm text-ink-soft mt-1">
                    Demo payment option for now.
                  </p>
                </div>

                {payment === "card" && (
                  <Check
                    size={19}
                    className="text-amber-dark"
                  />
                )}

              </label>

            </section>

          </div>

          {/* Right */}
          <aside className="lg:sticky lg:top-28 h-fit">

            <div className="bg-white border border-border rounded-3xl p-6">

              <h2 className="font-display text-2xl text-ink">
                Your Order
              </h2>

              <div className="mt-6 space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-ink truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-ink-soft mt-1">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <p className="text-sm font-medium text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                  </div>
                ))}

              </div>

              <div className="border-t border-border mt-6 pt-5 space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">
                    Subtotal
                  </span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">
                    Shipping
                  </span>

                  <span>
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">

                  <span className="font-medium">
                    Total
                  </span>

                  <span className="font-display text-2xl">
                    ${total.toFixed(2)}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                className="w-full mt-7 py-4 rounded-xl bg-ink text-white font-medium hover:bg-amber transition-colors"
              >
                Place Order
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-ink-soft mt-4">
                <ShieldCheck size={14} />
                Your information is secure
              </div>

            </div>

          </aside>

        </form>

      </main>

    </div>
  );
}