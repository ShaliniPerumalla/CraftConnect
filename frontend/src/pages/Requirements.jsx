// src/pages/Requirements.jsx

import { useState, useMemo } from "react";
/*import { useState } from "react";*/
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Filter,
  Search,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  Palette,
  ArrowRight,
  /*ArrowLeft,*/
  CheckCircle2,
  Clock,
  Plus,
  PlusCircle,
  LayoutGrid,
  Send,
  Eye,
  X,
  Calendar,
  MapPin,
  /*Clock,
  CheckCircle2,
  Filter,*/
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useRequirementQuotation } from "../context/RequirementQuotationContext";
import {
  RequirementForm,
  RequirementCard,
  QuotationForm,
  QuotationComparison,
  QuotationDetailModal,
  RequirementDetailModal,
  RequirementStepper,
} from "../components/requirements";

export default function Requirements() {
  const {
    requirements,
    quotations,
    activeRole,
    setActiveRole,
    addRequirement,
    submitQuotation,
    acceptQuotation,
    getQuotationsByRequirementId,
    resetAllData,
  } = useRequirementQuotation();

  // Active step sequence:
  // "create-requirement" (Step 1)
  // "active-requirements" (Step 2 - Default initial active state as requested!)
  // "creator-quotations" (Step 3)
  // "quotation-comparison" (Step 4)
  const [activeStep, setActiveStep] = useState("active-requirements");

  // Filter & Search states for Active Requirements
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Selected items
  const [selectedRequirementForQuote, setSelectedRequirementForQuote] =
    useState(null);
  const [selectedRequirementForCompare, setSelectedRequirementForCompare] =
    useState(requirements[0] || null);
  const [inspectedRequirement, setInspectedRequirement] = useState(null);
  const [inspectedQuotation, setInspectedQuotation] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4500);
  };

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchCat =
        categoryFilter === "All" || req.category === categoryFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.deliveryLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [requirements, categoryFilter, searchQuery]);

  // Handle requirement submit from Step 1 -> advances sequence to Step 2
  const handleRequirementSubmit = (newReqData) => {
    const created = addRequirement(newReqData);
    showToast(
      `Requirement #${created.id} ("${created.title}") published! Advanced to Step 2: Active Requirements.`
    );
    setSelectedRequirementForCompare(created);
    // Smoothly advance sequence to Step 2
    setActiveStep("active-requirements");
  };

  // Handle creator quotation submit from Step 3 -> advances sequence to Step 4
  const handleQuotationSubmit = (quoteData) => {
    const createdQuote = submitQuotation(quoteData);
    setSelectedRequirementForQuote(null);
    showToast(
      `Quotation of ₹${createdQuote.price} sent for #${quoteData.requirementId}! Advanced to Step 4: Quotation Comparison.`
    );
    const targetReq = requirements.find((r) => r.id === quoteData.requirementId);
    if (targetReq) {
      setSelectedRequirementForCompare(targetReq);
    }
    // Smoothly advance sequence to Step 4
    setActiveStep("quotation-comparison");
  };

  // Handle customer accepting quotation in Step 4
  const handleAcceptQuotation = (quotationId) => {
    acceptQuotation(quotationId);
    showToast(
      "Quotation accepted! Maker commissioned and custom order has been placed in your Orders."
    );
  };

  // Synchronize role switch with stepper
  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    if (role === "creator") {
      setActiveStep("creator-quotations");
    } else {
      setActiveStep("active-requirements");
    }
  };

  const categoriesList = [
    "All",
    "Resin Art",
    "Woodwork",
    "Pottery & Ceramics",
    "Jewelry",
    "Textiles & Fiber Art",
    "Wall Art & Prints",
  ];

  return (
    <div className="min-h-screen bg-cream font-body text-ink flex flex-col">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-ink text-cream p-4 rounded-2xl shadow-2xl border border-amber/30 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-amber/20 flex items-center justify-center text-amber shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-amber tracking-wide uppercase">
              MakerMatch Studio Workflow
            </p>
            <p className="text-xs text-cream/90 mt-0.5 leading-relaxed">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 pb-20">
        {/* ==================================================
            HERO & METRICS SECTION
        ================================================== */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-cream via-cream to-cream-dark/30">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-36 -right-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-forest/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-border shadow-2xs mb-4">
                  <Sparkles size={13} className="text-amber-dark" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-amber-dark">
                    Idea → Requirement → Creator → Quotation
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ink leading-tight font-semibold">
                  Handmade ideas,{" "}
                  <span className="italic text-amber-dark font-normal">
                    made personal.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-ink-soft leading-relaxed mt-3 max-w-2xl">
                  Commission custom bespoke crafts directly from master makers.
                  Submit your custom requirement, receive itemized artisan quotations,
                  and compare bids with guaranteed platform escrow protection.
                </p>
              </div>

              {/* Perspective / Role Toggle */}
              <div className="bg-white/95 backdrop-blur-xs border border-border rounded-2xl p-2 shadow-xs self-start lg:self-end">
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block px-3 pt-1 pb-1.5">
                  Interactive Simulator Role:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("customer")}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all
                      ${
                        activeRole === "customer"
                          ? "bg-ink text-cream shadow-2xs"
                          : "text-ink-soft hover:text-ink hover:bg-cream"
                      }
                    `}
                  >
                    <UserCheck size={14} />
                    Customer View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("creator")}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all
                      ${
                        activeRole === "creator"
                          ? "bg-amber-dark text-white shadow-2xs"
                          : "text-ink-soft hover:text-ink hover:bg-cream"
                      }
                    `}
                  >
                    <Palette size={14} />
                    Creator Side
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/80">
              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  Active Requirements
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5 block">
                  {requirements.length} Custom Requests
                </span>
              </div>

              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  Artisan Quotations
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-amber-dark mt-0.5 block">
                  {quotations.length} Active Bids
                </span>
              </div>

              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  Average Turnaround
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-forest mt-0.5 block">
                  4 – 7 Days
                </span>
              </div>

              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  Buyer Protection
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5 block flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-forest" />
                  100% Escrow
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN WORKSPACE CONTENT WITH STEPPER
        ================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* ==================================================
              NEW SEQUENTIAL STEPPER PIPELINE (Replaces old options line!)
          ================================================== */}
          <RequirementStepper
            activeStep={activeStep}
            onStepChange={(newStep) => {
              setActiveStep(newStep);
              if (newStep === "creator-quotations") {
                setActiveRole("creator");
              } else if (newStep === "active-requirements" || newStep === "create-requirement") {
                setActiveRole("customer");
              }
            }}
            requirementsCount={requirements.length}
            quotationsCount={quotations.length}
            selectedRequirementId={selectedRequirementForCompare?.id}
          />

          {/* Reset Demo Data Quick Link */}
          <div className="flex justify-end -mt-5 mb-5">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset demo requirements & quotations back to initial state?")) {
                  resetAllData();
                  showToast("Demo data reloaded to initial state.");
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-amber-dark underline transition-colors"
              title="Reset sample data"
            >
              <RotateCcw size={11} />
              Reset Demo Data
            </button>
          </div>

          {/* ==================================================
              STEP 01: CREATE CUSTOM REQUIREMENT
          ================================================== */}
          {activeStep === "create-requirement" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <RequirementForm
                onSubmitSuccess={handleRequirementSubmit}
                onCancel={() => setActiveStep("active-requirements")}
              />

              {/* Bottom Sequence Navigation */}
              <div className="flex items-center justify-between p-4 bg-white border border-border rounded-2xl shadow-2xs">
                <span className="text-xs text-ink-soft">
                  Already have custom orders submitted?
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStep("active-requirements")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold transition-all shadow-2xs"
                >
                  View Active Requirements
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 02: ACTIVE REQUIREMENTS (Customer Dashboard)
          ================================================== */}
          {activeStep === "active-requirements" && (
            <div className="space-y-6">
              {/* Filter & Search Toolbar */}
              <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-ink-soft mr-2 flex items-center gap-1">
                    <Filter size={13} /> Category:
                  </span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${
                          categoryFilter === cat
                            ? "bg-ink text-cream shadow-2xs font-semibold"
                            : "bg-cream text-ink-soft hover:text-ink hover:bg-cream-dark"
                        }
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Box & Quick New Req CTA */}
                <div className="flex items-center gap-2">
                  <div className="relative min-w-[200px]">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by ID, city..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-cream/40 text-xs text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveStep("create-requirement")}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold transition-colors shrink-0 shadow-2xs"
                  >
                    <Plus size={13} />
                    New
                  </button>
                </div>
              </div>

              {/* Requirement Cards Grid */}
              {filteredRequirements.length === 0 ? (
                <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-xs">
                  <Clock size={36} className="text-amber-dark mx-auto mb-3" />
                  <h3 className="font-display text-xl font-semibold text-ink">
                    No active requirements found
                  </h3>
                  <p className="text-xs text-ink-soft mt-1">
                    Submit a new custom craft requirement to receive artisan quotations.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveStep("create-requirement")}
                    className="mt-4 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors"
                  >
                    + Create Requirement
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequirements.map((req) => {
                    const reqQuotes = getQuotationsByRequirementId(req.id);
                    return (
                      <RequirementCard
                        key={req.id}
                        requirement={req}
                        quotations={reqQuotes}
                        viewRole="customer"
                        onViewRequirement={(r) => setInspectedRequirement(r)}
                        onCompareQuotations={(r) => {
                          setSelectedRequirementForCompare(r);
                          setActiveStep("quotation-comparison");
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Bottom Step Forward Bar */}
              <div className="mt-8 p-5 bg-white border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                    Next in Pipeline: Creator Side Review & Quotations
                  </h4>
                  <p className="text-xs text-ink-soft mt-0.5">
                    See how verified artisans view your request and submit formal quotations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("creator");
                    setActiveStep("creator-quotations");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-dark text-white hover:bg-ink text-xs font-semibold transition-all shadow-2xs shrink-0"
                >
                  Proceed to Step 3: Creator Quotations
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 03: CREATOR QUOTATIONS (Artisan Workspace)
          ================================================== */}
          {activeStep === "creator-quotations" && (
            <div className="space-y-6">
              {/* Creator Hero Header */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/10 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
                    <Palette size={13} />
                    Step 03 • Artisan Workspace & Available Requests
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                    Browse Client Requirements & Send Quotations
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Review client specifications, delivery location (e.g. Ongole), budget, and submit an itemized custom quotation.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="px-3 py-1.5 rounded-xl bg-forest/10 text-forest text-xs font-semibold border border-forest/20">
                    🟢 {requirements.length} Requests Open for Bids
                  </span>
                </div>
              </div>

              {/* Creator Requests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((req) => {
                  const reqQuotes = getQuotationsByRequirementId(req.id);
                  return (
                    <RequirementCard
                      key={req.id}
                      requirement={req}
                      quotations={reqQuotes}
                      viewRole="creator"
                      onViewRequirement={(r) => setInspectedRequirement(r)}
                      onSendQuotation={(r) => setSelectedRequirementForQuote(r)}
                    />
                  );
                })}
              </div>

              {/* Bottom Step Forward Bar */}
              <div className="mt-8 p-5 bg-white border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("customer");
                    setActiveStep("active-requirements");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream"
                >
                  <ArrowLeft size={13} />
                  Back to Active Requirements
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("customer");
                    setActiveStep("quotation-comparison");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white hover:bg-forest-dark text-xs font-semibold transition-all shadow-2xs"
                >
                  Proceed to Step 4: Quotation Comparison
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 04: CUSTOMER QUOTATION COMPARISON
          ================================================== */}
          {activeStep === "quotation-comparison" && (
            <div className="space-y-6">
              {/* Requirement Selector Dropdown */}
              <div className="bg-white border border-border rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-soft">
                    Select Requirement to Compare:
                  </span>
                  <select
                    value={selectedRequirementForCompare?.id || ""}
                    onChange={(e) => {
                      const found = requirements.find(
                        (r) => r.id === e.target.value
                      );
                      if (found) setSelectedRequirementForCompare(found);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-border bg-cream/40 text-xs font-bold text-ink outline-none cursor-pointer"
                  >
                    {requirements.map((req) => (
                      <option key={req.id} value={req.id}>
                        #{req.id} — {req.title} (
                        {getQuotationsByRequirementId(req.id).length} Quotes)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRequirementForQuote(
                        selectedRequirementForCompare || requirements[0]
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-dark text-white text-xs font-semibold hover:bg-ink transition-colors shadow-2xs"
                  >
                    + Simulate Sending Another Quote
                  </button>
                </div>
              </div>

              {/* Quotation Comparison Matrix */}
              <QuotationComparison
                requirement={selectedRequirementForCompare || requirements[0]}
                quotations={getQuotationsByRequirementId(
                  selectedRequirementForCompare?.id || "REQ001"
                )}
                onSelectQuotation={handleAcceptQuotation}
                onViewQuotation={(q) => setInspectedQuotation(q)}
                onClose={() => setActiveStep("active-requirements")}
              />

              {/* Bottom Step Navigation */}
              <div className="mt-8 p-5 bg-white border border-border rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveStep("active-requirements")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream"
                >
                  <ArrowLeft size={13} />
                  Back to Active Requirements
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep("create-requirement")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold transition-all shadow-2xs"
                >
                  + Create Another Custom Requirement
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          MODAL: CREATOR QUOTATION FORM
      ================================================== */}
      {selectedRequirementForQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <QuotationForm
              requirement={selectedRequirementForQuote}
              onSubmitQuotation={handleQuotationSubmit}
              onCancel={() => setSelectedRequirementForQuote(null)}
            />
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: VIEW REQUIREMENT DETAILS
      ================================================== */}
      {inspectedRequirement && (
        <RequirementDetailModal
          requirement={inspectedRequirement}
          quotations={getQuotationsByRequirementId(inspectedRequirement.id)}
          viewRole={activeRole}
          onClose={() => setInspectedRequirement(null)}
          onSendQuotation={(r) => {
            setInspectedRequirement(null);
            setSelectedRequirementForQuote(r);
          }}
          onCompareQuotations={(r) => {
            setInspectedRequirement(null);
            setSelectedRequirementForCompare(r);
            setActiveStep("quotation-comparison");
          }}
        />
      )}

      {/* ==================================================
          MODAL: VIEW OFFICIAL QUOTATION SLIP
      ================================================== */}
      {inspectedQuotation && (
        <QuotationDetailModal
          quotation={inspectedQuotation}
          requirement={requirements.find(
            (r) => r.id === inspectedQuotation.requirementId
          )}
          onClose={() => setInspectedQuotation(null)}
          onSelect={(q) => {
            handleAcceptQuotation(q.id);
            setInspectedQuotation(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
