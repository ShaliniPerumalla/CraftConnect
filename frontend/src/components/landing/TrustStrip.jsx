import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { useCrafts } from "../../context/CraftsContext";

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
    id: "p1",
    name: "Handcrafted Wooden Serving Board",
    category: "Woodwork",
    price: 699,
    creator: "Maren Holt",
    rating: 4.9,
    src: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500&auto=format&fit=crop&q=80",
    alt: "Handcrafted Wooden Serving Board",
  },
  {
    id: "p2",
    name: "Handmade Ceramic Pottery",
    category: "Pottery & Ceramics",
    price: 549,
    creator: "Priya Nair",
    rating: 5.0,
    src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&auto=format&fit=crop&q=80",
    alt: "Handmade Ceramic Pottery",
  },
  {
    id: "p3",
    name: "Handcrafted Gold Jewelry",
    category: "Jewelry",
    price: 799,
    creator: "Diego Fuentes",
    rating: 4.7,
    src: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=80",
    alt: "Handcrafted Gold Jewelry",
  },
  {
    id: "p6",
    name: "Hand-Poured Amber Candle",
    category: "Candles & Bath",
    price: 299,
    creator: "Priya Nair",
    rating: 4.9,
    src: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80",
    alt: "Hand-Poured Amber Candle",
  },
  {
    id: "p4",
    name: "Handwoven Textile Throw",
    category: "Textiles",
    price: 899,
    creator: "Ingrid Solberg",
    rating: 4.9,
    src: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=500&auto=format&fit=crop&q=80",
    alt: "Handwoven Textile Throw",
  },
  {
    id: "p5",
    name: "Botanical Wall Art Print",
    category: "Wall Art",
    price: 449,
    creator: "Maren Holt",
    rating: 4.8,
    src: "/botanical-wall-art.jpg",
    alt: "Botanical Wall Art Print",
  },
  {
    id: "p7",
    name: "Full-Grain Leather Journal",
    category: "Leather",
    price: 699,
    creator: "Diego Fuentes",
    rating: 4.8,
    src: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    alt: "Full-Grain Leather Journal",
  },
  {
    id: "p8",
    name: "Hand-Carved Wooden Bowl",
    category: "Woodwork",
    price: 799,
    creator: "Maren Holt",
    rating: 4.9,
    src: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
    alt: "Hand-Carved Wooden Bowl",
  },
];

function formatPrice(price) {
  const value = Number(price);
  if (!Number.isFinite(value)) return "₹0";
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function TrustStrip() {
  const { crafts } = useCrafts();

  function resolveCraft(item, index) {
    if (Array.isArray(crafts) && crafts.length > 0) {
      // 1. Direct ID match
      const byId = crafts.find((c) => String(c.id) === String(item.id));
      if (byId) {
        return {
          ...item,
          ...byId,
          id: byId.id,
          name: byId.name || item.name,
          price: byId.price ?? item.price,
          creator: byId.creator || item.creator,
          rating: byId.rating ?? item.rating,
          image: byId.image || item.src,
        };
      }

      // 2. Name or alt keyword match
      const searchKey = (item.name || item.alt || "").toLowerCase();
      const byName = crafts.find(
        (c) =>
          c.name &&
          (c.name.toLowerCase().includes(searchKey) ||
            searchKey.includes(c.name.toLowerCase()))
      );
      if (byName) {
        return {
          ...item,
          ...byName,
          id: byName.id,
          name: byName.name,
          price: byName.price,
          creator: byName.creator,
          rating: byName.rating,
          image: byName.image || item.src,
        };
      }

      // 3. Fallback to crafts list by index
      const byIndex = crafts[index % crafts.length];
      if (byIndex) {
        return {
          ...item,
          ...byIndex,
          id: byIndex.id,
          image: byIndex.image || item.src,
        };
      }
    }

    return {
      ...item,
      image: item.src,
    };
  }

  return (
    <section className="bg-cream pb-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-muted font-medium">
          Independent maker communities already selling here
        </p>
        <p className="text-xs text-ink-soft/80 mt-1.5">
          Click any scrolling piece to view craftsmanship details and buy directly from makers
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

      {/* Photo strip marquee — opposite direction, pauses on hover and links to craft details */}
      <div className="marquee mt-10">
        <div
          className="marquee-track marquee-track--reverse"
          style={{ "--marquee-duration": "42s" }}
        >
          {[...strip, ...strip].map((item, index) => {
            const craft = resolveCraft(item, index);
            const craftId = craft.id || item.id || "p1";

            return (
              <Link
                key={`${craftId}-${index}`}
                to={`/craft/${craftId}`}
                className="group relative w-52 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-border shadow-[0_8px_20px_rgba(60,45,35,0.08)] shrink-0 mx-2 sm:mx-2.5 block cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(60,45,35,0.2)] hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label={`View details and buy ${craft.name}`}
              >
                <img
                  src={craft.image || item.src}
                  alt={craft.name || item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Floating Price Pill */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-ink shadow-sm border border-border/60 transition-transform duration-300 group-hover:scale-105 z-10">
                  {formatPrice(craft.price)}
                </div>

                {/* Floating Rating Pill */}
                {craft.rating && (
                  <div className="absolute top-3 left-3 bg-ink/75 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1 shadow-sm z-10">
                    <Star size={11} className="fill-amber text-amber" />
                    <span>{craft.rating}</span>
                  </div>
                )}

                {/* Hover overlay with product details & buy action */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white z-20">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber">
                    {craft.category || "Handmade Craft"}
                  </span>

                  <h4 className="font-display text-base font-semibold text-white leading-snug mt-0.5 line-clamp-1">
                    {craft.name}
                  </h4>

                  <p className="text-xs text-cream/80 mt-0.5">
                    by {craft.creator}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/20">
                    <span className="font-display text-sm font-bold text-amber-light">
                      {formatPrice(craft.price)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber hover:bg-amber-dark text-white px-3 py-1.5 rounded-full transition-colors shadow-sm">
                      <ShoppingBag size={13} />
                      <span>View & Buy</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
