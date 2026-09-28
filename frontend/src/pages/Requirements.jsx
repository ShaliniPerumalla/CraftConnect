// src/pages/Requirements.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Plus,
  RefreshCw,
  User,
  Hammer,
  ShieldCheck,
  Check,
  ChevronRight,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import all 7 requested module components
import RequirementForm from "../components/requirements/RequirementForm";
import RequirementCard from "../components/requirements/RequirementCard";
import QuotationCard from "../components/requirements/QuotationCard";
import QuotationForm from "../components/requirements/QuotationForm";
import QuotationComparison from "../components/requirements/QuotationComparison";
import FileUpload from "../components/requirements/FileUpload";
import BudgetInput from "../components/requirements/BudgetInput";
import { useNotifications } from "../context/NotificationContext";

// Re-export all 7 components from this module for direct import flexibility
export {
  RequirementForm,
  RequirementCard,
  QuotationCard,
  QuotationForm,
  QuotationComparison,
  FileUpload,
  BudgetInput,
};

// ======================================================
// INITIAL SEED DATA
// ======================================================

const INITIAL_REQUIREMENTS = [
  {
    id: "REQ001",
    title: "Custom Resin Name Plate",
    category: "Resin Art",
    customerName: "Sneha Reddy",
    status: "Waiting for Quotations",
    budget: "₹1,000–₹1,500",
    budgetValue: 1250,
    requiredDate: "2026-09-25",
    location: "Ongole, Andhra Pradesh",
    deliveryLocation: "Ongole, Andhra Pradesh",
    description:
      "I want a customized resin name plate for our new apartment entrance. Ocean blue swirls with real dried sea shells and gold foil flakes. Engraved text: 'Sharma Residence'. Dimensions approx 12x6 inches.",
    images: [
      {
        id: "img-req-1",
        name: "Ocean Resin Sample",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "img-req-2",
        name: "Teak Base Inspo",
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      },
    ],
    quotations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ002",
    title: "Wedding Decoration",
    category: "Wedding & Event Decor",
    customerName: "Arun & Divya",
    status: "Quotations Received",
    budget: "₹1,200–₹1,500",
    budgetValue: 1350,
    requiredDate: "2026-10-15",
    location: "Ongole, Andhra Pradesh",
    deliveryLocation: "Ongole, Andhra Pradesh",
    description:
      "Geometric handcrafted wedding backdrop archway. Natural macrame weave with brass oil lamp holders and dried eucalyptus accents. Easy to assemble on venue lawn.",
    images: [
      {
        id: "img-req-3",
        name: "Floral & Macrame Arch",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "img-req-4",
        name: "Brass Accents",
        url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      },
    ],
    quotations: [
      {
        id: "QUO-001",
        requirementId: "REQ002",
        creatorId: "cr-1",
        creatorName: "Aarav Sharma",
        creatorStudio: "Vedic Craft Studio",
        creatorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        creatorRating: 4.7,
        creatorReviewsCount: 38,
        creatorLocation: "Hyderabad, India",
        creatorBadge: "Best Value",
        price: 1200,
        deliveryCharge: 0,
        totalPrice: 1200,
        productionDays: 5,
        estimatedCompletionDate: "2026-10-05",
        materials: "Solid Teak Wood + Natural Cotton Macrame",
        message:
          "I specialize in wedding backdrops. I can create the requested design with interlocking joints for quick 15-minute assembly.",
        terms: "50% advance, 1 revision included, free delivery.",
        proposedImages: [
          {
            id: "prop-1",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
          },
        ],
        status: "pending",
      },
      {
        id: "QUO-002",
        requirementId: "REQ002",
        creatorId: "cr-2",
        creatorName: "Maren Holt",
        creatorStudio: "Heritage Wood & Decor",
        creatorAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        creatorRating: 4.9,
        creatorReviewsCount: 92,
        creatorLocation: "Chennai, India",
        creatorBadge: "Top Rated ⭐",
        price: 1250,
        deliveryCharge: 100,
        totalPrice: 1350,
        productionDays: 4,
        estimatedCompletionDate: "2026-10-04",
        materials: "Seasoned Teak + Hand-burnished Brass + Cotton",
        message:
          "Can deliver a premium, luxury finish within 4 days. Fast courier packaging and weather-resistant protective beeswax seal included.",
        terms: "100% satisfaction guarantee, 2 digital revisions.",
        proposedImages: [
          {
            id: "prop-2",
            url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
          },
        ],
        status: "pending",
      },
      {
        id: "QUO-003",
        requirementId: "REQ002",
        creatorId: "cr-3",
        creatorName: "Diego Fuentes",
        creatorStudio: "Artisanal Workshop",
        creatorAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        creatorRating: 4.4,
        creatorReviewsCount: 29,
        creatorLocation: "Ongole, India",
        creatorBadge: "Local Maker",
        price: 1100,
        deliveryCharge: 0,
        totalPrice: 1100,
        productionDays: 7,
        estimatedCompletionDate: "2026-10-07",
        materials: "Treated Pine Wood + Jute & Brass Inlay",
        message:
          "Affordable and sturdy handmade arch decor crafted to your exact dimensions right here in Ongole. Free local delivery and hand-off.",
        terms: "Local pickup available, cash or UPI upon delivery.",
        proposedImages: [
          {
            id: "prop-3",
            url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          },
        ],
        status: "pending",
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Sample inspiration cards for Step 1: Idea
const SAMPLE_IDEAS = [
  {
    id: "idea-1",
    title: "Custom Resin Ocean Name Plate",
    category: "Resin Art",
    suggestedBudget: "1250",
    description:
      "I want a customized resin name plate for our house entrance with deep ocean blue pigment, embedded dried flowers and shells, with 'Sharma Residence' in gold acrylic lettering.",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    tags: ["Personalized", "Resin Art", "Home Decor"],
  },
  {
    id: "idea-2",
    title: "Bohemian Macrame Wedding Backdrop",
    category: "Wedding & Event Decor",
    suggestedBudget: "1350",
    description:
      "Handcrafted geometric archway backdrop with natural cotton macrame weave, polished brass lamps, and preserved botanical eucalyptus accents.",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    tags: ["Handmade", "Weddings", "Bespoke"],
  },
  {
    id: "idea-3",
    title: "Custom Carved Solid Teak Study Desk",
    category: "Woodwork",
    suggestedBudget: "8500",
    description:
      "Handcrafted solid teak desk with dovetail joinery, 2 soft-close drawers, cable pass-through, and natural matte beeswax finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    tags: ["Woodwork", "Solid Teak", "Heirloom"],
  },
  {
    id: "idea-4",
    title: "Artisanal Speckled Ceramic Dinner Set",
    category: "Pottery & Ceramics",
    suggestedBudget: "3200",
    description:
      "Wheel-thrown stoneware dining collection with food-safe satin white glaze, earthy speckled rims, and custom monogram stamped bases.",
    imageUrl:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
    tags: ["Wheel-thrown", "Ceramics", "Kitchen"],
  },
];

const STORAGE_KEY = "makermatch_requirements_store_v1";

export default function Requirements() {
  const { addNotification } = useNotifications() || {};

  // Store requirements in state with localStorage persistence
  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load requirements from localStorage:", e);
    }
    return INITIAL_REQUIREMENTS;
  });

  // Role: "customer" or "creator"
  const [role, setRole] = useState("customer");

  // Customer sub-tab: "ideas" (Step 1), "create" (Step 2), "dashboard" (My Requirements)
  const [customerTab, setCustomerTab] = useState("dashboard");

  // Creator sub-tab: "available" (Available Requests), "sent" (My Sent Quotations)
  const [creatorTab, setCreatorTab] = useState("available");

  // Pre-filled form values when turning an idea into a requirement
  const [initialFormValues, setInitialFormValues] = useState(null);

  // Active requirement for QuotationComparison (Step 4)
  const [comparingRequirement, setComparingRequirement] = useState(null);

  // Active requirement for Creator's QuotationForm modal (Step 3)
  const [quotingRequirement, setQuotingRequirement] = useState(null);

  // Active requirement for Details modal
  const [detailsModalRequirement, setDetailsModalRequirement] = useState(null);

  // Filter for status
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Save to localStorage whenever requirements change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requirements));
    } catch (e) {
      console.error("Failed to save requirements:", e);
    }
  }, [requirements]);

  // ======================================================
  // JOURNEY STEP LOGIC: Exactly ONE step active at a time
  // 1: Idea -> 2: Requirement -> 3: Creator -> 4: Quotation
  // ======================================================

  const currentStep = (() => {
    if (comparingRequirement) return 4;
    if (role === "creator") return 3;
    if (customerTab === "ideas") return 1;
    // customerTab is "create" or "dashboard"
    return 2;
  })();

  const goToStep = (stepNumber) => {
    if (stepNumber === 1) {
      setRole("customer");
      setCustomerTab("ideas");
      setComparingRequirement(null);
    } else if (stepNumber === 2) {
      setRole("customer");
      setCustomerTab("create");
      setComparingRequirement(null);
    } else if (stepNumber === 3) {
      setRole("creator");
      setCreatorTab("available");
      setComparingRequirement(null);
    } else if (stepNumber === 4) {
      setRole("customer");
      const reqWithQuotes =
        requirements.find((r) => r.quotations?.length > 0) || requirements[0];
      setComparingRequirement(reqWithQuotes);
    }
  };

  // Convert an idea card into a requirement form prefill
  const handleUseIdea = (idea) => {
    setInitialFormValues({
      title: idea.title,
      category: idea.category,
      description: idea.description,
      budget: idea.suggestedBudget,
      requiredDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      deliveryLocation: "Ongole, Andhra Pradesh",
      images: [
        {
          id: `idea-img-${Date.now()}`,
          name: idea.title,
          url: idea.imageUrl,
          isPreset: true,
        },
      ],
    });
    setCustomerTab("create");
    setRole("customer");
    setComparingRequirement(null);
  };

  // ======================================================
  // ACTION HANDLERS
  // ======================================================

  // Submit new customer requirement
  const handleCreateRequirement = (newRequirementData) => {
    const nextIndex = requirements.length + 1;
    const paddedId = `REQ${String(nextIndex).padStart(3, "0")}`;

    const newReq = {
      ...newRequirementData,
      id: paddedId,
      customerName: "You",
    };

    setRequirements((prev) => [newReq, ...prev]);
    setInitialFormValues(null);
    setCustomerTab("dashboard");

    if (addNotification) {
      addNotification({
        type: "custom",
        title: `Requirement #${paddedId} Created`,
        message: `Your request "${newReq.title}" has been published to local creators.`,
      });
    }
  };

  // Creator submits quotation
  const handleSendQuotation = (quotationData) => {
    if (!quotingRequirement) return;

    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id === quotingRequirement.id) {
          const updatedQuotations = [...(req.quotations || []), quotationData];
          return {
            ...req,
            status: "Quotations Received",
            quotations: updatedQuotations,
          };
        }
        return req;
      })
    );

    const reqTitle = quotingRequirement.title;
    setQuotingRequirement(null);

    if (addNotification) {
      addNotification({
        type: "custom",
        title: "Quotation Sent Successfully",
        message: `Quotation of ₹${quotationData.totalPrice} sent for "${reqTitle}".`,
      });
    }
  };

  // Customer selects/accepts a quotation
  const handleSelectQuotation = (selectedQuote, targetRequirement) => {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id === targetRequirement.id) {
          return {
            ...req,
            status: "In Production",
            selectedQuotationId: selectedQuote.id,
            selectedQuotation: selectedQuote,
          };
        }
        return req;
      })
    );

    setComparingRequirement((prev) =>
      prev
        ? {
            ...prev,
            status: "In Production",
            selectedQuotationId: selectedQuote.id,
            selectedQuotation: selectedQuote,
          }
        : null
    );

    if (addNotification) {
      addNotification({
        type: "order",
        title: "Quotation Accepted!",
        message: `You accepted ${selectedQuote.creatorName}'s quote of ₹${selectedQuote.totalPrice} for "${targetRequirement.title}".`,
      });
    }
  };

  // Reset to initial demo data
  const handleResetDemoData = () => {
    if (window.confirm("Reset all requirements and quotations to demo seed data?")) {
      setRequirements(INITIAL_REQUIREMENTS);
      localStorage.removeItem(STORAGE_KEY);
      setCustomerTab("dashboard");
      setInitialFormValues(null);
      setComparingRequirement(null);
      setQuotingRequirement(null);
      setRole("customer");
    }
  };

  // Filtered requirements
  const filteredRequirements = requirements.filter((req) => {
    if (statusFilter !== "ALL") {
      if (statusFilter === "WAITING" && req.status !== "Waiting for Quotations") {
        return false;
      }
      if (statusFilter === "RECEIVED" && req.status !== "Quotations Received") {
        return false;
      }
      if (statusFilter === "PRODUCTION" && req.status !== "In Production") {
        return false;
      }
    }
    if (categoryFilter !== "ALL" && req.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  // Creator's submitted quotations list
  const creatorSubmittedQuotes = requirements.flatMap((req) =>
    (req.quotations || []).map((q) => ({
      ...q,
      requirementTitle: req.title,
      requirementLocation: req.deliveryLocation || req.location,
    }))
  );

  const STEPS_DATA = [
    {
      num: 1,
      title: "Idea",
      desc: "Envision craft",
      hint: "Explore concepts",
    },
    {
      num: 2,
      title: "Requirement",
      desc: "Specs & budget",
      hint: "Create requirement",
    },
    {
      num: 3,
      title: "Creator",
      desc: "Reviews requests",
      hint: "Creator View bids",
    },
    {
      num: 4,
      title: "Quotation",
      desc: "Compare & select",
      hint: "Side-by-side compare",
    },
  ];

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main>
        {/* ==================================================
            HERO & DYNAMIC JOURNEY TRACKER
        ================================================== */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-white to-cream/60">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-forest/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft hover:text-amber-dark transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Home</span>
              </Link>

              <button
                type="button"
                onClick={handleResetDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-white text-ink-soft text-xs font-medium hover:border-amber hover:text-amber-dark transition-all"
                title="Reset to clean demonstration state"
              >
                <RefreshCw size={12} />
                <span>Reset Demo State</span>
              </button>
            </div>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber/15 border border-amber/30 shadow-xs mb-4">
                <Sparkles size={14} className="text-amber-dark" />
                <span className="text-xs font-semibold tracking-wider uppercase text-amber-dark">
                  MakerMatch Custom Order Engine
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ink font-bold tracking-tight">
                Requirement &{" "}
                <span className="italic text-amber-dark font-normal">
                  Quotation Hub
                </span>
              </h1>

              <p className="text-sm sm:text-base text-ink-soft mt-3 max-w-2xl leading-relaxed">
                Connect directly with master artisans. Submit your custom requirement, receive
                detailed transparent quotations, compare maker ratings, and commission bespoke crafts.
              </p>
            </div>

            {/* ==================================================
                DYNAMIC SEQUENTIAL 4-STEP RIBBON:
                Idea (1) -> Requirement (2) -> Creator (3) -> Quotation (4)
                Only ONE step highlights at a time!
            ================================================== */}
            <div className="mt-8 pt-6 border-t border-border/80">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">
                  Customer's Journey from Concept to Commission:
                </p>
                <span className="text-xs font-medium text-amber-dark">
                  Step {currentStep} of 4: {STEPS_DATA[currentStep - 1]?.title}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STEPS_DATA.map((stepItem, idx) => {
                  const isActive = currentStep === stepItem.num;
                  const isDone = currentStep > stepItem.num;

                  return (
                    <button
                      key={stepItem.num}
                      type="button"
                      onClick={() => goToStep(stepItem.num)}
                      className={`
                        relative text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 group cursor-pointer
                        ${
                          isActive
                            ? stepItem.num === 3
                              ? "bg-forest/15 border-forest ring-2 ring-forest/30 shadow-md scale-[1.02]"
                              : stepItem.num === 4
                              ? "bg-forest/15 border-forest-dark ring-2 ring-forest-dark/30 shadow-md scale-[1.02]"
                              : "bg-amber/15 border-amber ring-2 ring-amber/30 shadow-md scale-[1.02]"
                            : isDone
                            ? "bg-white border-forest/40 hover:border-forest shadow-xs"
                            : "bg-white border-border hover:border-amber/50 hover:bg-cream/40 shadow-xs"
                        }
                      `}
                    >
                      {/* Step Number or Check */}
                      <div
                        className={`
                          w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                          ${
                            isActive
                              ? stepItem.num >= 3
                                ? "bg-forest text-white shadow-xs"
                                : "bg-amber text-white shadow-xs"
                              : isDone
                              ? "bg-forest/15 text-forest"
                              : "bg-cream text-ink-muted border border-border"
                          }
                        `}
                      >
                        {isDone ? (
                          <Check size={16} className="stroke-[2.5]" />
                        ) : (
                          stepItem.num
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-xs font-bold transition-colors ${
                              isActive
                                ? "text-ink"
                                : isDone
                                ? "text-ink"
                                : "text-ink-soft"
                            }`}
                          >
                            {stepItem.title}
                          </p>
                          {isActive && (
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                stepItem.num >= 3
                                  ? "bg-forest text-white"
                                  : "bg-amber text-white"
                              }`}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted truncate mt-0.5">
                          {stepItem.desc}
                        </p>
                      </div>

                      {idx < STEPS_DATA.length - 1 && (
                        <ChevronRight
                          size={14}
                          className={`hidden md:block transition-colors ml-auto ${
                            isActive ? "text-amber-dark" : "text-border"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ROLE & VIEW CONTROLS
        ================================================== */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Role Switcher: Customer View vs Creator View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-border shadow-xs self-start">
                <button
                  type="button"
                  onClick={() => {
                    setRole("customer");
                    setComparingRequirement(null);
                    if (customerTab === "ideas") setCustomerTab("dashboard");
                  }}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${
                      role === "customer"
                        ? "bg-ink text-cream shadow-xs"
                        : "text-ink-soft hover:text-ink hover:bg-cream/60"
                    }
                  `}
                >
                  <User size={15} />
                  <span>Customer View</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("creator");
                    setComparingRequirement(null);
                  }}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${
                      role === "creator"
                        ? "bg-amber-dark text-white shadow-xs"
                        : "text-ink-soft hover:text-ink hover:bg-cream/60"
                    }
                  `}
                >
                  <Hammer size={15} />
                  <span>Creator View</span>
                </button>
              </div>

              {/* Sub Navigation depending on Role */}
              {role === "customer" ? (
                <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab("ideas");
                      setComparingRequirement(null);
                    }}
                    className={`
                      inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${
                        customerTab === "ideas" && !comparingRequirement
                          ? "bg-amber text-white border-amber shadow-xs"
                          : "border-border bg-cream text-ink-soft hover:border-amber/50"
                      }
                    `}
                  >
                    <Lightbulb size={13} />
                    <span>Ideas (Step 1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab("create");
                      setComparingRequirement(null);
                    }}
                    className={`
                      inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${
                        customerTab === "create" && !comparingRequirement
                          ? "bg-ink text-cream border-ink shadow-xs"
                          : "border-border bg-cream text-ink-soft hover:border-amber/50"
                      }
                    `}
                  >
                    <Plus size={13} />
                    <span>Create Requirement (Step 2)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab("dashboard");
                      setComparingRequirement(null);
                    }}
                    className={`
                      px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${
                        customerTab === "dashboard" && !comparingRequirement
                          ? "bg-white border-amber text-amber-dark shadow-xs"
                          : "border-border bg-cream text-ink-soft hover:border-amber/50"
                      }
                    `}
                  >
                    My Requirements ({requirements.length})
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setCreatorTab("available")}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${
                        creatorTab === "available"
                          ? "bg-amber-dark text-white border-amber-dark shadow-xs"
                          : "border-border bg-cream text-ink-soft hover:border-amber/50"
                      }
                    `}
                  >
                    Available Requests ({requirements.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatorTab("sent")}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${
                        creatorTab === "sent"
                          ? "bg-amber-dark text-white border-amber-dark shadow-xs"
                          : "border-border bg-cream text-ink-soft hover:border-amber/50"
                      }
                    `}
                  >
                    My Sent Quotes ({creatorSubmittedQuotes.length})
                  </button>
                </div>
              )}
            </div>

            {/* ==================================================
                DYNAMIC CONTENT DISPLAY (Step-by-Step)
            ================================================== */}

            {/* STEP 1: CUSTOMER VIEW - EXPLORE IDEAS */}
            {role === "customer" && !comparingRequirement && customerTab === "ideas" && (
              <div className="pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-dark mb-1">
                      <Lightbulb size={13} />
                      <span>Step 1: Idea Exploration</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      Handcrafted Inspiration Gallery
                    </h2>
                    <p className="text-xs text-ink-soft mt-1">
                      Envision your custom craft. Select any concept below to prefill your requirement form or start fresh.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInitialFormValues(null);
                      setCustomerTab("create");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-bold hover:bg-amber-dark transition-all shadow-xs self-start"
                  >
                    <span>Create Custom from Scratch</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SAMPLE_IDEAS.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-amber/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="aspect-[4/3] w-full overflow-hidden bg-cream relative">
                          <img
                            src={idea.imageUrl}
                            alt={idea.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                            {idea.category}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-display font-semibold text-sm text-ink group-hover:text-amber-dark transition-colors">
                            {idea.title}
                          </h4>
                          <p className="text-xs text-ink-soft line-clamp-3 leading-relaxed">
                            {idea.description}
                          </p>
                          <div className="pt-1 flex items-center justify-between text-xs">
                            <span className="text-ink-muted">Suggested Budget:</span>
                            <span className="font-bold text-amber-dark">
                              ₹{parseInt(idea.suggestedBudget, 10).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          onClick={() => handleUseIdea(idea)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cream border border-border text-ink text-xs font-semibold hover:bg-amber hover:text-white hover:border-amber transition-all"
                        >
                          <span>Turn into Requirement</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: CUSTOMER VIEW - CREATE REQUIREMENT FORM */}
            {role === "customer" && !comparingRequirement && customerTab === "create" && (
              <div className="pt-8 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-ink-muted font-medium">
                    Step 2: Define your custom requirement details
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomerTab("dashboard")}
                    className="text-xs text-amber-dark hover:underline font-medium"
                  >
                    View existing requirements →
                  </button>
                </div>
                <RequirementForm
                  initialValues={initialFormValues}
                  onSubmit={handleCreateRequirement}
                  onCancel={() => setCustomerTab("dashboard")}
                />
              </div>
            )}

            {/* STEP 2 (ALTERNATE): CUSTOMER VIEW - MY REQUIREMENTS DASHBOARD */}
            {role === "customer" && !comparingRequirement && customerTab === "dashboard" && (
              <div className="pt-8 space-y-6">
                {/* Header & Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      My Requirements
                    </h2>
                    <p className="text-xs text-ink-soft mt-1">
                      Track your custom requests, see incoming maker quotations, and compare bids.
                    </p>
                  </div>

                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-ink-muted mr-1">Status:</span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("ALL")}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        statusFilter === "ALL"
                          ? "bg-ink text-cream border-ink"
                          : "bg-white border-border text-ink-soft hover:border-amber"
                      }`}
                    >
                      All ({requirements.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("WAITING")}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        statusFilter === "WAITING"
                          ? "bg-amber/15 text-amber-dark border-amber"
                          : "bg-white border-border text-ink-soft hover:border-amber"
                      }`}
                    >
                      Waiting for Quotations
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("RECEIVED")}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        statusFilter === "RECEIVED"
                          ? "bg-forest/15 text-forest border-forest"
                          : "bg-white border-border text-ink-soft hover:border-amber"
                      }`}
                    >
                      Quotations Received
                    </button>
                  </div>
                </div>

                {/* Requirements Cards Grid */}
                {filteredRequirements.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white border border-border rounded-[2rem] shadow-xs">
                    <div className="w-14 h-14 mx-auto rounded-full bg-cream border border-border flex items-center justify-center text-ink-muted mb-3">
                      <Layers size={24} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      No requirements match this filter
                    </h3>
                    <p className="text-xs text-ink-soft mt-1">
                      Try selecting "All" or create a new custom requirement.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequirements.map((req) => (
                      <RequirementCard
                        key={req.id}
                        requirement={req}
                        role="customer"
                        onView={(r) => setDetailsModalRequirement(r)}
                        onCompare={(r) => {
                          setComparingRequirement(r);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: CREATOR VIEW - AVAILABLE REQUESTS & SENT QUOTES */}
            {role === "creator" && creatorTab === "available" && (
              <div className="pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-forest mb-1">
                      <Hammer size={13} />
                      <span>Step 3: Creator View (Reviews Requests)</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      Available Requests
                    </h2>
                    <p className="text-xs text-ink-soft mt-1">
                      Browse custom requirements posted by customers ready for quotation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted">Filter Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-border bg-white text-xs text-ink outline-none focus:border-amber"
                    >
                      <option value="ALL">All Crafts</option>
                      <option value="Resin Art">Resin Art</option>
                      <option value="Wedding & Event Decor">Wedding & Event Decor</option>
                      <option value="Woodwork">Woodwork</option>
                      <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                    </select>
                  </div>
                </div>

                {filteredRequirements.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white border border-border rounded-[2rem] shadow-xs">
                    <div className="w-14 h-14 mx-auto rounded-full bg-cream border border-border flex items-center justify-center text-ink-muted mb-3">
                      <Hammer size={24} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      No custom requests available in this category
                    </h3>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequirements.map((req) => (
                      <RequirementCard
                        key={req.id}
                        requirement={req}
                        role="creator"
                        onView={(r) => setDetailsModalRequirement(r)}
                        onSendQuotation={(r) => setQuotingRequirement(r)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 (SUB-TAB): CREATOR VIEW - SENT QUOTATIONS */}
            {role === "creator" && creatorTab === "sent" && (
              <div className="pt-8 space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    My Sent Quotations
                  </h2>
                  <p className="text-xs text-ink-soft mt-1">
                    Proposals and bids you have submitted to custom buyers.
                  </p>
                </div>

                {creatorSubmittedQuotes.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white border border-border rounded-[2rem] shadow-xs">
                    <div className="w-14 h-14 mx-auto rounded-full bg-cream border border-border flex items-center justify-center text-ink-muted mb-3">
                      <Send size={24} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      You haven't sent any quotations yet
                    </h3>
                    <p className="text-xs text-ink-soft mt-1">
                      Check the "Available Requests" tab and send your first quotation proposal!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creatorSubmittedQuotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cream border border-border">
                            {quote.id}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber/15 text-amber-dark">
                            Quoted
                          </span>
                        </div>

                        <div>
                          <p className="text-[11px] text-ink-muted uppercase tracking-wider">
                            For Requirement
                          </p>
                          <h4 className="font-semibold text-sm text-ink truncate mt-0.5">
                            {quote.requirementTitle}
                          </h4>
                          <p className="text-xs text-ink-soft mt-0.5 flex items-center gap-1">
                            <MapPin size={11} /> {quote.requirementLocation}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-cream/40 border border-border/60 text-xs">
                          <div>
                            <span className="text-ink-muted block text-[10px]">Price</span>
                            <span className="font-bold text-ink">
                              ₹{quote.totalPrice?.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-ink-muted block text-[10px]">Turnaround</span>
                            <span className="font-bold text-amber-dark">
                              {quote.productionDays} Days
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-ink-soft italic line-clamp-2">
                          "{quote.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: CUSTOMER VIEW - QUOTATION COMPARISON */}
            {role === "customer" && comparingRequirement && (
              <div className="pt-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-forest">
                  <Sparkles size={13} />
                  <span>Step 4: Quotation Comparison & Selection</span>
                </div>
                <QuotationComparison
                  requirement={comparingRequirement}
                  quotations={comparingRequirement.quotations}
                  onSelectQuotation={(quote) =>
                    handleSelectQuotation(quote, comparingRequirement)
                  }
                  onBack={() => setComparingRequirement(null)}
                />
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            MODAL 1: SEND QUOTATION FORM (CREATOR)
        ================================================== */}
        {quotingRequirement && (
          <div
            onClick={() => setQuotingRequirement(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto rounded-3xl"
            >
              <QuotationForm
                requirement={quotingRequirement}
                onSubmit={handleSendQuotation}
                onCancel={() => setQuotingRequirement(null)}
              />
            </div>
          </div>
        )}

        {/* ==================================================
            MODAL 2: REQUIREMENT DETAILS MODAL
        ================================================== */}
        {detailsModalRequirement && (
          <div
            onClick={() => setDetailsModalRequirement(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border my-8"
            >
              <button
                type="button"
                onClick={() => setDetailsModalRequirement(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-cream transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cream border border-border">
                  {detailsModalRequirement.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cream-dark text-ink-soft font-medium">
                  {detailsModalRequirement.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest/15 text-forest font-semibold ml-auto">
                  {detailsModalRequirement.status}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-ink mb-3">
                {detailsModalRequirement.title}
              </h3>

              <p className="text-xs text-ink-muted mb-4">
                Posted by {detailsModalRequirement.customerName || "Customer"}
              </p>

              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-cream/40 border border-border mb-5 text-xs text-ink-soft">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Budget</span>
                  <span className="font-bold text-ink">
                    {detailsModalRequirement.budget}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Delivery By</span>
                  <span className="font-bold text-ink">
                    {detailsModalRequirement.requiredDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Location</span>
                  <span className="font-bold text-ink">
                    {detailsModalRequirement.deliveryLocation || detailsModalRequirement.location}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-xs sm:text-sm">
                <div>
                  <h4 className="font-semibold text-ink mb-1">Requirement Description:</h4>
                  <p className="text-ink-soft leading-relaxed bg-cream/20 p-3.5 rounded-xl border border-border/60">
                    {detailsModalRequirement.description}
                  </p>
                </div>

                {detailsModalRequirement.images?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Reference Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {detailsModalRequirement.images.map((img, i) => (
                        <img
                          key={i}
                          src={typeof img === "string" ? img : img.url}
                          alt="Reference"
                          className="w-full h-32 object-cover rounded-xl border border-border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDetailsModalRequirement(null)}
                  className="px-5 py-2.5 rounded-full border border-border bg-white text-ink text-xs font-semibold hover:bg-cream"
                >
                  Close
                </button>
                {role === "creator" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = detailsModalRequirement;
                      setDetailsModalRequirement(null);
                      setQuotingRequirement(target);
                    }}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-ink text-cream text-xs font-bold hover:bg-amber-dark shadow-xs"
                  >
                    <Send size={13} />
                    <span>Send Quotation</span>
                  </button>
                ) : (
                  detailsModalRequirement.quotations?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = detailsModalRequirement;
                        setDetailsModalRequirement(null);
                        setComparingRequirement(target);
                      }}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark shadow-xs"
                    >
                      <Sparkles size={13} />
                      <span>Compare Quotations ({detailsModalRequirement.quotations.length})</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
