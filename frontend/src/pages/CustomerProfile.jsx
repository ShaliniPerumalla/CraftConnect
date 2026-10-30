// src/pages/CustomerProfile.jsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  Package,
  Pencil,
  Check,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useRequirements } from "../context/RequirementsContext";

const PROFILE_STORAGE_KEY = "craftconnect_customer_profile";

const defaultProfile = {
  name: "CraftConnect Customer",
  email: "customer@example.com",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CustomerProfile() {
  // ======================================================
  // CONTEXTS
  // ======================================================

  const { wishlist = [], wishlistCount = 0 } =
    useWishlist();

  const { cartItems = [] } = useCart();

  const ordersContext = useOrders();

  const orders = ordersContext?.orders || [];

  const { requirements = [] } = useRequirements();

  // ======================================================
  // PROFILE STATE
  // ======================================================

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem(
        PROFILE_STORAGE_KEY
      );

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);

        return {
          ...defaultProfile,
          ...parsedProfile,
        };
      }
    } catch (error) {
      console.error(
        "Could not load customer profile:",
        error
      );
    }

    return defaultProfile;
  });

  const [editMode, setEditMode] = useState(false);

  const [editData, setEditData] = useState(profile);

  const [activeSection, setActiveSection] =
    useState("overview");

  // ======================================================
  // CART COUNT
  // ======================================================

  const cartCount = useMemo(() => {
    return (
      cartItems?.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ) || 0
    );
  }, [cartItems]);

  // ======================================================
  // ORDER COUNT
  // ======================================================

  const orderCount = orders.length;

  // ======================================================
  // PROFILE INITIAL
  // ======================================================

  const profileInitial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "C";

  // ======================================================
  // HANDLE EDIT
  // ======================================================

  function startEditing() {
    setEditData(profile);
    setEditMode(true);
  }

  function cancelEditing() {
    setEditData(profile);
    setEditMode(false);
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  function saveProfile(event) {
    event.preventDefault();

    const updatedProfile = {
      ...editData,
      name:
        editData.name.trim() ||
        "CraftConnect Customer",
    };

    setProfile(updatedProfile);

    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );
    } catch (error) {
      console.error(
        "Could not save customer profile:",
        error
      );
    }

    setEditMode(false);
  }

  // ======================================================
  // LOGOUT
  // ======================================================

  function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    // Authentication can be connected here later.
    localStorage.removeItem("craftconnect_user");

    window.location.href = "/login";
  }

  // ======================================================
  // FORMAT ORDER STATUS
  // ======================================================

  function getOrderStatus(order) {
    return (
      order?.status ||
      order?.orderStatus ||
      "Processing"
    );
  }

  // ======================================================
  // STATUS STYLE
  // ======================================================

  function getStatusClass(status) {
    const normalized =
      String(status).toLowerCase();

    if (
      normalized.includes("delivered") ||
      normalized.includes("complete")
    ) {
      return "bg-forest/10 text-forest-dark";
    }

    if (
      normalized.includes("cancel") ||
      normalized.includes("failed")
    ) {
      return "bg-rose/10 text-rose-dark";
    }

    return "bg-amber/10 text-amber-dark";
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-cream font-body text-ink">

      <Navbar />

      {/* ==================================================
          HERO / PROFILE HEADER
      ================================================== */}

      <section className="relative overflow-hidden border-b border-border">

        {/* Decorative background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-light/20 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-forest/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

            {/* PROFILE IDENTITY */}

            <div className="flex items-center gap-5 sm:gap-6">

              {/* Avatar */}

              <div className="relative shrink-0">

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-ink text-cream flex items-center justify-center shadow-lg">

                  <span className="font-display text-4xl sm:text-5xl">
                    {profileInitial}
                  </span>

                </div>

                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center border-4 border-cream">
                  <Check size={13} strokeWidth={3} />
                </div>

              </div>

              {/* Name */}

              <div>

                <div className="flex items-center gap-2 mb-1">

                  <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                    My account
                  </p>

                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">
                  {profile.name}
                </h1>

                <p className="text-sm text-ink-soft mt-2">
                  Your personal CraftConnect space.
                </p>

              </div>

            </div>

            {/* EDIT BUTTON */}

            {!editMode && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <Pencil size={15} />
                Edit profile
              </button>
            )}

          </div>

        </div>

      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">

          {/* ORDERS */}

          <button
            type="button"
            onClick={() => setActiveSection("orders")}
            className="group text-left bg-white border border-border rounded-2xl p-5 hover:border-amber/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div className="w-10 h-10 rounded-xl bg-amber-light/25 flex items-center justify-center">
                <Package
                  size={19}
                  className="text-amber-dark"
                />
              </div>

              <ChevronRight
                size={16}
                className="text-border group-hover:text-amber transition-colors"
              />

            </div>

            <p className="font-display text-2xl mt-5">
              {orderCount}
            </p>

            <p className="text-xs text-ink-soft mt-1">
              Orders
            </p>

          </button>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={() => setActiveSection("wishlist")}
            className="group text-left bg-white border border-border rounded-2xl p-5 hover:border-rose/30 hover:-translate-y-0.5 transition-all shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center">
                <Heart
                  size={19}
                  className="text-rose"
                />
              </div>

              <ChevronRight
                size={16}
                className="text-border group-hover:text-rose transition-colors"
              />

            </div>

            <p className="font-display text-2xl mt-5">
              {wishlistCount}
            </p>

            <p className="text-xs text-ink-soft mt-1">
              Liked crafts
            </p>

          </button>

          {/* CART */}

          <Link
            to="/cart"
            className="group bg-white border border-border rounded-2xl p-5 hover:border-amber/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <ShoppingBag
                  size={19}
                  className="text-forest-dark"
                />
              </div>

              <ChevronRight
                size={16}
                className="text-border group-hover:text-forest transition-colors"
              />

            </div>

            <p className="font-display text-2xl mt-5">
              {cartCount}
            </p>

            <p className="text-xs text-ink-soft mt-1">
              Items in cart
            </p>

          </Link>

          {/* ACCOUNT */}

          <div className="bg-ink text-cream rounded-2xl p-5 shadow-sm">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck
                size={19}
                className="text-amber"
              />
            </div>

            <p className="font-display text-2xl mt-5">
              Active
            </p>

            <p className="text-xs text-cream/60 mt-1">
              Account status
            </p>

          </div>

        </div>

        {/* ==================================================
            CUSTOM REQUIREMENTS QUICK BANNER (MEMBER 3)
        ================================================== */}
        <div className="mb-8 bg-gradient-to-r from-amber/15 via-white to-forest/10 border border-border rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber/20 text-amber-dark flex items-center justify-center shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-ink">My Custom Requirements</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber text-ink text-[11px] font-bold">
                  {requirements.length} Active
                </span>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Track custom order requirements, check received creator quotations, and compare offers.
              </p>
            </div>
          </div>

          <Link
            to="/requirements?tab=dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-xs font-semibold hover:bg-amber-dark transition-colors shrink-0"
          >
            <span>View Requirements & Quotes</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* ==================================================
            LAYOUT
        ================================================== */}

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside>

            <div className="bg-white border border-border rounded-2xl p-2 sticky top-24">

              <button
                type="button"
                onClick={() =>
                  setActiveSection("overview")
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors ${
                  activeSection === "overview"
                    ? "bg-cream text-ink font-semibold"
                    : "text-ink-soft hover:bg-cream"
                }`}
              >
                <User size={17} />
                Overview
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveSection("orders")
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors ${
                  activeSection === "orders"
                    ? "bg-cream text-ink font-semibold"
                    : "text-ink-soft hover:bg-cream"
                }`}
              >
                <Package size={17} />
                My orders

                {orderCount > 0 && (
                  <span className="ml-auto text-xs">
                    {orderCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveSection("wishlist")
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors ${
                  activeSection === "wishlist"
                    ? "bg-cream text-ink font-semibold"
                    : "text-ink-soft hover:bg-cream"
                }`}
              >
                <Heart size={17} />
                Liked crafts

                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs text-rose">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ink-soft hover:bg-cream transition-colors"
              >
                <ShoppingBag size={17} />
                Shopping cart

                {cartCount > 0 && (
                  <span className="ml-auto text-xs text-amber-dark">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="h-px bg-border my-2" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-dark hover:bg-rose/5 transition-colors"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>

          </aside>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <section className="min-w-0">

            {/* ==================================================
                EDIT PROFILE
            ================================================== */}

            {editMode ? (

              <form
                onSubmit={saveProfile}
                className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4 mb-8">

                  <div>

                    <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                      Personal details
                    </p>

                    <h2 className="font-display text-3xl mt-2">
                      Edit your profile
                    </h2>

                    <p className="text-sm text-ink-soft mt-2">
                      Keep your CraftConnect information
                      up to date.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
                    aria-label="Cancel editing"
                  >
                    <X size={18} />
                  </button>

                </div>

                <div className="grid sm:grid-cols-2 gap-5">

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Full name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={editData.name}
                        onChange={handleEditChange}
                        required
                        className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors"
                      />

                    </div>

                  </div>

                  {/* PHONE */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone number
                    </label>

                    <div className="relative">

                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={editData.phone}
                        onChange={handleEditChange}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors"
                      />

                    </div>

                  </div>

                  {/* CITY */}

                  <div>

                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={editData.city}
                      onChange={handleEditChange}
                      placeholder="Guntur"
                      className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                    />

                  </div>

                  {/* STATE */}

                  <div>

                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-2"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={editData.state}
                      onChange={handleEditChange}
                      placeholder="Andhra Pradesh"
                      className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                    />

                  </div>

                  {/* PINCODE */}

                  <div>

                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium mb-2"
                    >
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={editData.pincode}
                      onChange={handleEditChange}
                      placeholder="522001"
                      className="w-full rounded-xl border border-border bg-cream py-3 px-4 text-sm outline-none focus:border-amber transition-colors"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="address"
                      className="block text-sm font-medium mb-2"
                    >
                      Delivery address
                    </label>

                    <div className="relative">

                      <MapPin
                        size={17}
                        className="absolute left-4 top-4 text-ink-soft"
                      />

                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder="House number, street, area..."
                        className="w-full rounded-xl border border-border bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-amber transition-colors resize-none"
                      />

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
                  >
                    <Check size={16} />
                    Save changes
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-6 py-3 rounded-full border border-border bg-white text-ink text-sm font-medium hover:border-amber transition-colors"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <>

                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                {activeSection === "overview" && (

                  <div className="space-y-6">

                    {/* WELCOME CARD */}

                    <div className="relative overflow-hidden bg-ink text-cream rounded-3xl p-7 sm:p-9">

                      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/10" />

                      <div className="absolute -right-6 -bottom-20 w-48 h-48 rounded-full border border-white/10" />

                      <div className="relative">

                        <div className="flex items-center gap-2 text-amber text-xs uppercase tracking-[0.18em] font-semibold">
                          <Sparkles size={14} />
                          Welcome back
                        </div>

                        <h2 className="font-display text-3xl sm:text-4xl mt-4 max-w-xl">
                          Discover something
                          beautifully handmade.
                        </h2>

                        <p className="text-cream/65 text-sm leading-relaxed mt-4 max-w-lg">
                          Explore independent creators,
                          save pieces you love, and find
                          handmade objects made with
                          intention.
                        </p>

                        <Link
                          to="/explore"
                          className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-full bg-cream text-ink text-sm font-medium hover:bg-amber-light transition-colors"
                        >
                          Explore crafts
                          <ChevronRight size={16} />
                        </Link>

                      </div>

                    </div>

                    {/* PERSONAL INFORMATION */}

                    <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                            Your information
                          </p>

                          <h2 className="font-display text-2xl mt-2">
                            Personal details
                          </h2>

                        </div>

                        <button
                          type="button"
                          onClick={startEditing}
                          className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:text-amber-dark transition-colors"
                          aria-label="Edit profile"
                        >
                          <Pencil size={16} />
                        </button>

                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mt-7">

                        <InfoItem
                          icon={<User size={17} />}
                          label="Full name"
                          value={profile.name}
                        />

                        <InfoItem
                          icon={<Mail size={17} />}
                          label="Email"
                          value={profile.email}
                        />

                        <InfoItem
                          icon={<Phone size={17} />}
                          label="Phone"
                          value={
                            profile.phone ||
                            "Not added yet"
                          }
                        />

                        <InfoItem
                          icon={<MapPin size={17} />}
                          label="Location"
                          value={
                            [
                              profile.city,
                              profile.state,
                            ]
                              .filter(Boolean)
                              .join(", ") ||
                            "Not added yet"
                          }
                        />

                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                          <MapPin
                            size={18}
                            className="text-forest-dark"
                          />
                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-[0.15em] text-forest font-semibold">
                            Delivery
                          </p>

                          <h3 className="font-display text-xl mt-1">
                            Saved address
                          </h3>

                        </div>

                      </div>

                      <div className="mt-6 p-5 rounded-2xl bg-cream border border-border">

                        {profile.address ||
                        profile.city ||
                        profile.state ||
                        profile.pincode ? (

                          <p className="text-sm text-ink-soft leading-relaxed">

                            {profile.address && (
                              <>
                                {profile.address}
                                <br />
                              </>
                            )}

                            {[
                              profile.city,
                              profile.state,
                              profile.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}

                          </p>

                        ) : (

                          <div>

                            <p className="text-sm text-ink">
                              No delivery address saved.
                            </p>

                            <button
                              type="button"
                              onClick={startEditing}
                              className="text-sm text-amber-dark font-medium mt-2 hover:underline"
                            >
                              Add an address
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    ORDERS
                ================================================== */}

                {activeSection === "orders" && (

                  <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">

                    <div className="mb-8">

                      <p className="text-xs uppercase tracking-[0.18em] text-forest font-semibold">
                        Purchase history
                      </p>

                      <h2 className="font-display text-3xl mt-2">
                        My orders
                      </h2>

                      <p className="text-sm text-ink-soft mt-2">
                        Keep track of your handmade
                        purchases.
                      </p>

                    </div>

                    {orders.length > 0 ? (

                      <div className="space-y-3">

                        {orders.slice(0, 8).map(
                          (order, index) => {

                            const orderId =
                              order.id ||
                              order.orderId ||
                              `order-${index + 1}`;

                            const status =
                              getOrderStatus(order);

                            const total =
                              Number(
                                order.total ||
                                order.grandTotal ||
                                0
                              );

                            return (
                              <Link
                                key={orderId}
                                to={`/orders/${orderId}`}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border hover:border-amber/40 hover:bg-cream/50 transition-all"
                              >

                                <div className="flex items-center gap-4">

                                  <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center shrink-0">
                                    <Package
                                      size={18}
                                      className="text-amber-dark"
                                    />
                                  </div>

                                  <div>

                                    <p className="text-sm font-medium">
                                      Order #
                                      {String(
                                        orderId
                                      ).slice(-8)}
                                    </p>

                                    <p className="text-xs text-ink-soft mt-1">
                                      {order.items?.length ||
                                        order.products
                                          ?.length ||
                                        0}{" "}
                                      item(s)
                                    </p>

                                  </div>

                                </div>

                                <div className="flex items-center gap-4">

                                  <span
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${getStatusClass(
                                      status
                                    )}`}
                                  >
                                    {status}
                                  </span>

                                  {total > 0 && (
                                    <span className="font-display text-lg">
                                      ₹
                                      {total.toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>
                                  )}

                                  <ChevronRight
                                    size={16}
                                    className="text-ink-soft group-hover:text-amber"
                                  />

                                </div>

                              </Link>
                            );
                          }
                        )}

                      </div>

                    ) : (

                      <EmptyState
                        icon={<Package size={24} />}
                        title="No orders yet"
                        text="Your handmade purchases will appear here."
                        actionText="Explore crafts"
                        actionLink="/explore"
                      />

                    )}

                  </div>
                )}

                {/* ==================================================
                    WISHLIST
                ================================================== */}

                {activeSection === "wishlist" && (

                  <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">

                    <div className="flex items-start justify-between gap-4 mb-8">

                      <div>

                        <p className="text-xs uppercase tracking-[0.18em] text-rose font-semibold">
                          Your collection
                        </p>

                        <h2 className="font-display text-3xl mt-2">
                          Liked crafts
                        </h2>

                        <p className="text-sm text-ink-soft mt-2">
                          Pieces you've saved for later.
                        </p>

                      </div>

                      <Link
                        to="/wishlist"
                        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-amber-dark hover:text-amber transition-colors"
                      >
                        View all
                        <ChevronRight size={15} />
                      </Link>

                    </div>

                    {wishlist.length > 0 ? (

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        {wishlist
                          .slice(0, 6)
                          .map((craft) => (

                            <Link
                              key={craft.id}
                              to={`/craft/${craft.id}`}
                              className="group"
                            >

                              <div className="aspect-square rounded-2xl overflow-hidden bg-cream">

                                {craft.image ? (

                                  <img
                                    src={craft.image}
                                    alt={
                                      craft.name ||
                                      "Liked craft"
                                    }
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />

                                ) : (

                                  <div className="w-full h-full flex items-center justify-center">
                                    <Heart
                                      size={28}
                                      className="text-rose"
                                    />
                                  </div>

                                )}

                              </div>

                              <h3 className="text-sm font-medium mt-3 line-clamp-1 group-hover:text-amber-dark transition-colors">
                                {craft.name ||
                                  "Handmade craft"}
                              </h3>

                              {craft.price != null && (
                                <p className="font-display text-lg mt-1">
                                  ₹
                                  {Number(
                                    craft.price
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              )}

                            </Link>

                          ))}

                      </div>

                    ) : (

                      <EmptyState
                        icon={<Heart size={24} />}
                        title="Nothing saved yet"
                        text="When you find a craft you love, save it here."
                        actionText="Discover crafts"
                        actionLink="/explore"
                      />

                    )}

                  </div>
                )}

              </>

            )}

          </section>

        </div>

      </main>

      <Footer />

    </div>
  );
}

// ======================================================
// INFO ITEM
// ======================================================

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream border border-border">

      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-ink-soft shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {label}
        </p>

        <p className="text-sm font-medium mt-1 truncate">
          {value}
        </p>

      </div>

    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  icon,
  title,
  text,
  actionText,
  actionLink,
}) {
  return (
    <div className="text-center py-12 px-6 rounded-2xl bg-cream border border-border">

      <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center text-amber-dark shadow-sm">
        {icon}
      </div>

      <h3 className="font-display text-2xl mt-5">
        {title}
      </h3>

      <p className="text-sm text-ink-soft mt-2 max-w-sm mx-auto">
        {text}
      </p>

      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium hover:bg-amber-dark transition-colors"
      >
        {actionText}
        <ChevronRight size={15} />
      </Link>

    </div>
  );
}
