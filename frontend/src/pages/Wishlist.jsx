// src/pages/Wishlist.jsx

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 lg:h-20 flex items-center justify-between">

            <Link
              to="/"
              className="font-display text-2xl sm:text-3xl text-ink"
            >
              Craft
              <span className="text-amber">
                Connect
              </span>
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
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

        {/* ==================================================
            TITLE
        ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-rose/10 flex items-center justify-center">

                  <Heart
                    size={21}
                    className="text-rose fill-current"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-rose font-semibold">
                    Your collection
                  </p>

                  <h1 className="font-display text-4xl sm:text-5xl mt-1">
                    Liked Crafts
                  </h1>

                </div>

              </div>

              <p className="text-sm text-ink-soft mt-4">
                {wishlistCount === 0
                  ? "You haven't liked any crafts yet."
                  : `${wishlistCount} ${
                      wishlistCount === 1
                        ? "craft"
                        : "crafts"
                    } saved to your collection.`}
              </p>

            </div>

            {wishlistCount > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border bg-white text-sm text-ink-soft hover:text-rose hover:border-rose transition-colors"
              >
                <Trash2 size={15} />
                Clear all
              </button>
            )}

          </div>

        </section>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {wishlist.length === 0 ? (

          <section className="min-h-[420px] flex items-center justify-center">

            <div className="max-w-md w-full text-center bg-white border border-border rounded-[28px] p-8 sm:p-12 shadow-sm">

              <div className="w-20 h-20 mx-auto rounded-full bg-rose/10 flex items-center justify-center">

                <Heart
                  size={34}
                  className="text-rose"
                />

              </div>

              <h2 className="font-display text-3xl mt-6">
                No liked crafts yet
              </h2>

              <p className="text-sm text-ink-soft leading-6 mt-3">
                When you find something you love, tap the
                heart icon to save it here.
              </p>

              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 mt-7 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
              >
                <ShoppingBag size={17} />
                Explore Crafts
              </Link>

            </div>

          </section>

        ) : (

          /* ==================================================
             LIKED CRAFTS
          ================================================== */

          <section>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">

              {wishlist.map((craft) => (

                <article
                  key={craft.id}
                  className="group bg-white border border-border rounded-[22px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    <Link
                      to={`/craft/${craft.id}`}
                      className="block w-full h-full"
                    >

                      <img
                        src={craft.image}
                        alt={craft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                    </Link>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(craft.id)
                      }
                      aria-label={`Remove ${craft.name} from liked crafts`}
                      title="Remove from liked crafts"
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-colors"
                    >
                      <Heart
                        size={18}
                        className="fill-current"
                      />
                    </button>

                    {craft.tag && (
                      <span className="absolute left-3 bottom-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-semibold text-ink shadow-sm">
                        {craft.tag}
                      </span>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-4">

                    <Link
                      to={`/craft/${craft.id}`}
                      className="block"
                    >

                      <h2 className="font-medium text-sm leading-snug line-clamp-2 hover:text-amber-dark transition-colors">
                        {craft.name}
                      </h2>

                    </Link>

                    <p className="text-xs text-ink-soft mt-1.5">
                      Handmade by {craft.creator}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-4">

                      <span className="font-display text-xl">
                        ₹
                        {Number(
                          craft.price || 0
                        ).toLocaleString("en-IN")}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-ink-soft">

                        <span>
                          ⭐
                        </span>

                        {craft.rating ?? 5}

                      </span>

                    </div>

                    {/* VIEW */}

                    <Link
                      to={`/craft/${craft.id}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-ink text-cream text-xs font-medium hover:bg-amber-dark transition-colors"
                    >
                      <ShoppingBag size={14} />
                      View Craft
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}
