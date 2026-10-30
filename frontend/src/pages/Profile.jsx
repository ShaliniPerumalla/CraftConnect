// src/pages/Profile.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Edit3,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("details");

  // Temporary mock user profile data
  const user = {
    name: "Phani Kumar",
    email: "phani@example.com",
    phone: "+91 98765 43210",
    role: "Craft Enthusiast",
    joinedDate: "August 2026",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
    address: {
      street: "RGUKT RK Valley Campus",
      city: "Idupulapaya",
      state: "Andhra Pradesh",
      pincode: "516330",
    },
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-amber-dark transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Profile Card Header */}
        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber/30 shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl">
                    {user.name}
                  </h1>
                  <p className="text-sm text-amber-dark font-medium mt-1">
                    {user.role} • Member since {user.joinedDate}
                  </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-amber hover:text-amber-dark transition-colors">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6 text-xs text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} /> {user.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {user.address.city},{" "}
                  {user.address.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "details"
                ? "border-amber-dark text-amber-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "address"
                ? "border-amber-dark text-amber-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-3xl p-6">
              <h2 className="font-display text-xl mb-4 flex items-center gap-2">
                <User size={20} className="text-amber-dark" /> Personal
                Information
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-ink-soft">Full Name</p>
                  <p className="font-medium mt-0.5">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Email Address</p>
                  <p className="font-medium mt-0.5">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Phone Number</p>
                  <p className="font-medium mt-0.5">{user.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-3xl p-6">
              <h2 className="font-display text-xl mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-amber-dark" /> Quick
                Shortcuts
              </h2>
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/50 hover:bg-cream transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Package size={18} className="text-amber-dark" /> View My
                    Orders
                  </span>
                  <span className="text-xs text-ink-soft">→</span>
                </Link>
                <Link
                  to="/explore"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/50 hover:bg-cream transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Heart size={18} className="text-amber-dark" /> Saved
                    Favorites
                  </span>
                  <span className="text-xs text-ink-soft">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="bg-white border border-border rounded-3xl p-6">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-amber-dark" /> Default
              Shipping Address
            </h2>
            <div className="p-4 rounded-2xl bg-cream/40 border border-border/60 max-w-md">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-sm text-ink-soft mt-1">
                {user.address.street}
              </p>
              <p className="text-sm text-ink-soft">
                {user.address.city}, {user.address.state} -{" "}
                {user.address.pincode}
              </p>
              <p className="text-sm text-ink-soft mt-1">{user.phone}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
