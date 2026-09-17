// src/components/explore/CraftCard.jsx

import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  ShoppingBag,
} from "lucide-react";

export default function CraftCard({
  craft,
  wishlist = [],
  onWishlist,
  onAddToCart,
}) {
  const isWishlisted = wishlist.some(
    (id) =>
      String(id) === String(craft.id)
  );

  const formatPrice = (price) => {
    const value = Number(price);

    if (!Number.isFinite(value)) {
      return "₹0";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <article className="group min-w-0">

      {/* IMAGE */}

      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/70 shadow-sm">

        <Link
          to={`/craft/${craft.id}`}
          className="block w-full h-full"
        >

          {craft.image ? (

            <img
              src={craft.image}
              alt={craft.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />

          ) : (

            <div className="w-full h-full flex items-center justify-center bg-cream text-ink-soft text-sm">
              No image available
            </div>

          )}

        </Link>

        {/* IMAGE OVERLAY */}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* TAG */}

        {craft.tag && (

          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-semibold shadow-sm ${
              craft.tag === "New"
                ? "bg-forest text-white"
                : craft.tag === "Limited"
                ? "bg-rose text-white"
                : "bg-amber text-white"
            }`}
          >
            {craft.tag}
          </span>

        )}

        {/* WISHLIST */}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (onWishlist) {
              onWishlist(craft.id);
            }
          }}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all duration-300 ${
            isWishlisted
              ? "bg-white text-rose border-white scale-105"
              : "bg-white/90 text-ink-soft border-white/70 hover:text-rose hover:scale-105"
          }`}
        >

          <Heart
            size={17}
            className={
              isWishlisted
                ? "fill-rose"
                : ""
            }
          />

        </button>

      </div>

      {/* INFORMATION */}

      <div className="pt-3 px-0.5">

        <div className="flex items-center justify-between gap-2">

          <p className="text-[11px] uppercase tracking-wide text-ink-soft truncate">
            {craft.creator
              ? `by ${craft.creator}`
              : "Independent creator"}
          </p>

          {craft.rating && (

            <div className="shrink-0 flex items-center gap-1 text-xs text-ink-soft">

              <Star
                size={12}
                fill="#C96F4A"
                color="#C96F4A"
                strokeWidth={1.5}
              />

              <span>
                {craft.rating}
              </span>

            </div>

          )}

        </div>

        <Link to={`/craft/${craft.id}`}>

          <h3 className="font-medium text-ink text-sm sm:text-[15px] mt-1.5 leading-snug line-clamp-2 hover:text-amber-dark transition-colors">
            {craft.name}
          </h3>

        </Link>

        <div className="flex items-center justify-between gap-2 mt-2.5">

          <span className="font-display text-lg text-ink">
            {formatPrice(craft.price)}
          </span>

          {craft.location && (

            <span className="hidden sm:flex items-center gap-1 text-[10px] text-ink-soft truncate max-w-[45%]">

              <MapPin size={10} />

              {craft.location}

            </span>

          )}

        </div>

        {/* ADD TO CART */}

        {onAddToCart && (

          <button
            type="button"
            disabled={Number(craft.stock) <= 0}
            onClick={() => onAddToCart(craft)}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-2.5 text-xs font-medium text-ink transition-all hover:border-amber hover:bg-amber/5 hover:text-amber-dark disabled:cursor-not-allowed disabled:opacity-50"
          >

            <ShoppingBag size={14} />

            {Number(craft.stock) <= 0
              ? "Out of stock"
              : "Add to cart"}

          </button>

        )}

      </div>

    </article>
  );
}
