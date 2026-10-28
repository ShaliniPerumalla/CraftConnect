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
  createRequirement: (data) =>
    apiClient.post('requirements/', {
      title: data.title,
      description: data.description,
      category: data.category,
      budget: data.budget,
      deadline: data.deadline,
    }),
};

// --- Quotations Module ---
export const quotationService = {
  getQuotations: () => apiClient.get('quotations/'),
  getQuotationsForRequirement: (reqId) => apiClient.get(`quotations/requirement/${reqId}/`),
  submitQuotation: (data) =>
    apiClient.post('quotations/', {
      requirement: data.requirement,
      price: data.price,
      estimated_delivery_date: data.estimated_delivery_date,
      description: data.description,
    }),
  updateQuotationStatus: (id, action) => apiClient.post(`quotations/${id}/${action}/`),
};

// --- Communication Module ---
export const communicationService = {
  getConversations: () => apiClient.get('communication/conversations/'),
  getMessages: (conversationId) => apiClient.get(`communication/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, bodyText) =>
    apiClient.post(`communication/conversations/${conversationId}/messages/`, { body: bodyText }),
  markAsRead: (conversationId) => apiClient.post(`communication/conversations/${conversationId}/read/`),
};