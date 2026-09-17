import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import SearchBar from "../components/explore/SearchBar";
import FilterSidebar from "../components/explore/FilterSidebar";
import SortDropdown from "../components/explore/SortDropdown";
import CraftGrid from "../components/explore/CraftGrid";
import EmptyResults from "../components/explore/EmptyResults";

import { crafts } from "../utils/mockData";

export default function Explore() {
  const [searchParams] = useSearchParams();

  // Read category from URL
  // Example: /explore?category=woodwork
  const initialCategory =
    searchParams.get("category") || "All Crafts";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState([]);

  const filteredCrafts = useMemo(() => {
    let result = [...crafts];

    // -------------------------
    // SEARCH
    // -------------------------
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((craft) =>
        [
          craft.name,
          craft.creator,
          craft.category,
          craft.description,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(query)
          )
      );
    }

    // -------------------------
    // CATEGORY
    // -------------------------
    if (category !== "All Crafts") {
      result = result.filter(
        (craft) =>
          craft.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // -------------------------
    // PRICE
    // -------------------------
    if (price === "0-25") {
      result = result.filter(
        (craft) => craft.price < 25
      );
    }

    if (price === "25-50") {
      result = result.filter(
        (craft) =>
          craft.price >= 25 &&
          craft.price <= 50
      );
    }

    if (price === "50-100") {
      result = result.filter(
        (craft) =>
          craft.price > 50 &&
          craft.price <= 100
      );
    }

    if (price === "100+") {
      result = result.filter(
        (craft) => craft.price > 100
      );
    }

    // -------------------------
    // RATING
    // -------------------------
    if (rating > 0) {
      result = result.filter(
        (craft) =>
          Number(craft.rating) >= rating
      );
    }

    // -------------------------
    // SORTING
    // -------------------------
    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating) -
          Number(a.rating)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
    }

    return result;
  }, [
    search,
    category,
    price,
    rating,
    sort,
  ]);

  // -------------------------
  // WISHLIST
  // -------------------------
  function toggleWishlist(id) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  // -------------------------
  // CLEAR FILTERS
  // -------------------------
  function clearFilters() {
    setSearch("");
    setCategory("All Crafts");
    setPrice("");
    setRating(0);
    setSort("featured");
  }

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* HEADER */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              className="font-display text-2xl text-ink"
            >
              Craft
              <span className="text-amber">
                Connect
              </span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={15} />
              Home
            </Link>

          </div>

        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

          <p className="text-xs uppercase tracking-[0.18em] text-forest font-medium">
            The CraftConnect collection
          </p>

          <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">
            Explore handmade
          </h1>

          <p className="text-ink-soft mt-3 max-w-xl">
            Discover thoughtfully made pieces
            from independent creators. Every
            object has a maker and every maker
            has a story.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* MOBILE FILTER + SORT */}
        <div className="lg:hidden flex items-center justify-between mb-5">

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("mobile-filters")
                ?.classList.toggle("hidden");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-ink"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <SortDropdown
            value={sort}
            onChange={setSort}
          />

        </div>

        <div className="flex gap-8 lg:gap-12">

          {/* FILTERS */}
          <div
            id="mobile-filters"
            className="hidden lg:block w-full lg:w-auto"
          >
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

            {/* DESKTOP TOOLBAR */}
            <div className="hidden lg:flex items-center justify-between mb-6">

              <p className="text-sm text-ink-soft">

                <span className="font-medium text-ink">
                  {filteredCrafts.length}
                </span>{" "}

                handmade pieces

              </p>

              <SortDropdown
                value={sort}
                onChange={setSort}
              />

            </div>

            {/* MOBILE COUNT */}
            <div className="lg:hidden mb-5">

              <p className="text-sm text-ink-soft">

                <span className="font-medium text-ink">
                  {filteredCrafts.length}
                </span>{" "}

                handmade pieces

              </p>

            </div>

            {/* CRAFT GRID */}
            {filteredCrafts.length > 0 ? (

              <CraftGrid
                crafts={filteredCrafts}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
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



