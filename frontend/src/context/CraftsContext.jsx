// src/context/CraftsContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { crafts as initialCrafts } from "../utils/mockData";

const CraftsContext = createContext(null);

const STORAGE_KEY = "craftconnect_crafts";

export function CraftsProvider({ children }) {
  const [crafts, setCrafts] = useState(() => {
    try {
      const savedCrafts = localStorage.getItem(STORAGE_KEY);

      if (savedCrafts) {
        const parsedCrafts = JSON.parse(savedCrafts);

        if (Array.isArray(parsedCrafts) && parsedCrafts.length > 0) {
          return parsedCrafts.map(normalizeCraft);
        }
      }
    } catch (error) {
      console.error("Could not load crafts:", error);
    }

    return initialCrafts.map(normalizeCraft);
  });

  // ======================================================
  // NORMALIZE CRAFT
  // ======================================================

  function normalizeCraft(craft) {
    return {
      ...craft,

      price: Number(craft.price) || 0,

      // IMPORTANT:
      // If stock is missing, use 10 instead of 0.
      stock:
        craft.stock !== undefined &&
        craft.stock !== null &&
        craft.stock !== ""
          ? Math.max(0, Number(craft.stock))
          : 10,

      rating: Number(craft.rating) || 5,

      reviews: Number(craft.reviews) || 0,

      tag: craft.tag || "New",

      materials:
        craft.materials ||
        "Hand-selected quality materials",
    };
  }

  // ======================================================
  // SAVE CRAFTS
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(crafts)
      );
    } catch (error) {
      console.error("Could not save crafts:", error);
    }
  }, [crafts]);

  // ======================================================
  // ADD CRAFT
  // ======================================================

  function addCraft(craftData) {
    const newCraft = normalizeCraft({
      ...craftData,

      id:
        craftData.id ||
        `craft-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      stock:
        craftData.stock !== undefined &&
        craftData.stock !== null &&
        craftData.stock !== ""
          ? craftData.stock
          : 10,
    });

    setCrafts((previousCrafts) => [
      newCraft,
      ...previousCrafts,
    ]);

    return newCraft;
  }

  // ======================================================
  // UPDATE CRAFT
  // ======================================================

  function updateCraft(craftId, updatedData) {
    setCrafts((previousCrafts) =>
      previousCrafts.map((craft) => {
        if (craft.id !== craftId) {
          return craft;
        }

        return normalizeCraft({
          ...craft,
          ...updatedData,
        });
      })
    );
  }

  // ======================================================
  // DELETE CRAFT
  // ======================================================

  function deleteCraft(craftId) {
    setCrafts((previousCrafts) =>
      previousCrafts.filter(
        (craft) => craft.id !== craftId
      )
    );
  }

  // ======================================================
  // GET CRAFT
  // ======================================================

  function getCraftById(craftId) {
    return crafts.find(
      (craft) => String(craft.id) === String(craftId)
    );
  }

  // ======================================================
  // REDUCE STOCK
  // ======================================================

  function reduceStock(craftId, quantity) {
    setCrafts((previousCrafts) =>
      previousCrafts.map((craft) =>
        String(craft.id) === String(craftId)
          ? {
              ...craft,
              stock: Math.max(
                0,
                Number(craft.stock || 0) -
                  Number(quantity || 0)
              ),
            }
          : craft
      )
    );
  }

  // ======================================================
  // RESET CRAFTS
  // ======================================================

  function resetCrafts() {
    const resetData = initialCrafts.map(normalizeCraft);

    setCrafts(resetData);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(resetData)
    );
  }

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    crafts,
    addCraft,
    updateCraft,
    deleteCraft,
    getCraftById,
    reduceStock,
    resetCrafts,
  };

  return (
    <CraftsContext.Provider value={value}>
      {children}
    </CraftsContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useCrafts() {
  const context = useContext(CraftsContext);

  if (!context) {
    throw new Error(
      "useCrafts must be used inside a CraftsProvider"
    );
  }

  return context;
}