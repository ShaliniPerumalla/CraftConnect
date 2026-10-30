import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const NotificationContext = createContext(null);

const STORAGE_KEY = "craftconnect_notifications";

// ======================================================
// SAMPLE NOTIFICATIONS
// ======================================================

const initialNotifications = [
  {
    id: "notification-1",
    type: "quotation",
    title: "New quotation received",
    message:
      "Anu Crafts has sent you a quotation for your custom jewelry requirement.",
    time: "Just now",
    read: false,
    createdAt: Date.now(),
  },

  {
    id: "notification-2",
    type: "design",
    title: "Creator uploaded a design",
    message:
      "Anu Crafts has uploaded a new design for your custom order. Check it and share your feedback.",
    time: "10 min ago",
    read: false,
    createdAt: Date.now() - 10 * 60 * 1000,
  },

  {
    id: "notification-3",
    type: "production",
    title: "Your order entered production",
    message:
      "Your custom order has been approved and is now being prepared by the creator.",
    time: "1 hour ago",
    read: false,
    createdAt: Date.now() - 60 * 60 * 1000,
  },

  {
    id: "notification-4",
    type: "delivery",
    title: "Order ready for delivery",
    message:
      "Your custom order is ready for delivery. You can now track its delivery status.",
    time: "3 hours ago",
    read: false,
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
  },

  {
    id: "notification-5",
    type: "delivered",
    title: "Order delivered",
    message:
      "Your custom order has been successfully delivered. Don't forget to share your experience with the creator.",
    time: "Yesterday",
    read: false,
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
  },
];

// ======================================================
// TIME FORMATTER
// ======================================================

function formatTime(timestamp) {
  const difference = Date.now() - timestamp;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  return `${days} days ago`;
}

// ======================================================
// PROVIDER
// ======================================================

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      // No saved notifications → use sample data
      if (!saved) {
        return initialNotifications;
      }

      const parsed = JSON.parse(saved);

      // Invalid saved data → use sample data
      if (!Array.isArray(parsed)) {
        return initialNotifications;
      }

      return parsed;
    } catch (error) {
      console.error(
        "Could not load notifications:",
        error
      );

      return initialNotifications;
    }
  });

  // ======================================================
  // SAVE TO LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error(
        "Could not save notifications:",
        error
      );
    }
  }, [notifications]);

  // ======================================================
  // UNREAD COUNT
  // ======================================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  // ======================================================
// MARK AS READ
// ======================================================

function markAsRead(notificationId) {
  setNotifications((current) =>
    current.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            read: true,
          }
        : notification
    )
  );
}

// ======================================================
// MARK ALL AS READ
// ======================================================

function markAllAsRead() {
  setNotifications((current) =>
    current.map((notification) => ({
      ...notification,
      read: true,
    }))
  );
}

  // ======================================================
  // ADD NOTIFICATION
  // ======================================================

  function addNotification({
    type = "system",
    title,
    message,
  }) {
    const createdAt = Date.now();

    const newNotification = {
      id: `notification-${createdAt}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      type,

      title,

      message,

      time: "Just now",

      // New notifications are unread
      read: false,

      createdAt,
    };

    setNotifications((current) => [
      newNotification,
      ...current,
    ]);

    return newNotification;
  }

  // ======================================================
  // DELETE NOTIFICATION
  // ======================================================

  function deleteNotification(notificationId) {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  }

  // ======================================================
  // CLEAR ALL NOTIFICATIONS
  // ======================================================

  function clearNotifications() {
    setNotifications([]);
  }

  // ======================================================
  // RESET NOTIFICATIONS
  // ======================================================

  function resetNotifications() {
    setNotifications(
      initialNotifications.map((notification) => ({
        ...notification,
      }))
    );
  }

  // ======================================================
  // REFRESH TIME LABELS
  // ======================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          time: formatTime(notification.createdAt),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    notifications,
    unreadCount,

    addNotification,
    markAsRead,
    markAllAsRead,

    deleteNotification,
    clearNotifications,
    resetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}