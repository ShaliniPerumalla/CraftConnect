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

  // Custom order 3-step sequence:
  // "create-requirement" (Step 1)
  // "active-requirements" (Step 2 - Default active state)
  // "quotation-comparison" (Step 3)
  const [activeStep, setActiveStep] = useState("active-requirements");

  // Filter & Search states
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

  // Filtered requirements for custom order dashboard
  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchCat =
        categoryFilter === "All" || req.category === categoryFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.deliveryLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [requirements, categoryFilter, searchQuery]);

  // Handle requirement submit from Step 1 (CREATE REQUIREMENT)
  const handleRequirementSubmit = (newReqData) => {
    const created = addRequirement(newReqData);
    showToast(
      `Custom order "${created.title}" published! Advanced to Active Requirements.`
    );
    setSelectedRequirementForCompare(created);
    setActiveStep("active-requirements");
  };

  // Handle quotation submit
  const handleQuotationSubmit = async (quoteData) => {
    const createdQuote = submitQuotation(quoteData);
    setSelectedRequirementForQuote(null);
    const targetReq = requirements.find(
      (r) => r.id === quoteData.requirementId
    );
    showToast(
      `Quotation of ₹${createdQuote.price} successfully submitted for ${targetReq?.title || "custom craft"}!`
    );
    if (targetReq) {
      setSelectedRequirementForCompare(targetReq);
    }
    setActiveStep("quotation-comparison");
  };

  // Handle customer accepting quotation in Step 3
  const handleAcceptQuotation = (quotationId) => {
    acceptQuotation(quotationId);
    showToast(
      "Quotation accepted! Maker commissioned and custom order has been placed in Orders."
    );
  };

  // Direct chat with maker
  const handleInitiateChat = (req, quote = null) => {
    if (!req) return;
    startOrOpenConversation({
      customerId: req.customer?.id,
      creatorId: quote?.creator?.id || "c1",
      requirementId: req.id,
      requirementTitle: req.title,
      participantName: quote?.creator?.name || "Artisan",
    });
    navigate("/chat");
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
            MAIN CUSTOM ORDER WORKSPACE
        ================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {/* 3 Main Sections: CREATE REQUIREMENT, ACTIVE REQUIREMENT, QUOTATION COMPARISON */}
          <RequirementStepper
            activeStep={activeStep}
            onStepChange={setActiveStep}
            requirementsCount={requirements.length}
            quotationsCount={quotations.length}
            selectedRequirementId={selectedRequirementForCompare?.id}
            selectedRequirementTitle={selectedRequirementForCompare?.title}
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
                          placeholder="Search by product name, city..."
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
                        className="px-3 py-1.5 rounded-xl border border-border bg-cream/40 text-xs font-bold text-ink outline-none cursor-pointer max-w-xs sm:max-w-md truncate"
                      >
                        {requirements.map((req) => (
                          <option key={req.id} value={req.id}>
                            {req.title} ({getQuotationsByRequirementId(req.id).length} Quotes)
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
