import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Star } from "lucide-react";

import { creators } from "../utils/mockData";

export default function Creators() {
  return (
    <div className="min-h-screen bg-cream font-body">

      {/* Header */}
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

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        <p className="text-xs uppercase tracking-[0.18em] text-forest font-medium">
          Meet the makers
        </p>

        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">
          The people behind the pieces
        </h1>

        <p className="text-ink-soft mt-4 max-w-2xl leading-relaxed">
          Discover independent creators who turn raw materials,
          traditional techniques, and imagination into handmade
          pieces worth keeping.
        </p>

      </section>

      {/* Creators */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {creators.map((creator) => (

            <Link
              key={creator.id}
              to={`/creator/${creator.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-border hover:border-amber/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >

              {/* Cover */}
              <div className="relative h-36 overflow-hidden">

                <img
                  src={creator.cover}
                  alt={creator.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10" />

              </div>

              {/* Profile */}
              <div className="px-6 pb-6">

                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white -mt-10 relative"
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
                  {creator.location}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">

                  <div className="flex items-center gap-1 text-sm text-ink">
                    <Star
                      size={14}
                      className="fill-amber text-amber"
                    />
                    <span className="font-medium">
                      {creator.rating}
                    </span>
                  </div>

                  <span className="text-xs text-ink-soft">
                    {creator.products} pieces
                  </span>

                </div>

                {/* View profile */}
                <div className="flex items-center gap-2 mt-5 text-sm font-medium text-amber-dark">

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

      </main>

    </div>
  );
}
