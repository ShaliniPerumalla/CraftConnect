const communities = [
  "Woodwork Guild",
  "Studio Ceramics",
  "Made By Hand Co.",
  "The Fiber Collective",
  "Small Batch Market",
  "Independent Makers",
];

const strip = [
  {
    src: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500&auto=format&fit=crop&q=80",
    alt: "Wooden serving board",
  },
  {
    src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&auto=format&fit=crop&q=80",
    alt: "Handmade ceramic pottery",
  },
  {
    src: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=80",
    alt: "Handcrafted gold jewelry",
  },
  {
    src: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80",
    alt: "Hand-poured candle",
  },
  {
    src: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=500&auto=format&fit=crop&q=80",
    alt: "Handwoven textile throw",
  },
  {
    src: "/botanical-wall-art.jpg",
    alt: "Botanical wall art print",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-cream pb-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-ink-muted font-medium">
          Independent maker communities already selling here
        </p>
      </div>

      {/* Logo / wordmark marquee — auto-scrolls, pauses on hover */}
      <div className="marquee mt-6">
        <div
          className="marquee-track"
          style={{ "--marquee-duration": "26s" }}
        >
          {[...communities, ...communities].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="font-display text-lg sm:text-xl text-ink-muted/70 px-6 sm:px-8 shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Photo strip marquee — opposite direction */}
      <div className="marquee mt-10">
        <div
          className="marquee-track marquee-track--reverse"
          style={{ "--marquee-duration": "38s" }}
        >
          {[...strip, ...strip].map((item, index) => (
            <div
              key={`${item.alt}-${index}`}
              className="relative w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-border shadow-[0_8px_20px_rgba(60,45,35,0.08)] shrink-0 mx-2 sm:mx-2.5"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
