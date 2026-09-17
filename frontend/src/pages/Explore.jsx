// src/pages/Explore.jsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import SearchBar from "../components/explore/SearchBar";
import FilterSidebar from "../components/explore/FilterSidebar";
import SortDropdown from "../components/explore/SortDropdown";
import CraftGrid from "../components/explore/CraftGrid";
import EmptyResults from "../components/explore/EmptyResults";

import { useCrafts } from "../context/CraftsContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Explore() {
  const { crafts } = useCrafts();

  const {
    wishlist,
    toggleWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Crafts");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("featured");

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  // ======================================================
  // FILTER + SEARCH + SORT
  // ======================================================

  const filteredCrafts = useMemo(() => {
    let result = Array.isArray(crafts)
      ? [...crafts]
      : [];

    // SEARCH
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((craft) =>
        [
          craft.name,
          craft.creator,
          craft.category,
          craft.description,
          craft.materials,
          craft.location,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
      );
    }

    // CATEGORY
    if (category !== "All Crafts") {
      result = result.filter((craft) => {
        const craftCategory =
          String(craft.category || "")
            .toLowerCase()
            .trim();

        const selectedCategory =
          category.toLowerCase().trim();

        return (
          craftCategory === selectedCategory ||
          craftCategory.includes(selectedCategory) ||
          selectedCategory.includes(craftCategory)
        );
      });
    }

    // PRICE
    result = result.filter((craft) => {
      const craftPrice = Number(craft.price) || 0;

      if (!price) {
        return true;
      }

      if (price === "0-1000") {
        return craftPrice < 1000;
      }

      if (price === "1000-2500") {
        return (
          craftPrice >= 1000 &&
          craftPrice <= 2500
        );
      }

      if (price === "2500-5000") {
        return (
          craftPrice > 2500 &&
          craftPrice <= 5000
        );
      }

      if (price === "5000-10000") {
        return (
          craftPrice > 5000 &&
          craftPrice <= 10000
        );
      }

      if (price === "10000+") {
        return craftPrice > 10000;
      }

      return true;
    });

    // RATING
    if (rating > 0) {
      result = result.filter(
        (craft) =>
          Number(craft.rating || 0) >= rating
      );
    }

    // SORT
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => {
        const aTime =
          Number(a.createdAt) ||
          Number(a.id?.replace(/\D/g, "")) ||
          0;

        const bTime =
          Number(b.createdAt) ||
          Number(b.id?.replace(/\D/g, "")) ||
          0;

        return bTime - aTime;
      });
    }

    return result;
  }, [
    crafts,
    search,
    category,
    price,
    rating,
    sort,
  ]);

  // ======================================================
  // WISHLIST
  // ======================================================

  function handleWishlist(craftId) {
    const craft = crafts.find(
      (item) =>
        String(item.id) === String(craftId)
    );

    if (!craft) {
      return;
    }

    toggleWishlist(craft);
  }

  // ======================================================
  // ADD TO CART
  // ======================================================

  function handleAddToCart(craft) {
    if (!craft) {
      return;
    }

    addToCart(craft);
  }

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  function clearFilters() {
    setSearch("");
    setCategory("All Crafts");
    setPrice("");
    setRating(0);
    setSort("featured");
  }

  // ======================================================
  // ACTIVE FILTER COUNT
  // ======================================================

  const activeFilterCount = [
    category !== "All Crafts",
    price !== "",
    rating > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-border">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              className="group font-display text-2xl sm:text-3xl tracking-tight"
            >
              Craft
              <span className="text-amber transition-colors group-hover:text-amber-dark">
                Connect
              </span>
            </Link>

            <Link
              to="/"
              className="group flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />
              Home
            </Link>

          </div>

        </div>

      </header>

      {/* ==================================================
          HERO / INTRO
      ================================================== */}

      <section className="relative overflow-hidden">

        {/* Decorative background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-light/20 blur-3xl pointer-events-none" />

        <div className="absolute top-40 -left-32 w-72 h-72 rounded-full bg-forest/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-10">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber/20 bg-white/60 text-xs font-medium text-forest">

              <Sparkles size={13} />

              The CraftConnect collection

            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mt-5">

              Discover things

              <br />

              <span className="italic text-amber-dark">
                made with meaning.
              </span>

            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">

              Explore thoughtfully handmade pieces
              from independent creators. Every object
              has a maker, a process, and a story.

            </p>

          </div>

          {/* SEARCH */}

          <div className="mt-9 max-w-3xl">

            <SearchBar
              value={search}
              onChange={setSearch}
            />

          </div>

        </div>

      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* MOBILE CONTROLS */}

        <div className="lg:hidden flex items-center justify-between gap-3 mb-6">

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen(
                (previous) => !previous
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-medium hover:border-amber transition-colors"
          >

            <SlidersHorizontal size={16} />

            Filters

            {activeFilterCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber text-white text-[11px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}

          </button>

          <SortDropdown
            value={sort}
            onChange={setSort}
          />

        </div>

        {/* MOBILE FILTER PANEL */}

        {mobileFiltersOpen && (

          <div className="lg:hidden mb-7 bg-white rounded-2xl border border-border p-5 shadow-sm">

            <div className="flex items-center justify-between mb-4">

              <h2 className="font-display text-xl">
                Filters
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:text-ink"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>

            </div>

            <FilterSidebar
              category={category}
              setCategory={setCategory}
              price={price}
              setPrice={setPrice}
              rating={rating}
              setRating={setRating}
              onClear={clearFilters}
            />

          </div>

        )}

        <div className="flex gap-8 lg:gap-12">

          {/* DESKTOP FILTER SIDEBAR */}

          <div className="hidden lg:block">

            <FilterSidebar
              category={category}
              setCategory={setCategory}
              price={price}
              setPrice={setPrice}
              rating={rating}
              setRating={setRating}
              onClear={clearFilters}
            />

          </div>

          {/* PRODUCTS */}

          <section className="flex-1 min-w-0">

            {/* TOOLBAR */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-sm text-ink-soft">

                  <span className="font-semibold text-ink">
                    {filteredCrafts.length}
                  </span>{" "}

                  handmade{" "}
                  {filteredCrafts.length === 1
                    ? "piece"
                    : "pieces"}

                </p>

                {(search ||
                  category !== "All Crafts" ||
                  price ||
                  rating > 0) && (

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-amber-dark hover:underline mt-1"
                  >
                    Clear all filters
                  </button>

                )}

              </div>

              <div className="hidden lg:block">

                <SortDropdown
                  value={sort}
                  onChange={setSort}
                />

              </div>

            </div>

            {/* GRID */}

            {filteredCrafts.length > 0 ? (

              <CraftGrid
                crafts={filteredCrafts}
                wishlist={wishlist.map(
                  (item) => item.id
                )}
                onWishlist={handleWishlist}
                onAddToCart={handleAddToCart}
              />

            ) : (

              <EmptyResults
                onClear={clearFilters}
              />

            )}

          </section>

        </div>

      </main>

    </div>
  );
}
