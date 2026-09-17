
// src/pages/CreatorProfile.jsx

import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Star,
  LayoutDashboard,
} from "lucide-react";

import { crafts, creators } from "../utils/mockData";

export default function CreatorProfile() {
  const { id } = useParams();

  // Find the creator using the URL id
  const creator = creators.find((item) => item.id === id);

  // Creator not found
  if (!creator) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink">
            Creator not found
          </h1>

          <Link
            to="/creators"
            className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-amber-dark hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} />
            Back to creators
          </Link>
        </div>
      </div>
    );
  }

  // Get all crafts belonging to this creator
  const creatorCrafts = crafts.filter(
    (craft) =>
      craft.creatorId === creator.id ||
      craft.creator === creator.name
  );

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* ======================================== */}
      {/* HEADER */}
      {/* ======================================== */}

      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 min-h-[72px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl text-ink shrink-0"
          >
            Craft<span className="text-amber">Connect</span>
          </Link>

          {/* Back button */}
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
          >
            <ArrowLeft size={15} />

            <span className="hidden sm:inline">
              Back to creators
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

        </div>
      </header>

      {/* ======================================== */}
      {/* MAIN CONTENT */}
      {/* ======================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* ======================================== */}
        {/* CREATOR PROFILE CARD */}
        {/* ======================================== */}

        <section className="bg-white rounded-[28px] border border-border overflow-hidden shadow-sm">

          {/* Cover image */}
          <div className="relative h-40 sm:h-52 lg:h-60 overflow-hidden">

            <img
              src={creator.cover}
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          </div>

          {/* Creator information */}
          <div className="px-5 sm:px-8 lg:px-10 pb-7">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 relative">

              {/* Avatar */}
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-[5px] border-white shadow-lg"
              />

              <div className="flex-1 sm:pb-2">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  {/* Name and specialty */}
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl text-ink">
                      {creator.name}
                    </h1>

                    <p className="text-sm text-ink-soft mt-1">
                      {creator.specialty}
                    </p>
                  </div>

                  {/* Rating and pieces */}
                  <div className="flex items-center gap-2">

                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-cream border border-border text-sm">
                      <Star
                        size={14}
                        className="fill-amber text-amber"
                      />

                      <span className="font-medium text-ink">
                        {creator.rating}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-cream border border-border text-sm text-ink-soft">
                      {creator.products} pieces
                    </div>

                  </div>

                </div>

                {/* Location */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-ink-soft">

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} />
                    {creator.location}
                  </span>

                  <span>
                    Independent creator
                  </span>

                </div>

              </div>

            </div>

            {/* ======================================== */}
            {/* CREATOR ACTIONS */}
            {/* ======================================== */}

            <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-border">

              {/* Creator Dashboard */}
              <Link
                to="/creator-dashboard"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-ink
                  text-cream
                  text-sm
                  font-medium
                  hover:bg-amber-dark
                  transition-colors
                "
              >
                <LayoutDashboard size={17} />

                Creator Dashboard
              </Link>

              {/* Explore more crafts */}
              <Link
                to="/explore"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-border
                  bg-white
                  text-ink
                  text-sm
                  font-medium
                  hover:bg-cream
                  hover:border-amber/40
                  transition-colors
                "
              >
                Explore Crafts

                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* CREATOR'S CRAFTS */}
        {/* ======================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between gap-5 mb-7">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
                From the workbench
              </p>

              <h2 className="font-display text-3xl sm:text-4xl text-ink mt-2">
                {creator.name}'s pieces
              </h2>

            </div>

            <span className="hidden sm:block text-sm text-ink-soft">
              {creatorCrafts.length} handmade pieces
            </span>

          </div>

          {/* No crafts */}
          {creatorCrafts.length === 0 ? (

            <div className="bg-white border border-border rounded-2xl p-10 text-center">

              <p className="text-ink-soft">
                No pieces available from this creator yet.
              </p>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-amber-dark"
              >
                Explore all crafts
                <ArrowRight size={15} />
              </Link>

            </div>

          ) : (

            /* Craft grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">

              {creatorCrafts.map((craft) => (

                <Link
                  key={craft.id}
                  to={`/craft/${craft.id}`}
                  className="
                    group
                    bg-white
                    rounded-[20px]
                    border
                    border-border
                    overflow-hidden
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-lg
                    transition-all
                    duration-300
                  "
                >

                  {/* Craft image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    <img
                      src={craft.image}
                      alt={craft.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Craft tag */}
                    {craft.tag && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-ink shadow-sm">
                        {craft.tag}
                      </span>
                    )}

                    {/* Wishlist */}
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
                        w-8
                        h-8
                        rounded-full
                        bg-white/95
                        flex
                        items-center
                        justify-center
                        text-ink-soft
                        hover:text-rose
                        transition-colors
                        shadow-sm
                      "
                    >
                      <Heart size={14} />
                    </button>

                  </div>

                  {/* Craft details */}
                  <div className="p-3.5">

                    <h3 className="font-medium text-sm text-ink leading-snug line-clamp-2 min-h-[40px]">
                      {craft.name}
                    </h3>

                    <div className="flex items-center justify-between gap-2 mt-3">

                      {/* Price in Indian Rupees */}
                      <span className="font-display text-lg text-ink">
                        ₹{Number(craft.price).toLocaleString("en-IN")}
                      </span>

                      {/* Rating */}
                      <span className="inline-flex items-center gap-1 text-xs text-ink-soft">

                        <Star
                          size={12}
                          className="fill-amber text-amber"
                        />

                        {craft.rating}

                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}