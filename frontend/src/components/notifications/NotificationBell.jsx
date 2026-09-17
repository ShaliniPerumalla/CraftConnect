import {
  Bell,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import NotificationDropdown from "./NotificationDropdown";

import { useNotifications } from "../../context/NotificationContext";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const {
    unreadCount,
  } = useNotifications();

  return (
    <div className="relative">

      {/* BELL */}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className={`
          relative
          w-10
          h-10
          rounded-full
          flex
          items-center
          justify-center
          transition-all
          duration-300
          ${
            open
              ? "bg-white text-amber-dark shadow-sm"
              : "text-ink-soft hover:bg-white hover:text-amber-dark"
          }
        `}
        aria-label="Notifications"
        title="Notifications"
      >

        <Bell
          size={19}
          strokeWidth={1.8}
          className={
            unreadCount > 0
              ? "animate-bell"
              : ""
          }
        />

        {/* BADGE */}

        {unreadCount > 0 && (
          <>
            <span
              className="
                absolute
                top-0
                right-0
                w-2
                h-2
                rounded-full
                bg-rose
                animate-ping
              "
            />

            <span
              className="
                absolute
                -top-1
                -right-1
                min-w-[18px]
                h-[18px]
                px-1
                rounded-full
                bg-rose
                text-white
                text-[9px]
                font-bold
                flex
                items-center
                justify-center
                border-2
                border-cream
              "
            >
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          </>
        )}

      </button>

      {/* DROPDOWN */}

      {open && (
        <NotificationDropdown
          onClose={() => setOpen(false)}
        />
      )}

    </div>
  );
}