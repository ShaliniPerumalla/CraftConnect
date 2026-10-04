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
} from "lucide-react";

import { useComplaints } from "../context/ComplaintContext";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Users",
    icon: Users,
  },
  {
    label: "Creators",
    icon: Palette,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    label: "Requirements",
    icon: ClipboardList,
  },
  {
    label: "Complaints",
    icon: MessageSquareWarning,
  },
  {
    label: "Reviews",
    icon: Star,
  },
  {
    label: "Reports",
    icon: BarChart3,
  },
  {
    label: "Creator verification",
    icon: ShieldCheck,
  },
];

const users = [
  {
    id: "USR-001",
    name: "Rahul",
    email: "rahul@example.com",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Priya",
    email: "priya@example.com",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Ananya",
    email: "ananya@example.com",
    status: "Pending",
  },
];

const creators = [
  {
    id: "CRT-001",
    name: "Anu Crafts",
    category: "Jewelry",
    status: "Verified",
  },
  {
    id: "CRT-002",
    name: "XYZ Art",
    category: "Resin Art",
    status: "Verified",
  },
  {
    id: "CRT-003",
    name: "Priya Creations",
    category: "Handmade Gifts",
    status: "Pending",
  },
];

const orders = [
  {
    id: "MM1024",
    customer: "Rahul",
    creator: "Anu Crafts",
    status: "Production",
  },
  {
    id: "MM1025",
    customer: "Priya",
    creator: "XYZ Art",
    status: "Delivered",
  },
  {
    id: "MM1026",
    customer: "Ananya",
    creator: "Priya Creations",
    status: "Pending",
  },
];

const statCards = [
  {
    label: "Users",
    value: "1,245",
    icon: Users,
  },
  {
    label: "Creators",
    value: "320",
    icon: Palette,
  },
  {
    label: "Orders",
    value: "2,430",
    icon: ShoppingBag,
  },
];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-5
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(33,30,27,0.07)]
      "
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs text-ink-muted">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-ink">
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-cream
            text-forest
          "
        >
          <Icon size={19} />
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active:
      "bg-green-50 text-green-700",
    Pending:
      "bg-amber-light/20 text-amber-dark",
    Verified:
      "bg-green-50 text-green-700",
    Production:
      "bg-blue-50 text-blue-700",
    Delivered:
      "bg-green-50 text-green-700",
    "In Review":
      "bg-blue-50 text-blue-700",
    Resolved:
      "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-semibold
        ${styles[status] || "bg-cream text-ink-soft"}
      `}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const {
    complaints,
    statistics,
  } = useComplaints();

  return (
    <main className="min-h-screen bg-background">

      <div className="flex min-h-screen">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside
          className="
            hidden
            w-64
            shrink-0
            border-r
            border-border
            bg-card
            lg:block
          "
        >
          <div className="sticky top-0 p-6">

            {/* BRAND */}

            <div className="mb-8">

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  font-semibold
                  text-forest
                "
              >
                CraftConnect
              </p>

              <h1 className="mt-1 text-xl font-semibold text-ink">
                Admin Panel
              </h1>

            </div>

            {/* NAVIGATION */}

            <nav className="space-y-1">

              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      transition-colors
                      ${
                        item.active
                          ? "bg-ink text-white"
                          : "text-ink-soft hover:bg-cream hover:text-ink"
                      }
                    `}
                  >
                    <Icon size={17} />

                    {item.label}
                  </button>
                );
              })}

            </nav>

          </div>
        </aside>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <section className="min-w-0 flex-1">

          {/* TOP BAR */}

          <header
            className="
              border-b
              border-border
              bg-card
              px-5
              py-4
              sm:px-8
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <p className="text-xs text-ink-muted">
                  Administration
                </p>

                <h2 className="text-lg font-semibold text-ink">
                  Dashboard
                </h2>

              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-border
                    text-ink-soft
                    transition
                    hover:bg-cream
                  "
                  title="Notifications"
                >
                  <Bell size={18} />
                </button>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-forest
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  A
                </div>

              </div>

            </div>

          </header>

          {/* CONTENT */}

          <div className="p-5 sm:p-8">

            {/* PAGE INTRO */}

            <div className="mb-8">

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  font-semibold
                  text-forest
                "
              >
                Overview
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-ink">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-ink-soft">
                Monitor users, creators, orders and
                customer issues from one place.
              </p>

            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              {statCards.map((card) => (
                <StatCard
                  key={card.label}
                  {...card}
                />
              ))}

              {/* PENDING ISSUES */}

              <StatCard
                label="Pending Issues"
                value={statistics.pending}
                icon={MessageSquareWarning}
              />

            </div>

            {/* ==================================================
                RECENT ORDERS
            ================================================== */}

            <section className="mt-8">

              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest">
                    Activity
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-ink">
                    Recent Orders
                  </h2>

                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-forest hover:underline"
                >
                  View all
                </button>

              </div>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                "
              >

                <div className="hidden grid-cols-4 border-b border-border px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-ink-muted sm:grid">

                  <span>Order</span>
                  <span>Customer</span>
                  <span>Creator</span>
                  <span>Status</span>

                </div>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="
                      grid
                      gap-3
                      border-b
                      border-border
                      px-5
                      py-4
                      last:border-b-0
                      sm:grid-cols-4
                      sm:items-center
                    "
                  >

                    <div className="font-semibold text-ink">
                      {order.id}
                    </div>

                    <div className="text-sm text-ink-soft">
                      {order.customer}
                    </div>

                    <div className="text-sm text-ink-soft">
                      {order.creator}
                    </div>

                    <div>
                      <StatusBadge
                        status={order.status}
                      />
                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* ==================================================
                COMPLAINTS
            ================================================== */}

            <section className="mt-8">

              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest">
                    Customer Support
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-ink">
                    Recent Complaints
                  </h2>

                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-amber-light/20
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-amber-dark
                  "
                >
                  <Clock3 size={13} />

                  {statistics.pending} pending
                </div>

              </div>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                "
              >

                {complaints.length === 0 ? (

                  <div className="px-6 py-12 text-center">

                    <CheckCircle2
                      size={30}
                      className="mx-auto text-green-600"
                    />

                    <p className="mt-3 text-sm font-medium text-ink">
                      No complaints
                    </p>

                    <p className="mt-1 text-xs text-ink-muted">
                      Everything is clear right now.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-border">

                    {complaints
                      .slice(0, 5)
                      .map((complaint) => (

                        <div
                          key={complaint.id}
                          className="
                            flex
                            flex-col
                            gap-4
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="font-semibold text-ink">
                                {complaint.id}
                              </p>

                              <StatusBadge
                                status={
                                  complaint.status
                                }
                              />

                            </div>

                            <p className="mt-1 text-sm text-ink-soft">
                              {complaint.orderId}
                              {" · "}
                              {complaint.category}
                            </p>

                            <p className="mt-1 max-w-xl truncate text-xs text-ink-muted">
                              {complaint.description}
                            </p>

                          </div>

                          <button
                            type="button"
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              text-ink-muted
                              transition
                              hover:bg-cream
                              hover:text-ink
                            "
                            title="More options"
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                        </div>

                      ))}

                  </div>

                )}

              </div>

            </section>

            {/* ==================================================
                QUICK MANAGEMENT
            ================================================== */}

            <section className="mt-8">

              <div className="mb-4">

                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest">
                  Management
                </p>

                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Platform Overview
                </h2>

              </div>

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >

                <ManagementCard
                  icon={Users}
                  title="Users"
                  description="View and manage registered customers."
                  count="1,245"
                />

                <ManagementCard
                  icon={Palette}
                  title="Creators"
                  description="Review creator profiles and verification."
                  count="320"
                />

                <ManagementCard
                  icon={Star}
                  title="Reviews"
                  description="Monitor customer feedback and ratings."
                  count="486"
                />

                <ManagementCard
                  icon={ClipboardList}
                  title="Requirements"
                  description="Review custom craft requirements."
                  count="128"
                />

                <ManagementCard
                  icon={BarChart3}
                  title="Reports"
                  description="View platform activity and reports."
                  count="24"
                />

                <ManagementCard
                  icon={ShieldCheck}
                  title="Verification"
                  description="Review creators awaiting verification."
                  count="12"
                />

              </div>

            </section>

          </div>

        </section>

      </div>

    </main>
  );
}

function ManagementCard({
  icon: Icon,
  title,
  description,
  count,
}) {
  return (
    <button
      type="button"
      className="
        group
        rounded-2xl
        border
        border-border
        bg-card
        p-5
        text-left
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(33,30,27,0.07)]
      "
    >

      <div className="flex items-start justify-between">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-cream
            text-forest
          "
        >
          <Icon size={18} />
        </div>

        <span className="text-lg font-semibold text-ink">
          {count}
        </span>

      </div>

      <h3 className="mt-4 font-semibold text-ink">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        {description}
      </p>

    </button>
  );
}