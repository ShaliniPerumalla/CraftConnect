// src/pages/Orders.jsx

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const mockOrders = [
  {
    id: "CC-1001",
    craftName: "Handmade Ceramic Vase",
    creator: "Ananya Ceramics",
    price: 1499,
    date: "12 Aug 2026",
    statusLabel: "Out for Delivery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&auto=format&fit=crop",
  },
  {
    id: "CC-1002",
    craftName: "Handcrafted Wooden Bowl",
    creator: "Arjun Woodworks",
    price: 899,
    date: "10 Aug 2026",
    statusLabel: "In Production",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&auto=format&fit=crop",
  },
  {
    id: "CC-1003",
    craftName: "Handmade Silver Earrings",
    creator: "Meera Jewellery",
    price: 2199,
    date: "08 Aug 2026",
    statusLabel: "Design Phase",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop",
  },
];

export default function Orders() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 w-full">
        <h1 className="font-display text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">View all your placed custom orders and check their status.</p>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={order.image} alt={order.craftName} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <span className="text-xs text-amber-600 font-semibold uppercase">{order.id}</span>
                  <h3 className="font-bold text-lg text-gray-900">{order.craftName}</h3>
                  <p className="text-sm text-gray-500">By {order.creator} • Ordered on {order.date}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">₹{order.price}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {order.statusLabel}
                </span>

                {/* View Order button -> routes directly to product details */}
                <Link
                  to={`/orders/${order.id}?view=details`}
                  className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  View Order
                </Link>

                {/* Track Order button -> routes directly to Module 4 lifecycle */}
                <Link
                  to={`/orders/${order.id}?view=track`}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}