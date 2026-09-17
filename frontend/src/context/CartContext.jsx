import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "craftconnect_cart";

export function CartProvider({ children }) {
  // ========================================
  // CART STATE
  // ========================================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // ========================================
  // SAVE CART TO LOCAL STORAGE
  // ========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  // ========================================
  // ADD TO CART
  // ========================================

  function addToCart(craft, quantity = 1) {
    if (!craft || !craft.id) {
      console.error("Invalid craft:", craft);
      return;
    }

    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.id === craft.id
      );

      // If product already exists
      if (existingItem) {
        return previousItems.map((item) =>
          item.id === craft.id
            ? {
                ...item,
                quantity: item.quantity + safeQuantity,
              }
            : item
        );
      }

      // Add new product
      return [
        ...previousItems,
        {
          ...craft,
          quantity: safeQuantity,
        },
      ];
    });
  }

  // ========================================
  // REMOVE FROM CART
  // ========================================

  function removeFromCart(craftId) {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== craftId)
    );
  }

  // ========================================
  // UPDATE QUANTITY
  // ========================================

  function updateQuantity(craftId, quantity) {
    const newQuantity = Number(quantity);

    if (!Number.isFinite(newQuantity) || newQuantity <= 0) {
      removeFromCart(craftId);
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === craftId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  }

  // ========================================
  // INCREASE QUANTITY
  // ========================================

  function increaseQuantity(craftId) {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === craftId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // ========================================
  // DECREASE QUANTITY
  // ========================================

  function decreaseQuantity(craftId) {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item.id === craftId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // ========================================
  // CLEAR CART
  // ========================================

  function clearCart() {
    setCartItems([]);
  }

  // ========================================
  // TOTAL NUMBER OF ITEMS
  // ========================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // ========================================
  // SUBTOTAL
  // ========================================

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // ========================================
  // DELIVERY FEE
  // ========================================

  const deliveryFee =
    subtotal === 0
      ? 0
      : subtotal >= 999
      ? 0
      : 79;

  // ========================================
  // FINAL TOTAL
  // ========================================

  const total = subtotal + deliveryFee;

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    cartItems,

    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,

    totalItems,
    subtotal,
    deliveryFee,
    total,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ========================================
// CUSTOM CART HOOK
// ========================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider."
    );
  }

  return context;
}