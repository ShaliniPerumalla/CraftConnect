// src/components/explore/FilterSidebar.jsx

import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  Sparkles,
} from "lucide-react";

// ================================
// CATEGORY FILTERS
// ================================

const categories = [
  "All Crafts",
  "Woodwork",
  "Pottery",
  "Jewelry",
  "Textiles",
  "Wall Art",
  "Candles",
  "Leather",
];

// ================================
// INDIAN PRICE RANGES
// ================================

const priceRanges = [
  {
    label: "All prices",
    value: "",
  },
  {
    label: "Under ₹1,000",
    value: "0-1000",
  },
  {
    label: "₹1,000 – ₹2,500",
    value: "1000-2500",
  },
  {
    label: "₹2,500 – ₹5,000",
    value: "2500-5000",
  },
  {
    label: "₹5,000 – ₹10,000",
    value: "5000-10000",
  },
  {
    label: "₹10,000+",
    value: "10000+",
  },
];

// ================================
// FILTER SIDEBAR
// ================================

export default function FilterSidebar({
  category,
  setCategory,
  price,
  setPrice,
  rating,
  setRating,
  onClear,
  availableCategories,
}) {
  const displayCategories =
    Array.isArray(availableCategories) && availableCategories.length > 0
      ? [
          "All Crafts",
          ...availableCategories.map((item) =>
            typeof item === "string" ? item : item.name
          ),
        ]
      : categories;
  return (
    <aside className="w-full lg:w-64 shrink-0">

      {/* ================================ */}
      {/* FILTER HEADER */}
      {/* ================================ */}

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-lg bg-amber-light/30 flex items-center justify-center">
            <SlidersHorizontal
              size={17}
              className="text-forest"
            />
          </div>

          <h2 className="font-display text-lg text-ink">
            Discover
          </h2>

        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-ink-soft hover:text-amber-dark transition-colors"
        >
          <RotateCcw size={13} />
          Reset
        </button>

      </div>

      {/* ================================ */}
      {/* CATEGORY */}
      {/* ================================ */}

      <div className="pb-6 border-b border-border">

        <h3 className="text-sm font-medium text-ink mb-3">
          What are you looking for?
        </h3>

        <div className="space-y-1.5">

          {displayCategories.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-all ${
                category === item
                  ? "bg-amber-light/30 text-amber-dark font-medium shadow-sm"
                  : "text-ink-soft hover:bg-cream hover:text-ink"
              }`}
            >

              <span>{item}</span>

              {category === item && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              )}

            </button>

          ))}

        </div>

      </div>

      {/* ================================ */}
      {/* PRICE */}
      {/* ================================ */}

      <div className="py-6 border-b border-border">

        <div className="flex items-center gap-2 mb-3">

          <Sparkles
            size={14}
            className="text-amber"
          />

          <h3 className="text-sm font-medium text-ink">
            Find your price
          </h3>

        </div>

        <div className="space-y-2">

          {priceRanges.map((item) => (

            <label
              key={item.value}
              className={`flex items-center gap-2.5 text-sm cursor-pointer rounded-lg px-2.5 py-2 transition-colors ${
                price === item.value
                  ? "bg-amber-light/20 text-amber-dark font-medium"
                  : "text-ink-soft hover:bg-cream hover:text-ink"
              }`}
            >

              <input
                type="radio"
                name="price"
                checked={price === item.value}
                onChange={() => setPrice(item.value)}
                className="accent-amber"
              />

              <span>{item.label}</span>

            </label>

          ))}

        </div>

      </div>

      {/* ================================ */}
      {/* CUSTOMER RATING */}
      {/* ================================ */}

      <div className="py-6">

        <h3 className="text-sm font-medium text-ink mb-3">
          Loved by shoppers
        </h3>

        <div className="space-y-2.5">

          {[4, 3, 2].map((value) => (

            <button
              key={value}
              type="button"
              onClick={() =>
                setRating(rating === value ? 0 : value)
              }
              className={`flex items-center gap-2 text-sm transition-colors ${
                rating === value
                  ? "text-amber-dark"
                  : "text-ink-soft hover:text-ink"
              }`}
            >

              <div className="flex items-center gap-0.5">

                {Array.from({ length: 5 }).map(
                  (_, index) => (

                    <Star
                      key={index}
                      size={13}
                      className={
                        index < value
                          ? "fill-amber text-amber"
                          : "text-border"
                      }
                    />

                  )
                )}

              </div>

              <span>{value}+ stars</span>

            </button>

          ))}

        </div>

        {/* Small discovery message */}

        <div className="mt-5 p-3 rounded-xl bg-amber-light/15 border border-amber/10">

          <p className="text-xs text-ink-soft leading-relaxed">
            ✨ Filter by your style, budget, and
            customer ratings to find something
            special.
          </p>

        </div>

      </div>

    </aside>
  );
}