const toneStyles = {
  cream: "bg-cream",
  white: "bg-white",
  amber: "bg-amber-light/60",
  forest: "bg-forest-light/60",
};

export default function FeatureSplit({
  eyebrow,
  title,
  description,
  bullets = [],
  mockup,
  reverse = false,
  tone = "white",
  border = true,
}) {
  return (
    <section
      className={`
        ${toneStyles[tone] || toneStyles.white}
        ${border ? "border-y border-border" : ""}
        py-16 lg:py-24
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            grid lg:grid-cols-2 gap-10 lg:gap-16 items-center
            ${reverse ? "lg:[&>*:first-child]:order-2" : ""}
          `}
        >
          <div className={reverse ? "lg:pl-4" : ""}>
            <p className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
              {eyebrow}
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-ink mt-3 leading-[1.08]">
              {title}
            </h2>

            {description && (
              <p className="text-ink-soft mt-4 max-w-md leading-relaxed">
                {description}
              </p>
            )}

            {bullets.length > 0 && (
              <ul className="mt-8 space-y-6">
                {bullets.map((bullet) => (
                  <li key={bullet.title} className="flex gap-3.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-dark shrink-0" />
                    <div>
                      <p className="text-ink font-medium text-sm">
                        {bullet.title}
                      </p>
                      <p className="text-ink-soft text-sm mt-1 leading-relaxed">
                        {bullet.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">{mockup}</div>
        </div>
      </div>
    </section>
  );
}
