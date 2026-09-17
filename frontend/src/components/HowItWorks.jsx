import {
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Explore handmade pieces and find something that feels uniquely yours.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Connect",
    description:
      "Learn about the person behind the piece and the story behind their craft.",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Bring it home",
    description:
      "Choose your favorite piece and support an independent creator directly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12">

          <p className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Simple by design
          </p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink mt-2">
            From discovery to something you can keep.
          </h2>

          <p className="text-ink-soft mt-4 leading-relaxed">
            CraftConnect makes it easy to discover meaningful handmade
            work while keeping the creator at the heart of every purchase.
          </p>

        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-5">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative group"
              >

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 left-[calc(100%-5px)] w-10 h-px bg-border z-10" />
                )}

                {/* Card */}
                <div className="relative h-full rounded-[24px] bg-cream border border-border p-7 lg:p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

                  {/* Top */}
                  <div className="flex items-center justify-between">

                    <span className="font-display text-4xl text-amber">
                      {step.number}
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-amber-dark shadow-sm group-hover:bg-amber group-hover:text-white transition-colors">
                      <Icon size={21} />
                    </div>

                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl text-ink mt-8">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-ink-soft leading-relaxed mt-3">
                    {step.description}
                  </p>

                  {/* Bottom */}
                  <div className="flex items-center gap-2 mt-7 text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
                    <span className="w-7 h-px bg-amber" />
                    CraftConnect
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom message */}
        <div className="mt-10 flex justify-center">

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream border border-border text-sm text-ink-soft">

            <span>
              Every purchase supports a real maker.
            </span>

            <ArrowRight size={15} className="text-amber-dark" />

          </div>

        </div>

      </div>
    </section>
  );
}