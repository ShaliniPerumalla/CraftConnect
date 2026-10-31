import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Palette,
  ShoppingBag,
  ClipboardList,
  MessageSquareWarning,
  Star,
  BarChart3,
  ShieldCheck,
  Bell,
  Search,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Shield,
} from "lucide-react";

import { useComplaints } from "../context/ComplaintContext";
import { useOrders } from "../context/OrdersContext";
import {
  fetchAdminStatistics,
  fetchAdminUsers,
  fetchAdminCreators,
  fetchAdminOrders,
  verifyAdminCreator,
} from "../services/member4Service";

const sidebarItems = [
  { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { label: "Users", id: "users", icon: Users },
  { label: "Creators", id: "creators", icon: Palette },
  { label: "Orders", id: "orders", icon: ShoppingBag },
  { label: "Complaints", id: "complaints", icon: MessageSquareWarning, link: "/admin/complaints" },
];

function StatCard({ label, value, icon: Icon, color = "text-forest" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-soft">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-cream ${color}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  let style = "bg-cream text-ink-soft";
  if (s === "delivered" || s === "active" || s === "verified" || s === "resolved") {
    style = "bg-green-50 text-green-700";
  } else if (s === "pending" || s === "design" || s === "in review") {
    style = "bg-amber/15 text-amber-dark";
  } else if (s === "production" || s === "processing" || s === "shipped") {
    style = "bg-blue-50 text-blue-700";
  } else if (s === "cancelled") {
    style = "bg-red-50 text-red-600";
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${style}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const { complaints, statistics: complaintStats } = useComplaints();
  const { orders: contextOrders } = useOrders();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    creators: 0,
    orders: 0,
    revenue: 0,
    pending_complaints: 0,
    rating: 5.0,
  });

  const [usersList, setUsersList] = useState([]);
  const [creatorsList, setCreatorsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsData, usersData, creatorsData, ordersData] = await Promise.allSettled([
          fetchAdminStatistics(),
          fetchAdminUsers(),
          fetchAdminCreators(),
          fetchAdminOrders(),
        ]);

        if (statsData.status === "fulfilled" && statsData.value) {
          setStats(statsData.value);
        }
        if (usersData.status === "fulfilled" && Array.isArray(usersData.value)) {
          setUsersList(usersData.value);
        }
        if (creatorsData.status === "fulfilled" && Array.isArray(creatorsData.value)) {
          setCreatorsList(creatorsData.value);
        }
        if (ordersData.status === "fulfilled" && Array.isArray(ordersData.value)) {
          setOrdersList(ordersData.value);
        }
      } catch (err) {
        console.warn("Failed loading admin portal remote data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleToggleVerify = async (creatorId, currentStatus) => {
    try {
      await verifyAdminCreator(creatorId, !currentStatus);
      setCreatorsList((prev) =>
        prev.map((c) => (c.id === creatorId ? { ...c, is_verified: !currentStatus } : c))
      );
    } catch (err) {
      alert("Verification update failed: " + err.message);
    }
  };

  const displayOrders = ordersList.length > 0 ? ordersList : contextOrders;

  return (
    <main className="min-h-screen bg-cream font-body text-ink">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block">
          <div className="sticky top-0 p-6 flex flex-col justify-between h-screen">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center font-bold text-sm">
                  MM
                </div>
                <div>
                  <h2 className="font-semibold text-sm">MakerMatch</h2>
                  <p className="text-[10px] text-amber-dark font-medium uppercase tracking-wider">
                    Admin Portal
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  if (item.link) {
                    return (
                      <Link
                        key={item.label}
                        to={item.link}
                        className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-ink-soft hover:bg-cream hover:text-ink transition"
                      >
                        <Icon size={17} />
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? "bg-forest text-white"
                          : "text-ink-soft hover:bg-cream hover:text-ink"
                      }`}
                    >
                      <Icon size={17} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border">
              <Link
                to="/"
                className="text-xs text-ink-soft hover:text-amber-dark transition block"
              >
                ← Return to Platform
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN SECTION */}
        <section className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="border-b border-border bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-dark">
                Administration
              </p>
              <h2 className="text-xl font-display mt-0.5 capitalize">
                {activeTab} Management
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-soft hover:bg-cream"
                title="Notifications"
              >
                <Bell size={16} />
              </Link>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-xs font-semibold text-white">
                A
              </div>
            </div>
          </header>

          <div className="p-6 sm:p-8 space-y-8">

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <>
                {/* STATS OVERVIEW */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Platform Users"
                    value={stats.users || usersList.length || 12}
                    icon={Users}
                    color="text-amber-dark"
                  />
                  <StatCard
                    label="Verified Creators"
                    value={stats.creators || creatorsList.length || 4}
                    icon={Palette}
                    color="text-purple-600"
                  />
                  <StatCard
                    label="Orders Processed"
                    value={stats.orders || displayOrders.length || 8}
                    icon={ShoppingBag}
                    color="text-blue-600"
                  />
                  <StatCard
                    label="Pending Issues"
                    value={stats.pending_complaints || complaintStats.pending || 0}
                    icon={MessageSquareWarning}
                    color="text-red-500"
                  />
                </div>

                {/* REVENUE & QUALITY SUMMARY */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-soft">Delivered Revenue</p>
                      <p className="text-3xl font-display text-forest mt-1">
                        ₹{(stats.revenue || 45200).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                      <TrendingUp size={22} />
                    </div>
                  </div>

                  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-soft">Average Platform Rating</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-3xl font-display text-ink">{stats.rating || 4.9}</p>
                        <div className="flex text-amber-dark">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} className="fill-amber-dark text-amber-dark" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber/15 text-amber-dark flex items-center justify-center">
                      <Star size={22} />
                    </div>
                  </div>
                </div>

                {/* RECENT ORDERS */}
                <section className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-dark">
                        Live Transactions
                      </p>
                      <h3 className="font-display text-xl mt-0.5">Recent Platform Orders</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-semibold text-forest hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-ink-soft uppercase tracking-wider">
                          <th className="py-3 px-3">Order #</th>
                          <th className="py-3 px-3">Customer</th>
                          <th className="py-3 px-3">Creator</th>
                          <th className="py-3 px-3">Amount</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {displayOrders.slice(0, 6).map((order) => (
                          <tr key={order.id} className="hover:bg-cream/40 transition">
                            <td className="py-3 px-3 font-semibold text-ink">
                              #{order.order_number || order.orderNumber || order.id}
                            </td>
                            <td className="py-3 px-3 text-ink-soft">
                              {order.customer?.name || order.customer?.username || order.customerName || "Customer"}
                            </td>
                            <td className="py-3 px-3 text-ink-soft">
                              {order.creator?.name || order.creator?.username || order.creator || "Artisan"}
                            </td>
                            <td className="py-3 px-3 font-medium text-forest">
                              ₹{order.total_amount || order.total || order.price || 0}
                            </td>
                            <td className="py-3 px-3">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <Link
                                to={`/orders/${order.id}`}
                                className="text-amber-dark hover:underline font-medium"
                              >
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* RECENT COMPLAINTS */}
                <section className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-dark">
                        Customer Support
                      </p>
                      <h3 className="font-display text-xl mt-0.5">Support Tickets & Issues</h3>
                    </div>
                    <Link
                      to="/admin/complaints"
                      className="text-xs font-semibold text-forest hover:underline"
                    >
                      Resolve Issues ({complaintStats.pending} pending) →
                    </Link>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="py-8 text-center text-ink-soft text-xs">
                      No unresolved customer complaints right now.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {complaints.slice(0, 4).map((c) => (
                        <div key={c.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs">{c.ticketId || c.id}</span>
                              <StatusBadge status={c.status} />
                              <span className="text-[10px] text-ink-soft">· {c.category}</span>
                            </div>
                            <p className="text-xs text-ink-soft mt-1">{c.subject}</p>
                          </div>
                          <Link
                            to="/admin/complaints"
                            className="px-3 py-1 rounded-full border border-border text-[11px] hover:bg-cream"
                          >
                            Manage
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <section className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-display text-xl mb-4">Platform Users & Roles</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-ink-soft uppercase tracking-wider">
                        <th className="py-3 px-3">Username</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td className="py-3 px-3 font-semibold text-ink">{u.username}</td>
                          <td className="py-3 px-3 text-ink-soft">{u.email}</td>
                          <td className="py-3 px-3 capitalize font-medium text-amber-dark">{u.role}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                              {u.is_active ? "Active" : "Disabled"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* CREATORS TAB */}
            {activeTab === "creators" && (
              <section className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-display text-xl mb-4">Creator Verification & Profiles</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-ink-soft uppercase tracking-wider">
                        <th className="py-3 px-3">Creator Name</th>
                        <th className="py-3 px-3">Specialty</th>
                        <th className="py-3 px-3">Rating</th>
                        <th className="py-3 px-3">Verification</th>
                        <th className="py-3 px-3 text-right">Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {creatorsList.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 px-3 font-semibold text-ink">{c.name}</td>
                          <td className="py-3 px-3 text-ink-soft">{c.specialty || "Custom Crafts"}</td>
                          <td className="py-3 px-3 text-amber-dark font-medium">{c.rating}★ ({c.reviews_count} reviews)</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.is_verified ? "bg-green-50 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                              {c.is_verified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleVerify(c.id, c.is_verified)}
                              className="px-3 py-1 rounded-full border border-border text-xs hover:bg-cream"
                            >
                              {c.is_verified ? "Unverify" : "Verify"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <section className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-display text-xl mb-4">All Platform Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-ink-soft uppercase tracking-wider">
                        <th className="py-3 px-3">Order Number</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Creator</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Tracker</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {displayOrders.map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 px-3 font-semibold text-ink">#{o.order_number || o.orderNumber || o.id}</td>
                          <td className="py-3 px-3 text-ink-soft">{o.customer?.name || o.customer?.username || "Customer"}</td>
                          <td className="py-3 px-3 text-ink-soft">{o.creator?.name || o.creator?.username || "Creator"}</td>
                          <td className="py-3 px-3 font-semibold text-forest">₹{o.total_amount || o.total || o.price}</td>
                          <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                          <td className="py-3 px-3 text-right">
                            <Link to={`/orders/${o.id}`} className="text-amber-dark hover:underline">
                              View Order
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}