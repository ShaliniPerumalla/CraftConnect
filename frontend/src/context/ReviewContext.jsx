import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  fetchReviews as apiFetchReviews,
  createReview as apiCreateReview,
} from "../services/member4Service";
import useAuth from "../hooks/useAuth";

const ReviewContext = createContext(null);
const STORAGE_KEY = "craftconnect_reviews";

export function ReviewProvider({ children }) {
  const { user } = useAuth() || {};

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load cached reviews:", e);
    }
    return {};
  });

  const [loading, setLoading] = useState(false);

  // Load reviews from real API
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchReviews();
      if (Array.isArray(data)) {
        const grouped = {};
        data.forEach((r) => {
          const cId = String(r.creator?.id || r.creator || "creator-1");
          if (!grouped[cId]) grouped[cId] = [];
          grouped[cId].push({
            id: String(r.id),
            creatorId: cId,
            creatorName: r.creator?.name || r.creator?.username || `Creator #${cId}`,
            customerId: r.customer?.id || r.customer,
            customerUsername: r.customer?.username,
            customerName: r.customer?.name || r.customer?.username || "Verified Customer",
            rating: Number(r.rating || 5),
            review: r.comment,
            orderNumber: r.order_number,
            orderId: r.order,
            createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
          });
        });
        setReviews((prev) => ({ ...prev, ...grouped }));
      }
    } catch (err) {
      console.warn("apiFetchReviews failed, using cached reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error("Could not cache reviews:", e);
    }
  }, [reviews]);

  function getCreatorReviews(creatorId) {
    if (!creatorId) return [];
    return reviews[creatorId] || reviews[String(creatorId)] || [];
  }

  function getCustomerReviews(filterUser = user) {
    const list = [];
    Object.entries(reviews || {}).forEach(([creatorId, reviewArr]) => {
      if (Array.isArray(reviewArr)) {
        reviewArr.forEach((r) => {
          if (
            (filterUser?.id && (r.customerId === filterUser.id || r.customer?.id === filterUser.id)) ||
            (filterUser?.username && (r.customerUsername === filterUser.username || r.customerName === filterUser.username)) ||
            r.customerName === "You" ||
            (filterUser?.name && r.customerName === filterUser.name)
          ) {
            list.push({ ...r, creatorId });
          }
        });
      }
    });
    return list;
  }

  async function addReview({
    creatorId,
    orderId,
    customerName = "You",
    rating,
    review,
  }) {
    const trimmedReview = (review || "").trim();
    if (!rating || !trimmedReview) return false;

    let apiRes = null;
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        if (orderId) {
          apiRes = await apiCreateReview({
            order: orderId,
            rating: Number(rating),
            comment: trimmedReview,
          });
        } else if (creatorId) {
          apiRes = await apiCreateReview({
            creator_id: creatorId,
            rating: Number(rating),
            comment: trimmedReview,
          });
        }
      } catch (err) {
        console.error("apiCreateReview error:", err?.response?.data || err.message);
        throw err;
      }
    }

    const cId = String(creatorId || (apiRes && apiRes.creator) || "creator-1");
    const newReview = {
      id: apiRes?.id ? String(apiRes.id) : `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      creatorId: cId,
      creatorName: apiRes?.creator_name || `Creator #${cId}`,
      orderId,
      customerId: user?.id,
      customerUsername: user?.username,
      customerName: user?.name || user?.username || customerName,
      rating: Number(rating),
      review: trimmedReview,
      createdAt: Date.now(),
    };

    setReviews((current) => ({
      ...current,
      [cId]: [newReview, ...(current[cId] || [])],
    }));

    return true;
  }

  function deleteReview(creatorId, reviewId) {
    setReviews((current) => ({
      ...current,
      [creatorId]: (current[creatorId] || []).filter((r) => r.id !== reviewId),
    }));
  }

  function getRatingSummary(creatorId) {
    const creatorReviews = reviews[creatorId] || reviews[String(creatorId)] || [];
    const totalReviews = creatorReviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratingSum = creatorReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (ratingSum / totalReviews).toFixed(1);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    creatorReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return {
      averageRating: Number(averageRating),
      totalReviews,
      distribution,
    };
  }

  const value = {
    reviews,
    loading,
    refreshReviews: loadReviews,

    getCreatorReviews,
    getCustomerReviews,
    addReview,
    deleteReview,
    getRatingSummary,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used inside a ReviewProvider");
  }
  return context;
}