// src/context/CraftsContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  crafts as initialCrafts,
  categories as initialCategories,
  creators as initialCreators,
} from "../utils/mockData";

import {
  fetchProducts,
  fetchCategories,
  fetchCreators,
  createProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "../services/marketplaceService";

const CraftsContext = createContext(null);

const STORAGE_KEY = "craftconnect_crafts";
const CATEGORIES_KEY = "craftconnect_categories";
const CREATORS_KEY = "craftconnect_creators";

export function CraftsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. CRAFTS
  const [crafts, setCrafts] = useState(() => {
    try {
      const savedCrafts = localStorage.getItem(STORAGE_KEY);
      if (savedCrafts) {
        const parsedCrafts = JSON.parse(savedCrafts);
        if (Array.isArray(parsedCrafts) && parsedCrafts.length > 0) {
          return parsedCrafts.map(normalizeCraft);
        }
      }
    } catch (err) {
      console.error("Could not load crafts from storage:", err);
    }
    return initialCrafts.map(normalizeCraft);
  });

  // 2. CATEGORIES
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialCategories;
  });

  // 3. CREATORS
  const [creators, setCreators] = useState(() => {
    try {
      const saved = localStorage.getItem(CREATORS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialCreators;
  });

  // ======================================================
  // NORMALIZE CRAFT
  // ======================================================

  function normalizeCraft(craft) {
    return {
      ...craft,
      id: craft.id !== undefined ? String(craft.id) : `craft-${Date.now()}`,
      name: craft.name || craft.title || "Untitled Craft",
      creator: craft.creator || craft.creator_name || "Independent Creator",
      creatorId: craft.creatorId || craft.creator_id || (craft.creator_details?.id ? String(craft.creator_details.id) : "c1"),
      price: Number(craft.price) || 0,
      stock:
        craft.stock !== undefined && craft.stock !== null && craft.stock !== ""
          ? Math.max(0, Number(craft.stock))
          : 10,
      rating: Number(craft.rating) || 5,
      reviews: Number(craft.reviews || craft.reviews_count) || 0,
      category: craft.category || craft.category_slug || "woodwork",
      tag: craft.tag || "New",
      materials: craft.materials || "Hand-selected quality materials",
      image: craft.image || craft.image_url || "/botanical-wall-art.jpg",
      description: craft.description || "",
    };
  }

  // ======================================================
  // NORMALIZE CREATOR
  // ======================================================

  function normalizeCreator(c) {
    return {
      ...c,
      id: String(c.id),
      name: c.name || "Independent Creator",
      specialty: c.specialty || "Custom handmade crafts",
      location: c.location || "Local Workshop",
      avatar: c.avatar || "https://i.pravatar.cc/150?img=32",
      cover: c.cover || "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80",
      rating: Number(c.rating) || 5.0,
      products: Number(c.products || c.products_count) || 0,
      bio: c.bio || "",
      skills: c.skills || "",
    };
  }

  // ======================================================
  // SYNC WITH BACKEND API
  // ======================================================

  const loadBackendData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products, categories, creators concurrently
      const [backendProducts, backendCategories, backendCreators] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
        fetchCreators(),
      ]);

      if (backendProducts.status === "fulfilled" && Array.isArray(backendProducts.value) && backendProducts.value.length > 0) {
        const normalized = backendProducts.value.map(normalizeCraft);
        setCrafts(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }

      if (backendCategories.status === "fulfilled" && Array.isArray(backendCategories.value) && backendCategories.value.length > 0) {
        const cats = backendCategories.value.map((c) => ({
          id: c.slug || String(c.id),
          name: c.name,
          icon: c.icon || "Package",
          count: c.count || c.pieces_count || 0,
          description: c.description,
          image_url: c.image_url,
        }));
        setCategories(cats);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
      }

      if (backendCreators.status === "fulfilled" && Array.isArray(backendCreators.value) && backendCreators.value.length > 0) {
        const crs = backendCreators.value.map(normalizeCreator);
        setCreators(crs);
        localStorage.setItem(CREATORS_KEY, JSON.stringify(crs));
      }

      setError(null);
    } catch (err) {
      console.warn("Could not sync with backend API:", err);
      setError("Unable to sync with live database. Operating with cached data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  // Persist crafts locally whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crafts));
    } catch (err) {
      console.error("Could not save crafts:", err);
    }
  }, [crafts]);

  // ======================================================
  // ADD CRAFT (API + Local sync)
  // ======================================================

  async function addCraft(craftData) {
    let newCraft = null;

    try {
      // Attempt backend API create
      const apiResponse = await createProduct({
        name: craftData.name,
        description: craftData.description || "",
        price: Number(craftData.price),
        stock: Number(craftData.stock ?? 10),
        materials: craftData.materials || "",
        category: craftData.category,
        tag: craftData.tag || "New",
        image: craftData.image || "",
      });

      newCraft = normalizeCraft(apiResponse);
    } catch (apiError) {
      console.warn("Backend product creation unavailable, falling back to local creation:", apiError);
      newCraft = normalizeCraft({
        ...craftData,
        id: craftData.id || `craft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      });
    }

    setCrafts((previousCrafts) => [newCraft, ...previousCrafts]);
    return newCraft;
  }

  // ======================================================
  // UPDATE CRAFT (API + Local sync)
  // ======================================================

  async function updateCraft(craftId, updatedData) {
    try {
      if (!String(craftId).startsWith("craft-") && !String(craftId).startsWith("p")) {
        await apiUpdateProduct(craftId, {
          name: updatedData.name,
          description: updatedData.description,
          price: updatedData.price !== undefined ? Number(updatedData.price) : undefined,
          stock: updatedData.stock !== undefined ? Number(updatedData.stock) : undefined,
          materials: updatedData.materials,
          category: updatedData.category,
          tag: updatedData.tag,
          image: updatedData.image,
        });
      }
    } catch (err) {
      console.warn("Backend update failed, applying locally:", err);
    }

    setCrafts((previousCrafts) =>
      previousCrafts.map((craft) => {
        if (String(craft.id) !== String(craftId)) {
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
  // DELETE CRAFT (API + Local sync)
  // ======================================================

  async function deleteCraft(craftId) {
    try {
      if (!String(craftId).startsWith("craft-") && !String(craftId).startsWith("p")) {
        await apiDeleteProduct(craftId);
      }
    } catch (err) {
      console.warn("Backend delete failed, removing locally:", err);
    }

    setCrafts((previousCrafts) =>
      previousCrafts.filter((craft) => String(craft.id) !== String(craftId))
    );
  }

  // ======================================================
  // GET CRAFT BY ID
  // ======================================================

  function getCraftById(craftId) {
    return crafts.find((craft) => String(craft.id) === String(craftId));
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
              stock: Math.max(0, Number(craft.stock || 0) - Number(quantity || 0)),
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    loadBackendData();
  }

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    crafts,
    categories,
    creators,
    loading,
    error,
    addCraft,
    updateCraft,
    deleteCraft,
    getCraftById,
    reduceStock,
    resetCrafts,
    refreshCrafts: loadBackendData,
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
    throw new Error("useCrafts must be used inside a CraftsProvider");
  }

  return context;
}