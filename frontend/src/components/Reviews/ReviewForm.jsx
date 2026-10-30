import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useReviews } from "../../context/ReviewContext";

export default function ReviewForm({
  creatorId,
  creatorName = "this creator",
}) {
  const { addReview } = useReviews();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!review.trim()) {
      setError("Please write a review.");
      return;
    }

    const success = addReview({
      creatorId,
      customerName: "You",
      rating,
      review,
    });

    if (!success) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setRating(0);
    setHoverRating(0);
    setReview("");
    setSubmitted(true);

    // Hide success message after a few seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  }

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7">

      {/* HEADER */}

      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-forest">
          Share your experience
        </p>

        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-ink">
          Rate your experience with {creatorName}
        </h3>

        <p className="mt-2 text-sm text-ink-soft">
          Your feedback helps other customers discover great creators.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}

      {submitted && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ Thank you! Your review has been submitted.
        </div>
      )}

      {/* FORM */}

      <form onSubmit={handleSubmit}>

        {/* STAR RATING */}

        <div className="mb-6">

          <p className="mb-3 text-sm font-medium text-ink">
            Your rating
          </p>

          <div className="flex items-center gap-1">

            {[1, 2, 3, 4, 5].map((star) => {

              const active =
                star <= (hoverRating || rating);

              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  className="
                    rounded-lg
                    p-1
                    transition-all
                    duration-200
                    hover:scale-110
                  "
                >
                  <Star
                    size={28}
                    strokeWidth={1.5}
                    className={
                      active
                        ? "fill-amber text-amber"
                        : "text-ink-muted"
                    }
                  />
                </button>
              );
            })}

          </div>

          {rating > 0 && (
            <p className="mt-2 text-xs text-ink-muted">
              You selected {rating} out of 5 stars
            </p>
          )}

        </div>

        {/* REVIEW TEXT */}

        <div className="mb-5">

          <label
            htmlFor="review-text"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Your review
          </label>

          <textarea
            id="review-text"
            value={review}
            onChange={(event) =>
              setReview(event.target.value)
            }
            placeholder="Tell us about your experience..."
            rows={5}
            maxLength={500}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-border
              bg-background
              px-4
              py-3
              text-sm
              text-ink
              outline-none
              transition-all
              placeholder:text-ink-muted
              focus:border-forest
              focus:ring-2
              focus:ring-forest/10
            "
          />

          <div className="mt-2 flex justify-end">
            <span className="text-[11px] text-ink-muted">
              {review.length}/500
            </span>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <p className="mb-4 text-sm text-rose">
            {error}
          </p>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-ink
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-lg
            active:translate-y-0
          "
        >
          <Send size={15} />
          Submit Review
        </button>

      </form>

    </section>
  );
}