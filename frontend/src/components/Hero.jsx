import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Sparkles, Star } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop",
];

export default function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (value) {
      navigate(`/explore?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/explore");
    }
  };

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl animate-blob-float" />

      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-forest/10 blur-3xl animate-blob-float--delay" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-center">

          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border text-xs font-medium text-forest shadow-sm">
              <Sparkles size={13} />
              Handmade. Independent. Meaningful.
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5rem] leading-[0.96] tracking-tight text-ink mt-7">
              Everything here
              <br />
              <span className="text-amber-dark italic">
                was made
              </span>
              <br />
              by someone's hands.
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl mt-7">
              Discover handmade pieces from independent creators,
              support the people behind the work, and bring home
              something with a story.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-7 flex items-center w-full max-w-xl bg-white rounded-2xl border border-border shadow-[0_10px_30px_rgba(60,45,35,0.08)] overflow-hidden focus-within:border-amber focus-within:shadow-[0_12px_35px_rgba(184,118,61,0.15)] transition-all"
            >
              <Search
                size={20}
                className="ml-4 text-ink-soft shrink-0"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search crafts, creators or skills..."
                className="flex-1 min-w-0 px-3 py-4 bg-transparent outline-none text-sm text-ink placeholder:text-ink-soft/60"
              />

              <button
                type="submit"
                className="m-1.5 px-5 sm:px-6 py-3 rounded-xl bg-amber text-white text-sm font-medium hover:bg-amber-dark transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mt-8">

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark hover:-translate-y-0.5 transition-all shadow-sm"
              >
                Explore crafts
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-border text-ink text-sm font-medium hover:border-amber hover:text-amber-dark transition-colors"
              >
                Sell your work
              </Link>

            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 pt-7 border-t border-border">

              <div>
                <p className="font-display text-2xl text-ink">
                  100%
                </p>

                <p className="text-xs text-ink-soft mt-0.5">
                  Handmade
                </p>
              </div>

              <div className="w-px h-9 bg-border" />

              <div>
                <p className="font-display text-2xl text-ink">
                  Independent
                </p>

                <p className="text-xs text-ink-soft mt-0.5">
                  Real creators
                </p>
              </div>

              <div className="w-px h-9 bg-border" />

              <div className="flex items-center gap-1.5">

                <Star
                  size={16}
                  className="fill-amber text-amber"
                />

                <div>
                  <p className="text-sm font-medium text-ink">
                    Made with care
                  </p>

                  <p className="text-xs text-ink-soft">
                    One piece at a time
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="relative min-h-[470px] sm:min-h-[560px] lg:min-h-[610px] w-full">

            <div className="absolute top-12 right-16 w-28 h-28 rounded-full border border-amber/30 z-0" />

            <div className="absolute top-4 right-2 w-[66%] h-[64%] rounded-[34px] overflow-hidden bg-white border-[8px] border-white shadow-[0_25px_60px_rgba(60,45,35,0.18)] rotate-[5deg] transition-transform duration-700 hover:rotate-[2deg] hover:scale-[1.02] z-10">
              <img
                src={heroImages[0]}
                alt="Handmade wooden craft"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute left-1 top-[20%] w-[65%] h-[67%] rounded-[34px] overflow-hidden bg-white border-[8px] border-white shadow-[0_30px_70px_rgba(60,45,35,0.24)] rotate-[-6deg] transition-transform duration-700 hover:rotate-[-3deg] hover:scale-[1.02] z-20">
              <img
                src={heroImages[1]}
                alt="Handmade pottery"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute right-0 bottom-3 w-[36%] h-[37%] rounded-[26px] overflow-hidden bg-white border-[6px] border-white shadow-[0_22px_50px_rgba(60,45,35,0.2)] rotate-[7deg] transition-transform duration-700 hover:rotate-[3deg] hover:scale-[1.04] z-30">
              <img
                src={heroImages[2]}
                alt="Handmade jewelry"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute left-[45%] top-[8%] z-40 bg-white rounded-2xl px-4 py-3 shadow-[0_15px_40px_rgba(60,45,35,0.16)] border border-border -rotate-2">

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest" />

                <span className="text-xs font-semibold text-ink">
                  Made by hand
                </span>
              </div>

              <p className="text-[10px] text-ink-soft mt-1">
                Never factory-made.
              </p>

            </div>

            <div className="absolute left-[8%] bottom-[5%] z-40 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-border shadow-lg rotate-3">

              <div className="flex items-center gap-2">

                <Star
                  size={14}
                  className="fill-amber text-amber"
                />

                <span className="text-xs font-medium text-ink">
                  Crafted with care
                </span>

              </div>

            </div>

            <div className="absolute right-[35%] bottom-[18%] w-3 h-3 rounded-full bg-amber z-40" />

            <div className="absolute right-[30%] bottom-[14%] w-2 h-2 rounded-full bg-forest z-40" />

          </div>

        </div>
      </div>
    </section>
  );
}