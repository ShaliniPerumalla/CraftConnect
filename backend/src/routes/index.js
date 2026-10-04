const express = require("express");
const router = express.Router();

// Mock store for Requirements and Quotations
let requirements = [
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
      "Need handcrafted rustic floral wooden & ceramic table centerpieces for an outdoor wedding reception.",
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
        creatorRating: 4.7,
        price: 1200,
        productionDays: 5,
        materials: "Reclaimed Teak Wood & Natural Oil Finish",
        deliveryCharge: 150,
        message: "I can create the requested rustic centerpieces with hand-selected reclaimed wood.",
        status: "Pending",
      },
      {
        id: "QUO002",
        requirementId: "REQ002",
        creatorId: "c2",
        creatorName: "Priya Nair",
        creatorRating: 4.9,
        price: 1350,
        productionDays: 4,
        materials: "Epoxy Resin + Glazed Stoneware & Wood",
        deliveryCharge: 100,
        message: "I can create the requested design with durable stoneware and modern resin detailing.",
        status: "Pending",
      },
      {
        id: "QUO003",
        requirementId: "REQ002",
        creatorId: "c3",
        creatorName: "Diego Fuentes",
        creatorRating: 4.4,
        price: 1100,
        productionDays: 7,
        materials: "Brushed Brass Accents & Hardwood",
        deliveryCharge: 120,
        message: "Artisan finish with durable brass and solid wood styling at an economical price.",
        status: "Pending",
      },
    ],
  },
];

// GET all requirements
router.get("/requirements", (req, res) => {
  res.json({
    status: "success",
    data: requirements,
  });
});

// GET single requirement
router.get("/requirements/:id", (req, res) => {
  const reqItem = requirements.find((r) => r.id === req.params.id);
  if (!reqItem) {
    return res.status(404).json({ status: "error", message: "Requirement not found" });
  }
  res.json({ status: "success", data: reqItem });
});

// POST new requirement
router.post("/requirements", (req, res) => {
  const nextNum = String(requirements.length + 1).padStart(3, "0");
  const newReq = {
    id: `REQ${nextNum}`,
    title: req.body.title || "Custom Craft Request",
    category: req.body.category || "Resin Art",
    description: req.body.description || "",
    budget: Number(req.body.budget) || 0,
    budgetMin: Number(req.body.budgetMin) || Number(req.body.budget) || 0,
    budgetMax: Number(req.body.budgetMax) || Number(req.body.budget) || 0,
    requiredDate: req.body.requiredDate || "",
    location: req.body.location || "Ongole",
    customerName: req.body.customerName || "Customer",
    customerEmail: req.body.customerEmail || "customer@makermatch.com",
    referenceImages: req.body.referenceImages || [],
    status: "Waiting for Quotations",
    createdAt: new Date().toISOString().split("T")[0],
    quotations: [],
  };
  requirements.unshift(newReq);
  res.status(201).json({ status: "success", data: newReq });
});

// POST quotation for requirement
router.post("/requirements/:id/quotations", (req, res) => {
  const reqItem = requirements.find((r) => r.id === req.params.id);
  if (!reqItem) {
    return res.status(404).json({ status: "error", message: "Requirement not found" });
  }

  const nextQuoteNum = String((reqItem.quotations?.length || 0) + 1).padStart(3, "0");
  const newQuotation = {
    id: `QUO${nextQuoteNum}`,
    requirementId: reqItem.id,
    creatorId: req.body.creatorId || "c1",
    creatorName: req.body.creatorName || "Artisan Creator",
    creatorAvatar: req.body.creatorAvatar || "https://i.pravatar.cc/150?img=32",
    creatorSpecialty: req.body.creatorSpecialty || "Craft Specialist",
    creatorRating: req.body.creatorRating || 4.8,
    price: Number(req.body.price) || 0,
    productionDays: Number(req.body.productionDays) || 5,
    materials: req.body.materials || "Epoxy Resin + Wood",
    deliveryCharge: Number(req.body.deliveryCharge) || 0,
    terms: req.body.terms || "Standard terms",
    proposedDesign: req.body.proposedDesign || "",
    message: req.body.message || "",
    submittedAt: new Date().toISOString().split("T")[0],
    status: "Pending",
  };

  reqItem.quotations.push(newQuotation);
  reqItem.status = "Quotations Received";

  res.status(201).json({ status: "success", data: newQuotation });
});

// POST accept quotation
router.post("/requirements/:id/quotations/:quoteId/accept", (req, res) => {
  const reqItem = requirements.find((r) => r.id === req.params.id);
  if (!reqItem) {
    return res.status(404).json({ status: "error", message: "Requirement not found" });
  }

  reqItem.quotations = reqItem.quotations.map((q) => ({
    ...q,
    status: q.id === req.params.quoteId ? "Accepted" : "Declined",
  }));

  const accepted = reqItem.quotations.find((q) => q.id === req.params.quoteId);
  reqItem.status = "Accepted";
  reqItem.acceptedQuotation = accepted;

  res.json({ status: "success", data: reqItem });
});

module.exports = router;
