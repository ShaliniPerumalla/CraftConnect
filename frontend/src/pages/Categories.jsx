// src/pages/Categories.jsx

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Hammer,
  Package,
  Gem,
  Shirt,
  Palette,
  Home,
  Flower2,
  Briefcase,
} from "lucide-react";

import { categories as defaultCategories } from "../utils/mockData";
import { useCrafts } from "../context/CraftsContext";

const iconMap = {
  Hammer,
  Package,
  Gem,
  Shirt,
  Palette,
  Home,
  Flower2,
  Briefcase,
};

const categoryImages = {
  woodwork:
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&auto=format&fit=crop",

  pottery:
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop",

  jewelry:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop",

  textiles:
    "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=300&auto=format&fit=crop",

  "wall-art":
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&auto=format&fit=crop",

  "home-decor":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop",

  candles:
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop",

  leather:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop",
};

const categoryDescriptions = {
  woodwork:
    "Handcrafted pieces shaped from natural materials.",

  pottery:
    "Beautiful ceramics created and finished by hand.",

  jewelry:
    "Unique pieces designed with attention to detail.",

  textiles:
    "Traditional techniques transformed into modern designs.",

  "wall-art":
    "Creative pieces that bring character to your space.",

  "home-decor":
    "Thoughtful objects made for beautiful homes.",

  candles:
    "Hand-poured creations for warmth and atmosphere.",

  leather:
    "Durable handcrafted goods made for everyday use.",
};

export default function Categories() {
  const { categories } = useCrafts();
  return (
    <div className="min-h-screen bg-cream">

      {/* HEADER */}

      <header className="bg-white border-b border-border">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              className="font-display text-2xl text-ink"
            >
              Craft<span className="text-amber">Connect</span>
            </Link>

            <Link
              to="/"
              className="
                flex
                items-center
                gap-2
                text-sm
                text-ink-soft
                hover:text-amber-dark
                transition-colors
              "
            >
              <ArrowLeft size={16} />
              Back home
            </Link>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-10
        lg:py-14
      ">

        {/* TITLE */}

        <div className="
          flex
          items-end
          justify-between
          mb-8
        ">

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.22em]
              text-forest
              font-semibold
            ">
              Discover handmade
            </p>

            <h1 className="
              font-display
              text-3xl
              sm:text-4xl
              lg:text-5xl
              text-ink
              mt-2
            ">
              Shop by craft
            </h1>

            <p className="
              text-sm
              sm:text-base
              text-ink-soft
              mt-2
            ">
              Find something made with skill, creativity and care.
            </p>

          </div>


          <Link
            to="/explore"
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
            Browse everything
            <ArrowRight size={15} />
          </Link>

        </div>


        {/* CATEGORY GRID */}

        <div className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
          lg:gap-5
        ">

          {categories.map((category, index) => {

            const Icon = iconMap[category.icon] || Package;

            return (
              <Link
                key={category.id}
                to={`/explore?category=${category.id}`}
                className="
                  group
                  relative
                  bg-white
                  border
                  border-border
                  rounded-2xl
                  p-5
                  sm:p-6
                  min-h-[245px]
                  flex
                  flex-col
                  justify-between
                  overflow-hidden
                  hover:-translate-y-1
                  hover:shadow-[0_18px_40px_rgba(60,45,35,0.12)]
                  hover:border-amber/40
                  transition-all
                  duration-300
                "
              >

                {/* TOP SECTION */}

                <div className="
                  flex
                  items-start
                  justify-between
                ">

                  {/* IMAGE + ICON */}

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    {/* SMALL CATEGORY IMAGE */}

                    <div className="
                      w-16
                      h-16
                      rounded-xl
                      overflow-hidden
                      bg-cream
                      border
                      border-border
                      shadow-sm
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    ">

                      <img
                        src={category.image_url || categoryImages[category.id] || "/botanical-wall-art.jpg"}
                        alt={category.name}
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          object-center
                        "
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />

                    </div>


                    {/* CATEGORY ICON */}

                    <div className="
                      hidden
                      sm:flex
                      w-9
                      h-9
                      rounded-xl
                      bg-amber-light/40
                      items-center
                      justify-center
                      group-hover:bg-amber
                      transition-colors
                    ">

                      <Icon
                        size={17}
                        strokeWidth={1.6}
                        className="
                          text-amber-dark
                          group-hover:text-white
                          transition-colors
                        "
                      />

                    </div>

                  </div>


                  {/* NUMBER */}

                  <span className="
                    text-[10px]
                    tracking-widest
                    font-semibold
                    text-ink-soft
                  ">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="
                  relative
                  z-10
                  mt-6
                ">

                  <h2 className="
                    font-display
                    text-xl
                    sm:text-2xl
                    text-ink
                    group-hover:text-amber-dark
                    transition-colors
                  ">
                    {category.name}
                  </h2>


                  <p className="
                    text-xs
                    sm:text-sm
                    text-ink-soft
                    leading-relaxed
                    mt-2
                    max-w-[240px]
                  ">
                    {categoryDescriptions[category.id] ||
                      "Discover beautiful handmade creations from independent makers."}
                  </p>


                  {/* BOTTOM ROW */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    mt-5
                    pt-4
                    border-t
                    border-border
                  ">

                    <span className="
                      text-xs
                      text-ink-soft
                    ">
                      {category.count} pieces
                    </span>


                    <span className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-amber-dark
                      group-hover:gap-2.5
                      transition-all
                    ">
                      Explore
                      <ArrowRight size={13} />
                    </span>

                  </div>

                </div>


                {/* DECORATIVE CIRCLE */}

                <div className="
                  absolute
                  -right-10
                  -bottom-10
                  w-28
                  h-28
                  rounded-full
                  bg-amber-light/20
                  group-hover:scale-125
                  transition-transform
                  duration-500
                  pointer-events-none
                " />

              </Link>
            );
          })}

        </div>


        {/* MOBILE BUTTON */}

        <div className="
          sm:hidden
          flex
          justify-center
          mt-8
        ">

          <Link
            to="/explore"
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
            Browse all crafts
            <ArrowRight size={15} />
          </Link>

        </div>

      </main>

    </div>
  );
}