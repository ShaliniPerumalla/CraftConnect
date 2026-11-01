import { useState, useMemo } from "react";
import { Star, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useReviews } from "../../context/ReviewContext";
import useAuth from "../../hooks/useAuth";

export default function ReviewForm({
  creatorId: initialCreatorId = "",
  creatorName: initialCreatorName = "",
  creators = [],
  orders = [],
  onReviewSubmitted,
}) {
  const { addReview, reviews } = useReviews();
  const { user } = useAuth();

  const [selectedCreatorId, setSelectedCreatorId] = useState(
    initialCreatorId ? String(initialCreatorId) : ""
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Determine active creator name
  const effectiveCreatorName = useMemo(() => {
    if (initialCreatorName && initialCreatorId === selectedCreatorId) {
      return initialCreatorName;
    }
    const found = creators.find((c) => String(c.id) === String(selectedCreatorId));
    if (found) return found.name || found.username;
    return "selected creator";
  }, [initialCreatorName, initialCreatorId, selectedCreatorId, creators]);

  // Check if current user has already reviewed this creator
  const alreadyReviewed = useMemo(() => {
    if (!selectedCreatorId || !reviews) return false;
    const creatorReviews = reviews[selectedCreatorId] || reviews[String(selectedCreatorId)] || [];
    return creatorReviews.some(
      (r) =>
        (user?.id && (r.customerId === user.id || r.customer?.id === user.id)) ||
        (user?.username && (r.customerUsername === user.username || r.customerName === user.username)) ||
        r.customerName === "You"
    );
  }, [selectedCreatorId, reviews, user]);

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedCreatorId) {
      setError("Please select a creator to review.");
      return;
    }

    if (alreadyReviewed) {
      setError(`You have already reviewed ${effectiveCreatorName}.`);
      return;
    }

    if (rating === 0) {
      setError("Please select a star rating (1 to 5).");
      return;
    }

    if (!review.trim()) {
      setError("Please write your review feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const success = await addReview({
        creatorId: selectedCreatorId,
        customerName: user?.name || user?.username || "You",
        rating,
        review: review.trim(),
      });

      if (!success) {
        setError("Could not submit review. Please try again.");
        return;
      }

      setRating(0);
      setHoverRating(0);
      setReview("");
      setSubmitted(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      console.error("Review submission error:", err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Failed to submit review. Please try again.";
      setError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-forest">
          Share your experience
        </p>

        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-ink font-display">
          Rate your experience with {effectiveCreatorName}
        </h3>

        <p className="mt-2 text-sm text-ink-soft">
          Your feedback helps makers improve and guides other customers to authentic handcrafted work.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Thank you! Your review has been saved to your profile and the maker's rating has been updated.</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        {/* CREATOR SELECTOR (if creators provided and creatorId not fixed) */}
        {creators.length > 0 && (
          <div className="mb-6">
            <label htmlFor="creator-select" className="mb-2 block text-sm font-medium text-ink">
              Choose Creator
            </label>
            <select
              id="creator-select"
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-amber transition-colors"
            >
              <option value="">-- Select a maker to review --</option>
              {creators.map((c) => {
                const cIdStr = String(c.id);
                const hasReviewed = (reviews[cIdStr] || []).some(
                  (r) =>
                    (user?.id && (r.customerId === user.id || r.customer?.id === user.id)) ||
                    r.customerName === "You"
                );
                return (
                  <option key={c.id} value={c.id}>
                    {c.name || c.username} {c.specialty ? `• ${c.specialty}` : ""} {hasReviewed ? "(Reviewed)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* STAR RATING */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-ink">Your rating</p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || rating);

              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="rounded-lg p-1 transition-all duration-200 hover:scale-110"
                >
                  <Star
                    size={28}
                    strokeWidth={1.5}
                    className={active ? "fill-amber text-amber" : "text-ink-muted/50"}
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
          <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-ink">
            Your review feedback
          </label>

          <textarea
            id="review-text"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Share details about the craftsmanship, communication, delivery, and quality..."
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-amber focus:ring-2 focus:ring-amber/10"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-[11px] text-ink-muted">{review.length}/500</span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting || alreadyReviewed}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-amber-dark hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 shadow-sm"
        >
          <Send size={15} />
          {submitting ? "Submitting..." : alreadyReviewed ? "Already Reviewed" : "Submit Review"}
        </button>
      </form>
    </section>
  );
}