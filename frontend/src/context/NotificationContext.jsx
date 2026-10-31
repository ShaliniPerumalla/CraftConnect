import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  fetchNotifications as apiFetchNotifications,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
  deleteNotification as apiDeleteNotification,
} from "../services/member4Service";

const NotificationContext = createContext(null);
const STORAGE_KEY = "craftconnect_notifications";

function formatTime(timestamp) {
  if (!timestamp) return "Just now";
  const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;
  const diff = Date.now() - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function normalizeNotification(item) {
  return {
    ...item,
    id: String(item.id),
    type: item.notification_type || item.type || "general",
    title: item.title,
    message: item.message,
    read: Boolean(item.is_read !== undefined ? item.is_read : item.read),
    time: item.time || formatTime(item.created_at || item.createdAt),
    createdAt: item.created_at ? new Date(item.created_at).getTime() : item.createdAt || Date.now(),
    link: item.link || "",
  };
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeNotification);
        }
      }
    } catch (e) {
      console.warn("Could not load cached notifications:", e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  // Load from backend
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchNotifications();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeNotification);
        setNotifications(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn("apiFetchNotifications failed, using local notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error("Could not cache notifications:", e);
    }
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  async function markAsRead(notificationId) {
    // Optimistic UI update
    setNotifications((current) =>
      current.map((n) => (n.id === String(notificationId) ? { ...n, read: true } : n))
    );

    try {
      if (String(notificationId).match(/^\d+$/)) {
        await apiMarkNotificationRead(notificationId);
      }
    } catch (err) {
      console.warn("apiMarkNotificationRead failed:", err);
    }
  }

  async function markAllAsRead() {
    setNotifications((current) =>
      current.map((n) => ({ ...n, read: true }))
    );

    try {
      await apiMarkAllNotificationsRead();
    } catch (err) {
      console.warn("apiMarkAllNotificationsRead failed:", err);
    }
  }

  function addNotification({ type = "system", title, message, link = "" }) {
    const createdAt = Date.now();
    const newNotification = {
      id: `notification-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      message,
      time: "Just now",
      read: false,
      createdAt,
      link,
    };

    setNotifications((current) => [newNotification, ...current]);
    return newNotification;
  }

  async function deleteNotification(notificationId) {
    setNotifications((current) =>
      current.filter((n) => n.id !== String(notificationId))
    );

    try {
      if (String(notificationId).match(/^\d+$/)) {
        await apiDeleteNotification(notificationId);
      }
    } catch (err) {
      console.warn("apiDeleteNotification failed:", err);
    }
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function resetNotifications() {
    loadNotifications();
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshNotifications: loadNotifications,

    markAsRead,
    markAllAsRead,
    addNotification,
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

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
}