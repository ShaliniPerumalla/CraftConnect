import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ReviewContext = createContext(null);

const STORAGE_KEY = "craftconnect_reviews";

// ======================================================
// INITIAL REVIEWS
// ======================================================

const initialReviews = {
  "creator-1": [
    {
      id: "review-1",
      creatorId: "creator-1",
      customerName: "Rahul",
      rating: 5,
      review:
        "Beautiful work! The design was exactly what I requested.",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: "review-2",
      creatorId: "creator-1",
      customerName: "Priya",
      rating: 4,
      review:
        "Very nice craftsmanship and the creator was helpful throughout.",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: "review-3",
      creatorId: "creator-1",
      customerName: "Ananya",
      rating: 5,
      review:
        "Loved the final result. Everything looked beautifully handmade.",
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    },
    {
      id: "review-4",
      creatorId: "creator-1",
      customerName: "Kiran",
      rating: 5,
      review:
        "Amazing quality and attention to detail.",
      createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    },
    {
      id: "review-5",
      creatorId: "creator-1",
      customerName: "Meera",
      rating: 3,
      review:
        "The product was good, although delivery took a little longer than expected.",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
  ],

  "creator-2": [
    {
      id: "review-6",
      creatorId: "creator-2",
      customerName: "Arjun",
      rating: 5,
      review:
        "The resin artwork turned out beautifully.",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      id: "review-7",
      creatorId: "creator-2",
      customerName: "Sneha",
      rating: 4,
      review:
        "Great design and good communication.",
      createdAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    },
  ],

  "creator-3": [
    {
      id: "review-8",
      creatorId: "creator-3",
      customerName: "Ravi",
      rating: 5,
      review:
        "The handmade gift was lovely and carefully packaged.",
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
  ],
};

// ======================================================
// PROVIDER
// ======================================================

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return initialReviews;
      }

      const parsed = JSON.parse(saved);

      if (!parsed || typeof parsed !== "object") {
        return initialReviews;
      }

      return parsed;
    } catch (error) {
      console.error(
        "Could not load reviews:",
        error
      );

      return initialReviews;
    }
  });

  // ======================================================
  // SAVE REVIEWS
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reviews)
      );
    } catch (error) {
      console.error(
        "Could not save reviews:",
        error
      );
    }
  }, [reviews]);

  // ======================================================
  // GET REVIEWS FOR CREATOR
  // ======================================================

  function getCreatorReviews(creatorId) {
    return reviews[creatorId] || [];
  }

  // ======================================================
  // ADD REVIEW
  // ======================================================

  function addReview({
    creatorId,
    customerName = "You",
    rating,
    review,
  }) {
    const trimmedReview = review.trim();

    if (!creatorId || !rating || !trimmedReview) {
      return false;
    }

    const newReview = {
      id: `review-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      creatorId,
      customerName,
      rating,
      review: trimmedReview,
      createdAt: Date.now(),
    };

    setReviews((current) => ({
      ...current,

      [creatorId]: [
        ...(current[creatorId] || []),
        newReview,
      ],
    }));

    return true;
  }

  // ======================================================
  // DELETE REVIEW
  // ======================================================

  function deleteReview(creatorId, reviewId) {
    setReviews((current) => ({
      ...current,

      [creatorId]: (current[creatorId] || []).filter(
        (review) => review.id !== reviewId
      ),
    }));
  }

  // ======================================================
  // RATING SUMMARY
  // ======================================================

  function getRatingSummary(creatorId) {
    const creatorReviews =
      reviews[creatorId] || [];

    const totalReviews =
      creatorReviews.length;

    if (totalReviews === 0) {
      return {
        average: 0,
        total: 0,
        distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const totalRating =
      creatorReviews.reduce(
        (sum, review) =>
          sum + Number(review.rating),
        0
      );

    const average =
      totalRating / totalReviews;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    creatorReviews.forEach((review) => {
      const rating = Number(review.rating);

      if (distribution[rating] !== undefined) {
        distribution[rating] += 1;
      }
    });

    return {
      average: Number(average.toFixed(1)),
      total: totalReviews,
      distribution,
    };
  }

  // ======================================================
  // RESET REVIEWS
  // ======================================================

  function resetReviews() {
    setReviews(
      JSON.parse(JSON.stringify(initialReviews))
    );
  }

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = useMemo(
    () => ({
      reviews,
      getCreatorReviews,
      addReview,
      deleteReview,
      getRatingSummary,
      resetReviews,
    }),
    [reviews]
  );

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useReviews() {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error(
      "useReviews must be used inside ReviewProvider"
    );
  }

  return context;
}