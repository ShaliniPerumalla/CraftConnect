// src/pages/EditCraft.jsx

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { creators } from "../utils/mockData";
import { useCrafts } from "../context/CraftsContext";

export default function EditCraft() {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getCraftById,
    updateCraft,
  } = useCrafts();

  const craft = getCraftById(id);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "woodwork",
    tag: "New",
    materials: "",
    image: "",
  });

  const [saving, setSaving] = useState(false);

  // ======================================================
  // LOAD CRAFT
  // ======================================================

  useEffect(() => {

    if (!craft) {
      return;
    }

    setFormData({
      name: craft.name || "",
      price: craft.price ?? "",
      stock: craft.stock ?? 10,
      category: craft.category || "woodwork",
      tag: craft.tag || "New",
      materials: craft.materials || "",
      image: craft.image || "",
    });

  }, [craft]);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================================
  // SAVE
  // ======================================================

  function handleSubmit(event) {

    event.preventDefault();

    if (!craft) {
      return;
    }

    setSaving(true);

    updateCraft(craft.id, {
      ...formData,
      price: Number(formData.price) || 0,
      stock: Math.max(
        0,
        Number(formData.stock) || 0
      ),
    });

    setTimeout(() => {
      setSaving(false);
      navigate("/creator/crafts");
    }, 300);
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!craft) {

    return (
      <div className="min-h-screen bg-cream font-body text-ink">

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-20 text-center">

          <Package
            size={40}
            className="mx-auto text-ink-soft"
          />

          <h1 className="font-display text-3xl mt-5">
            Craft not found
          </h1>

          <p className="text-sm text-ink-soft mt-2">
            This craft may have been deleted.
          </p>

          <Link
            to="/creator/crafts"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to My Crafts
          </Link>

        </main>

        <Footer />

      </div>
    );
  }

  const currentCreator = creators.find(
    (creator) =>
      creator.id === craft.creatorId
  );

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="border-b border-border bg-cream">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <Link
              to="/creator/crafts"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to My Crafts
            </Link>

            <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold mt-7">
              Creator Studio
            </p>

            <h1 className="font-display text-4xl sm:text-5xl mt-2">
              Edit Craft
            </h1>

            <p className="text-sm text-ink-soft mt-2">
              Update your product information and inventory.
            </p>

          </div>

        </section>

        {/* ==================================================
            FORM
        ================================================== */}

        <section className="py-10">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-border rounded-[28px] p-6 sm:p-8"
            >

              {/* PRODUCT PREVIEW */}

              <div className="flex flex-col sm:flex-row gap-5 pb-7 border-b border-border">

                <div className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-gray-100">

                  {formData.image ? (

                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon
                        size={30}
                        className="text-ink-soft"
                      />
                    </div>

                  )}

                </div>

                <div className="flex-1">

                  <p className="text-xs uppercase tracking-[0.15em] text-forest font-semibold">
                    {currentCreator?.name || "Creator"}
                  </p>

                  <h2 className="font-display text-2xl mt-2">
                    {formData.name || "Your craft"}
                  </h2>

                  <p className="text-sm text-ink-soft mt-2">
                    Changes will be reflected across your storefront.
                  </p>

                </div>

              </div>

              {/* ==================================================
                  NAME
              ================================================== */}

              <div className="mt-7">

                <label className="block text-sm font-medium">
                  Craft Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
                  placeholder="Enter craft name"
                />

              </div>

              {/* ==================================================
                  PRICE + STOCK
              ================================================== */}

              <div className="grid sm:grid-cols-2 gap-5 mt-5">

                <div>

                  <label className="block text-sm font-medium">
                    Price
                  </label>

                  <div className="relative mt-2">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
                  />

                </div>

              </div>

              {/* ==================================================
                  CATEGORY + TAG
              ================================================== */}

              <div className="grid sm:grid-cols-2 gap-5 mt-5">

                <div>

                  <label className="block text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
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
                      Candles
                    </option>

                    <option value="leather">
                      Leather
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    Tag
                  </label>

                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
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
                      No Tag
                    </option>

                  </select>

                </div>

              </div>

              {/* ==================================================
                  MATERIALS
              ================================================== */}

              <div className="mt-5">

                <label className="block text-sm font-medium">
                  Materials
                </label>

                <textarea
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  rows={3}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors resize-none"
                  placeholder="Describe the materials used"
                />

              </div>

              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div className="mt-5">

                <label className="block text-sm font-medium">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-cream/30 outline-none focus:border-amber transition-colors"
                  placeholder="https://..."
                />

              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-7 border-t border-border">

                <Link
                  to="/creator/crafts"
                  className="flex-1 inline-flex items-center justify-center px-5 py-3.5 rounded-full border border-border text-sm font-medium hover:border-amber transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark disabled:opacity-60 transition-colors"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}