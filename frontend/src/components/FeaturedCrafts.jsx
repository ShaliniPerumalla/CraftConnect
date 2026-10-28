import { Link } from "react-router-dom";
import { Heart, Star, ArrowRight } from "lucide-react";
import { useCrafts } from "../context/CraftsContext";

const fallbackImages = [
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=900&q=85",
  "/botanical-wall-art.jpg",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1602874801006-e26b7f3c1a8a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
];

const tagStyle = {
  Bestseller: "bg-amber text-white",
  Limited: "bg-rose text-white",
  New: "bg-forest text-white",
};

function getImage(craft, index) {
  if (craft?.image && typeof craft.image === "string") {
    return craft.image;
  }

  return fallbackImages[index % fallbackImages.length];
}

function formatPrice(price) {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FeaturedCrafts() {
  const { crafts } = useCrafts();
  const allCrafts = Array.isArray(crafts) ? crafts : [];
  const firstEight = allCrafts.slice(0, 8);
  const remainingCrafts = allCrafts.slice(8);

  const orderedCrafts = [
    ...remainingCrafts,
    ...firstEight,
  ];

  return (
    <section className="bg-white py-14 lg:py-20 border-y border-border">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">

          <div>
            <h2 className="font-display text-3xl text-ink">
              Fresh off the workbench
            </h2>

            <p className="text-ink-soft mt-1">
              Handpicked pieces from creators making right now.
            </p>
          </div>

          <Link
            to="/explore"
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-medium
              text-amber-dark
              hover:gap-2.5
              transition-all
              shrink-0
            "
          >
            View all
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">

          {orderedCrafts.map((craft, index) => {

            const originalIndex = crafts.findIndex(
              (item) => item.id === craft.id
            );

            return (
              <Link
                key={craft.id}
                to={`/craft/${craft.id}`}
                className="
                  group
                  block
                  shrink-0
                  w-64
                  sm:w-72
                  snap-start
                  rounded-2xl
                  bg-cream
                  border
                  border-border
                  overflow-hidden
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                <div className="relative aspect-square overflow-hidden bg-gray-100">

                  <img
                    src={getImage(craft, originalIndex >= 0 ? originalIndex : index)}
                    alt={craft.name}
                    loading="lazy"
                    className="
                      w-full
                      h-full
                      object-cover
                      object-center
                      group-hover:scale-105
                      transition-transform
                      duration-500
                    "
                    onError={(event) => {
                      const fallback =
                        fallbackImages[
                          (originalIndex >= 0 ? originalIndex : index) %
                            fallbackImages.length
                        ];

                      if (event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {originalIndex >= 0 && originalIndex < 8 && (
                    <div
                      className="
                        absolute
                        top-3
                        left-3
                        w-9
                        h-9
                        rounded-full
                        bg-white/95
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-semibold
                        text-ink
                        shadow-sm
                      "
                    >
                      {String(originalIndex + 1).padStart(2, "0")}
                    </div>
                  )}

                  {craft.tag && (
                    <span
                      className={`
                        absolute
                        top-3
                        left-14
                        text-[11px]
                        font-medium
                        px-2.5
                        py-1
                        rounded-full
                        ${tagStyle[craft.tag] || "bg-ink text-white"}
                      `}
                    >
                      {craft.tag}
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={`Add ${craft.name} to wishlist`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="
                      absolute
                      top-3
                      right-3
                      p-2
                      rounded-full
                      bg-white/90
                      text-ink-soft
                      hover:text-rose
                      shadow-sm
                      transition-colors
                    "
                  >
                    <Heart size={15} />
                  </button>

                </div>

                <div className="p-4">

                  <p className="text-xs text-ink-soft">
                    by {craft.creator}
                  </p>

                  <h3 className="font-medium text-ink text-sm mt-1 leading-snug line-clamp-2">
                    {craft.name}
                  </h3>

                  <div className="flex items-center justify-between mt-3">

                    <span className="font-display text-lg text-ink">
                      {formatPrice(craft.price)}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-ink-soft">

                      <Star
                        size={14}
                        fill="#D4A017"
                        color="#D4A017"
                        strokeWidth={1.5}
                      />

                      {craft.rating}

                    </span>

                  </div>

                </div>

              </Link>
            );
          })}

        </div>

      </div>

    </section>
  );
}
