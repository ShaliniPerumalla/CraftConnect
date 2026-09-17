import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../utils/mockData";

const categoryImages = {
  woodwork:
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&auto=format&fit=crop",

  pottery:
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&auto=format&fit=crop",

  jewelry:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop",

  textiles:
    "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=700&auto=format&fit=crop",

  "wall-art":
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&auto=format&fit=crop&q=80",

  "home-decor":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&auto=format&fit=crop",

  candles:
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=700&auto=format&fit=crop&q=80",

  leather:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop",
};

export default function Categories() {
  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
              Explore craftsmanship
            </p>

            <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2">
              Shop by craft
            </h2>

            <p className="text-ink-soft mt-2 max-w-xl">
              Discover beautiful handmade pieces from independent
              creators, each with its own story and character.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-amber-dark hover:gap-3 transition-all"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">

          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/explore?category=${category.id}`}
              className="
                group
                relative
                h-[270px]
                sm:h-[285px]
                lg:h-[300px]
                rounded-[24px]
                overflow-hidden
                bg-white
                border
                border-white
                shadow-[0_8px_25px_rgba(60,45,35,0.08)]
                hover:-translate-y-1
                hover:shadow-[0_18px_40px_rgba(60,45,35,0.15)]
                transition-all
                duration-300
              "
            >

              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={categoryImages[category.id]}
                  alt={category.name}
                  loading="lazy"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-black/25
                to-black/5
              " />

              <div className="
                absolute
                top-4
                left-4
                w-9
                h-9
                rounded-full
                bg-white/90
                backdrop-blur-md
                flex
                items-center
                justify-center
                text-[11px]
                font-semibold
                text-ink
                shadow-sm
              ">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="
                absolute
                bottom-0
                left-0
                right-0
                p-5
              ">

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                ">
                  Handmade collection
                </p>

                <h3 className="
                  font-display
                  text-2xl
                  text-white
                  mt-1
                ">
                  {category.name}
                </h3>

                <div className="
                  flex
                  items-center
                  justify-between
                  mt-2
                ">

                  <span className="text-xs text-white/75">
                    {category.count} pieces
                  </span>

                  <span className="
                    text-xs
                    font-medium
                    text-white
                    opacity-0
                    translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all
                    duration-300
                  ">
                    Explore →
                  </span>

                </div>
              </div>

              <div className="
                absolute
                bottom-0
                left-0
                h-1
                w-0
                bg-amber
                group-hover:w-full
                transition-all
                duration-500
              " />

            </Link>
          ))}

        </div>

        <div className="sm:hidden flex justify-center mt-7">
          <Link
            to="/categories"
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              rounded-full
              bg-white
              border
              border-border
              text-sm
              font-medium
              text-ink
            "
          >
            View all categories
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}