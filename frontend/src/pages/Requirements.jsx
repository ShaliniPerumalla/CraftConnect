// src/pages/Requirements.jsx

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  PlusCircle,
  LayoutGrid,
  Send,
  Eye,
  X,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useRequirements } from "../context/RequirementsContext";
import RequirementForm from "../components/requirements/RequirementForm";
import RequirementCard from "../components/requirements/RequirementCard";
import QuotationForm from "../components/requirements/QuotationForm";
import QuotationComparison from "../components/requirements/QuotationComparison";

export default function Requirements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";

  const [activeTab, setActiveTab] = useState(initialTab); // "create" | "dashboard" | "creator"
  const [statusFilter, setStatusFilter] = useState("all");

  const { requirements } = useRequirements();

  // Modal / Interaction states
  const [quotationModalReq, setQuotationModalReq] = useState(null);
  const [comparisonReq, setComparisonReq] = useState(null);
  const [detailModalReq, setDetailModalReq] = useState(null);

  // Filtered customer requirements
  const filteredRequirements = requirements.filter((req) => {
    if (statusFilter === "all") return true;
    return req.status.toLowerCase().includes(statusFilter.toLowerCase());
  });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setComparisonReq(null);
    setSearchParams({ tab });
  };

  const handleOpenQuotation = (req) => {
    setQuotationModalReq(req);
  };

  const handleCompare = (req) => {
    setComparisonReq(req);
  };

  const handleView = (req) => {
    setDetailModalReq(req);
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main>
        {/* ==================================================
            HERO HEADER
        ================================================== */}
        <section className="relative overflow-hidden border-b border-border bg-cream">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-forest/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Marketplace
            </Link>

            <div className="max-w-4xl mt-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border shadow-sm">
                <Sparkles size={14} className="text-amber-dark" />
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-amber-dark">
                  MakerMatch Custom Studio
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight mt-4">
                Requirement + Quotation{" "}
                <span className="italic text-amber-dark">Management.</span>
              </h1>

              <p className="text-base text-ink-soft leading-relaxed mt-4 max-w-2xl">
                The bridge connecting your custom ideas to verified artisan creators.
                Describe what you want, receive competitive quotations, and compare offers before ordering.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-border/80">
              <button
                type="button"
                onClick={() => handleTabSwitch("dashboard")}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    activeTab === "dashboard" && !comparisonReq
                      ? "bg-ink text-cream shadow-md"
                      : "bg-white border border-border text-ink-soft hover:text-ink hover:border-amber"
                  }
                `}
              >
                <LayoutGrid size={15} />
                <span>My Requirements (Dashboard)</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber/20 text-amber-dark text-[10px]">
                  {requirements.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("create")}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    activeTab === "create"
                      ? "bg-ink text-cream shadow-md"
                      : "bg-white border border-border text-ink-soft hover:text-ink hover:border-amber"
                  }
                `}
              >
                <PlusCircle size={15} />
                <span>Create Custom Requirement</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("creator")}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    activeTab === "creator"
                      ? "bg-amber-dark text-white shadow-md"
                      : "bg-white border border-border text-ink-soft hover:text-ink hover:border-amber"
                  }
                `}
              >
                <Send size={15} />
                <span>Creator Side: Available Requests</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-cream text-[10px]">
                  {requirements.filter((r) => r.status !== "Accepted").length} open
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN CONTENT AREA
        ================================================== */}
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* COMPARISON VIEW (WHEN CLICKED) */}
            {comparisonReq ? (
              <QuotationComparison
                requirement={comparisonReq}
                onBack={() => setComparisonReq(null)}
                onQuotationAccepted={() => {
                  // Refresh state from context
                  setComparisonReq((prev) =>
                    requirements.find((r) => r.id === prev.id) || prev
                  );
                }}
              />
            ) : activeTab === "create" ? (
              /* TAB 1: CREATE CUSTOM REQUIREMENT */
              <div className="max-w-3xl mx-auto">
                <RequirementForm
                  onSuccess={(created) => {
                    // Switch to dashboard after a delay or let user view it
                  }}
                />
              </div>
            ) : activeTab === "dashboard" ? (
              /* TAB 2: CUSTOMER REQUIREMENT DASHBOARD */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <h2 className="font-display text-3xl text-ink">
                      My Requirements
                    </h2>
                    <p className="text-xs text-ink-soft mt-1">
                      Track customer custom requests, check received creator quotations, and approve offers.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-white border border-border rounded-2xl p-1.5 self-start shadow-sm">
                    <span className="text-[11px] font-semibold text-ink-muted px-2 flex items-center gap-1">
                      <Filter size={12} /> Filter:
                    </span>
                    {["all", "Waiting", "Quotations Received", "Accepted"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`
                          px-3
                          py-1
                          rounded-xl
                          text-xs
                          font-medium
                          transition-all
                          ${
                            statusFilter === status
                              ? "bg-ink text-cream"
                              : "text-ink-soft hover:text-ink hover:bg-cream"
                          }
                        `}
                      >
                        {status === "all" ? "All" : status}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredRequirements.length === 0 ? (
                  <div className="bg-white border border-border rounded-3xl p-12 text-center">
                    <p className="font-display text-xl text-ink">No requirements found</p>
                    <p className="text-xs text-ink-soft mt-1">
                      You haven't posted any requirements in this filter category yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("create")}
                      className="mt-5 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors"
                    >
                      Post New Requirement
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredRequirements.map((req) => (
                      <RequirementCard
                        key={req.id}
                        requirement={req}
                        viewMode="customer"
                        onView={handleView}
                        onCompare={handleCompare}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* TAB 3: CREATOR SIDE - AVAILABLE REQUESTS */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber/10 via-white to-forest/10 border border-border rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-dark">
                        Creator Portal
                      </span>
                      <h2 className="font-display text-3xl text-ink mt-1">
                        Available Custom Requests
                      </h2>
                      <p className="text-sm text-ink-soft mt-1">
                        Browse active requests submitted by customers looking for custom craft pieces. Review requirements and submit your price quotations.
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur border border-border rounded-2xl px-5 py-3 text-center shrink-0">
                      <span className="text-xs text-ink-soft block">Available Leads</span>
                      <span className="font-display text-2xl font-bold text-ink">
                        {requirements.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {requirements.map((req) => (
                    <RequirementCard
                      key={req.id}
                      requirement={req}
                      viewMode="creator"
                      onView={handleView}
                      onSendQuotation={handleOpenQuotation}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            REQUIREMENT DETAIL MODAL
        ================================================== */}
        {detailModalReq && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white border border-border rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setDetailModalReq(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-dark bg-amber/10 px-2.5 py-1 rounded-lg">
                  #{detailModalReq.id}
                </span>
                <span className="text-xs uppercase tracking-wider text-ink-soft font-semibold">
                  {detailModalReq.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest/15 text-forest font-semibold ml-auto">
                  {detailModalReq.status}
                </span>
              </div>

              <h2 className="font-display text-2xl text-ink">
                {detailModalReq.title}
              </h2>

              <p className="text-xs text-ink-soft mt-1">
                Requested by {detailModalReq.customerName || "Customer"} on {detailModalReq.createdAt}
              </p>

              <div className="my-5 p-4 rounded-2xl bg-cream/60 border border-border/80">
                <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider block mb-1">
                  Customer Description:
                </span>
                <p className="text-sm text-ink leading-relaxed">
                  {detailModalReq.description}
                </p>
              </div>

              {/* Reference Images */}
              {detailModalReq.referenceImages && detailModalReq.referenceImages.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider block mb-2">
                    Reference Images:
                  </span>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {detailModalReq.referenceImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Reference"
                        className="w-24 h-24 rounded-2xl object-cover border border-border shadow-sm shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-border text-xs mb-6">
                <div>
                  <span className="text-ink-soft block">Target Budget</span>
                  <span className="font-display text-base font-bold text-ink mt-0.5 block">
                    ₹{Number(detailModalReq.budget).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-ink-soft block">Delivery Date</span>
                  <span className="font-semibold text-ink mt-0.5 block flex items-center gap-1">
                    <Calendar size={13} className="text-amber-dark" />
                    {detailModalReq.requiredDate || "Flexible"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-soft block">Location</span>
                  <span className="font-semibold text-ink mt-0.5 block flex items-center gap-1">
                    <MapPin size={13} className="text-forest" />
                    {detailModalReq.location}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDetailModalReq(null)}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-medium text-ink hover:bg-cream"
                >
                  Close
                </button>

                {detailModalReq.quotations?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const req = detailModalReq;
                      setDetailModalReq(null);
                      handleCompare(req);
                    }}
                    className="px-6 py-2.5 rounded-full bg-amber-dark text-white text-xs font-semibold hover:bg-ink transition-colors"
                  >
                    Compare {detailModalReq.quotations.length} Quotations
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const req = detailModalReq;
                    setDetailModalReq(null);
                    handleOpenQuotation(req);
                  }}
                  className="px-6 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors"
                >
                  Send Quotation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            QUOTATION SUBMISSION MODAL (CREATOR FORM)
        ================================================== */}
        <QuotationForm
          requirement={quotationModalReq}
          isOpen={!!quotationModalReq}
          onClose={() => setQuotationModalReq(null)}
          onSuccess={() => {
            // Updated in context
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
