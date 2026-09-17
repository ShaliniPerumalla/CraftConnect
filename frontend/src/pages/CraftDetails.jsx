// src/pages/CraftDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { creators } from "../utils/mockData";
import { useCrafts } from "../context/CraftsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function CraftDetails() {
  const { id } = useParams();

  const { crafts } = useCrafts();
  const { addToCart } = useCart();

  const {
    isLiked,
    toggleWishlist,
  } = useWishlist();

  const [quantity, setQuantity] = useState(1);

  const [notification, setNotification] =
    useState(false);

  const [notificationMessage, setNotificationMessage] =
    useState("");

  const craft = crafts.find(
    (item) =>
      String(item.id) === String(id)
  );

  const creator = craft
    ? creators.find(
        (item) =>
          item.id === craft.creatorId
      )
    : null;

  const relatedCrafts = useMemo(() => {
    if (!craft) {
      return [];
    }

    return crafts
      .filter(
        (item) =>
          item.id !== craft.id &&
          item.category === craft.category
      )
      .slice(0, 4);
  }, [crafts, craft]);

  // ======================================================
  // RESET QUANTITY WHEN CRAFT CHANGES
  // ======================================================

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  // ======================================================
  // AUTO HIDE NOTIFICATION
  // ======================================================

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      setNotification(false);
      setNotificationMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification, notificationMessage]);

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!craft) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="font-display text-3xl text-ink">
            Craft not found
          </h1>

          <p className="text-sm text-ink-soft mt-2">
            The craft you're looking for is no longer
            available.
          </p>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

        </div>

      </div>
    );
  }

  // ======================================================
  // PRICE
  // ======================================================

  const price =
    Number(craft.price) || 0;

  const formattedPrice =
    `₹${price.toLocaleString("en-IN")}`;

  // ======================================================
  // STOCK
  // ======================================================

  const stockAvailable =
    Math.max(
      0,
      Number(craft.stock ?? 0)
    );

  // ======================================================
  // QUANTITY
  // ======================================================

  function increaseQuantity() {
    if (
      quantity <
      stockAvailable
    ) {
      setQuantity(
        (previous) =>
          previous + 1
      );
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(
        (previous) =>
          previous - 1
      );
    }
  }

  // ======================================================
  // WISHLIST
  // ======================================================

  function handleWishlist() {
    const wasLiked = isLiked(craft.id);

    toggleWishlist(craft);

    setNotificationMessage(
      wasLiked
        ? "Removed from liked crafts"
        : "Added to liked crafts"
    );

    setNotification(true);
  }

  // ======================================================
  // ADD TO CART
  // ======================================================

  function handleAddToCart() {
    if (stockAvailable <= 0) {
      return;
    }

    if (
      quantity >
      stockAvailable
    ) {
      setQuantity(stockAvailable);
      return;
    }

    addToCart(
      craft,
      quantity
    );

    setNotificationMessage(
      "Added to your cart"
    );

    setNotification(true);
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 lg:h-20 flex items-center justify-between">

            <Link
              to="/"
              className="font-display text-2xl text-ink"
            >
              Craft
              <span className="text-amber">
                Connect
              </span>
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark"
            >
              <ArrowLeft size={16} />

              <span className="hidden sm:inline">
                Back to Explore
              </span>

              <span className="sm:hidden">
                Back
              </span>
            </Link>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <section className="grid lg:grid-cols-2 gap-8 lg:gap-14">

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div>

            <div className="relative aspect-square rounded-[28px] overflow-hidden bg-white border border-border shadow-sm">

              <img
                src={craft.image}
                alt={craft.name}
                className="w-full h-full object-cover"
              />

              {craft.tag && (
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-semibold text-ink shadow-sm">
                  {craft.tag}
                </span>
              )}

              {/* WISHLIST BUTTON */}

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  isLiked(craft.id)
                    ? "Remove from liked crafts"
                    : "Add to liked crafts"
                }
                title={
                  isLiked(craft.id)
                    ? "Remove from liked crafts"
                    : "Add to liked crafts"
                }
                className={`absolute top-5 right-5 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 ${
                  isLiked(craft.id)
                    ? "text-rose"
                    : "text-ink-soft hover:text-rose"
                }`}
              >
                <Heart
                  size={21}
                  className={
                    isLiked(craft.id)
                      ? "fill-current"
                      : ""
                  }
                />
              </button>

            </div>

            <p className="text-xs text-ink-soft mt-3 text-center">
              Handmade with care by{" "}
              {craft.creator}
            </p>

          </div>

          {/* ==================================================
              INFORMATION
          ================================================== */}

          <div className="flex flex-col justify-center">

            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              {String(
                craft.category
              ).replace("-", " ")}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mt-3">
              {craft.name}
            </h1>

            {/* CREATOR */}

            <div className="flex items-center gap-3 mt-5">

              {creator && (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              )}

              <div>

                <p className="text-xs text-ink-soft">
                  Crafted by
                </p>

                <Link
                  to={`/creator/${craft.creatorId}`}
                  className="text-sm font-medium hover:text-amber-dark"
                >
                  {craft.creator}
                </Link>

              </div>

              {creator && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-ink-soft">
                  <MapPin size={12} />
                  {creator.location}
                </span>
              )}

            </div>

            {/* RATING */}

            <div className="flex items-center gap-3 mt-5">

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-border">

                <Star
                  size={15}
                  className="fill-amber text-amber"
                />

                <span className="text-sm font-medium">
                  {craft.rating ?? 5}
                </span>

              </div>

              <span className="text-sm text-ink-soft">
                {craft.reviews ?? 0} reviews
              </span>

            </div>

            {/* PRICE */}

            <div className="mt-7">

              <p className="font-display text-4xl">
                {formattedPrice}
              </p>

              <p className="text-xs text-ink-soft mt-1">
                Inclusive of applicable taxes
              </p>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-7 pt-7 border-t border-border">

              <h2 className="font-display text-2xl">
                About this piece
              </h2>

              <p className="text-sm text-ink-soft leading-7 mt-3">
                This handmade piece is carefully
                crafted with attention to detail and
                designed to bring warmth and character
                to your space.
              </p>

            </div>

            {/* MATERIAL */}

            <div className="mt-6">

              <h3 className="text-sm font-semibold">
                Materials
              </h3>

              <p className="text-sm text-ink-soft mt-1">
                {craft.materials ||
                  "Hand-selected quality materials"}
              </p>

            </div>

            {/* STOCK */}

            <div className="flex items-center gap-2 mt-5">

              <span
                className={`w-2 h-2 rounded-full ${
                  stockAvailable > 0
                    ? "bg-forest"
                    : "bg-rose"
                }`}
              />

              <span
                className={`text-sm font-medium ${
                  stockAvailable > 0
                    ? "text-forest"
                    : "text-rose"
                }`}
              >
                {stockAvailable > 0
                  ? `${stockAvailable} pieces available`
                  : "Currently out of stock"}
              </span>

            </div>

            {/* PURCHASE */}

            {stockAvailable > 0 ? (

              <div className="mt-7">

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* QUANTITY */}

                  <div className="flex items-center justify-between border border-border bg-white rounded-full px-2 py-1.5 sm:w-36">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream disabled:opacity-30"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="text-sm font-medium">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        stockAvailable
                      }
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream disabled:opacity-30"
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={
                      handleAddToCart
                    }
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                  >
                    <ShoppingBag size={17} />
                    Add to Cart
                  </button>

                </div>

              </div>

            ) : (

              <button
                disabled
                className="mt-7 w-full py-3.5 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
              >
                Out of Stock
              </button>

            )}

            {/* TOTAL */}

            {stockAvailable > 0 && (
              <div className="flex items-center justify-between mt-4 px-2">

                <span className="text-xs text-ink-soft">
                  {quantity} ×{" "}
                  {formattedPrice}
                </span>

                <span className="font-medium text-sm">
                  Total: ₹
                  {(
                    price * quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>
            )}

            {/* TRUST */}

            <div className="grid grid-cols-3 gap-3 mt-8 pt-7 border-t border-border">

              <div className="text-center">

                <div className="w-9 h-9 mx-auto rounded-xl bg-forest/10 flex items-center justify-center">

                  <Check
                    size={16}
                    className="text-forest"
                  />

                </div>

                <p className="text-[11px] text-ink-soft mt-2">
                  Handmade
                </p>

              </div>

              <div className="text-center">

                <div className="w-9 h-9 mx-auto rounded-xl bg-amber/10 flex items-center justify-center">

                  <Truck
                    size={16}
                    className="text-amber-dark"
                  />

                </div>

                <p className="text-[11px] text-ink-soft mt-2">
                  Secure delivery
                </p>

              </div>

              <div className="text-center">

                <div className="w-9 h-9 mx-auto rounded-xl bg-ink/5 flex items-center justify-center">

                  <ShieldCheck size={16} />

                </div>

                <p className="text-[11px] text-ink-soft mt-2">
                  Trusted seller
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            CREATOR
        ================================================== */}

        {creator && (
          <section className="mt-16">

            <div className="bg-white border border-border rounded-[28px] p-6 sm:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div>

                    <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                      Meet the creator
                    </p>

                    <h2 className="font-display text-2xl mt-1">
                      {creator.name}
                    </h2>

                    <p className="text-sm text-ink-soft mt-1">
                      {creator.specialty}
                    </p>

                  </div>

                </div>

                <Link
                  to={`/creator/${creator.id}`}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-border text-sm font-medium hover:border-amber"
                >
                  View Creator Profile
                </Link>

              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            RELATED CRAFTS
        ================================================== */}

        {relatedCrafts.length > 0 && (
          <section className="mt-16">

            <div className="mb-7">

              <p className="text-xs uppercase tracking-[0.2em] text-amber-dark font-semibold">
                You may also like
              </p>

              <h2 className="font-display text-3xl sm:text-4xl mt-2">
                More handmade pieces
              </h2>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">

              {relatedCrafts.map(
                (item) => (
                  <Link
                    key={item.id}
                    to={`/craft/${item.id}`}
                    className="group bg-white border border-border rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
                  >

                    <div className="relative aspect-square overflow-hidden bg-gray-100">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                    </div>

                    <div className="p-3.5">

                      <h3 className="font-medium text-sm leading-snug">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mt-3">

                        <span className="font-display text-lg">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="text-xs text-ink-soft">
                          ⭐{" "}
                          {item.rating}
                        </span>

                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>

          </section>
        )}

      </main>

      {/* ==================================================
          NOTIFICATION
      ================================================== */}

      {notification && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[390px] max-w-[calc(100vw-32px)]">

          <div className="relative overflow-hidden rounded-3xl bg-white border border-border shadow-2xl">

            <div className="flex items-start gap-5 p-5">

              <div className="w-14 h-14 shrink-0 rounded-2xl bg-forest/10 flex items-center justify-center">

                <Check
                  size={26}
                  className="text-forest"
                />

              </div>

              <div className="flex-1 min-w-0 pt-0.5">

                <p className="font-semibold text-base text-ink">
                  {notificationMessage ||
                    "Success"}
                </p>

                <p className="text-sm text-ink-soft mt-1.5 line-clamp-2">
                  {craft.name}
                </p>

                {notificationMessage ===
                  "Added to your cart" && (
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-dark mt-3 hover:underline"
                  >
                    View cart
                    <span>→</span>
                  </Link>
                )}

                {(notificationMessage ===
                  "Added to liked crafts" ||
                  notificationMessage ===
                    "Removed from liked crafts") && (
                  <Link
                    to="/wishlist"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-dark mt-3 hover:underline"
                  >
                    View liked crafts
                    <span>→</span>
                  </Link>
                )}

              </div>

            </div>

            <div className="h-1.5 bg-cream">

              <div
                className="h-full bg-amber animate-[shrink_3s_linear_forwards]"
                style={{
                  width: "100%",
                }}
              />

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          ANIMATION
      ================================================== */}

      <style>
        {`
          @keyframes shrink {
            from {
              width: 100%;
            }

            to {
              width: 0%;
            }
          }
        `}
      </style>

    </div>
  );
}