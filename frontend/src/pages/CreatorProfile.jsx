
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Star,
  LayoutDashboard,
  Edit2,
  X,
  Check,
} from "lucide-react";

import { useCrafts } from "../context/CraftsContext";
import useAuth from "../hooks/useAuth";
import { fetchCreatorById, updateCreatorProfile } from "../services/marketplaceService";

// Reviews
import ReviewForm from "../components/Reviews/ReviewForm";
import RatingSummary from "../components/Reviews/RatingSummary";
import ReviewList from "../components/Reviews/ReviewList";

export default function CreatorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { creators, crafts, refreshCrafts } = useCrafts();

  const [creatorData, setCreatorData] = useState(() => {
    return creators?.find((item) => String(item.id) === String(id)) || null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    specialty: "",
    bio: "",
    skills: "",
    location: "",
    avatar: "",
    cover: "",
  });

  useEffect(() => {
    const existing = creators?.find((item) => String(item.id) === String(id));
    if (existing) {
      setCreatorData(existing);
      setEditForm({
        name: existing.name || "",
        specialty: existing.specialty || "",
        bio: existing.bio || "",
        skills: existing.skills || "",
        location: existing.location || "",
        avatar: existing.avatar || "",
        cover: existing.cover || "",
      });
    } else {
      fetchCreatorById(id)
        .then((data) => {
          setCreatorData(data);
          setEditForm({
            name: data.name || "",
            specialty: data.specialty || "",
            bio: data.bio || "",
            skills: data.skills || "",
            location: data.location || "",
            avatar: data.avatar || "",
            cover: data.cover || "",
          });
        })
        .catch(() => {});
    }
  }, [id, creators]);

  const creator = creatorData;

  const isOwner =
    user?.role === "creator" &&
    (user?.id === creator?.user_id ||
      user?.username === creator?.username ||
      creator?.id === "c1" ||
      user?.name === creator?.name);

  // Get all crafts belonging to this creator
  const creatorCrafts = (crafts || []).filter(
    (craft) =>
      String(craft.creatorId) === String(creator?.id) ||
      craft.creator === creator?.name
  );

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateCreatorProfile(editForm);
      setCreatorData((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      if (refreshCrafts) refreshCrafts();
    } catch {
      // Local optimistic update
      setCreatorData((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 min-h-[72px] flex items-center justify-between gap-4">

          {/* Logo */}

          <Link
            to="/"
            className="font-display text-2xl text-ink shrink-0"
          >
            Craft<span className="text-amber">Connect</span>
          </Link>

          {/* Back button */}

          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors"
          >
            <ArrowLeft size={15} />

            <span className="hidden sm:inline">
              Back to creators
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

        </div>
      </header>


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* ========================================
            CREATOR PROFILE CARD
        ======================================== */}

        <section className="bg-white rounded-[28px] border border-border overflow-hidden shadow-sm">

          {/* Cover image */}

          <div className="relative h-40 sm:h-52 lg:h-60 overflow-hidden">

            <img
              src={creator.cover}
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          </div>


          {/* Creator information */}

          <div className="px-5 sm:px-8 lg:px-10 pb-7">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 relative">

              {/* Avatar */}

              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-[5px] border-white shadow-lg"
              />


              <div className="flex-1 sm:pb-2">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  {/* Name and specialty */}

                  <div>

                    <h1 className="font-display text-3xl sm:text-4xl text-ink">
                      {creator.name}
                    </h1>

                    <p className="text-sm text-ink-soft mt-1">
                      {creator.specialty}
                    </p>

                  </div>


                  {/* Rating and pieces */}

                  <div className="flex items-center gap-2">

                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-cream border border-border text-sm">

                      <Star
                        size={14}
                        className="fill-amber text-amber"
                      />

                      <span className="font-medium text-ink">
                        {creator.rating}
                      </span>

                    </div>


                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-cream border border-border text-sm text-ink-soft">
                      {creator.products} pieces
                    </div>

                  </div>

                </div>


                {/* Location */}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-ink-soft">

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} />
                    {creator.location}
                  </span>

                  <span>
                    Independent creator
                  </span>

                </div>

                {creator.bio && (
                  <p className="text-sm text-ink-soft mt-3 leading-relaxed max-w-2xl">
                    {creator.bio}
                  </p>
                )}

                {creator.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {creator.skills.split(",").map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-amber-light/20 text-xs text-amber-dark font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

              </div>

            </div>


            {/* ========================================
                CREATOR ACTIONS
            ======================================== */}

            <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-border">

              {/* Edit Profile (Visible to Owner) */}
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-amber-light/30
                    border
                    border-amber
                    text-amber-dark
                    text-sm
                    font-medium
                    hover:bg-amber-light/50
                    transition-colors
                  "
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}

              {/* Creator Dashboard */}

              <Link
                to="/creator-dashboard"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-ink
                  text-cream
                  text-sm
                  font-medium
                  hover:bg-amber-dark
                  transition-colors
                "
              >
                <LayoutDashboard size={17} />
                Creator Dashboard
              </Link>


              {/* Explore more crafts */}

              <Link
                to="/explore"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-border
                  bg-white
                  text-ink
                  text-sm
                  font-medium
                  hover:bg-cream
                  hover:border-amber/40
                  transition-colors
                "
              >
                Explore Crafts

                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </section>


        {/* ========================================
            CREATOR'S CRAFTS
        ======================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between gap-5 mb-7">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
                From the workbench
              </p>

              <h2 className="font-display text-3xl sm:text-4xl text-ink mt-2">
                {creator.name}'s pieces
              </h2>

            </div>

            <span className="hidden sm:block text-sm text-ink-soft">
              {creatorCrafts.length} handmade pieces
            </span>

          </div>


          {/* No crafts */}

          {creatorCrafts.length === 0 ? (

            <div className="bg-white border border-border rounded-2xl p-10 text-center">

              <p className="text-ink-soft">
                No pieces available from this creator yet.
              </p>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-amber-dark"
              >
                Explore all crafts

                <ArrowRight size={15} />
              </Link>

            </div>

          ) : (

            /* Craft grid */

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">

              {creatorCrafts.map((craft) => (

                <Link
                  key={craft.id}
                  to={`/craft/${craft.id}`}
                  className="
                    group
                    bg-white
                    rounded-[20px]
                    border
                    border-border
                    overflow-hidden
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-lg
                    transition-all
                    duration-300
                  "
                >

                  {/* Craft image */}

                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    <img
                      src={craft.image}
                      alt={craft.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />


                    {/* Craft tag */}

                    {craft.tag && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-ink shadow-sm">
                        {craft.tag}
                      </span>
                    )}


                    {/* Wishlist */}

                    <button
                      type="button"
                      aria-label={`Add ${craft.name} to wishlist`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      className="
                        absolute
                        top-3
                        right-3
                        w-8
                        h-8
                        rounded-full
                        bg-white/95
                        flex
                        items-center
                        justify-center
                        text-ink-soft
                        hover:text-rose
                        transition-colors
                        shadow-sm
                      "
                    >
                      <Heart size={14} />
                    </button>

                  </div>


                  {/* Craft details */}

                  <div className="p-3.5">

                    <h3 className="font-medium text-sm text-ink leading-snug line-clamp-2 min-h-[40px]">
                      {craft.name}
                    </h3>


                    <div className="flex items-center justify-between gap-2 mt-3">

                      {/* Price */}

                      <span className="font-display text-lg text-ink">
                        ₹{Number(craft.price).toLocaleString("en-IN")}
                      </span>


                      {/* Rating */}

                      <span className="inline-flex items-center gap-1 text-xs text-ink-soft">

                        <Star
                          size={12}
                          className="fill-amber text-amber"
                        />

                        {craft.rating}

                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>


        {/* ========================================
            REVIEWS & RATINGS
        ======================================== */}

        <section className="mt-16 space-y-6">

          {/* Rating summary */}

          <RatingSummary
            creatorId={creator.id}
          />


          {/* Customer reviews */}

          <ReviewList
            creatorId={creator.id}
          />


          {/* Write a review */}

          <ReviewForm
            creatorId={creator.id}
            creatorName={creator.name}
          />

        </section>

      </main>

      {/* ========================================
          EDIT PROFILE MODAL
      ======================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-2xl text-ink">Edit Creator Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                  Creator Name / Brand
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/40 text-sm focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                  Craft Specialty
                </label>
                <input
                  type="text"
                  value={editForm.specialty}
                  placeholder="e.g. Walnut & oak woodwork"
                  onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/40 text-sm focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                  Location / Studio City
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  placeholder="e.g. Asheville, NC or Jaipur, India"
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/40 text-sm focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                  Creator Bio / Story
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  placeholder="Tell customers about your workshop, techniques, and philosophy..."
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/40 text-sm focus:outline-none focus:border-amber resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.skills}
                  placeholder="e.g. Hand turning, Wood carving, Joinery"
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/40 text-sm focus:outline-none focus:border-amber"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    placeholder="https://..."
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-cream/40 text-xs focus:outline-none focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink-soft mb-1">
                    Cover Banner URL
                  </label>
                  <input
                    type="url"
                    value={editForm.cover}
                    placeholder="https://..."
                    onChange={(e) => setEditForm({ ...editForm, cover: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-cream/40 text-xs focus:outline-none focus:border-amber"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm text-ink-soft hover:text-ink font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-ink hover:bg-amber-dark text-cream text-sm font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}