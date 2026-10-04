// src/context/RequirementsContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const RequirementsContext = createContext(null);

const STORAGE_KEY = "makermatch_requirements";

const initialRequirements = [
  {
    id: "REQ001",
    title: "Custom Resin Name Plate",
    category: "Resin Art",
    description:
      "I want a customized resin name plate for our new home entrance with gold foil flakes, white pearl and oceanic blue swirl texture, and raised brass lettering reading 'The Sharmas - Villa 402'.",
    budget: 1250,
    budgetMin: 1000,
    budgetMax: 1500,
    requiredDate: "2026-09-25",
    location: "Ongole",
    customerName: "Ananya Sharma",
    customerEmail: "ananya.sharma@example.com",
    referenceImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Waiting for Quotations",
    createdAt: "2026-09-17",
    quotations: [],
  },
  {
    id: "REQ002",
    title: "Wedding Decoration Table Centerpieces",
    category: "Home Decor",
    description:
      "Need handcrafted rustic floral wooden & ceramic table centerpieces for an outdoor wedding reception. Needs warm fairy light integration and minimalist elegance.",
    budget: 1300,
    budgetMin: 1000,
    budgetMax: 1500,
    requiredDate: "2026-10-15",
    location: "Hyderabad",
    customerName: "Rahul Varma",
    customerEmail: "rahul.varma@example.com",
    referenceImages: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Quotations Received",
    createdAt: "2026-09-15",
    quotations: [
      {
        id: "QUO001",
        requirementId: "REQ002",
        creatorId: "c1",
        creatorName: "Maren Holt",
        creatorAvatar: "https://i.pravatar.cc/150?img=32",
        creatorSpecialty: "Walnut & oak woodwork",
        creatorRating: 4.7,
        price: 1200,
        productionDays: 5,
        materials: "Reclaimed Teak Wood & Natural Oil Finish",
        deliveryCharge: 150,
        terms: "50% advance for raw materials; includes 2 revisions on mockup samples.",
        proposedDesign:
          "Hand-turned reclaimed teak base with recessed brass holders and soft warm fairy-light grooves.",
        message:
          "I can create the requested rustic centerpieces with hand-selected reclaimed wood.",
        submittedAt: "2026-09-16",
        status: "Pending",
      },
      {
        id: "QUO002",
        requirementId: "REQ002",
        creatorId: "c2",
        creatorName: "Priya Nair",
        creatorAvatar: "https://i.pravatar.cc/150?img=47",
        creatorSpecialty: "Hand-thrown stoneware & ceramic art",
        creatorRating: 4.9,
        price: 1350,
        productionDays: 4,
        materials: "Epoxy Resin + Glazed Stoneware & Wood",
        deliveryCharge: 100,
        terms: "Safe wooden crate packaging; dispatch via express courier.",
        proposedDesign:
          "Custom speckled ceramic cylinders with integrated resin-wood accents and engraved couple initials.",
        message:
          "I can create the requested design with durable stoneware and modern resin detailing.",
        submittedAt: "2026-09-16",
        status: "Pending",
      },
      {
        id: "QUO003",
        requirementId: "REQ002",
        creatorId: "c3",
        creatorName: "Diego Fuentes",
        creatorAvatar: "https://i.pravatar.cc/150?img=15",
        creatorSpecialty: "Leather & brass artisan",
        creatorRating: 4.4,
        price: 1100,
        productionDays: 7,
        materials: "Brushed Brass Accents & Hardwood",
        deliveryCharge: 120,
        terms: "Production starts immediately; tracking link provided.",
        proposedDesign:
          "Minimalist brass geometric frames with custom wood block mounts.",
        message:
          "Artisan finish with durable brass and solid wood styling at a very economical price.",
        submittedAt: "2026-09-17",
        status: "Pending",
      },
    ],
  },
];

export function RequirementsProvider({ children }) {
  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Could not load requirements from storage:", error);
    }
    return initialRequirements;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requirements));
    } catch (error) {
      console.error("Could not persist requirements:", error);
    }
  }, [requirements]);

  // Create new customer requirement
  const addRequirement = (data) => {
    const nextIndex = requirements.length + 1;
    const reqNumber = String(nextIndex).padStart(3, "0");
    const newRequirement = {
      id: `REQ${reqNumber}`,
      title: data.title || "Custom Craft Request",
      category: data.category || "Resin Art",
      description: data.description || "",
      budget: Number(data.budget) || 0,
      budgetMin: Number(data.budgetMin) || Number(data.budget) || 0,
      budgetMax: Number(data.budgetMax) || Number(data.budget) || 0,
      requiredDate: data.requiredDate || "",
      location: data.location || "Ongole",
      customerName: data.customerName || "Customer",
      customerEmail: data.customerEmail || "customer@example.com",
      referenceImages: data.referenceImages || [],
      status: "Waiting for Quotations",
      createdAt: new Date().toISOString().split("T")[0],
      quotations: [],
    };

    setRequirements((prev) => [newRequirement, ...prev]);
    return newRequirement;
  };

  // Creator sends a quotation
  const submitQuotation = (requirementId, quoteData) => {
    let createdQuotation = null;

    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id !== requirementId) return req;

        const nextQuoteIndex = (req.quotations?.length || 0) + 1;
        const quoNumber = String(nextQuoteIndex).padStart(3, "0");

        createdQuotation = {
          id: `QUO${quoNumber}`,
          requirementId,
          creatorId: quoteData.creatorId || "c1",
          creatorName: quoteData.creatorName || "Artisan Creator",
          creatorAvatar: quoteData.creatorAvatar || "https://i.pravatar.cc/150?img=32",
          creatorSpecialty: quoteData.creatorSpecialty || "Custom Handmade Specialist",
          creatorRating: quoteData.creatorRating || 4.8,
          price: Number(quoteData.price) || 0,
          productionDays: Number(quoteData.productionDays) || 5,
          materials: quoteData.materials || "High Quality Materials",
          deliveryCharge: Number(quoteData.deliveryCharge) || 0,
          terms: quoteData.terms || "Standard terms apply",
          proposedDesign: quoteData.proposedDesign || "",
          message: quoteData.message || "",
          submittedAt: new Date().toISOString().split("T")[0],
          status: "Pending",
        };

        const updatedQuotes = [...(req.quotations || []), createdQuotation];

        return {
          ...req,
          status: "Quotations Received",
          quotations: updatedQuotes,
        };
      })
    );

    return createdQuotation;
  };

  // Customer selects/accepts quotation
  const acceptQuotation = (requirementId, quotationId) => {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id !== requirementId) return req;

        const updatedQuotations = req.quotations.map((q) => ({
          ...q,
          status: q.id === quotationId ? "Accepted" : "Declined",
        }));

        const selected = updatedQuotations.find((q) => q.id === quotationId);

        return {
          ...req,
          status: "Accepted",
          acceptedQuotation: selected,
          quotations: updatedQuotations,
        };
      })
    );
  };

  // Delete requirement
  const deleteRequirement = (requirementId) => {
    setRequirements((prev) => prev.filter((r) => r.id !== requirementId));
  };

  // Find requirement by ID
  const getRequirementById = (requirementId) => {
    return requirements.find((r) => r.id === requirementId) || null;
  };

  return (
    <RequirementsContext.Provider
      value={{
        requirements,
        addRequirement,
        submitQuotation,
        acceptQuotation,
        deleteRequirement,
        getRequirementById,
      }}
    >
      {children}
    </RequirementsContext.Provider>
  );
}

export function useRequirements() {
  const context = useContext(RequirementsContext);
  if (!context) {
    throw new Error("useRequirements must be used within a RequirementsProvider");
  }
  return context;
}
