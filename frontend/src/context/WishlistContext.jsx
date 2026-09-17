
// src/context/WishlistContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "craftconnect_wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "Could not load wishlist:",
        error
      );

      return [];
    }
  });

  // ======================================================
  // SAVE TO LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Could not save wishlist:",
        error
      );
    }
  }, [wishlist]);

  // ======================================================
  // CHECK IF CRAFT IS LIKED
  // ======================================================

  function isLiked(craftId) {
    return wishlist.some(
      (item) =>
        String(item.id) === String(craftId)
    );
  }

  // ======================================================
  // ADD TO WISHLIST
  // ======================================================

  function addToWishlist(craft) {
    if (!craft || craft.id == null) {
      return;
    }

    setWishlist((previousWishlist) => {

      const alreadyExists =
        previousWishlist.some(
          (item) =>
            String(item.id) ===
            String(craft.id)
        );

      if (alreadyExists) {
        return previousWishlist;
      }

      return [
        ...previousWishlist,
        craft,
      ];
    });
  }

  // ======================================================
  // REMOVE FROM WISHLIST
  // ======================================================

  function removeFromWishlist(craftId) {
    setWishlist((previousWishlist) =>
      previousWishlist.filter(
        (item) =>
          String(item.id) !==
          String(craftId)
      )
    );
  }

  // ======================================================
  // TOGGLE WISHLIST
  // ======================================================

  function toggleWishlist(craft) {
    if (!craft || craft.id == null) {
      return;
    }

    setWishlist((previousWishlist) => {

      const alreadyExists =
        previousWishlist.some(
          (item) =>
            String(item.id) ===
            String(craft.id)
        );

      if (alreadyExists) {
        return previousWishlist.filter(
          (item) =>
            String(item.id) !==
            String(craft.id)
        );
      }

      return [
        ...previousWishlist,
        craft,
      ];
    });
  }

  // ======================================================
  // CLEAR WISHLIST
  // ======================================================

  function clearWishlist() {
    setWishlist([]);
  }

  // ======================================================
  // CONTEXT
  // ======================================================

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,

        isLiked,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
}
