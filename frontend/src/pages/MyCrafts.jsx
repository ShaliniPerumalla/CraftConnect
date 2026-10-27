import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Package,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCrafts } from "../context/CraftsContext";
import useAuth from "../hooks/useAuth";
import { fetchCurrentCreatorProfile } from "../services/marketplaceService";

export default function MyCrafts() {
  const { user } = useAuth();
  const {
    crafts,
    creators,
    deleteCraft,
  } = useCrafts();

  const [currentCreator, setCurrentCreator] = useState(() => {
    if (user) {
      const match = creators?.find(
        (c) =>
          c.user_id === user.id ||
          c.username === user.username ||
          c.name === user.name
      );
      if (match) return match;
    }
    return creators?.[0] || { id: "c1", name: user?.name || "Creator" };
  });

  useEffect(() => {
    fetchCurrentCreatorProfile()
      .then((profile) => {
        if (profile && profile.name) {
          setCurrentCreator(profile);
        }
      })
      .catch(() => {});
  }, [user]);

  // Only current creator's crafts
  const myCrafts = crafts.filter(
    (craft) =>
      String(craft.creatorId) === String(currentCreator?.id) ||
      craft.creator === currentCreator?.name
  );

  const totalStock = myCrafts.reduce(
    (total, craft) =>
      total + Number(craft.stock || 0),
    0
  );

  const averagePrice = myCrafts.length
    ? Math.round(
        myCrafts.reduce(
          (total, craft) =>
            total + Number(craft.price || 0),
          0
        ) / myCrafts.length
      )
    : 0;

  async function handleDelete(craft) {
    const confirmed = window.confirm(
      `Delete "${craft.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCraft(craft.id);
    } catch (err) {
      console.error("Error deleting craft:", err);
    }
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      <main>

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="border-b border-border bg-cream">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <Link
              to="/creator-dashboard"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mt-7">

              <div>

                <p className="text-xs uppercase tracking-[0.18em] text-amber-dark font-semibold">
                  Creator Studio
                </p>

                <h1 className="font-display text-4xl sm:text-5xl mt-2">
                  My Crafts
                </h1>

                <p className="text-sm text-ink-soft mt-2">
                  View, edit and manage your handmade products.
                </p>

              </div>

              <Link
                to="/creator/add-craft"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
              >
                <Plus size={17} />
                Add New Craft
              </Link>

            </div>

          </div>

        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="py-10">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid sm:grid-cols-3 gap-5 mb-8">

              <div className="bg-white border border-border rounded-3xl p-5">

                <Package
                  size={22}
                  className="text-amber-dark"
                />

                <p className="text-sm text-ink-soft mt-4">
                  Total Crafts
                </p>

                <p className="font-display text-3xl mt-1">
                  {myCrafts.length}
                </p>

              </div>

              <div className="bg-white border border-border rounded-3xl p-5">

                <p className="text-sm text-ink-soft">
                  Total Stock
                </p>

                <p className="font-display text-3xl mt-2">
                  {totalStock}
                </p>

                <p className="text-xs text-ink-soft mt-1">
                  Available pieces
                </p>

              </div>

              <div className="bg-white border border-border rounded-3xl p-5">

                <p className="text-sm text-ink-soft">
                  Average Price
                </p>

                <p className="font-display text-3xl mt-2">
                  ₹{averagePrice.toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-ink-soft mt-1">
                  Per craft
                </p>

              </div>

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {myCrafts.length === 0 ? (

              <div className="bg-white border border-border rounded-3xl p-12 text-center">

                <Package
                  size={35}
                  className="mx-auto text-ink-soft"
                />

                <h2 className="font-display text-2xl mt-4">
                  No crafts yet
                </h2>

                <p className="text-sm text-ink-soft mt-2">
                  Start adding your handmade products.
                </p>

                <Link
                  to="/creator/add-craft"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Your First Craft
                </Link>

              </div>

            ) : (

              /* ==================================================
                 CRAFT GRID
              ================================================== */

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {myCrafts.map((craft) => {

                  const stock = Number(craft.stock || 0);

                  return (
                    <article
                      key={craft.id}
                      className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                        <img
                          src={craft.image}
                          alt={craft.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />

                        {craft.tag && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-semibold shadow-sm">
                            {craft.tag}
                          </span>
                        )}

                      </div>

                      {/* DETAILS */}

                      <div className="p-5">

                        <p className="text-xs uppercase tracking-[0.15em] text-forest font-semibold">
                          {craft.category}
                        </p>

                        <h2 className="font-display text-xl mt-2">
                          {craft.name}
                        </h2>

                        <div className="flex items-center justify-between mt-4">

                          <span className="font-display text-xl">
                            ₹
                            {Number(craft.price || 0).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          <span
                            className={`text-xs font-medium ${
                              stock > 0
                                ? "text-forest"
                                : "text-rose"
                            }`}
                          >
                            {stock > 0
                              ? `${stock} in stock`
                              : "Out of stock"}
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="grid grid-cols-3 gap-2 mt-5">

                          <Link
                            to={`/craft/${craft.id}`}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs font-medium hover:border-amber hover:text-amber-dark transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          <Link
                            to={`/creator/edit-craft/${craft.id}`}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs font-medium hover:border-amber hover:text-amber-dark transition-colors"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(craft)
                            }
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs font-medium text-rose hover:bg-rose/5 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}