// src/services/marketplaceService.js

import api from "./api";

/**
 * =========================================================================
 * CATEGORIES
 * =========================================================================
 */

export async function fetchCategories() {
  try {
    const response = await api.get("/marketplace/categories/");
    return response.data?.results || response.data || [];
  } catch (error) {
    console.warn("Error fetching categories from API, using fallback:", error);
    throw error;
  }
}

export async function fetchCategoryById(idOrSlug) {
  const response = await api.get(`/marketplace/categories/${idOrSlug}/`);
  return response.data;
}

/**
 * =========================================================================
 * CREATORS
 * =========================================================================
 */

export async function fetchCreators(params = {}) {
  try {
    const response = await api.get("/marketplace/creators/", { params });
    return response.data?.results || response.data || [];
  } catch (error) {
    console.warn("Error fetching creators from API, using fallback:", error);
    throw error;
  }
}

export async function fetchCreatorById(id) {
  try {
    const response = await api.get(`/marketplace/creators/${id}/`);
    return response.data;
  } catch (error) {
    console.warn(`Error fetching creator ${id} from API:`, error);
    throw error;
  }
}

export async function fetchCurrentCreatorProfile() {
  try {
    const response = await api.get("/marketplace/creator-profile/me/");
    return response.data;
  } catch (error) {
    console.warn("Error fetching current creator profile:", error);
    throw error;
  }
}

export async function updateCreatorProfile(profileData) {
  const response = await api.patch("/marketplace/creator-profile/me/", profileData);
  return response.data;
}

/**
 * =========================================================================
 * PRODUCTS / CRAFTS
 * =========================================================================
 */

export async function fetchProducts(params = {}) {
  try {
    const response = await api.get("/marketplace/products/", { params });
    return response.data?.results || response.data || [];
  } catch (error) {
    console.warn("Error fetching products from API, using fallback:", error);
    throw error;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await api.get(`/marketplace/products/${id}/`);
    return response.data;
  } catch (error) {
    console.warn(`Error fetching product ${id}:`, error);
    throw error;
  }
}

export async function createProduct(productData) {
  const response = await api.post("/marketplace/products/", productData);
  return response.data;
}

export async function updateProduct(id, productData) {
  const response = await api.patch(`/marketplace/products/${id}/`, productData);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/marketplace/products/${id}/`);
  return response.data;
}

export async function fetchMyProducts() {
  try {
    const response = await api.get("/marketplace/creator/my-products/");
    return response.data?.results || response.data || [];
  } catch (error) {
    console.warn("Error fetching creator products:", error);
    throw error;
  }
}

/**
 * =========================================================================
 * IMAGES / CLOUDINARY UPLOAD
 * =========================================================================
 */

export async function uploadMarketplaceImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/marketplace/upload-image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
