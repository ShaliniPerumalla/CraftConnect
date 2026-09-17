import {
  Bell,
  CheckCheck,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import NotificationItem from "./NotificationItem";

import { useNotifications } from "../../context/NotificationContext";

export default function NotificationDropdown({
  onClose,
}) {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  const recentNotifications =
    notifications.slice(0, 4);

  function handleViewAll() {
    onClose?.();
    navigate("/notifications");
  }

  return (
    <div
      className="
        absolute
        right-0
        top-14
        w-[390px]
        max-w-[calc(100vw-1.5rem)]
        bg-card
        border
        border-border
        rounded-3xl
        shadow-[0_25px_80px_rgba(33,30,27,0.15)]
        overflow-hidden
        z-[100]
        animate-dropdown
      "
    >

      {/* HEADER */}

      <div className="relative px-5 py-5 border-b border-border">

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/60 to-transparent" />

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center">
              <Bell
                size={18}
                className="text-amber-dark"
              />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-forest font-semibold">
                CraftConnect
              </p>

              <h3 className="font-display text-xl text-ink">
                Notifications
              </h3>

            </div>

          </div>

          {unreadCount > 0 && (
            <div className="text-right">

              <p className="text-xl font-semibold text-ink">
                {unreadCount}
              </p>

              <p className="text-[9px] uppercase tracking-wider text-ink-muted">
                unread
              </p>

            </div>
          )}

        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="
              mt-4
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              uppercase
              tracking-[0.12em]
              font-semibold
              text-amber-dark
              hover:text-amber
            "
          >
            <CheckCheck size={13} />
            Mark all as read
          </button>
        )}

      </div>

      {/* LIST */}

      {recentNotifications.length > 0 ? (
        <div className="max-h-[410px] overflow-y-auto p-3 space-y-2">

          {recentNotifications.map(
            (notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDelete={deleteNotification}
                compact
                index={index}
              />
            )
          )}

        </div>
      ) : (

        <div className="px-6 py-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-cream flex items-center justify-center">
            <Bell
              size={22}
              className="text-ink-muted"
            />
          </div>

          <h4 className="font-display text-xl mt-5">
            You're all caught up
          </h4>

          <p className="text-xs text-ink-soft mt-2">
            New updates will appear here.
          </p>

        </div>
      )}

      {/* FOOTER */}

      <div className="border-t border-border p-3">

        <button
          type="button"
          onClick={handleViewAll}
          className="
            group
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-2xl
            bg-ink
            text-cream
            text-xs
            font-medium
            transition-all
            hover:bg-amber-dark
          "
        >
          View all notifications

          <ArrowRight
            size={14}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />

        </button>

      </div>

    </div>
  );
}