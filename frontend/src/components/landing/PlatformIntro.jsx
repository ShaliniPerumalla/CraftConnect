import { Search, MessageCircle, PackageCheck } from "lucide-react";
import Avatar from "./Avatar";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Explore handmade pieces and find something that feels uniquely yours.",
    mock: "discover",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Connect",
    description:
      "Learn about the person behind the piece and message them directly.",
    mock: "connect",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Bring it home",
    description:
      "Choose your favorite piece and support an independent creator directly.",
    mock: "checkout",
  },
];

function StepMock({ variant }) {
  if (variant === "discover") {
    return (
      <div className="rounded-2xl bg-white border border-border p-4">
        <div className="flex items-center gap-2 rounded-lg bg-cream border border-border px-3 py-2.5">
          <Search size={14} className="text-ink-soft shrink-0" />
          <div className="h-2 w-20 rounded-full bg-border-dark/70" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3.5">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=200&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "connect") {
    return (
      <div className="rounded-2xl bg-white border border-border p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <Avatar name="Maren Holt" size={28} className="text-[11px]" />
          <div className="rounded-2xl rounded-tl-sm bg-cream px-3.5 py-2 text-xs text-ink-soft">
            Is this available in oak?
          </div>
        </div>
        <div className="flex items-center gap-2.5 justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-amber/15 px-3.5 py-2 text-xs text-amber-dark">
            Yes! I can start this week.
          </div>
          <Avatar name="You" size={28} className="text-[11px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-border p-4">
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>Wooden serving board</span>
        <span className="text-ink font-medium">₹699</span>
      </div>
      <div className="h-px bg-border my-2.5" />
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="mt-3.5 rounded-lg bg-ink text-cream text-xs font-medium text-center py-2.5">
        Bring it home
      </div>
    </div>
  );
}

export default function PlatformIntro() {
  return (
    <section className="bg-white py-16 lg:py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Simple by design
          </p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink mt-2">
            The only place built for buying straight from the maker.
          </h2>

          <p className="text-ink-soft mt-4 leading-relaxed">
            CraftConnect makes it easy to discover meaningful handmade work
            while keeping the creator at the heart of every purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-14">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group rounded-[28px] bg-cream border border-border p-8 sm:p-9 min-h-[420px] flex flex-col hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl text-amber">
                    {step.number}
                  </span>

                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-amber-dark shadow-sm group-hover:bg-amber group-hover:text-white transition-colors">
                    <Icon size={21} />
                  </div>
                </div>

                <h3 className="font-display text-[26px] text-ink mt-7">
                  {step.title}
                </h3>

                <p className="text-[15px] text-ink-soft leading-relaxed mt-2.5">
                  {step.description}
                </p>

                <div className="mt-auto pt-7">
                  <StepMock variant={step.mock} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
