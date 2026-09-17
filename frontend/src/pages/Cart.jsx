import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    totalItems,
  } = useCart();

  // ========================================
  // EMPTY CART
  // ========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream font-body text-ink flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">

            <div className="mx-auto w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center shadow-sm">
              <ShoppingBag
                size={32}
                className="text-amber-dark"
              />
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold mt-7">
              Your collection
            </p>

            <h1 className="font-display text-4xl sm:text-5xl mt-2">
              Your cart is empty
            </h1>

            <p className="text-sm text-ink-soft leading-relaxed mt-4">
              Discover beautiful handmade pieces from independent
              creators and add something special to your collection.
            </p>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 mt-7 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
            >
              Explore Crafts
              <ArrowRight size={16} />
            </Link>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ======================================== */}
        {/* HEADER */}
        {/* ======================================== */}

        <section className="border-b border-border bg-cream">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>

            <div className="mt-6">

              <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
                Your collection
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-2">

                <h1 className="font-display text-4xl sm:text-5xl">
                  Shopping Cart
                </h1>

                <p className="text-sm text-ink-soft">
                  {totalItems}{" "}
                  {totalItems === 1 ? "piece" : "pieces"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* CART CONTENT */}
        {/* ======================================== */}

        <section className="py-8 lg:py-12">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid lg:grid-cols-[1fr_380px] gap-7">

              {/* ======================================== */}
              {/* ITEMS */}
              {/* ======================================== */}

              <div className="space-y-4">

                {cartItems.map((item) => (

                  <article
                    key={item.id}
                    className="bg-white border border-border rounded-3xl p-4 sm:p-5 shadow-sm"
                  >

                    <div className="flex gap-4">

                      {/* IMAGE */}

                      <Link
                        to={`/craft/${item.id}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />

                      </Link>

                      {/* DETAILS */}

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <Link
                              to={`/craft/${item.id}`}
                              className="font-display text-lg sm:text-xl hover:text-amber-dark transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>

                            {item.creator && (
                              <p className="text-xs text-ink-soft mt-1">
                                By {item.creator}
                              </p>
                            )}

                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            aria-label={`Remove ${item.name}`}
                            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-ink-soft hover:text-rose hover:bg-rose/5 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-5">

                          {/* PRICE */}

                          <div>

                            <p className="font-display text-xl">
                              {formatPrice(item.price)}
                            </p>

                            <p className="text-xs text-ink-soft mt-0.5">
                              per piece
                            </p>

                          </div>

                          {/* QUANTITY */}

                          <div className="inline-flex items-center w-fit rounded-full border border-border bg-cream/40">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              aria-label="Decrease quantity"
                              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              aria-label="Increase quantity"
                              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {/* ======================================== */}
              {/* SUMMARY */}
              {/* ======================================== */}

              <aside className="lg:sticky lg:top-24 h-fit">

                <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-sm">

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={17}
                      className="text-amber-dark"
                    />

                    <h2 className="font-display text-2xl">
                      Order Summary
                    </h2>

                  </div>

                  {/* PRICE DETAILS */}

                  <div className="space-y-3 mt-6">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-soft">
                        Subtotal
                      </span>

                      <span className="font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-soft">
                        Delivery
                      </span>

                      <span className="font-medium">
                        {deliveryFee === 0
                          ? "FREE"
                          : formatPrice(deliveryFee)}
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">

                      <span className="font-medium">
                        Total
                      </span>

                      <span className="font-display text-2xl">
                        {formatPrice(total)}
                      </span>

                    </div>

                  </div>

                  {/* FREE DELIVERY MESSAGE */}

                  {subtotal < 999 && (
                    <div className="mt-5 rounded-2xl bg-amber-light/15 border border-amber/20 p-4">

                      <div className="flex gap-3">

                        <Truck
                          size={18}
                          className="text-amber-dark shrink-0 mt-0.5"
                        />

                        <p className="text-xs text-ink-soft leading-relaxed">
                          Add{" "}
                          <span className="font-semibold text-ink">
                            {formatPrice(999 - subtotal)}
                          </span>{" "}
                          more to unlock free delivery.
                        </p>

                      </div>

                    </div>
                  )}

                  {subtotal >= 999 && (
                    <div className="mt-5 rounded-2xl bg-forest/10 p-4">

                      <div className="flex gap-3">

                        <Truck
                          size={18}
                          className="text-forest shrink-0"
                        />

                        <p className="text-xs text-forest leading-relaxed font-medium">
                          Great! You qualify for free delivery.
                        </p>

                      </div>

                    </div>
                  )}

                  {/* CHECKOUT */}

                  <Link
                    to="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 mt-6 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                  >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                  </Link>

                  {/* TRUST */}

                  <div className="flex items-center justify-center gap-2 mt-5 text-xs text-ink-soft">

                    <ShieldCheck size={14} />

                    Secure checkout
                  </div>

                </div>

              </aside>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}