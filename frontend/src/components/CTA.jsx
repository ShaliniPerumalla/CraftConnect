// src/components/CTA.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-ink overflow-hidden">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-amber/20 blur-3xl animate-blob-float" />
          <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-forest/25 blur-3xl animate-blob-float--delay" />

          <div className="relative grid lg:grid-cols-2 items-center gap-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="max-w-lg">
              <p className="text-xs uppercase tracking-[0.22em] text-amber font-semibold">
                Start today
              </p>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-cream leading-[1.08] mt-4">
                Make a living from what you make by hand.
              </h2>

              <p className="text-cream/70 mt-4 leading-relaxed">
                Set your own prices, talk directly to buyers, and keep the
                story behind your work intact. No factory listings, ever.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber text-white font-medium hover:bg-amber-dark hover:-translate-y-0.5 transition-all shadow-sm"
              >
                Start selling
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden border-4 border-cream/10 shadow-[0_30px_70px_rgba(0,0,0,0.4)] rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&auto=format&fit=crop&q=80"
                  alt="Creator finishing a handmade wooden piece"
                  className="w-full h-72 object-cover"
                />
              </div>

              <div className="absolute -bottom-5 -left-8 bg-cream rounded-2xl px-4 py-3 shadow-xl -rotate-3">
                <p className="text-2xl font-display text-ink">1,200+</p>
                <p className="text-[11px] text-ink-soft">Independent creators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
