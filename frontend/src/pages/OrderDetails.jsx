// src/pages/OrderDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  Star,
  AlertTriangle,
  FileText,
  XCircle,
  Sparkles,
  ChevronRight,
  Eye,
  Send,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useOrders } from "../context/OrdersContext";
import { useReviews } from "../context/ReviewContext";
import { useComplaints } from "../context/ComplaintContext";
import { fetchOrderDetails, fetchOrderReview } from "../services/member4Service";

const trackingStages = [
  { key: "placed", title: "Order Placed", desc: "Quotation accepted & order initialized" },
  { key: "design", title: "Design & Review", desc: "Creator custom design proof & review" },
  { key: "production", title: "In Production", desc: "Handcrafted piece being prepared" },
  { key: "ready", title: "Ready for Delivery", desc: "Quality checked and safely packaged" },
  { key: "shipped", title: "Shipped", desc: "On the way with courier" },
  { key: "delivered", title: "Delivered", desc: "Successfully delivered to your address" },
];

function getStageIndex(status) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return 0;
  if (s === "design" || s === "design_stage" || s === "design stage") return 1;
  if (s === "design_review" || s === "design review") return 1;
  if (s === "production" || s === "processing" || s === "in production") return 2;
  if (s === "ready_for_delivery" || s === "ready for delivery") return 3;
  if (s === "shipped") return 4;
  if (s === "delivered" || s === "completed") return 5;
  if (s === "cancelled") return -1;
  return 0;
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, reviewDesign, cancelOrder, refreshOrders } = useOrders();
  const { addReview } = useReviews();
  const { addComplaint } = useComplaints();

  const [order, setOrder] = useState(() => getOrderById(id));
  const [loading, setLoading] = useState(!order);
  const [existingReview, setExistingReview] = useState(null);

  // Design review form state
  const [designFeedback, setDesignFeedback] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Rating modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Complaint modal state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintCat, setComplaintCat] = useState("Delivery");
  const [complaintSuccess, setComplaintSuccess] = useState("");

  // Cancel order modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const cached = getOrderById(id);
      if (cached) {
        setOrder(cached);
      }
      try {
        const fetched = await fetchOrderDetails(id);
        if (isMounted && fetched) {
          setOrder((prev) => ({ ...(prev || {}), ...fetched, id: String(fetched.id) }));
          // Check for existing review
          const rev = await fetchOrderReview(id);
          if (isMounted && rev && rev.id) {
            setExistingReview(rev);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote order:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id, getOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream font-body text-ink">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-amber-dark border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-ink-soft">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream font-body text-ink">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-border rounded-3xl p-10 max-w-lg mx-auto shadow-sm">
            <ShoppingBag size={36} className="text-amber-dark mx-auto" />
            <h1 className="font-display text-3xl mt-4">Order Not Found</h1>
            <p className="text-ink-soft mt-2 text-sm">We couldn't locate an order with ID #{id}.</p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-ink text-white text-sm hover:bg-amber-dark transition"
            >
              <ArrowLeft size={16} /> Back to My Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStage = getStageIndex(order.rawStatus || order.status);
  const isCancelled = (order.rawStatus || order.status || "").toLowerCase() === "cancelled";
  const canCancel = ["pending", "design", "design_review", "design stage"].includes(
    (order.rawStatus || order.status || "").toLowerCase()
  );

  const handleDesignAction = async (action) => {
    setIsSubmittingReview(true);
    try {
      await reviewDesign(order.id, { action, feedback: designFeedback });
      setOrder((prev) => ({
        ...prev,
        status: action === "approve" ? "Processing" : "Design Stage",
        rawStatus: action === "approve" ? "production" : "design",
        design_status: action === "approve" ? "approved" : "revision_requested",
        customer_design_feedback: designFeedback,
      }));
      setDesignFeedback("");
      refreshOrders();
    } catch (e) {
      alert("Failed to submit design feedback: " + (e.message || "Unknown error"));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        creatorId: order.creatorId,
        orderId: order.backendId || order.id,
        rating: ratingVal,
        review: reviewComment,
      });
      setExistingReview({ rating: ratingVal, comment: reviewComment });
      setReviewSuccessMsg("Thank you! Your review has been published.");
      setTimeout(() => setShowReviewModal(false), 2000);
    } catch (err) {
      alert("Review submission failed: " + err.message);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComplaint({
        orderId: order.orderNumber || order.id,
        craftName: order.craftName,
        creator: order.creator,
        orderTotal: order.total || order.price,
        subject: complaintSubject,
        description: complaintDesc,
        category: complaintCat,
        priority: "Medium",
      });
      setComplaintSuccess("Support ticket raised successfully. Our team will follow up.");
      setTimeout(() => setShowComplaintModal(false), 2000);
    } catch (err) {
      alert("Complaint submission failed: " + err.message);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order.id, cancelReason);
      setOrder((prev) => ({ ...prev, status: "Cancelled", rawStatus: "cancelled" }));
      setShowCancelModal(false);
      refreshOrders();
    } catch (err) {
      alert("Cancellation failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-border bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} /> Back to orders
            </Link>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-dark">
                  Order Details & Custom Tracker
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <h1 className="font-display text-3xl sm:text-4xl">
                    #{order.orderNumber || order.id}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isCancelled
                        ? "bg-red-50 text-red-600"
                        : currentStage === 5
                        ? "bg-forest/10 text-forest"
                        : "bg-amber/15 text-amber-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-1">Placed on {order.date}</p>
              </div>

              {canCancel && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-full text-xs font-medium hover:bg-red-50 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column (2 Cols): Details + Design Review + Actions */}
              <div className="lg:col-span-2 space-y-6">

                {/* PRODUCT CARD */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-cream shrink-0 border border-border">
                      <img
                        src={order.image}
                        alt={order.craftName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-dark">
                          Custom Commission
                        </span>
                        <h2 className="font-display text-2xl mt-1">{order.craftName}</h2>
                        <p className="text-sm text-ink-soft mt-1">
                          Crafted by <strong className="text-ink">{order.creator}</strong>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 my-3 border-y border-border text-sm">
                        <div>
                          <p className="text-xs text-ink-soft">Quantity</p>
                          <p className="font-semibold text-ink mt-0.5">{order.quantity || 1} pcs</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft">Unit Price</p>
                          <p className="font-semibold text-ink mt-0.5">₹{order.price || order.total}</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft">Delivery Fee</p>
                          <p className="font-semibold text-ink mt-0.5">
                            {order.deliveryFee ? `₹${order.deliveryFee}` : "Free"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-ink-soft">Total Paid</span>
                        <span className="font-display text-2xl text-forest">₹{order.total || order.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESIGN STAGE & CUSTOMER APPROVAL SECTION */}
                {(order.design_file_url || (order.rawStatus || order.status || "").toLowerCase().includes("design")) && (
                  <div className="bg-white border-2 border-amber-light/40 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-dark" />
                      <h3 className="font-display text-xl text-ink">Design Stage & Preview</h3>
                    </div>
                    <p className="text-xs text-ink-soft mt-1">
                      Review the custom design mockup uploaded by your creator before production begins.
                    </p>

                    {order.design_file_url ? (
                      <div className="mt-5 space-y-4">
                        <div className="rounded-2xl overflow-hidden border border-border bg-cream/50 max-h-80 flex items-center justify-center p-2">
                          <img
                            src={order.design_file_url}
                            alt="Design Mockup"
                            className="max-h-72 object-contain rounded-xl"
                          />
                        </div>
                        {order.design_notes && (
                          <div className="p-4 bg-cream rounded-2xl text-xs text-ink leading-relaxed border border-border">
                            <strong>Creator Notes:</strong> {order.design_notes}
                          </div>
                        )}

                        {order.design_status === "approved" ? (
                          <div className="p-3 bg-green-50 text-green-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <CheckCircle size={16} /> Design approved by you! In production.
                          </div>
                        ) : order.design_status === "revision_requested" ? (
                          <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <Clock3 size={16} /> Changes requested. Creator is updating the design.
                          </div>
                        ) : (
                          <div className="space-y-3 pt-2">
                            <textarea
                              rows={3}
                              value={designFeedback}
                              onChange={(e) => setDesignFeedback(e.target.value)}
                              placeholder="Add optional notes or specific changes you'd like..."
                              className="w-full text-xs p-3 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark resize-none"
                            />
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                disabled={isSubmittingReview}
                                onClick={() => handleDesignAction("approve")}
                                className="px-5 py-2.5 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90 transition shadow-sm"
                              >
                                {isSubmittingReview ? "Submitting..." : "Approve Design & Start Production"}
                              </button>
                              <button
                                type="button"
                                disabled={isSubmittingReview}
                                onClick={() => handleDesignAction("revision")}
                                className="px-5 py-2.5 rounded-full border border-amber-dark text-amber-dark text-xs font-medium hover:bg-amber/10 transition"
                              >
                                Request Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 p-5 rounded-2xl bg-cream border border-border text-center">
                        <Clock3 size={24} className="mx-auto text-amber-dark" />
                        <p className="text-xs text-ink-soft mt-2">
                          The creator is currently preparing your design concept. You will receive a notification as soon as it is uploaded.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TRACKING COURIER INFO */}
                {order.tracking_number && (
                  <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber-dark">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft">Shipment Tracking</p>
                        <p className="text-sm font-semibold text-ink">
                          {order.courier_name || "Courier"}: #{order.tracking_number}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-forest bg-forest/10 px-3 py-1 rounded-full">
                      In Transit
                    </span>
                  </div>
                )}

                {/* REVIEWS & COMPLAINTS ACTIONS */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Need help or want to leave feedback?</h4>
                    <p className="text-xs text-ink-soft mt-0.5">
                      Share your review once delivered, or contact support if any issue arises.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {currentStage === 5 && (
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-dark text-white text-xs font-medium hover:bg-amber-800 transition shadow-sm"
                      >
                        <Star size={14} />
                        {existingReview ? "Edit Review" : "Write Review"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowComplaintModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-ink-soft text-xs font-medium hover:text-red-600 hover:border-red-200 transition"
                    >
                      <AlertTriangle size={14} />
                      Report Issue
                    </button>
                  </div>
                </div>

                {/* EXISTING REVIEW DISPLAY */}
                {existingReview && (
                  <div className="bg-forest/5 border border-forest/20 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-dark">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={15}
                              className={i < existingReview.rating ? "fill-amber-dark text-amber-dark" : "text-border"}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-forest">Your Review</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-soft italic">"{existingReview.comment}"</p>
                  </div>
                )}
              </div>

              {/* Right Column (1 Col): Order Progress Tracker & Address */}
              <div className="space-y-6">

                {/* TRACKING TIMELINE */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    Progress Timeline
                  </p>
                  <h3 className="font-display text-2xl mt-1">Lifecycle Tracker</h3>

                  {isCancelled ? (
                    <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                      <XCircle size={28} className="text-red-500 mx-auto" />
                      <p className="font-semibold text-red-700 text-sm mt-2">Order Cancelled</p>
                      <p className="text-xs text-red-600 mt-1">
                        {order.cancellation_reason || "This order was cancelled."}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      {trackingStages.map((stage, idx) => {
                        const isDone = currentStage >= idx;
                        const isCurrent = currentStage === idx;
                        return (
                          <div key={stage.key} className="flex gap-3 relative">
                            {idx < trackingStages.length - 1 && (
                              <div
                                className={`absolute left-4 top-8 w-0.5 h-10 ${
                                  currentStage > idx ? "bg-forest" : "bg-border"
                                }`}
                              />
                            )}

                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                isDone
                                  ? "bg-forest text-white"
                                  : "bg-cream text-ink-soft border border-border"
                              }`}
                            >
                              {isDone ? <CheckCircle size={14} /> : <span className="text-xs">{idx + 1}</span>}
                            </div>

                            <div className="min-w-0 pb-2">
                              <h4
                                className={`text-xs font-semibold ${
                                  isCurrent ? "text-amber-dark" : isDone ? "text-ink" : "text-ink-soft"
                                }`}
                              >
                                {stage.title}
                              </h4>
                              <p className="text-[11px] text-ink-soft mt-0.5 leading-tight">
                                {stage.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber-dark">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink-soft font-medium">
                        Delivery Destination
                      </p>
                      <p className="text-sm font-semibold text-ink mt-0.5">
                        {order.address || "Address specified in requirement"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-border max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display text-2xl text-ink">Rate & Review Creator</h3>
            <p className="text-xs text-ink-soft mt-1">
              Share your handmade experience with {order.creator}.
            </p>

            {reviewSuccessMsg ? (
              <div className="my-6 p-4 bg-green-50 text-green-700 rounded-2xl text-center text-sm font-medium">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1.5">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingVal(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= ratingVal ? "fill-amber-dark text-amber-dark" : "text-border"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1.5">Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell other craft lovers about the quality, craftsmanship, and communication..."
                    className="w-full text-xs p-3 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-full border border-border text-xs text-ink-soft hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-forest text-white text-xs font-medium hover:bg-forest/90"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-border max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display text-2xl text-ink">Raise Support Ticket</h3>
            <p className="text-xs text-ink-soft mt-1">
              Reporting issue for Order #{order.orderNumber || order.id}
            </p>

            {complaintSuccess ? (
              <div className="my-6 p-4 bg-green-50 text-green-700 rounded-2xl text-center text-sm font-medium">
                {complaintSuccess}
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1">Issue Category</label>
                  <select
                    value={complaintCat}
                    onChange={(e) => setComplaintCat(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                  >
                    <option value="Delivery">Delivery Delay / Not Arrived</option>
                    <option value="Product">Damaged or Incorrect Product</option>
                    <option value="Creator">Creator Unresponsive</option>
                    <option value="Payment">Payment Issue</option>
                    <option value="Other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="Brief summary of the issue"
                    className="w-full text-xs p-2.5 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Please explain in detail so our support team can assist you..."
                    className="w-full text-xs p-3 rounded-2xl border border-border bg-card focus:outline-none focus:border-amber-dark"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowComplaintModal(false)}
                    className="px-4 py-2 rounded-full border border-border text-xs text-ink-soft hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-border max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-display text-xl text-ink">Cancel Order</h3>
            <p className="text-xs text-ink-soft mt-1">
              Cancellation is only permitted before the piece enters production.
            </p>

            <div className="mt-4">
              <label className="text-xs font-medium text-ink-soft block mb-1">Reason for cancellation</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason..."
                className="w-full text-xs p-3 rounded-2xl border border-border bg-card focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-full border border-border text-xs text-ink-soft"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}