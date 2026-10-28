import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Check,
  Upload,
  Loader2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCrafts } from "../context/CraftsContext";
import useAuth from "../hooks/useAuth";
import { uploadMarketplaceImage } from "../services/marketplaceService";

export default function AddCraft() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addCraft, categories, creators } = useCrafts();

  const currentCreator =
    (user &&
      creators?.find(
        (c) =>
          c.user_id === user.id ||
          c.username === user.username ||
          c.name === user.name
      )) ||
    creators?.[0] || { id: "c1", name: user?.name || "Independent Creator" };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "10",
    category: categories?.[0]?.id || "woodwork",
    materials: "",
    image: "",
    tag: "New",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(false);

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMarketplaceImage(file);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      console.warn("Image upload failed, please use direct URL:", err);
      alert("Image upload failed. Please ensure file is an image under 5MB or paste a URL.");
    } finally {
      setUploading(false);
    }
  }

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
  // SUBMIT
  // ======================================================

  async function handleSubmit(event) {
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

    setSubmitting(true);
    try {
      const newCraft = await addCraft({
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
        setSubmitting(false);
        return;
      }

      setNotification(true);

      setTimeout(() => {
        navigate("/creator/crafts");
      }, 1000);
    } catch (err) {
      console.error("Error creating craft:", err);
      setSubmitting(false);
    }
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
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
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

                {/* IMAGE */}

                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold">
                    Product Image (Upload or Image URL)
                  </label>

                  <div className="mt-2 flex flex-col sm:flex-row gap-3">

                    <div className="relative flex-1">

                      <ImageIcon
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />

                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://... or upload from device"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-cream/40 outline-none focus:border-amber text-sm"
                      />

                    </div>

                    <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-white hover:bg-cream cursor-pointer text-sm font-medium transition-colors">
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin text-amber" />
                      ) : (
                        <Upload size={16} className="text-amber-dark" />
                      )}
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>

                  </div>

                  {formData.image && (
                    <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-amber-light/10 border border-amber/20">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <span className="text-xs text-ink-soft truncate flex-1">
                        {formData.image}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-ink-soft mt-2">
                    Images are uploaded and saved securely. Leave empty for default.
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