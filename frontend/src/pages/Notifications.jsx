import { ArrowLeft, Bell, CheckCheck, Trash2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import NotificationItem from "../components/notifications/NotificationItem";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState("all");

  // ======================================================
  // FILTER NOTIFICATIONS
  // ======================================================

  const filteredNotifications = useMemo(() => {
  switch (filter) {
    case "unread":
      return notifications.filter(
        (notification) => !notification.read
      );

    case "orders":
      return notifications.filter((notification) =>
        ["quotation", "production", "delivery", "delivered"].includes(
          notification.type
        )
      );

    case "designs":
      return notifications.filter(
        (notification) => notification.type === "design"
      );

    case "all":
    default:
      return notifications;
  }
}, [notifications, filter]);
  // ======================================================
  // FILTER BUTTONS
  // ======================================================

  const filters = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "unread",
    label: "Unread",
  },
  {
    id: "orders",
    label: "Orders",
  },
  {
    id: "designs",
    label: "Designs",
  },
];

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar />

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden border-b border-border ambient-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
          {/* BACK BUTTON */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              uppercase
              tracking-[0.14em]
              font-semibold
              text-ink-soft
              hover:text-amber-dark
              transition-colors
            "
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          {/* HERO CONTENT */}

          <div
            className="
              grid
              lg:grid-cols-[1fr_auto]
              gap-10
              lg:gap-20
              items-end
              mt-14
              sm:mt-20
            "
          >
            <div>
              {/* BADGE */}

              <div className="inline-flex items-center gap-2 premium-badge">
                <Sparkles size={12} />
                CraftConnect activity
              </div>

              {/* TITLE */}

              <h1
                className="
                  font-display
                  text-[3.2rem]
                  sm:text-6xl
                  lg:text-7xl
                  leading-[0.92]
                  tracking-tight
                  mt-6
                  max-w-3xl
                  text-balance
                "
              >
                Everything worth
                <br />
                knowing,
                <br />
                <span className="text-amber-dark">
                  in one place.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  text-ink-soft
                  text-sm
                  sm:text-base
                  max-w-xl
                  mt-7
                  leading-relaxed
                "
              >
                Stay close to your orders, custom requests,
                saved crafts and everything happening around
                your CraftConnect journey.
              </p>
            </div>

            {/* STAT */}

            <div
              className="
                lg:min-w-[220px]
                lg:border-l
                lg:border-border
                lg:pl-8
              "
            >
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-ink-muted
                "
              >
                Your inbox
              </p>

              <p
                className="
                  font-display
                  text-6xl
                  sm:text-7xl
                  leading-none
                  mt-3
                "
              >
                {String(notifications.length).padStart(2, "0")}
              </p>

              <p className="text-xs text-ink-soft mt-3">
                total notifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
          sm:py-14
          pb-24
        "
      >
        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
            mb-8
          "
        >
          {/* FILTERS */}

          <div
            className="
              flex
              items-center
              gap-1
              p-1
              bg-white
              border
              border-border
              rounded-full
              w-fit
              max-w-full
              overflow-x-auto
              scrollbar-hide
            "
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`
                  whitespace-nowrap
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-medium
                  transition-all
                  ${
                    filter === item.id
                      ? "bg-ink text-cream shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }
                `}
              >
                {item.label}

                {item.id === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 text-amber">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ACTIONS */}

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-amber-dark
                  hover:text-amber
                  transition-colors
                "
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearNotifications}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-ink-muted
                  hover:text-rose
                  transition-colors
                "
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* DIVIDER */}

        <div className="premium-divider mb-8" />

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                font-semibold
                text-forest
              "
            >
              Notifications
            </span>

            <span className="w-1 h-1 rounded-full bg-border-dark" />

            <span className="text-xs text-ink-muted">
              {filteredNotifications.length} shown
            </span>
          </div>

          {unreadCount > 0 && (
            <span
              className="
                inline-flex
                items-center
                gap-2
                text-[10px]
                uppercase
                tracking-[0.14em]
                font-semibold
                text-amber-dark
              "
            >
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-amber
                  animate-pulse
                "
              />

              {unreadCount} unread
            </span>
          )}
        </div>

        {/* ==================================================
            NOTIFICATION LIST
        ================================================== */}

        {filteredNotifications.length > 0 ? (
          <div className="grid gap-3">
            {filteredNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDelete={deleteNotification}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* ==================================================
             EMPTY STATE
          ================================================== */

          <div
            className="
              relative
              overflow-hidden
              bg-white
              border
              border-border
              rounded-[2rem]
              px-6
              py-20
              sm:py-28
              text-center
              shadow-sm
            "
          >
            {/* TOP ACCENT */}

            <div
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-amber/60
                to-transparent
              "
            />

            {/* ICON */}

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-cream
                flex
                items-center
                justify-center
              "
            >
              <Bell size={25} className="text-ink-muted" />
            </div>

            {/* LABEL */}

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-forest
                font-semibold
                mt-7
              "
            >
              Nothing new
            </p>

            {/* TITLE */}

            <h2
              className="
                font-display
                text-3xl
                sm:text-4xl
                mt-3
              "
            >
              You're all caught up.
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                text-sm
                text-ink-soft
                max-w-md
                mx-auto
                mt-3
              "
            >
              There are no notifications in this category
              right now.
            </p>

            {/* EXPLORE BUTTON */}

            <Link
              to="/explore"
              className="
                inline-flex
                items-center
                justify-center
                mt-7
                px-6
                py-3
                rounded-full
                bg-ink
                text-cream
                text-sm
                font-medium
                hover:bg-amber-dark
                transition-colors
              "
            >
              Explore crafts
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
