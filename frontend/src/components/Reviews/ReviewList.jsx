import { Star } from "lucide-react";
import { useReviews } from "../../context/ReviewContext";

function formatReviewDate(timestamp) {
  const difference = Date.now() - timestamp;

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Today";
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

export default function ReviewList({ creatorId }) {
  const { getCreatorReviews } = useReviews();

  const creatorReviews = getCreatorReviews(creatorId);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7">

      {/* HEADER */}

      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-forest">
          Customer feedback
        </p>

        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-ink">
          Reviews
        </h3>
      </div>

      {/* EMPTY STATE */}

      {creatorReviews.length === 0 ? (
        <div className="rounded-2xl bg-cream p-8 text-center">
          <p className="text-sm text-ink-soft">
            No reviews yet.
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Be the first customer to share your experience.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">

          {creatorReviews.map((review) => (
            <article
              key={review.id}
              className="py-5 first:pt-0 last:pb-0"
            >

              {/* CUSTOMER + DATE */}

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h4 className="text-sm font-semibold text-ink">
                    {review.customerName}
                  </h4>

                  <p className="mt-1 text-xs text-ink-muted">
                    {formatReviewDate(review.createdAt)}
                  </p>
                </div>

                {/* STARS */}

                <div className="flex shrink-0 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      strokeWidth={1.5}
                      className={
                        star <= review.rating
                          ? "fill-amber text-amber"
                          : "text-border-dark"
                      }
                    />
                  ))}
                </div>

              </div>

              {/* REVIEW */}

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {review.review}
              </p>

            </article>
          ))}

        </div>
      )}

    </section>
  );
}