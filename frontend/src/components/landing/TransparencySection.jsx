export default function TransparencySection() {
  return (
    <section className="bg-forest-light">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
        <div className="relative min-h-[340px] lg:min-h-[480px]">
          <img
            src="https://images.unsplash.com/photo-1753164726043-31e583f8a9b8?w=1200&auto=format&fit=crop&q=80"
            alt="A creator shaping clay by hand on a pottery wheel"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center px-4 sm:px-6 lg:px-14 py-14 lg:py-0">
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.22em] text-forest-dark font-semibold">
              Fair by default
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-ink mt-3 leading-[1.08]">
              Full creator control, from the first sale.
            </h2>

            <p className="text-ink-soft mt-4 leading-relaxed">
              No black-box algorithms and no factory listings hiding in
              the results. What you see is made by the person you're
              buying from.
            </p>

            <div className="mt-8 space-y-5 border-t border-ink/10 pt-7">
              <div>
                <p className="text-ink font-medium text-sm">
                  You set the price
                </p>
                <p className="text-ink-soft text-sm mt-1 leading-relaxed">
                  Creators price their own work — CraftConnect never
                  marks it up.
                </p>
              </div>

              <div>
                <p className="text-ink font-medium text-sm">
                  Talk directly, buy directly
                </p>
                <p className="text-ink-soft text-sm mt-1 leading-relaxed">
                  Message the maker before you buy. No middlemen in
                  between.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
