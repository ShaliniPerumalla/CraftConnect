import apiClient from './apiClient';

// --- Authentication Service ---
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// --- Requirements Module ---
export const requirementService = {
  getRequirements: () => apiClient.get('requirements/'),
  getRequirementById: (id) => apiClient.get(`requirements/${id}/`),
  createRequirement: (data) => apiClient.post('requirements/', data),
};

// --- Quotations Module ---
export const quotationService = {
  getQuotations: () => apiClient.get('quotations/'),
  getQuotationsForRequirement: (reqId) => apiClient.get(`quotations/requirement/${reqId}/`),
  submitQuotation: (data) => apiClient.post('quotations/', data),
  updateQuotationStatus: (id, status) => apiClient.patch(`quotations/${id}/`, { status }),
};

// --- Communication Module ---
export const communicationService = {
  getConversations: () => apiClient.get('communication/conversations/'),
  getMessages: (conversationId) => apiClient.get(`communication/messages/${conversationId}/`),
  sendMessage: (conversationId, content) => apiClient.post(`communication/messages/${conversationId}/`, { content }),
  markAsRead: (conversationId) => apiClient.post(`communication/messages/${conversationId}/read/`),
};