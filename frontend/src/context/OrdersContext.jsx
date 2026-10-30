// src/context/OrdersContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const OrdersContext = createContext(null);

const STORAGE_KEY = "craftconnect_orders";

// ======================================================
// INITIAL DEMO ORDERS
// ======================================================

const initialOrders = [
  {
    id: "ORD-1001",
    customer: {
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
    },
    items: [
      {
        craftId: "p1",
        name: "Handcrafted Wooden Serving Board",
        quantity: 1,
        price: 699,
        creatorId: "c1",
      },
    ],
    total: 778,
    deliveryFee: 79,
    status: "Processing",
    paymentStatus: "Paid",
    date: "2026-08-14",
    address: {
      line1: "12 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
  },

  {
    id: "ORD-1002",
    customer: {
      name: "Ananya Reddy",
      email: "ananya@example.com",
      phone: "+91 91234 56789",
    },
    items: [
      {
        craftId: "p8",
        name: "Hand-Carved Wooden Bowl",
        quantity: 2,
        price: 799,
        creatorId: "c1",
      },
    ],
    total: 1677,
    deliveryFee: 79,
    status: "Pending",
    paymentStatus: "Paid",
    date: "2026-08-13",
    address: {
      line1: "45 Lake View Road",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
    },
  },
];

// ======================================================
// PROVIDER
// ======================================================

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          return parsedOrders;
        }
      }
    } catch (error) {
      console.error("Could not load orders:", error);
    }

    return initialOrders;
  });

  // ======================================================
  // SAVE ORDERS
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Could not save orders:", error);
    }
  }, [orders]);

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================

  function updateOrderStatus(orderId, status) {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  }

  // ======================================================
  // GET ORDER
  // ======================================================

  function getOrderById(orderId) {
    return orders.find(
      (order) => order.id === orderId
    );
  }

  // ======================================================
  // ADD ORDER
  // ======================================================

  function addOrder(orderData) {
    const newOrder = {
      ...orderData,
      id:
        orderData.id ||
        `ORD-${Date.now()}`,
      status: orderData.status || "Pending",
      paymentStatus:
        orderData.paymentStatus || "Paid",
      date:
        orderData.date ||
        new Date().toISOString().split("T")[0],
    };

    setOrders((previousOrders) => [
      newOrder,
      ...previousOrders,
    ]);

    return newOrder;
  }

  // ======================================================
  // DELETE ORDER
  // ======================================================

  function deleteOrder(orderId) {
    setOrders((previousOrders) =>
      previousOrders.filter(
        (order) => order.id !== orderId
      )
    );
  }

  // ======================================================
  // RESET ORDERS
  // ======================================================

  function resetOrders() {
    setOrders(initialOrders);
  }

  // ======================================================
  // CREATOR ORDERS
  // ======================================================

  function getCreatorOrders(creatorId) {
    return orders.filter((order) =>
      order.items?.some(
        (item) => item.creatorId === creatorId
      )
    );
  }

  // ======================================================
  // ORDER COUNTS
  // ======================================================

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === "Pending"
      ),
    [orders]
  );

  const processingOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === "Processing"
      ),
    [orders]
  );

  const completedOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === "Delivered"
      ),
    [orders]
  );

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    orders,

    addOrder,
    updateOrderStatus,
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

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside an OrdersProvider"
    );
  }

  return context;
}