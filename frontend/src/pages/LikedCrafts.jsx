import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Trash2,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCrafts } from "../context/CraftsContext";
import { useWishlist } from "../context/WishlistContext";

export default function LikedCrafts() {
  const { crafts } = useCrafts();

  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const likedCrafts = crafts.filter((craft) =>
    wishlist.some(
      (id) =>
        String(id) === String(craft.id)
    )
  );

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <div className="flex items-center gap-4 mt-7">

            <div className="w-14 h-14 rounded-2xl bg-rose/10 flex items-center justify-center">

              <Heart
                size={27}
                className="text-rose fill-current"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.18em] text-rose font-semibold">
                Your Collection
              </p>

              <h1 className="font-display text-4xl sm:text-5xl mt-1">
                Liked Crafts
              </h1>

            </div>

          </div>

          <p className="text-sm text-ink-soft mt-3">
            Crafts you've saved because you love them.
          </p>

        </div>

        {/* EMPTY STATE */}

        {likedCrafts.length === 0 ? (

          <div className="bg-white border border-border rounded-[28px] p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-rose/10 flex items-center justify-center">

              <Heart
                size={34}
                className="text-rose"
              />

            </div>

            <h2 className="font-display text-3xl mt-5">
              No liked crafts yet
            </h2>

            <p className="text-sm text-ink-soft mt-2 max-w-md mx-auto">
              When you find a craft you love, click the
              heart button to save it here.
            </p>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
            >
              Explore Crafts
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {likedCrafts.map((craft) => (

              <article
                key={craft.id}
                className="group bg-white border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >

                {/* IMAGE */}

                <div className="relative aspect-square overflow-hidden bg-gray-100">

                  <Link to={`/craft/${craft.id}`}>

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
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-colors"
                    aria-label="Remove from liked crafts"
                  >
                    <Trash2 size={17} />
                  </button>

                  {/* TAG */}

                  {craft.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-semibold shadow-sm">
                      {craft.tag}
                    </span>
                  )}

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-forest font-semibold">
                    {String(craft.category).replace(
                      "-",
                      " "
                    )}
                  </p>

                  <Link to={`/craft/${craft.id}`}>

                    <h2 className="font-display text-lg mt-2 line-clamp-2">
                      {craft.name}
                    </h2>

                  </Link>

                  <div className="flex items-center justify-between mt-4">

                    <span className="font-display text-lg">
                      ₹
                      {Number(
                        craft.price || 0
                      ).toLocaleString("en-IN")}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                      <Star
                        size={13}
                        className="fill-amber text-amber"
                      />
                      {craft.rating ?? 5}
                    </span>

                  </div>

                  <Link
                    to={`/craft/${craft.id}`}
                    className="block text-center mt-4 py-2.5 rounded-xl bg-ink text-cream text-xs font-medium hover:bg-amber-dark transition-colors"
                  >
                    View Craft
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

      <Footer />

    </div>
  );
}