import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { creators } from "../utils/mockData";

export default function FeaturedCreators() {
  const featuredCreators = creators.slice(0, 4);

  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
              Independent creators
            </p>

            <h2 className="font-display text-3xl lg:text-4xl text-ink mt-2">
              Meet the makers
            </h2>

            <p className="text-ink-soft mt-2 max-w-xl">
              Discover the people behind the handmade pieces and support
              independent creators.
            </p>
          </div>

          <Link
            to="/creators"
            className="
              hidden
              sm:flex
              items-center
              gap-2
              text-sm
              font-medium
              text-amber-dark
              hover:gap-3
              transition-all
            "
          >
            View all creators
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredCreators.map((creator) => (
            <Link
              key={creator.id}
              to={`/creator/${creator.id}`}
              className="
                group
                block
                bg-white
                rounded-2xl
                border
                border-border
                overflow-hidden
                hover:-translate-y-1
                hover:shadow-lg
                transition-all
                duration-300
              "
            >

              <div className="relative h-24 overflow-hidden bg-gray-100">
                <img
                  src={creator.cover}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition-transform
                    duration-500
                  "
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="px-5 pb-5">

                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="
                    relative
                    z-10
                    w-16
                    h-16
                    -mt-8
                    rounded-full
                    object-cover
                    border-4
                    border-white
                    bg-white
                    shadow-sm
                  "
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <h3 className="font-display text-lg text-ink mt-3">
                  {creator.name}
                </h3>

                <p className="text-sm text-ink-soft mt-1 line-clamp-1">
                  {creator.specialty}
                </p>

                <div className="flex items-center gap-1.5 mt-3 text-xs text-ink-soft">
                  <MapPin size={13} />
                  <span>{creator.location}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">

                  <div className="flex items-center gap-1 text-sm text-ink">
                    <Star
                      size={14}
                      fill="#D4A017"
                      color="#D4A017"
                      strokeWidth={1.5}
                    />
                    <span>{creator.rating}</span>
                  </div>

                  <span className="text-xs text-ink-soft">
                    {creator.products} pieces
                  </span>

                </div>

              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden flex justify-center mt-7">
          <Link
            to="/creators"
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
            View all creators
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}