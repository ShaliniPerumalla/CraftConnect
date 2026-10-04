// src/context/RequirementQuotationContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useOrders } from "./OrdersContext";
import { useNotifications } from "./NotificationContext";

const RequirementQuotationContext = createContext(null);

const REQUIREMENTS_STORAGE_KEY = "craftconnect_requirements_v1";
const QUOTATIONS_STORAGE_KEY = "craftconnect_quotations_v1";

// ======================================================
// SAMPLE INITIAL REQUIREMENTS
// ======================================================

const initialRequirements = [
  {
    id: "REQ001",
    title: "Custom Resin Name Plate",
    category: "Resin Art",
    whatDoYouWant: "Custom birthday gift for parents' 25th anniversary",
    description:
      "I want a customized resin name plate with gold flakes, preserved dried white baby's breath flowers, and high-gloss teak wooden border. Text should read 'The Sharmas - Est. 2001'. Need warm LED backlighting if possible.",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    ],
    budget: 1500,
    budgetMin: 1000,
    budgetMax: 1500,
    requiredDate: "2026-09-25",
    deliveryLocation: "Ongole, Andhra Pradesh",
    customer: {
      name: "Rohan Sharma",
      email: "rohan.sharma@example.com",
      phone: "+91 98451 22334",
    },
    status: "Quotations Received", // "Waiting for Quotations" | "Quotations Received" | "Quotation Accepted" | "In Production" | "Completed"
    createdAt: "2026-09-20T10:30:00Z",
  },
  {
    id: "REQ002",
    title: "Wedding Decoration Welcome Board",
    category: "Woodwork",
    whatDoYouWant: "Bespoke wooden calligraphy welcome easel for reception",
    description:
      "Hand-carved and hand-lettered rustic pine welcome board with laser engraved floral vines and names 'Ananya & Kabir'. Needs to be weatherproof and stand 3.5 ft tall.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    budget: 3500,
    budgetMin: 3000,
    budgetMax: 4200,
    requiredDate: "2026-10-15",
    deliveryLocation: "Hyderabad, Telangana",
    customer: {
      name: "Ananya Reddy",
      email: "ananya@example.com",
      phone: "+91 91234 56789",
    },
    status: "Quotations Received",
    createdAt: "2026-09-22T14:15:00Z",
  },
  {
    id: "REQ003",
    title: "Hand-thrown Ceramic Dinnerware Set",
    category: "Pottery & Ceramics",
    whatDoYouWant: "Set of 6 rustic ceramic ramen bowls and serving platter",
    description:
      "Matte speckled glaze in oatmeal and forest green tones. Microwave and dishwasher safe with handcrafted unglazed textured bases.",
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    ],
    budget: 2800,
    budgetMin: 2500,
    budgetMax: 3200,
    requiredDate: "2026-10-02",
    deliveryLocation: "Bengaluru, Karnataka",
    customer: {
      name: "Meera Krishnan",
      email: "meera.k@example.com",
      phone: "+91 97400 88219",
    },
    status: "Waiting for Quotations",
    createdAt: "2026-09-24T09:00:00Z",
  },
];

// ======================================================
// SAMPLE INITIAL QUOTATIONS (Specifically matching user example!)
// Quotation 1: ₹1200, 5 Days, ⭐4.7
// Quotation 2: ₹1350, 4 Days, ⭐4.9
// Quotation 3: ₹1100, 7 Days, ⭐4.4
// ======================================================

const initialQuotations = [
  {
    id: "QT001",
    requirementId: "REQ001",
    quoteNumber: "QT-REQ001-A",
    creator: {
      id: "c2",
      name: "Priya Nair",
      studioName: "Nair Ceramic & Resin Studio",
      avatar: "https://i.pravatar.cc/150?img=47",
      rating: 4.7,
      reviewsCount: 38,
      location: "Bengaluru, Karnataka",
      specialty: "High-clarity epoxy resin & botanical preservation",
    },
    price: 1200,
    deliveryCharge: 100,
    totalPrice: 1300,
    productionTime: "5 Days",
    estimatedCompletionDate: "2026-09-25",
    materials: "Crystal Epoxy Resin + Solid Teak Wood Base + Brass Letters",
    description:
      "I can create the requested design with premium high-gloss, UV-resistant crystal epoxy resin so it won't yellow over time. Includes real hand-picked baby's breath and polished brass lettering.",
    terms:
      "50% platform escrow payment upon selection. 2 design mockups provided for approval prior to curing. Safely packed in bubble-lined wooden crate.",
    proposedDesign:
      "Hexagonal live-edge wood board with floating gold foil leaf and embedded warm micro-LED wiring.",
    status: "Pending", // "Pending" | "Accepted" | "Declined"
    createdAt: "2026-09-21T11:00:00Z",
  },
  {
    id: "QT002",
    requirementId: "REQ001",
    quoteNumber: "QT-REQ001-B",
    creator: {
      id: "c1",
      name: "Maren Holt",
      studioName: "Holt Artisan Woodcraft",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.9,
      reviewsCount: 52,
      location: "Hyderabad, Telangana",
      specialty: "Fine hardwood carving & resin inlays",
    },
    price: 1350,
    deliveryCharge: 120,
    totalPrice: 1470,
    productionTime: "4 Days",
    estimatedCompletionDate: "2026-09-24",
    materials: "Premium Walnut Wood + Clear Resin & Pure Gold Leaf",
    description:
      "I specialize in precision-beveled hardwood nameplates. I will use hand-selected aged American walnut, diamond polish the resin surface to mirror finish, and seal with organic beeswax.",
    terms:
      "Full satisfaction guarantee. Express priority production in 4 days. Includes brass wall hanging brackets and screw anchors.",
    proposedDesign:
      "Chamfered dark walnut backing plate with recessed resin pour, embedded brass typography, and satin coat.",
    status: "Pending",
    createdAt: "2026-09-21T14:30:00Z",
  },
  {
    id: "QT003",
    requirementId: "REQ001",
    quoteNumber: "QT-REQ001-C",
    creator: {
      id: "c3",
      name: "Diego Fuentes",
      studioName: "Fuentes Bespoke Goods",
      avatar: "https://i.pravatar.cc/150?img=15",
      rating: 4.4,
      reviewsCount: 29,
      location: "Chennai, Tamil Nadu",
      specialty: "Custom handcrafted gifts & home accents",
    },
    price: 1100,
    deliveryCharge: 80,
    totalPrice: 1180,
    productionTime: "7 Days",
    estimatedCompletionDate: "2026-09-27",
    materials: "Standard Epoxy Resin + Pine Wood Frame + Acrylic Cutouts",
    description:
      "Budget-friendly yet durable design! I can deliver high-clarity resin casting with dried floral accents, gold glitter highlights, and laser-cut acrylic 3D lettering.",
    terms:
      "Standard shipping with tracking. 1 round of text proofing before casting.",
    proposedDesign:
      "Rectangular pine base with double-pour clear resin and metallic gold vinyl backing.",
    status: "Pending",
    createdAt: "2026-09-22T09:15:00Z",
  },
  {
    id: "QT004",
    requirementId: "REQ002",
    quoteNumber: "QT-REQ002-A",
    creator: {
      id: "c1",
      name: "Maren Holt",
      studioName: "Holt Artisan Woodcraft",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.9,
      reviewsCount: 52,
      location: "Hyderabad, Telangana",
      specialty: "Fine hardwood carving & resin inlays",
    },
    price: 3400,
    deliveryCharge: 200,
    totalPrice: 3600,
    productionTime: "6 Days",
    estimatedCompletionDate: "2026-10-05",
    materials: "Reclaimed Seasoned Pine + Outdoor Matte Polyurethane Sealant",
    description:
      "Hand-routed floral filigree with elegant gold leaf calligraphy lettering. Includes matching foldable wooden easel stand.",
    terms:
      "Digital calligraphy preview sent within 24 hours of commission. Weatherproof packaging.",
    proposedDesign:
      "Arched top rustic easel board with 3D carved names and laurel wreath border.",
    status: "Pending",
    createdAt: "2026-09-23T16:00:00Z",
  },
];

// ======================================================
// CONTEXT PROVIDER
// ======================================================

export function RequirementQuotationProvider({ children }) {
  const { addOrder } = useOrders() || {};
  const { addNotification } = useNotifications() || {};

  // Current view role: "customer" or "creator"
  const [activeRole, setActiveRole] = useState("customer");

  // Current logged in creator (for creator simulation)
  const [activeCreatorId, setActiveCreatorId] = useState("c1");

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ======================================================
  // LOAD & SAVE REQUIREMENTS
  // ======================================================

  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem(REQUIREMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Could not load requirements:", e);
    }
    return initialRequirements;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        REQUIREMENTS_STORAGE_KEY,
        JSON.stringify(requirements)
      );
    } catch (e) {
      console.error("Could not save requirements:", e);
    }
  }, [requirements]);

  // ======================================================
  // LOAD & SAVE QUOTATIONS
  // ======================================================

  const [quotations, setQuotations] = useState(() => {
    try {
      const saved = localStorage.getItem(QUOTATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Could not load quotations:", e);
    }
    return initialQuotations;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        QUOTATIONS_STORAGE_KEY,
        JSON.stringify(quotations)
      );
    } catch (e) {
      console.error("Could not save quotations:", e);
    }
  }, [quotations]);

  // ======================================================
  // ADD REQUIREMENT (Customer side)
  // ======================================================

  const addRequirement = (newReqData) => {
    const nextSeq = requirements.length + 1;
    const formattedId = `REQ${String(nextSeq).padStart(3, "0")}`;

    const newRequirement = {
      id: formattedId,
      title: newReqData.title || "Custom Requirement",
      category: newReqData.category || "Resin Art",
      whatDoYouWant: newReqData.whatDoYouWant || newReqData.title || "",
      description: newReqData.description || "",
      images:
        newReqData.images && newReqData.images.length > 0
          ? newReqData.images
          : [
              "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
            ],
      budget: Number(newReqData.budget) || 1500,
      budgetMin: Number(newReqData.budgetMin) || Number(newReqData.budget) * 0.8 || 1000,
      budgetMax: Number(newReqData.budgetMax) || Number(newReqData.budget) * 1.2 || 1500,
      requiredDate: newReqData.requiredDate || "2026-10-15",
      deliveryLocation: newReqData.deliveryLocation || "Ongole, Andhra Pradesh",
      customer: newReqData.customer || {
        name: "You (Customer)",
        email: "customer@example.com",
        phone: "+91 98765 43210",
      },
      status: "Waiting for Quotations",
      createdAt: new Date().toISOString(),
    };

    setRequirements((prev) => [newRequirement, ...prev]);

    if (addNotification) {
      addNotification({
        type: "custom",
        title: `Requirement #${formattedId} Published`,
        message: `Your request for '${newRequirement.title}' has been submitted. Creators can now send you quotations!`,
      });
    }

    return newRequirement;
  };

  // ======================================================
  // UPDATE REQUIREMENT STATUS
  // ======================================================

  const updateRequirementStatus = (reqId, status) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, status } : req))
    );
  };

  // ======================================================
  // SUBMIT QUOTATION (Creator side)
  // ======================================================

  const submitQuotation = (quoteData) => {
    const nextSeq = quotations.length + 1;
    const quoteId = `QT${String(nextSeq).padStart(3, "0")}`;

    const newQuotation = {
      id: quoteId,
      requirementId: quoteData.requirementId,
      quoteNumber: `QT-${quoteData.requirementId}-${String.fromCharCode(
        65 + (getQuotationsByRequirementId(quoteData.requirementId).length % 26)
      )}`,
      creator: quoteData.creator || {
        id: activeCreatorId,
        name: "Maren Holt",
        studioName: "Holt Artisan Woodcraft",
        avatar: "https://i.pravatar.cc/150?img=32",
        rating: 4.9,
        reviewsCount: 52,
        location: "Hyderabad, Telangana",
        specialty: "Custom Wood & Resin Artisan",
      },
      price: Number(quoteData.price) || 1250,
      deliveryCharge: Number(quoteData.deliveryCharge) || 100,
      totalPrice:
        (Number(quoteData.price) || 1250) +
        (Number(quoteData.deliveryCharge) || 100),
      productionTime: quoteData.productionTime || "5 Days",
      estimatedCompletionDate:
        quoteData.estimatedCompletionDate ||
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      materials:
        quoteData.materials || "Epoxy Resin + Wood + Fine Finish",
      description:
        quoteData.description ||
        "I can create the requested design with precision craftsmanship and quality materials.",
      terms:
        quoteData.terms ||
        "Platform escrow protection. 2 review iterations included prior to final shipping.",
      proposedDesign:
        quoteData.proposedDesign || "Custom bespoke specimen crafted to client specs.",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuotation, ...prev]);

    // Update parent requirement status to "Quotations Received" if it was "Waiting"
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id === quoteData.requirementId) {
          return {
            ...req,
            status: "Quotations Received",
          };
        }
        return req;
      })
    );

    if (addNotification) {
      addNotification({
        type: "custom",
        title: "New Quotation Submitted",
        message: `A quotation of ₹${newQuotation.price} was sent for requirement #${quoteData.requirementId}.`,
      });
    }

    return newQuotation;
  };

  // ======================================================
  // ACCEPT / SELECT QUOTATION (Customer side)
  // ======================================================

  const acceptQuotation = (quotationId) => {
    const targetQuote = quotations.find((q) => q.id === quotationId);
    if (!targetQuote) return false;

    const targetReq = requirements.find(
      (r) => r.id === targetQuote.requirementId
    );

    // 1. Update quotation status
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quotationId) {
          return { ...q, status: "Accepted" };
        }
        if (q.requirementId === targetQuote.requirementId) {
          return { ...q, status: "Declined" };
        }
        return q;
      })
    );

    // 2. Update requirement status
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === targetQuote.requirementId
          ? {
              ...r,
              status: "Quotation Accepted",
              acceptedQuotationId: quotationId,
              acceptedCreator: targetQuote.creator,
            }
          : r
      )
    );

    // 3. Sync into real OrdersContext as an active custom order!
    if (addOrder) {
      addOrder({
        id: `ORD-CUST-${Date.now().toString().slice(-4)}`,
        customer: targetReq?.customer || {
          name: "Customer",
          email: "customer@example.com",
          phone: "+91 98765 43210",
        },
        items: [
          {
            craftId: `custom-${targetQuote.requirementId}`,
            name: `${targetReq?.title || "Custom Craft"} (Custom Order)`,
            quantity: 1,
            price: targetQuote.price,
            creatorId: targetQuote.creator.id,
            creatorName: targetQuote.creator.name,
            productionTime: targetQuote.productionTime,
          },
        ],
        total: targetQuote.totalPrice,
        deliveryFee: targetQuote.deliveryCharge,
        status: "Processing",
        paymentStatus: "Paid (Escrow Secured)",
        date: new Date().toISOString().split("T")[0],
        address: {
          line1: targetReq?.deliveryLocation || "Customer Address",
          city: targetReq?.deliveryLocation?.split(",")?.[0] || "City",
          state: targetReq?.deliveryLocation?.split(",")?.[1] || "State",
          pincode: "523001",
        },
        isCustomOrder: true,
        requirementId: targetQuote.requirementId,
        quotationId: targetQuote.id,
      });
    }

    // 4. Send notification
    if (addNotification) {
      addNotification({
        type: "order",
        title: "Quotation Accepted!",
        message: `You accepted ${targetQuote.creator.name}'s quotation of ₹${targetQuote.price} for '${targetReq?.title}'. The maker has been commissioned!`,
      });
    }

    return true;
  };

  // ======================================================
  // DECLINE QUOTATION
  // ======================================================

  const declineQuotation = (quotationId) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotationId ? { ...q, status: "Declined" } : q
      )
    );
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const getQuotationsByRequirementId = (reqId) => {
    return quotations.filter((q) => q.requirementId === reqId);
  };

  const getRequirementById = (reqId) => {
    return requirements.find((r) => r.id === reqId);
  };

  const getQuotationById = (quoteId) => {
    return quotations.find((q) => q.id === quoteId);
  };

  const deleteRequirement = (reqId) => {
    setRequirements((prev) => prev.filter((r) => r.id !== reqId));
    setQuotations((prev) => prev.filter((q) => q.requirementId !== reqId));
  };

  const resetAllData = () => {
    setRequirements(initialRequirements);
    setQuotations(initialQuotations);
    localStorage.removeItem(REQUIREMENTS_STORAGE_KEY);
    localStorage.removeItem(QUOTATIONS_STORAGE_KEY);
  };

  // ======================================================
  // MEMOIZED CONTEXT VALUE
  // ======================================================

  const value = useMemo(
    () => ({
      requirements,
      quotations,
      activeRole,
      setActiveRole,
      activeCreatorId,
      setActiveCreatorId,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      addRequirement,
      updateRequirementStatus,
      submitQuotation,
      acceptQuotation,
      declineQuotation,
      getQuotationsByRequirementId,
      getRequirementById,
      getQuotationById,
      deleteRequirement,
      resetAllData,
    }),
    [requirements, quotations, activeRole, activeCreatorId, selectedCategory, searchQuery]
  );

  return (
    <RequirementQuotationContext.Provider value={value}>
      {children}
    </RequirementQuotationContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useRequirementQuotation() {
  const context = useContext(RequirementQuotationContext);
  if (!context) {
    throw new Error(
      "useRequirementQuotation must be used within a RequirementQuotationProvider"
    );
  }
  return context;
}
