import {
  ShoppingBag,
  Sparkles,
  Heart,
  Palette,
  Bell,
  Check,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

const notificationIcons = {
  order: ShoppingBag,
  custom: Sparkles,
  craft: Palette,
  wishlist: Heart,
  system: Bell,
};

const notificationLabels = {
  order: "Order",
  custom: "Custom",
  craft: "Craft",
  wishlist: "Wishlist",
  system: "Update",
};

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
  compact = false,
  index = 0,
}) {
  const Icon =
    notificationIcons[notification.type] || Bell;

  const label =
    notificationLabels[notification.type] ||
    "Update";

  return (
    <article
      className={`
        group relative overflow-hidden
        border border-border
        bg-card
        transition-all duration-500
        hover:border-border-dark
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(33,30,27,0.07)]
        animate-notification-in
        ${compact
          ? "rounded-xl p-3"
          : "rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        }
        ${!notification.read
          ? "ring-1 ring-amber/10"
          : ""
        }
      `}
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >

      {/* TOP ACCENT */}

      {!notification.read && (
        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber to-transparent opacity-80" />
      )}

      <div className="flex gap-4">

        {/* ICON */}

        <div
          className={`
            shrink-0
            flex items-center justify-center
            rounded-2xl
            transition-transform duration-500
            group-hover:scale-105
            ${compact
              ? "w-10 h-10"
              : "w-12 h-12 sm:w-14 sm:h-14"
            }
            ${notification.read
              ? "bg-cream text-ink-soft"
              : "bg-amber-light/20 text-amber-dark"
            }
          `}
        >
          <Icon
            size={compact ? 17 : 20}
            strokeWidth={1.7}
          />
        </div>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          {/* META */}

          <div className="flex items-center gap-2 mb-1.5">

            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-forest">
              {label}
            </span>

            <span className="w-1 h-1 rounded-full bg-border-dark" />

            <span className="text-[10px] text-ink-muted">
              {notification.time}
            </span>

          </div>

          {/* TITLE */}

          <div className="flex items-start justify-between gap-4">

            <h3
              className={`
                leading-snug
                text-ink
                ${compact
                  ? "text-sm font-semibold"
                  : "text-base sm:text-lg font-semibold"
                }
              `}
            >
              {notification.title}
            </h3>

            {!compact && (
              <ArrowUpRight
                size={16}
                className="
                  shrink-0
                  text-ink-muted
                  opacity-0
                  translate-y-1
                  -translate-x-1
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  group-hover:translate-x-0
                  transition-all duration-300
                "
              />
            )}

          </div>

          {/* MESSAGE */}

          <p
            className={`
              text-ink-soft
              leading-relaxed
              ${compact
                ? "text-xs mt-1 line-clamp-2"
                : "text-sm mt-2 max-w-2xl"
              }
            `}
          >
            {notification.message}
          </p>

          {/* ACTIONS */}

          <div
            className={`
              flex items-center gap-4
              ${compact ? "mt-2" : "mt-4"}
            `}
          >

            {!notification.read && (
              <button
                type="button"
                onClick={() =>
                  onRead(notification.id)
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  font-semibold
                  text-amber-dark
                  hover:text-amber
                  transition-colors
                "
              >
                <Check size={12} />
                Mark read
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onDelete(notification.id)
              }
              className="
                inline-flex
                items-center
                gap-1.5
                text-[10px]
                uppercase
                tracking-[0.12em]
                font-semibold
                text-ink-muted
                hover:text-rose
                transition-colors
              "
            >
              <Trash2 size={12} />
              Delete
            </button>

          </div>

        </div>

        {/* UNREAD DOT */}

        {!notification.read && (
          <span
            className="
              absolute
              right-4
              top-5
              w-2
              h-2
              rounded-full
              bg-amber
              animate-pulse
            "
          />
        )}

      </div>
    </article>
  );
}