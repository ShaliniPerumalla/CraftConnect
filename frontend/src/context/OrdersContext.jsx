// src/context/OrdersContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  fetchOrders as apiFetchOrders,
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  uploadOrderDesign as apiUploadOrderDesign,
  reviewOrderDesign as apiReviewOrderDesign,
  cancelOrder as apiCancelOrder,
} from "../services/member4Service";

const OrdersContext = createContext(null);
const STORAGE_KEY = "craftconnect_orders";

function mapStatusToTitle(status) {
  if (!status) return "Pending";
  const s = status.toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "design") return "Design Stage";
  if (s === "design_review") return "Design Review";
  if (s === "production") return "Processing";
  if (s === "ready_for_delivery") return "Ready for Delivery";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  return status;
}

function normalizeOrder(order) {
  if (!order) return null;
  const items = Array.isArray(order.items) ? order.items : [];
  const firstItem = items[0] || {};
  const idStr = String(order.id || order.order_number || Date.now());

  const creatorName =
    order.creator?.name ||
    order.creator?.username ||
    (typeof order.creator === "string" ? order.creator : "Independent Creator");

  const customerName =
    order.customer?.name ||
    order.customer?.username ||
    (typeof order.customer === "string" ? order.customer : "Customer");

  return {
    ...order,
    id: idStr,
    backendId: order.id,
    orderNumber: order.order_number || idStr,
    craftName: firstItem.title || order.craftName || "Custom Handcrafted Piece",
    image:
      firstItem.image_url ||
      order.image ||
      order.design_file_url ||
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&auto=format&fit=crop",
    creator: creatorName,
    creatorId: order.creator?.id || order.creatorId || "c1",
    customer: {
      id: order.customer?.id,
      name: customerName,
      email: order.customer?.email || "customer@makermatch.internal",
      phone: order.shipping_phone || "+91 98765 43210",
    },
    quantity: firstItem.quantity || order.quantity || 1,
    price: Number(firstItem.price || order.total_amount || order.price || 0),
    total: Number(order.total_amount || order.total || 0),
    deliveryFee: Number(order.delivery_fee || order.deliveryFee || 0),
    paymentStatus: order.payment_status || "Paid",
    date: order.created_at
      ? order.created_at.split("T")[0]
      : order.date || new Date().toISOString().split("T")[0],
    address: order.shipping_address
      ? `${order.shipping_address}, ${order.shipping_city || ""} ${order.shipping_state || ""}`.trim()
      : typeof order.address === "object"
      ? `${order.address?.line1 || ""}, ${order.address?.city || ""}`.trim()
      : order.address || "12 MG Road, Bengaluru, Karnataka",
    rawStatus: order.status || "pending",
    status: mapStatusToTitle(order.status),
    statusHistory: order.status_history || [],
  };
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeOrder);
        }
      }
    } catch (e) {
      console.warn("Could not load cached orders:", e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======================================================
  // LOAD ORDERS FROM REAL BACKEND API
  // ======================================================
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchOrders();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeOrder);
        setOrders(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn("API loadOrders failed, retaining local orders:", err);
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Sync to local storage
  useEffect(() => {
    try {
      if (orders.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      }
    } catch (err) {
      console.error("Could not cache orders:", err);
    }
  }, [orders]);

  // ======================================================
  // ADD ORDER
  // ======================================================
  async function addOrder(orderData) {
    try {
      const created = await apiCreateOrder({
        total_amount: orderData.total || orderData.price || 500,
        delivery_fee: orderData.deliveryFee || 0,
        status: orderData.status?.toLowerCase() || "pending",
        shipping_name: orderData.customer?.name || "Customer",
        shipping_address:
          typeof orderData.address === "string"
            ? orderData.address
            : orderData.address?.line1 || "Customer Address",
        items: orderData.items || [
          {
            title: orderData.craftName || "Handmade Craft",
            quantity: orderData.quantity || 1,
            price: orderData.price || orderData.total || 500,
            image_url: orderData.image || "",
          },
        ],
      });
      const normalized = normalizeOrder(created);
      setOrders((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      console.warn("Failed to create order on server, creating locally:", err);
      const localOrder = normalizeOrder({
        ...orderData,
        id: `ORD-${Date.now()}`,
        status: orderData.status || "Pending",
        total_amount: orderData.total || orderData.price || 0,
      });
      setOrders((prev) => [localOrder, ...prev]);
      return localOrder;
    }
  }

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================
  async function updateOrderStatus(orderId, newStatus, extraData = {}) {
    const target = orders.find((o) => o.id === String(orderId) || o.orderNumber === String(orderId));
    const backendId = target?.backendId || orderId;

    try {
      const updated = await apiUpdateOrderStatus(backendId, {
        status: newStatus.toLowerCase().replace(/ /g, "_"),
        ...extraData,
      });
      const normalized = normalizeOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === String(orderId) ? normalized : o))
      );
      return normalized;
    } catch (err) {
      console.warn("API updateOrderStatus failed, falling back to local state:", err);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === String(orderId)
            ? {
                ...order,
                status: mapStatusToTitle(newStatus),
                rawStatus: newStatus.toLowerCase(),
                ...extraData,
              }
            : order
        )
      );
    }
  }

  // ======================================================
  // UPLOAD DESIGN (Creator Stage)
  // ======================================================
  async function uploadDesign(orderId, { design_file_url, design_notes }) {
    const target = orders.find((o) => o.id === String(orderId) || o.orderNumber === String(orderId));
    const backendId = target?.backendId || orderId;

    try {
      const updated = await apiUploadOrderDesign(backendId, {
        design_file_url,
        design_notes,
      });
      const normalized = normalizeOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === String(orderId) ? normalized : o))
      );
      return normalized;
    } catch (err) {
      console.error("Failed to upload design to server:", err);
      throw err;
    }
  }

  // ======================================================
  // REVIEW DESIGN (Customer Stage)
  // ======================================================
  async function reviewDesign(orderId, { action, feedback }) {
    const target = orders.find((o) => o.id === String(orderId) || o.orderNumber === String(orderId));
    const backendId = target?.backendId || orderId;

    try {
      const updated = await apiReviewOrderDesign(backendId, { action, feedback });
      const normalized = normalizeOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === String(orderId) ? normalized : o))
      );
      return normalized;
    } catch (err) {
      console.error("Failed to submit design review to server:", err);
      throw err;
    }
  }

  // ======================================================
  // CANCEL ORDER
  // ======================================================
  async function cancelOrder(orderId, reason = "Cancelled by user") {
    const target = orders.find((o) => o.id === String(orderId) || o.orderNumber === String(orderId));
    const backendId = target?.backendId || orderId;

    try {
      const updated = await apiCancelOrder(backendId, reason);
      const normalized = normalizeOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === String(orderId) ? normalized : o))
      );
      return normalized;
    } catch (err) {
      console.warn("API cancelOrder failed, falling back to local state:", err);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === String(orderId)
            ? { ...order, status: "Cancelled", rawStatus: "cancelled" }
            : order
        )
      );
    }
  }

  function getOrderById(orderId) {
    if (!orderId) return null;
    const sId = String(orderId);
    return orders.find(
      (order) => order.id === sId || order.orderNumber === sId || order.backendId === Number(sId)
    );
  }

  function deleteOrder(orderId) {
    setOrders((prev) => prev.filter((order) => order.id !== String(orderId)));
  }

  function resetOrders() {
    loadOrders();
  }

  function getCreatorOrders(creatorId) {
    return orders.filter(
      (order) =>
        order.creatorId === creatorId ||
        order.items?.some((item) => item.creatorId === creatorId)
    );
  }

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.rawStatus === "pending" ||
          order.status === "Pending" ||
          order.status === "Design Stage" ||
          order.status === "Design Review"
      ),
    [orders]
  );

  const processingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.rawStatus === "production" ||
          order.rawStatus === "ready_for_delivery" ||
          order.status === "Processing" ||
          order.status === "Ready for Delivery"
      ),
    [orders]
  );

  const completedOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.rawStatus === "delivered" || order.status === "Delivered"
      ),
    [orders]
  );

  const value = {
    orders,
    loading,
    error,
    refreshOrders: loadOrders,

    addOrder,
    updateOrderStatus,
    uploadDesign,
    reviewDesign,
    cancelOrder,
    getOrderById,
    deleteOrder,
    resetOrders,
    getCreatorOrders,

    pendingOrders,
    processingOrders,
    completedOrders,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used inside an OrdersProvider");
  }
  return context;
}