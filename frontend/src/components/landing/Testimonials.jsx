import { Star } from "lucide-react";
import Avatar from "./Avatar";

const testimonials = [
  {
    quote:
      "I found a walnut serving board I didn't know I needed, and messaging Maren directly about the finish made it feel personal in a way big marketplaces never do.",
    name: "R. Kapoor",
    role: "Customer",
  },
  {
    quote:
      "Since opening my shop here, I've connected with customers who actually care about how a piece is made. Orders have tripled and I still pack every box myself.",
    name: "Priya Nair",
    role: "Creator, Pottery",
  },
  {
    quote:
      "CraftConnect is the easiest way I've found to browse handmade goods without wading through mass-produced lookalikes first.",
    name: "E. Verhoeven",
    role: "Customer",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16 lg:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Real stories
          </p>

          <h2 className="font-display text-3xl sm:text-4xl text-ink mt-3">
            Trusted by makers and collectors alike.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-[24px] bg-cream border border-border p-8 min-h-[280px] flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill="#C6A15B"
                    color="#C6A15B"
                  />
                ))}
              </div>

              <p className="text-[15px] text-ink leading-relaxed mt-5 flex-1">
                "{item.quote}"
              </p>

              <div className="flex items-center gap-3 mt-7 pt-6 border-t border-border">
                <Avatar name={item.name} size={44} />

                <div>
                  <p className="text-sm font-medium text-ink">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-soft">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
