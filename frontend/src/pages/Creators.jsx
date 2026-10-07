import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Search, Star } from "lucide-react";
import { useCrafts } from "../context/CraftsContext";

export default function Creators() {
  const { creators } = useCrafts();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const locations = useMemo(() => {
    if (!Array.isArray(creators)) return [];
    const set = new Set();
    creators.forEach((c) => {
      if (c.location) set.add(c.location);
    });
    return Array.from(set);
  }, [creators]);

  const filteredCreators = useMemo(() => {
    if (!Array.isArray(creators)) return [];
    return creators.filter((creator) => {
      const matchesSearch =
        !search.trim() ||
        [creator.name, creator.specialty, creator.location, creator.skills]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(search.trim().toLowerCase()));

      const matchesLocation =
        selectedLocation === "all" ||
        creator.location?.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesLocation;
    });
  }, [creators, search, selectedLocation]);

  return (
    <div className="min-h-screen bg-cream font-body">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl text-ink">
              Craft<span className="text-amber">Connect</span>
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

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-forest font-medium">
          Meet the makers
        </p>

        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">
          The people behind the pieces
        </h1>

        <p className="text-ink-soft mt-4 max-w-2xl leading-relaxed">
          Discover independent creators who turn raw materials, traditional
          techniques, and imagination into handmade pieces worth keeping.
        </p>

        {/* Search & Location Filter */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search makers by name, craft or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:border-amber"
            />
          </div>

          {locations.length > 0 && (
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter creators by location"
              className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-ink focus:outline-none focus:border-amber"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* Creators Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredCreators.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-12 text-center my-8">
            <p className="text-ink-soft">
              No creators found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedLocation("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-dark hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <Link
                key={creator.id}
                to={`/creator/${creator.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-border hover:border-amber/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cover */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={creator.cover}
                      alt={creator.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* Profile */}
                  <div className="px-6 pb-2">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white -mt-10 relative"
                      onError={(e) => {
                        e.currentTarget.src = "https://i.pravatar.cc/150?img=32";
                      }}
                    />

                    <h2 className="font-display text-xl text-ink mt-4">
                      {creator.name}
                    </h2>

                    <p className="text-sm text-ink-soft mt-1">
                      {creator.specialty}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-4">
                      <MapPin size={14} />
                      {creator.location || "Independent Studio"}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  {/* Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-ink">
                      <Star size={14} className="fill-amber text-amber" />
                      <span className="font-medium">{creator.rating}</span>
                    </div>

                    <span className="text-xs text-ink-soft">
                      {creator.products} pieces
                    </span>
                  </div>

                  {/* View profile */}
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-amber-dark">
                    View profile
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
