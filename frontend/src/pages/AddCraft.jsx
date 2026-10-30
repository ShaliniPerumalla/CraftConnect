// src/pages/AddCraft.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Check,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { creators } from "../utils/mockData";
import { useCrafts } from "../context/CraftsContext";

export default function AddCraft() {
  const navigate = useNavigate();

  const { addCraft } = useCrafts();

  const currentCreator =
    creators.find(
      (creator) => creator.id === "c1"
    ) || creators[0];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "10",
    category: "woodwork",
    materials: "",
    image: "",
    tag: "New",
  });

  const [notification, setNotification] =
    useState(false);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================================
  // FILE UPLOAD HANDLER
  // ======================================================

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((previous) => ({
        ...previous,
        image: reader.result, // Sets base64 preview URL
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setFormData((previous) => ({
      ...previous,
      image: "",
    }));
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      return;
    }

    const newCraft = addCraft({
      name: formData.name.trim(),

      price: Number(formData.price),

      stock: Number(formData.stock),

      category: formData.category,

      materials:
        formData.materials.trim() ||
        "Hand-selected quality materials",

      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",

      tag: formData.tag || "New",

      creator: currentCreator.name,

      creatorId: currentCreator.id,

      rating: 5,

      reviews: 0,
    });

    if (!newCraft) {
      return;
    }

    setNotification(true);

    setTimeout(() => {
      navigate("/creator/crafts");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* HEADER */}

        <section className="border-b border-border">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <Link
              to="/creator/crafts"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark"
            >
              <ArrowLeft size={16} />
              Back to My Crafts
            </Link>

            <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold mt-7">
              Creator Studio
            </p>

            <h1 className="font-display text-4xl sm:text-5xl mt-2">
              Add New Craft
            </h1>

            <p className="text-sm text-ink-soft mt-2">
              Add your handmade product to CraftConnect.
            </p>

          </div>

        </section>

        {/* FORM */}

        <section className="py-10">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm"
            >

              <div className="grid sm:grid-cols-2 gap-6">

                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold">
                    Craft Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Handcrafted Wooden Bowl"
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="text-sm font-semibold">
                    Price
                  </label>

                  <div className="relative mt-2">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      min="1"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="699"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                    />

                  </div>

                </div>

                {/* STOCK */}

                <div>

                  <label className="text-sm font-semibold">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="text-sm font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                  >
                    <option value="woodwork">
                      Woodwork
                    </option>

                    <option value="pottery">
                      Pottery & Ceramics
                    </option>

                    <option value="jewelry">
                      Jewelry
                    </option>

                    <option value="textiles">
                      Textiles
                    </option>

                    <option value="wall-art">
                      Wall Art
                    </option>

                    <option value="home-decor">
                      Home Decor
                    </option>

                    <option value="candles">
                      Candles & Bath
                    </option>

                    <option value="leather">
                      Leather Goods
                    </option>
                  </select>

                </div>

                {/* TAG */}

                <div>

                  <label className="text-sm font-semibold">
                    Tag
                  </label>

                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                  >
                    <option value="New">
                      New
                    </option>

                    <option value="Bestseller">
                      Bestseller
                    </option>

                    <option value="Limited">
                      Limited
                    </option>

                    <option value="">
                      No tag
                    </option>
                  </select>

                </div>

                {/* MATERIALS */}

                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold">
                    Materials
                  </label>

                  <input
                    type="text"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    placeholder="Walnut wood, natural finish"
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber"
                  />

                </div>

                {/* IMAGE UPLOAD */}

                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold">
                    Upload Craft Image
                  </label>

                  {!formData.image ? (
                    <div className="relative mt-2 border-2 border-dashed border-border rounded-2xl p-6 text-center bg-cream/40 hover:bg-cream/80 hover:border-amber transition-all cursor-pointer group">

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      <div className="flex flex-col items-center justify-center">

                        <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-amber-dark group-hover:scale-110 transition-transform mb-2 shadow-sm">
                          <Upload size={18} />
                        </div>

                        <p className="text-sm font-semibold text-ink">
                          Click to upload image
                        </p>

                        <p className="text-xs text-ink-soft mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>

                      </div>

                    </div>
                  ) : (
                    /* UPLOADED PREVIEW */
                    <div className="relative mt-2 w-36 h-36 rounded-2xl overflow-hidden border border-border shadow-sm group">

                      <img
                        src={formData.image}
                        alt="Craft preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/80 text-white flex items-center justify-center hover:bg-rose transition-colors"
                        title="Remove image"
                      >
                        <X size={15} />
                      </button>

                    </div>
                  )}

                  <p className="text-xs text-ink-soft mt-2">
                    Leave empty to use a default craft image.
                  </p>

                </div>

              </div>

              {/* SUBMIT */}

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">

                <Link
                  to="/creator/crafts"
                  className="flex-1 inline-flex items-center justify-center py-3.5 rounded-full border border-border text-sm font-medium"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                >
                  <Plus size={17} />
                  Add Craft
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

      <Footer />

      {/* NOTIFICATION */}

      {notification && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[330px] max-w-[calc(100vw-32px)]">

          <div className="bg-white border border-border rounded-2xl shadow-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">

                <Check
                  size={20}
                  className="text-forest"
                />

              </div>

              <div>
                <p className="font-semibold text-sm">
                  Craft added successfully
                </p>

                <p className="text-xs text-ink-soft mt-1">
                  Your new craft is now available.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}