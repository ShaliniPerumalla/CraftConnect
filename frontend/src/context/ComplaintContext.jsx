import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  fetchComplaints as apiFetchComplaints,
  createComplaint as apiCreateComplaint,
  updateComplaint as apiUpdateComplaint,
  resolveComplaint as apiResolveComplaint,
  fetchComplaintStatistics as apiFetchComplaintStatistics,
} from "../services/member4Service";

const ComplaintContext = createContext(null);
const STORAGE_KEY = "craftconnect_complaints";

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

function normalizeComplaint(item) {
  const idStr = String(item.ticket_id || item.id || `complaint-${Date.now()}`);
  return {
    ...item,
    id: idStr,
    backendId: item.id,
    ticketId: item.ticket_id || idStr,
    orderId: item.order_number || (item.order ? (typeof item.order === 'object' ? item.order.order_number : String(item.order)) : item.orderId || "N/A"),
    craftName: item.craftName || "Custom Order Item",
    creator: item.creator || (item.order?.creator?.username) || "Maker Artisan",
    orderTotal: item.orderTotal || item.order?.total_amount || 0,
    subject: item.subject,
    description: item.description,
    category: item.category || "Other",
    priority: item.priority || "Medium",
    status: item.status || "Pending",
    adminNotes: item.admin_notes || item.adminNotes || "",
    resolutionNotes: item.resolution_notes || item.resolutionNotes || "",
    createdAt: item.created_at ? new Date(item.created_at).getTime() : item.createdAt || Date.now(),
    updatedAt: item.updated_at ? new Date(item.updated_at).getTime() : item.updatedAt || Date.now(),
    time: item.time || formatTime(item.created_at || item.createdAt),
  };
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeComplaint);
        }
      }
    } catch (e) {
      console.warn("Could not load cached complaints:", e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  // Load from real API
  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchComplaints();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeComplaint);
        setComplaints(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn("apiFetchComplaints failed, retaining cached data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error("Could not cache complaints:", e);
    }
  }, [complaints]);

  // Statistics
  const statistics = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const inReview = complaints.filter((c) => c.status === "In Review").length;
    const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;

    return { total, pending, inReview, resolved };
  }, [complaints]);

  // Add complaint
  async function addComplaint({
    orderId = "",
    craftName = "",
    creator = "",
    orderTotal = null,
    subject,
    description,
    category = "Other",
    priority = "Medium",
  }) {
    try {
      const created = await apiCreateComplaint({
        order_id: orderId || null,
        subject,
        description,
        category,
        priority,
      });
      const normalized = normalizeComplaint({
        ...created,
        craftName,
        creator,
        orderTotal,
      });
      setComplaints((current) => [normalized, ...current]);
      return normalized;
    } catch (err) {
      console.warn("apiCreateComplaint failed, saving locally:", err);
      const local = normalizeComplaint({
        id: `CMP-${Date.now().toString().slice(-6)}`,
        orderId,
        craftName,
        creator,
        orderTotal,
        subject,
        description,
        category,
        priority,
        status: "Pending",
      });
      setComplaints((current) => [local, ...current]);
      return local;
    }
  }

  // Update complaint status (Admin)
  async function updateComplaintStatus(complaintId, status) {
    const target = complaints.find((c) => c.id === String(complaintId) || c.ticketId === String(complaintId));
    const backendId = target?.backendId || target?.ticketId || complaintId;

    try {
      const updated = await apiUpdateComplaint(backendId, { status });
      const normalized = normalizeComplaint(updated);
      setComplaints((current) =>
        current.map((c) => (c.id === String(complaintId) ? normalized : c))
      );
    } catch (err) {
      console.warn("apiUpdateComplaint failed, updating locally:", err);
      setComplaints((current) =>
        current.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status, updatedAt: Date.now() }
            : complaint
        )
      );
    }
  }

  // Resolve complaint (Admin)
  async function resolveComplaint(complaintId, { resolution_notes, status = "Resolved" }) {
    const target = complaints.find((c) => c.id === String(complaintId) || c.ticketId === String(complaintId));
    const backendId = target?.backendId || target?.ticketId || complaintId;

    try {
      const updated = await apiResolveComplaint(backendId, { resolution_notes, status });
      const normalized = normalizeComplaint(updated);
      setComplaints((current) =>
        current.map((c) => (c.id === String(complaintId) ? normalized : c))
      );
      return normalized;
    } catch (err) {
      console.warn("apiResolveComplaint failed, updating locally:", err);
      setComplaints((current) =>
        current.map((c) =>
          c.id === String(complaintId)
            ? { ...c, status, resolutionNotes: resolution_notes, updatedAt: Date.now() }
            : c
        )
      );
    }
  }

  function deleteComplaint(complaintId) {
    setComplaints((current) =>
      current.filter((c) => c.id !== String(complaintId))
    );
  }

  function clearComplaints() {
    setComplaints([]);
  }

  function resetComplaints() {
    loadComplaints();
  }

  const value = {
    complaints,
    statistics,
    loading,
    refreshComplaints: loadComplaints,

    addComplaint,
    updateComplaintStatus,
    resolveComplaint,
    deleteComplaint,
    clearComplaints,
    resetComplaints,
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaints must be used inside ComplaintProvider");
  }
  return context;
}