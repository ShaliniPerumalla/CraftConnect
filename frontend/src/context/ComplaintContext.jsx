import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ComplaintContext = createContext(null);

const STORAGE_KEY = "craftconnect_complaints";

// ======================================================
// INITIAL COMPLAINTS
// ======================================================

const initialComplaints = [
  {
    id: "complaint-1",
    orderId: "ORD-1001",

    craftName: "Handmade Ceramic Vase",
    creator: "Ananya Ceramics",
    orderTotal: 1499,

    subject: "Order delivery delayed",
    description:
      "My order was expected to arrive yesterday, but I have not received it yet.",

    category: "Delivery",
    priority: "Medium",
    status: "Pending",

    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  },

  {
    id: "complaint-2",
    orderId: "ORD-1002",

    craftName: "Handcrafted Wooden Bowl",
    creator: "Arjun Woodworks",
    orderTotal: 1798,

    subject: "Product received damaged",
    description:
      "The handmade item arrived with visible damage to the packaging and product.",

    category: "Product",
    priority: "High",
    status: "In Review",

    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 60 * 60 * 1000,
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

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return initialComplaints;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return initialComplaints;
      }

      return parsed;
    } catch (error) {
      console.error(
        "Could not load complaints:",
        error
      );

      return initialComplaints;
    }
  });

  // ======================================================
  // SAVE TO LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(complaints)
      );
    } catch (error) {
      console.error(
        "Could not save complaints:",
        error
      );
    }
  }, [complaints]);

  // ======================================================
  // REFRESH TIME LABELS
  // ======================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setComplaints((current) =>
        current.map((complaint) => ({
          ...complaint,
          time: formatTime(complaint.createdAt),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // ADD COMPLAINT
  // ======================================================

  function addComplaint({
    orderId = "",
    craftName = "",
    creator = "",
    orderTotal = null,
    subject,
    description,
    category = "Other",
    priority = "Medium",
  }) {
    const now = Date.now();

    const newComplaint = {
      id: `complaint-${now}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      orderId: orderId.trim(),

      craftName: craftName.trim(),

      creator: creator.trim(),

      orderTotal,

      subject: subject.trim(),

      description: description.trim(),

      category,

      priority,

      status: "Pending",

      createdAt: now,

      updatedAt: now,

      time: "Just now",
    };

    setComplaints((current) => [
      newComplaint,
      ...current,
    ]);

    return newComplaint;
  }

  // ======================================================
  // UPDATE COMPLAINT STATUS
  // ======================================================

  function updateComplaintStatus(
    complaintId,
    status
  ) {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status,
              updatedAt: Date.now(),
            }
          : complaint
      )
    );
  }

  // ======================================================
  // DELETE COMPLAINT
  // ======================================================

  function deleteComplaint(complaintId) {
    setComplaints((current) =>
      current.filter(
        (complaint) =>
          complaint.id !== complaintId
      )
    );
  }

  // ======================================================
  // CLEAR ALL COMPLAINTS
  // ======================================================

  function clearComplaints() {
    setComplaints([]);
  }

  // ======================================================
  // RESET COMPLAINTS
  // ======================================================

  function resetComplaints() {
    setComplaints(
      initialComplaints.map((complaint) => ({
        ...complaint,
      }))
    );
  }

  // ======================================================
  // STATISTICS
  // ======================================================

  const statistics = useMemo(() => {
    return {
      total: complaints.length,

      pending: complaints.filter(
        (complaint) =>
          complaint.status === "Pending"
      ).length,

      inReview: complaints.filter(
        (complaint) =>
          complaint.status === "In Review"
      ).length,

      resolved: complaints.filter(
        (complaint) =>
          complaint.status === "Resolved"
      ).length,
    };
  }, [complaints]);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    complaints,
    statistics,

    addComplaint,
    updateComplaintStatus,
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

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useComplaints() {
  const context = useContext(ComplaintContext);

  if (!context) {
    throw new Error(
      "useComplaints must be used inside ComplaintProvider"
    );
  }

  return context;
}