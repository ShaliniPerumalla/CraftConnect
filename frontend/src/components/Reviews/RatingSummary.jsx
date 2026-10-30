import { Star } from "lucide-react";
import { useReviews } from "../../context/ReviewContext";

export default function RatingSummary({ creatorId }) {
  const { getRatingSummary } = useReviews();

  const {
    average,
    total,
    distribution,
  } = getRatingSummary(creatorId);

  const ratingRows = [5, 4, 3, 2, 1];

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7">

      {/* HEADER */}

      <div className="mb-6">

        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-forest">
          Reviews & Ratings
        </p>

        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-ink">
          Customer experience
        </h3>

      </div>

      {/* RATING SUMMARY */}

      <div className="grid gap-8 md:grid-cols-[180px_1fr]">

        {/* AVERAGE */}

        <div className="flex flex-col items-center justify-center rounded-2xl bg-cream p-5">

          <div className="flex items-center gap-2">

            <Star
              size={24}
              className="fill-amber text-amber"
            />

            <span className="text-4xl font-semibold text-ink">
              {average > 0 ? average.toFixed(1) : "—"}
            </span>

          </div>

          <p className="mt-2 text-sm text-ink-soft">
            out of 5
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            {total} {total === 1 ? "review" : "reviews"}
          </p>

        </div>

        {/* DISTRIBUTION */}

        <div className="space-y-3">

          {ratingRows.map((rating) => {

            const count =
              distribution[rating] || 0;

            const percentage =
              total > 0
                ? Math.round(
                    (count / total) * 100
                  )
                : 0;

            return (
              <div
                key={rating}
                className="flex items-center gap-3"
              >

                {/* STAR LABEL */}

                <div className="flex w-12 shrink-0 items-center gap-1">

                  <span className="text-xs font-medium text-ink">
                    {rating}
                  </span>

                  <Star
                    size={12}
                    className="fill-amber text-amber"
                  />

                </div>

                {/* PROGRESS BAR */}

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">

                  <div
                    className="h-full rounded-full bg-amber transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                {/* PERCENTAGE */}

                <span className="w-10 text-right text-xs text-ink-muted">
                  {percentage}%
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}