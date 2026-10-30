// src/pages/Requirements.jsx

import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  CheckCircle2,
  Clock,
  Plus,
  LayoutGrid,
  Send,
  Eye,
  X,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  MessageSquare,
  FileText,
  Truck,
  IndianRupee,
  Star,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { useChat } from "../context/ChatContext";
import * as member3Service from "../services/member3Service";

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
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const { startOrOpenConversation } = useChat();

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

  // If logged-in user is a creator, default to creator role
  useEffect(() => {
    if (user?.role === "creator" && activeRole !== "creator") {
      setActiveRole("creator");
    }
  }, [user, activeRole, setActiveRole]);

  // Customer step sequence:
  // "create-requirement" (Step 1)
  // "active-requirements" (Step 2 - Default initial active state)
  // "quotation-comparison" (Step 4)
  const [activeStep, setActiveStep] = useState(
    activeRole === "creator" ? "creator-quotations" : "active-requirements"
  );

  // Creator module internal tab: "marketplace" | "my-bids"
  const [creatorTab, setCreatorTab] = useState("marketplace");

  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [myBidsStatusFilter, setMyBidsStatusFilter] = useState("All");

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

  // Filtered requirements for customer and creator marketplace
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

  // Creator's submitted quotations list
  const mySubmittedQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchCreator =
        !user?.email ||
        q.creator_email === user.email ||
        q.creator?.id === "c1" ||
        q.creator?.name?.toLowerCase().includes("maren") ||
        true; // include creator quotations in simulator
      if (!matchCreator) return false;

      if (myBidsStatusFilter === "All") return true;
      return (
        q.status?.toLowerCase() === myBidsStatusFilter.toLowerCase()
      );
    });
  }, [quotations, user, myBidsStatusFilter]);

  // Handle requirement submit from Step 1 (Customer side)
  const handleRequirementSubmit = (newReqData) => {
    const created = addRequirement(newReqData);
    showToast(
      `Requirement #${created.id} ("${created.title}") published! Advanced to Active Requirements.`
    );
    setSelectedRequirementForCompare(created);
    setActiveStep("active-requirements");
  };

  // Handle creator quotation submit (Direct Bid Modal)
  const handleQuotationSubmit = async (quoteData) => {
    const createdQuote = submitQuotation(quoteData);
    setSelectedRequirementForQuote(null);
    showToast(
      `Quotation of ₹${createdQuote.price} successfully submitted for #${quoteData.requirementId}!`
    );

    // Switch creator to "my-bids" tab so they immediately see real-time status!
    if (activeRole === "creator") {
      setCreatorTab("my-bids");
    } else {
      const targetReq = requirements.find(
        (r) => r.id === quoteData.requirementId
      );
      if (targetReq) {
        setSelectedRequirementForCompare(targetReq);
      }
      setActiveStep("quotation-comparison");
    }
  };

  // Handle customer accepting quotation in Step 4
  const handleAcceptQuotation = (quotationId) => {
    acceptQuotation(quotationId);
    showToast(
      "Quotation accepted! Maker commissioned and custom order has been placed in Orders."
    );
  };

  // Direct chat with client or creator
  const handleInitiateChat = (req, quote = null) => {
    if (!req) return;
    startOrOpenConversation({
      customerId: req.customer?.id,
      creatorId: quote?.creator?.id || "c1",
      requirementId: req.id,
      requirementTitle: req.title,
      participantName:
        activeRole === "creator"
          ? req.customer?.name || "Client"
          : quote?.creator?.name || "Artisan",
    });
    navigate("/chat");
  };

  // Synchronize role switch
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
            HERO & ROLE PERSPECTIVE SECTION
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
                    {activeRole === "creator"
                      ? "Artisan Workspace • Bidding Hub & Live Requests"
                      : "Idea → Requirement → Creator → Quotation"}
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ink leading-tight font-semibold">
                  {activeRole === "creator" ? (
                    <>
                      Artisan Bidding &{" "}
                      <span className="italic text-amber-dark font-normal">
                        Commission Hub.
                      </span>
                    </>
                  ) : (
                    <>
                      Handmade ideas,{" "}
                      <span className="italic text-amber-dark font-normal">
                        made personal.
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-ink-soft leading-relaxed mt-3 max-w-2xl">
                  {activeRole === "creator"
                    ? "Browse live custom craft requirements posted by verified buyers across India. Send itemized price & delivery bids, review accepted commissions, and track customer negotiations."
                    : "Commission custom bespoke crafts directly from master makers. Submit your custom requirement, receive itemized artisan quotations, and compare bids with guaranteed platform escrow protection."}
                </p>
              </div>

              {/* Role Toggle */}
              <div className="bg-white/95 backdrop-blur-xs border border-border rounded-2xl p-2 shadow-xs self-start lg:self-end">
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block px-3 pt-1 pb-1.5">
                  Platform View Role:
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
                    Creator Module
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/80">
              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  Marketplace Requests
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5 block">
                  {requirements.length} Open Requests
                </span>
              </div>

              <div className="bg-white/70 backdrop-blur-2xs rounded-xl p-3.5 border border-border/70 shadow-2xs">
                <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                  {activeRole === "creator" ? "My Submitted Bids" : "Active Quotations"}
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-amber-dark mt-0.5 block">
                  {activeRole === "creator"
                    ? `${mySubmittedQuotations.length} Bids Sent`
                    : `${quotations.length} Active Bids`}
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
                  Escrow Guarantee
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5 block flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-forest" />
                  100% Secured
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN WORKSPACE CONTENT
        ================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* =========================================================================
              CUSTOMER VIEW MODULE (UNCHANGED AS PER SPEC: DO NOT CHANGE CUSTOMER MODULE)
          ========================================================================= */}
          {activeRole === "customer" && (
            <>
              {/* Stepper Pipeline for Customer */}
              <RequirementStepper
                activeStep={activeStep}
                onStepChange={(newStep) => {
                  setActiveStep(newStep);
                  if (newStep === "creator-quotations") {
                    setActiveRole("creator");
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
                    if (
                      confirm("Reset demo requirements & quotations back to initial state?")
                    ) {
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

              {/* STEP 01: CREATE CUSTOM REQUIREMENT (Customer side) */}
              {activeStep === "create-requirement" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <RequirementForm
                    onSubmitSuccess={handleRequirementSubmit}
                    onCancel={() => setActiveStep("active-requirements")}
                  />

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

              {/* STEP 02: ACTIVE REQUIREMENTS (Customer Dashboard) */}
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

                    {/* Search Box & Customer New Req Button */}
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
                        New Requirement
                      </button>
                    </div>
                  </div>

                  {/* Cards Grid */}
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

                  {/* Customer Pipeline Next step banner */}
                  <div className="mt-8 p-5 bg-white border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div>
                      <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                        Artisan Quotations Available
                      </h4>
                      <p className="text-xs text-ink-soft mt-0.5">
                        Compare incoming bids and accept the best craft proposal.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStep("quotation-comparison")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold transition-all shadow-2xs shrink-0"
                    >
                      Go to Quotation Comparison
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 04: CUSTOMER QUOTATION COMPARISON */}
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
            </>
          )}

          {/* =========================================================================
              CREATOR MODULE: DEDICATED ARTISAN WORKSPACE & BIDDING INTERFACE
              (Post New Requirement button is HIDDEN. Shows Marketplace & My Submitted Quotations)
          ========================================================================= */}
          {activeRole === "creator" && (
            <div className="space-y-8">
              {/* Creator Workspace Header */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/15 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
                    <Palette size={13} />
                    Artisan Workspace • Bidding & Commission Hub
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                    Explore Client Orders & Submit Custom Quotations
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl">
                    Review client specifications, delivery location (e.g. Ongole, Hyderabad), budget constraints, and submit formal itemized bids with price, delivery charge, and estimated delivery dates.
                  </p>
                </div>

                {/* Creator Navigation Tabs */}
                <div className="flex items-center bg-cream/70 p-1.5 rounded-2xl border border-border shrink-0 self-start lg:self-auto">
                  <button
                    type="button"
                    onClick={() => setCreatorTab("marketplace")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      creatorTab === "marketplace"
                        ? "bg-white text-ink shadow-2xs border border-border/80"
                        : "text-ink-soft hover:text-ink hover:bg-cream"
                    }`}
                  >
                    <LayoutGrid size={14} />
                    Browse Open Requests
                    <span className="px-1.5 py-0.5 rounded-full bg-amber/15 text-amber-dark text-[10px] font-bold">
                      {requirements.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatorTab("my-bids")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      creatorTab === "my-bids"
                        ? "bg-white text-ink shadow-2xs border border-border/80"
                        : "text-ink-soft hover:text-ink hover:bg-cream"
                    }`}
                  >
                    <FileText size={14} />
                    My Submitted Quotations
                    <span className="px-1.5 py-0.5 rounded-full bg-forest/15 text-forest text-[10px] font-bold">
                      {mySubmittedQuotations.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* ==================================================
                  CREATOR TAB 1: BROWSE OPEN MARKETPLACE REQUESTS
              ================================================== */}
              {creatorTab === "marketplace" && (
                <div className="space-y-6">
                  {/* Filter Toolbar (Notice: NO "Post New Requirement" button here!) */}
                  <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-ink-soft mr-2 flex items-center gap-1">
                        <Filter size={13} /> Craft Domain:
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
                                ? "bg-amber-dark text-white shadow-2xs font-semibold"
                                : "bg-cream text-ink-soft hover:text-ink hover:bg-cream-dark"
                            }
                          `}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px]">
                      <Search
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by city, title, resin, teak..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-cream/40 text-xs text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none"
                      />
                    </div>
                  </div>

                  {/* Marketplace Requests Cards Grid */}
                  {filteredRequirements.length === 0 ? (
                    <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-xs">
                      <Clock size={36} className="text-amber-dark mx-auto mb-3" />
                      <h3 className="font-display text-xl font-semibold text-ink">
                        No marketplace requests matching your filter
                      </h3>
                      <p className="text-xs text-ink-soft mt-1">
                        Try resetting your craft category or clearing search keywords.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("All");
                          setSearchQuery("");
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-ink text-cream text-xs font-semibold"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRequirements.map((req) => {
                        const reqQuotes = getQuotationsByRequirementId(req.id);
                        // Check if creator has already submitted a bid for this requirement
                        const existingBid = reqQuotes.find(
                          (q) =>
                            q.creator?.id === "c1" ||
                            q.creator_email === user?.email ||
                            q.creator?.name?.toLowerCase().includes("maren")
                        );

                        return (
                          <div
                            key={req.id}
                            className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                          >
                            <div>
                              {/* Top Bar: ID, Category & Existing Bid Badge */}
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cream border border-border text-ink">
                                    #{req.id}
                                  </span>
                                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-cream-dark/60 text-ink-soft">
                                    {req.category}
                                  </span>
                                </div>

                                {existingBid ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest/15 text-forest text-[11px] font-bold border border-forest/20">
                                    <CheckCircle size={12} />
                                    Bid Sent: ₹{existingBid.price}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber/15 text-amber-dark text-[11px] font-bold border border-amber/20">
                                    <Clock size={12} />
                                    Open for Bids
                                  </span>
                                )}
                              </div>

                              {/* Card Image & Description */}
                              <div className="flex gap-4 mt-3">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream shrink-0 border border-border relative">
                                  <img
                                    src={
                                      req.images && req.images.length > 0
                                        ? req.images[0]
                                        : "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                                    }
                                    alt={req.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className="font-display text-lg font-semibold text-ink leading-snug line-clamp-1 group-hover:text-amber-dark transition-colors">
                                    {req.title}
                                  </h3>
                                  <p className="text-xs text-ink-soft mt-1 line-clamp-2 leading-relaxed">
                                    {req.description}
                                  </p>
                                </div>
                              </div>

                              {/* Metadata Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/80 text-xs">
                                <div className="bg-cream/50 rounded-xl p-2.5 border border-border/50">
                                  <span className="text-[11px] text-ink-muted block font-medium">
                                    Client Budget
                                  </span>
                                  <span className="font-semibold text-ink text-sm block mt-0.5">
                                    ₹
                                    {req.budgetMin && req.budgetMax
                                      ? `${req.budgetMin.toLocaleString("en-IN")}–₹${req.budgetMax.toLocaleString("en-IN")}`
                                      : Number(req.budget || 1500).toLocaleString("en-IN")}
                                  </span>
                                </div>

                                <div className="bg-cream/50 rounded-xl p-2.5 border border-border/50">
                                  <span className="text-[11px] text-ink-muted block font-medium">
                                    Deadline
                                  </span>
                                  <span className="font-semibold text-ink text-sm flex items-center gap-1 mt-0.5 truncate">
                                    <Calendar size={13} className="text-amber-dark shrink-0" />
                                    {req.requiredDate || "Flexible"}
                                  </span>
                                </div>

                                <div className="col-span-2 sm:col-span-1 bg-cream/50 rounded-xl p-2.5 border border-border/50">
                                  <span className="text-[11px] text-ink-muted block font-medium">
                                    Delivery City
                                  </span>
                                  <span className="font-semibold text-ink text-sm flex items-center gap-1 mt-0.5 truncate">
                                    <MapPin size={13} className="text-forest shrink-0" />
                                    {req.deliveryLocation || "Ongole"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Creator Card Action Footer */}
                            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setInspectedRequirement(req)}
                                  className="p-2 rounded-xl border border-border bg-white text-ink-soft hover:text-ink hover:bg-cream text-xs font-semibold"
                                  title="View Full Specifications"
                                >
                                  <Eye size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleInitiateChat(req, existingBid)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-ink-soft hover:text-ink hover:bg-cream text-xs font-semibold transition-colors"
                                  title="Chat with Customer"
                                >
                                  <MessageSquare size={13} />
                                  <span className="hidden sm:inline">Message</span>
                                </button>
                              </div>

                              {/* Prominent Send Bid / Quotation Button */}
                              <button
                                type="button"
                                onClick={() => setSelectedRequirementForQuote(req)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all ${
                                  existingBid
                                    ? "bg-forest text-white hover:bg-forest-dark"
                                    : "bg-amber-dark text-white hover:bg-ink"
                                }`}
                              >
                                <Send size={13} />
                                {existingBid ? "Revise Bid" : "Send Bid / Quotation"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================
                  CREATOR TAB 2: MY SUBMITTED QUOTATIONS
              ================================================== */}
              {creatorTab === "my-bids" && (
                <div className="space-y-6">
                  {/* Filter Toolbar for My Bids */}
                  <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink-soft mr-2">
                        Filter by Status:
                      </span>
                      {["All", "Pending", "Accepted", "Rejected"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setMyBidsStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            myBidsStatusFilter === st
                              ? "bg-ink text-cream shadow-2xs"
                              : "bg-cream text-ink-soft hover:text-ink hover:bg-cream-dark"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs text-ink-muted">
                      Showing {mySubmittedQuotations.length} artisan proposal{mySubmittedQuotations.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Submitted Quotations List */}
                  {mySubmittedQuotations.length === 0 ? (
                    <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-xs">
                      <FileText size={36} className="text-amber-dark mx-auto mb-3" />
                      <h3 className="font-display text-xl font-semibold text-ink">
                        No quotations found
                      </h3>
                      <p className="text-xs text-ink-soft mt-1">
                        You have not submitted any bids under this filter yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCreatorTab("marketplace")}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-amber-dark text-white text-xs font-semibold hover:bg-ink transition-colors"
                      >
                        Browse Open Client Requests
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mySubmittedQuotations.map((quote) => {
                        const linkedReq = requirements.find(
                          (r) => r.id === quote.requirementId
                        );

                        // Status pill badge helper
                        const getStatusBadge = (st) => {
                          const lower = (st || "").toLowerCase();
                          if (lower === "accepted") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/15 text-forest font-bold text-xs border border-forest/30">
                                <CheckCircle size={13} />
                                Accepted (Commissioned!)
                              </span>
                            );
                          }
                          if (lower === "rejected" || lower === "declined") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                                <X size={13} />
                                Declined
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber-dark font-bold text-xs border border-amber/30 animate-pulse">
                              <Clock size={13} />
                              Pending Buyer Review
                            </span>
                          );
                        };

                        return (
                          <div
                            key={quote.id}
                            className="bg-white border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Top Bar */}
                              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/80">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-wider block">
                                    Quotation Reference
                                  </span>
                                  <h4 className="font-display font-bold text-ink text-base">
                                    #{quote.id} {quote.quoteNumber ? `(${quote.quoteNumber})` : ""}
                                  </h4>
                                </div>
                                <div>{getStatusBadge(quote.status)}</div>
                              </div>

                              {/* Linked Requirement Summary */}
                              <div className="bg-cream/40 rounded-xl p-3 border border-border/60 mb-4">
                                <span className="text-[10px] font-semibold text-amber-dark uppercase tracking-wider block">
                                  Bidding On Client Order #{quote.requirementId}
                                </span>
                                <h5 className="font-display font-semibold text-ink text-sm mt-0.5">
                                  {linkedReq?.title || "Custom Artisan Requirement"}
                                </h5>
                                <p className="text-xs text-ink-soft mt-1">
                                  Client Location: {linkedReq?.deliveryLocation || "Ongole, Andhra Pradesh"}
                                </p>
                              </div>

                              {/* Price Breakdown Grid */}
                              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                                <div className="bg-cream/50 p-2.5 rounded-xl border border-border/50">
                                  <span className="text-[10px] text-ink-muted block">
                                    Item Price
                                  </span>
                                  <span className="font-bold text-ink text-sm">
                                    ₹{Number(quote.price || 0).toLocaleString("en-IN")}
                                  </span>
                                </div>

                                <div className="bg-cream/50 p-2.5 rounded-xl border border-border/50">
                                  <span className="text-[10px] text-ink-muted block">
                                    Delivery Charge
                                  </span>
                                  <span className="font-bold text-ink text-sm">
                                    ₹{Number(quote.deliveryCharge || 0).toLocaleString("en-IN")}
                                  </span>
                                </div>

                                <div className="bg-forest/10 p-2.5 rounded-xl border border-forest/20">
                                  <span className="text-[10px] text-forest block font-medium">
                                    Total Amount
                                  </span>
                                  <span className="font-bold text-forest text-sm">
                                    ₹{Number(quote.totalPrice || quote.price || 0).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>

                              {/* Turnaround & Delivery Date */}
                              <div className="flex items-center gap-4 text-xs text-ink-soft mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock size={13} className="text-amber-dark" />
                                  Turnaround: <strong>{quote.productionTime || "5-7 Days"}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={13} className="text-forest" />
                                  Est. Delivery:{" "}
                                  <strong>
                                    {quote.estimatedCompletionDate ||
                                      quote.estimated_delivery_date ||
                                      "On Schedule"}
                                  </strong>
                                </span>
                              </div>

                              {/* Proposal Notes */}
                              {quote.description && (
                                <div className="text-xs bg-cream/20 p-3 rounded-xl border border-border/40">
                                  <span className="font-semibold text-ink-soft block mb-1">
                                    Proposal Notes:
                                  </span>
                                  <p className="text-ink-soft italic line-clamp-3">
                                    "{quote.description}"
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => setInspectedQuotation(quote)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-white text-ink text-xs font-medium hover:bg-cream"
                              >
                                <Eye size={13} />
                                View Full Slip
                              </button>

                              <button
                                type="button"
                                onClick={() => handleInitiateChat(linkedReq, quote)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-cream hover:bg-amber-dark text-xs font-semibold transition-all shadow-2xs"
                              >
                                <MessageSquare size={13} />
                                Message Client
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          MODAL: DIRECT SEND BID / QUOTATION FORM
      ================================================== */}
      {selectedRequirementForQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <QuotationForm
              requirement={selectedRequirementForQuote}
              onSubmitQuotation={handleQuotationSubmit}
              onCancel={() => setSelectedRequirementForQuote(null)}
              currentCreator={{
                id: "c1",
                name: user?.name || "Maren Holt",
                studioName: "Holt Artisan Woodcraft",
                avatar: "https://i.pravatar.cc/150?img=32",
                rating: 4.9,
                reviewsCount: 52,
                location: "Hyderabad, Telangana",
                specialty: "Custom Wood & Resin Artisan",
              }}
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
