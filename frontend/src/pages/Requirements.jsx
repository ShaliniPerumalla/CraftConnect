// src/pages/Requirements.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Send,
  CheckCircle,
  ImagePlus,
  Sparkles,
  ShieldCheck,
  Clock3,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ======================================================
// AVAILABLE CATEGORIES
// ======================================================

const categories = [
  "Woodwork",
  "Pottery & Ceramics",
  "Jewelry",
  "Textiles & Fiber Art",
  "Wall Art & Prints",
  "Home Decor",
  "Candles & Bath",
  "Leather Goods",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function Requirements() {
  const [mode, setMode] = useState("request");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    budget: "",
    deadline: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ======================================================
  // CLEAN IMAGE PREVIEW URL
  // ======================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
  };

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "creator" && !image) {
      alert("Please upload an image of your craft.");
      return;
    }

    console.log("Submitted data:", {
      mode,
      ...formData,
      image,
    });

    setSubmitted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetForm = () => {
    setSubmitted(false);
    setMode("request");

    setFormData({
      category: "",
      title: "",
      description: "",
      budget: "",
      deadline: "",
      price: "",
      stock: "",
    });

    removeImage();
  };

  // ======================================================
  // SWITCH MODE
  // ======================================================

  const switchMode = (newMode) => {
    removeImage();
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ==================================================
            PREMIUM HERO
        ================================================== */}

        <section className="relative overflow-hidden border-b border-border">

          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-forest/10 blur-3xl" />

          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-ink-soft
                hover:text-amber-dark
                transition-colors
              "
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="max-w-4xl mt-10">

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 border border-border shadow-sm">

                <Sparkles
                  size={14}
                  className="text-amber-dark"
                />

                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-amber-dark">
                  CraftConnect Studio
                </span>

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mt-6">

                Handmade ideas,
                <br />

                <span className="italic text-amber-dark">
                  made personal.
                </span>

              </h1>

              <p className="text-base sm:text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">

                Turn your imagination into something real. Tell a creator
                exactly what you have in mind, or showcase your own
                handmade work to the CraftConnect community.

              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            SUCCESS SCREEN
        ================================================== */}

        {submitted ? (

          <section className="py-20">

            <div className="max-w-2xl mx-auto px-4 sm:px-6">

              <div className="relative overflow-hidden bg-white border border-border rounded-[2rem] p-8 sm:p-14 text-center shadow-[0_20px_70px_rgba(0,0,0,0.08)]">

                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber via-amber-dark to-forest" />

                <div className="w-20 h-20 mx-auto rounded-full bg-forest/10 flex items-center justify-center">

                  <CheckCircle
                    size={38}
                    className="text-forest"
                  />

                </div>

                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mt-7">
                  Successfully submitted
                </p>

                <h2 className="font-display text-3xl sm:text-4xl mt-3">

                  {mode === "creator"
                    ? "Your craft is ready!"
                    : "Your request has been received."}

                </h2>

                <p className="text-ink-soft leading-relaxed mt-4 max-w-lg mx-auto">

                  {mode === "creator"
                    ? "Your craft details and image have been prepared for publishing."
                    : "Your custom requirement has been prepared and can be connected with suitable creators."}

                </p>

                <div className="flex flex-wrap justify-center gap-3 mt-9">

                  <Link
                    to="/creators"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-6
                      py-3.5
                      rounded-full
                      bg-ink
                      text-cream
                      text-sm
                      font-medium
                      hover:bg-amber-dark
                      transition-all
                    "
                  >
                    Browse creators
                    <ChevronRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="
                      px-6
                      py-3.5
                      rounded-full
                      border
                      border-border
                      bg-white
                      text-ink
                      text-sm
                      font-medium
                      hover:border-amber
                      transition-colors
                    "
                  >
                    Create another
                  </button>

                </div>

              </div>

            </div>

          </section>

        ) : (

          <section className="py-12 sm:py-16 lg:py-20">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* ==================================================
                  MODE SELECTOR
              ================================================== */}

              <div className="max-w-2xl mx-auto mb-12">

                <div className="relative bg-white/80 backdrop-blur border border-border rounded-2xl p-1.5 shadow-sm">

                  <div className="grid grid-cols-2 gap-1.5">

                    <button
                      type="button"
                      onClick={() => switchMode("request")}
                      className={`
                        relative
                        px-4
                        py-3.5
                        rounded-xl
                        text-sm
                        font-medium
                        transition-all
                        ${
                          mode === "request"
                            ? "bg-ink text-cream shadow-md"
                            : "text-ink-soft hover:text-ink hover:bg-cream"
                        }
                      `}
                    >
                      Request a custom craft
                    </button>

                    <button
                      type="button"
                      onClick={() => switchMode("creator")}
                      className={`
                        relative
                        px-4
                        py-3.5
                        rounded-xl
                        text-sm
                        font-medium
                        transition-all
                        ${
                          mode === "creator"
                            ? "bg-amber-dark text-white shadow-md"
                            : "text-ink-soft hover:text-ink hover:bg-cream"
                        }
                      `}
                    >
                      Add my craft
                    </button>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  MAIN FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 lg:gap-10"
              >

                {/* ==================================================
                    LEFT COLUMN
                ================================================== */}

                <div className="space-y-6">

                  {/* ==================================================
                      IMAGE CARD
                  ================================================== */}

                  <div className="bg-white border border-border rounded-[2rem] p-6 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.05)]">

                    <div className="flex items-start justify-between mb-6">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="w-2 h-2 rounded-full bg-amber-dark" />

                          <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold">
                            {mode === "creator"
                              ? "Product photo"
                              : "Reference image"}
                          </p>

                        </div>

                        <h2 className="font-display text-2xl sm:text-3xl mt-2">

                          {mode === "creator"
                            ? "Show your work"
                            : "Show your idea"}

                        </h2>

                      </div>

                      <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">

                        <ImagePlus
                          size={20}
                          className="text-amber-dark"
                        />

                      </div>

                    </div>

                    {/* ==================================================
                        IMAGE PREVIEW
                    ================================================== */}

                    {imagePreview ? (

                      <div
                        className={`
                          relative
                          w-full
                          ${
                            mode === "creator"
                              ? "aspect-square"
                              : "aspect-[4/3]"
                          }
                          rounded-2xl
                          overflow-hidden
                          bg-cream
                          group
                        `}
                      >

                        <img
                          src={imagePreview}
                          alt={
                            mode === "creator"
                              ? "Uploaded craft preview"
                              : "Custom craft reference preview"
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.03]
                          "
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove uploaded image"
                          className="
                            absolute
                            top-3
                            right-3
                            w-9
                            h-9
                            rounded-full
                            bg-white/95
                            text-ink
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            hover:bg-rose
                            hover:text-white
                            transition-all
                          "
                        >
                          <X size={17} />
                        </button>

                      </div>

                    ) : (

                      <label
                        htmlFor={
                          mode === "creator"
                            ? "craft-image"
                            : "reference-image"
                        }
                        className="
                          group
                          relative
                          block
                          w-full
                          max-w-md
                          mx-auto
                          aspect-[4/3]
                          rounded-2xl
                          border
                          border-dashed
                          border-border
                          bg-gradient-to-br
                          from-cream
                          to-white
                          cursor-pointer
                          overflow-hidden
                          hover:border-amber
                          transition-all
                        "
                      >

                        {/* Decorative circles */}

                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-amber/10 group-hover:bg-amber/15 transition-colors" />

                        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-forest/5" />

                        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">

                          <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all">

                            {mode === "creator" ? (
                              <Upload
                                size={23}
                                className="text-amber-dark"
                              />
                            ) : (
                              <ImagePlus
                                size={23}
                                className="text-amber-dark"
                              />
                            )}

                          </div>

                          <h3 className="font-medium mt-4">

                            {mode === "creator"
                              ? "Upload your craft image"
                              : "Upload a reference image"}

                          </h3>

                          <p className="text-xs text-ink-soft mt-2 max-w-xs leading-relaxed">

                            {mode === "creator"
                              ? "Choose a clear photo of your handmade product."
                              : "Show the creator the style, design, colour or shape you have in mind."}

                          </p>

                          <span className="mt-4 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-medium group-hover:bg-amber-dark transition-colors">

                            Choose image

                          </span>

                          <input
                            id={
                              mode === "creator"
                                ? "craft-image"
                                : "reference-image"
                            }
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                          />

                        </div>

                      </label>

                    )}

                    <div className="flex items-center justify-between gap-3 mt-4">

                      <p className="text-xs text-ink-soft">
                        JPG, PNG or WEBP
                      </p>

                      <p className="text-xs text-ink-soft">
                        Max 5 MB
                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      TRUST INFO
                  ================================================== */}

                  {mode === "request" && (

                    <div className="bg-ink rounded-[2rem] p-6 sm:p-7 text-cream">

                      <p className="text-xs uppercase tracking-[0.18em] text-amber font-semibold">
                        CraftConnect promise
                      </p>

                      <h3 className="font-display text-2xl mt-2">
                        Your idea stays yours.
                      </h3>

                      <div className="space-y-4 mt-6">

                        <div className="flex gap-3">

                          <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">

                            <ShieldCheck
                              size={17}
                              className="text-amber"
                            />

                          </div>

                          <div>

                            <p className="text-sm font-medium">
                              Clear requirements
                            </p>

                            <p className="text-xs text-cream/60 mt-1">
                              Give creators the details they need to understand your vision.
                            </p>

                          </div>

                        </div>

                        <div className="flex gap-3">

                          <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">

                            <Clock3
                              size={17}
                              className="text-amber"
                            />

                          </div>

                          <div>

                            <p className="text-sm font-medium">
                              Flexible timelines
                            </p>

                            <p className="text-xs text-cream/60 mt-1">
                              Share your preferred deadline so creators can plan ahead.
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

                {/* ==================================================
                    RIGHT FORM CARD
                ================================================== */}

                <div className="bg-white border border-border rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.05)]">

                  <div className="pb-6 mb-6 border-b border-border">

                    <div className="flex items-center gap-2">

                      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-forest">
                        {mode === "creator"
                          ? "Craft information"
                          : "Custom requirement"}
                      </span>

                      <span className="flex-1 h-px bg-border" />

                      <span className="text-xs text-ink-soft">
                        {mode === "creator" ? "01" : "01"}
                      </span>

                    </div>

                    <h2 className="font-display text-3xl mt-2">

                      {mode === "creator"
                        ? "Tell buyers about your craft"
                        : "Tell us what you need"}

                    </h2>

                    <p className="text-sm text-ink-soft mt-2">
                      {mode === "creator"
                        ? "Add the details buyers need before discovering your work."
                        : "The more detail you provide, the easier it is for a creator to bring your idea to life."}
                    </p>

                  </div>

                  <div className="space-y-5">

                    {/* ==================================================
                        CATEGORY
                    ================================================== */}

                    <div>

                      <label
                        htmlFor="category"
                        className="block text-sm font-medium mb-2"
                      >
                        Craft category
                      </label>

                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="
                          w-full
                          px-4
                          py-3.5
                          rounded-xl
                          border
                          border-border
                          bg-cream/60
                          outline-none
                          focus:border-amber
                          focus:ring-2
                          focus:ring-amber/10
                          transition-all
                        "
                      >

                        <option value="">
                          Select a category
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <div>

                      <label
                        htmlFor="title"
                        className="block text-sm font-medium mb-2"
                      >
                        {mode === "creator"
                          ? "Craft name"
                          : "What would you like made?"}
                      </label>

                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={
                          mode === "creator"
                            ? "Example: Hand-carved wooden bowl"
                            : "Example: Custom wooden study table"
                        }
                        required
                        className="
                          w-full
                          px-4
                          py-3.5
                          rounded-xl
                          border
                          border-border
                          bg-cream/60
                          outline-none
                          focus:border-amber
                          focus:ring-2
                          focus:ring-amber/10
                          transition-all
                        "
                      />

                    </div>

                    {/* ==================================================
                        CREATOR PRICE + STOCK
                    ================================================== */}

                    {mode === "creator" && (

                      <div className="grid sm:grid-cols-2 gap-5">

                        <div>

                          <label
                            htmlFor="price"
                            className="block text-sm font-medium mb-2"
                          >
                            Price (₹)
                          </label>

                          <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
                              ₹
                            </span>

                            <input
                              id="price"
                              name="price"
                              type="number"
                              min="0"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="2500"
                              required
                              className="
                                w-full
                                pl-9
                                pr-4
                                py-3.5
                                rounded-xl
                                border
                                border-border
                                bg-cream/60
                                outline-none
                                focus:border-amber
                                focus:ring-2
                                focus:ring-amber/10
                              "
                            />

                          </div>

                        </div>

                        <div>

                          <label
                            htmlFor="stock"
                            className="block text-sm font-medium mb-2"
                          >
                            Available quantity
                          </label>

                          <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="1"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="10"
                            required
                            className="
                              w-full
                              px-4
                              py-3.5
                              rounded-xl
                              border
                              border-border
                              bg-cream/60
                              outline-none
                              focus:border-amber
                              focus:ring-2
                              focus:ring-amber/10
                            "
                          />

                        </div>

                      </div>

                    )}

                    {/* ==================================================
                        BUDGET
                    ================================================== */}

                    {mode === "request" && (

                      <div>

                        <label
                          htmlFor="budget"
                          className="block text-sm font-medium mb-2"
                        >
                          Budget (₹)
                        </label>

                        <div className="relative">

                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
                            ₹
                          </span>

                          <input
                            id="budget"
                            name="budget"
                            type="number"
                            min="0"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="5000"
                            required
                            className="
                              w-full
                              pl-9
                              pr-4
                              py-3.5
                              rounded-xl
                              border
                              border-border
                              bg-cream/60
                              outline-none
                              focus:border-amber
                              focus:ring-2
                              focus:ring-amber/10
                            "
                          />

                        </div>

                      </div>

                    )}

                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <label
                          htmlFor="description"
                          className="block text-sm font-medium"
                        >
                          Description
                        </label>

                        <span className="text-xs text-ink-soft">
                          Required
                        </span>

                      </div>

                      <textarea
                        id="description"
                        name="description"
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={
                          mode === "creator"
                            ? "Tell buyers about the materials, process, inspiration and special details..."
                            : "Tell the creator about size, colour, material, design, personalization and other details..."
                        }
                        required
                        className="
                          w-full
                          px-4
                          py-3.5
                          rounded-xl
                          border
                          border-border
                          bg-cream/60
                          outline-none
                          focus:border-amber
                          focus:ring-2
                          focus:ring-amber/10
                          transition-all
                          resize-none
                          leading-relaxed
                        "
                      />

                    </div>

                    {/* ==================================================
                        DEADLINE
                    ================================================== */}

                    {mode === "request" && (

                      <div>

                        <label
                          htmlFor="deadline"
                          className="block text-sm font-medium mb-2"
                        >
                          Preferred deadline
                        </label>

                        <input
                          id="deadline"
                          name="deadline"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={formData.deadline}
                          onChange={handleChange}
                          className="
                            w-full
                            px-4
                            py-3.5
                            rounded-xl
                            border
                            border-border
                            bg-cream/60
                            outline-none
                            focus:border-amber
                            focus:ring-2
                            focus:ring-amber/10
                            transition-all
                          "
                        />

                      </div>

                    )}

                  </div>

                  {/* ==================================================
                      SUBMIT
                  ================================================== */}

                  <button
                    type="submit"
                    className="
                      group
                      mt-8
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-4
                      rounded-full
                      bg-ink
                      text-cream
                      text-sm
                      font-medium
                      shadow-lg
                      hover:bg-amber-dark
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      transition-all
                    "
                  >

                    {mode === "creator"
                      ? "Publish my craft"
                      : "Send requirement"}

                    {mode === "creator" ? (
                      <Upload
                        size={16}
                        className="group-hover:translate-y-[-1px] transition-transform"
                      />
                    ) : (
                      <Send
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    )}

                  </button>

                  <p className="text-xs text-ink-soft mt-4 text-center leading-relaxed">

                    {mode === "creator"
                      ? "Your image and craft details are currently prepared for frontend publishing."
                      : "Your requirement can be used to connect you with relevant CraftConnect creators."}

                  </p>

                </div>

              </form>

            </div>

          </section>

        )}

      </main>

      <Footer />

    </div>
  );
}
