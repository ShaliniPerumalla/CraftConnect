import { Link } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";

export default function CraftCard({ craft, wishlist, onWishlist }) {
  const isWishlisted = wishlist.includes(craft.id);

  const formatPrice = (price) => {
    const value = Number(price);

    if (!Number.isFinite(value)) {
      return "₹0";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <article className="group">

      <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream">

        <Link to={`/craft/${craft.id}`} className="block w-full h-full">
          <img
            src={craft.image}
            alt={craft.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </Link>

        {craft.tag && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium ${
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

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onWishlist(craft.id);
          }}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            isWishlisted
              ? "bg-white text-rose"
              : "bg-white/90 text-ink-soft hover:text-rose"
          }`}
        >
          <Heart
            size={17}
            className={isWishlisted ? "fill-rose" : ""}
          />
        </button>
      </div>

      <div className="pt-3 px-0.5">

        <div className="flex items-center justify-between gap-2">

          <p className="text-xs text-ink-soft">
            by {craft.creator}
          </p>

          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <Star
              size={13}
              fill="#D4A017"
              color="#D4A017"
              strokeWidth={1.5}
            />
            <span>{craft.rating}</span>
          </div>

        </div>

        <Link to={`/craft/${craft.id}`}>
          <h3 className="font-medium text-ink text-sm mt-1 leading-snug line-clamp-2 hover:text-amber-dark transition-colors">
            {craft.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2.5">

          <span className="font-display text-lg text-ink">
            {formatPrice(craft.price)}
          </span>

          {craft.location && (
            <span className="flex items-center gap-1 text-[11px] text-ink-soft">
              <MapPin size={11} />
              {craft.location}
            </span>
          )}

        </div>

      </div>

    </article>
  );
}
