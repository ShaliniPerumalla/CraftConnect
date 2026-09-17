import { Search, SlidersHorizontal, Star, Heart, MapPin, BadgeCheck } from "lucide-react";
import Avatar from "./Avatar";

function BrowserFrame({ children, accent = "bg-amber/10" }) {
  return (
    <div className="relative max-w-md ml-auto lg:mx-0">
      <div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full ${accent} blur-3xl animate-blob-float`} />

      <div className="relative rounded-[24px] bg-white border border-border shadow-[0_25px_60px_rgba(60,45,35,0.14)] overflow-hidden transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_rgba(60,45,35,0.2)]">
        <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-border bg-cream">
          <span className="w-2.5 h-2.5 rounded-full bg-rose/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-forest/60" />
        </div>

        <div className="p-6 sm:p-7">{children}</div>
      </div>
    </div>
  );
}

export function CreatorProfileMockup() {
  return (
    <BrowserFrame accent="bg-forest/10">
      <div className="flex items-start gap-4">
        <Avatar name="Maren Holt" size={64} className="text-lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-display text-xl text-ink">Maren Holt</p>
            <BadgeCheck size={16} className="text-forest fill-forest-light" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-1.5">
            <MapPin size={13} />
            Oslo, Norway
          </div>

          <div className="flex items-center gap-1 text-sm text-ink mt-2.5">
            <Star size={14} fill="#C6A15B" color="#C6A15B" />
            4.9 <span className="text-ink-soft">· 112 reviews</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-5" />

      <div className="grid grid-cols-3 gap-2.5">
        <div className="aspect-square rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=300&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-xl bg-amber-light flex items-center justify-center text-amber-dark text-sm font-medium">
          +18
        </div>
      </div>
    </BrowserFrame>
  );
}

export function ExploreMockup() {
  return (
    <BrowserFrame accent="bg-amber/10">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg bg-cream border border-border px-3.5 py-2.5">
          <Search size={14} className="text-ink-soft" />
          <span className="text-sm text-ink-soft">Search pottery, oak, gold...</span>
        </div>

        <div className="w-10 h-10 rounded-lg bg-ink flex items-center justify-center shrink-0">
          <SlidersHorizontal size={15} className="text-cream" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {["Pottery", "Woodwork", "Jewelry"].map((tag, index) => (
          <span
            key={tag}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              index === 0
                ? "bg-ink text-cream border-ink"
                : "border-border text-ink-soft"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {[
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&auto=format&fit=crop&q=80",
        ].map((src) => (
          <div key={src} className="rounded-xl overflow-hidden border border-border">
            <div className="aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5 bg-white">
              <div className="h-2 w-3/4 rounded-full bg-border-dark/60" />
              <div className="h-2 w-1/3 rounded-full bg-border-dark/40 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

export function CartMockup() {
  const items = [
    { name: "Ceramic Pottery Set", price: "₹549", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80" },
    { name: "Amber Candle", price: "₹299", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&auto=format&fit=crop&q=80" },
  ];

  return (
    <BrowserFrame accent="bg-rose/10">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl text-ink">Your cart</p>
        <Heart size={16} className="text-rose" />
      </div>

      <div className="mt-5 space-y-3.5">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
              <img src={item.img} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink font-medium truncate">{item.name}</p>
              <p className="text-xs text-ink-soft">Qty 1</p>
            </div>

            <span className="text-sm text-ink font-medium">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border my-5" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">Total</span>
        <span className="font-display text-xl text-ink">₹848</span>
      </div>

      <div className="mt-4 rounded-lg bg-amber text-white text-sm font-medium text-center py-3">
        Checkout securely
      </div>
    </BrowserFrame>
  );
}
