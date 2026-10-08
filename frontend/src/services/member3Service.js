import api from './api';

// ==============================
// 1. REQUIREMENTS APIS
// ==============================
export const fetchRequirements = async (params = {}) => {
  const response = await api.get('/requirements/', { params });
  return response.data;
};

export const createRequirement = async (requirementData) => {
  const response = await api.post('/requirements/', requirementData);
  return response.data;
};

export const fetchRequirementDetails = async (id) => {
  const response = await api.get(`/requirements/${id}/`);
  return response.data;
};

export const updateRequirement = async (id, data) => {
  const response = await api.patch(`/requirements/${id}/`, data);
  return response.data;
};

export const cancelRequirement = async (id) => {
  const response = await api.delete(`/requirements/${id}/`);
  return response.data;
};

// ==============================
// 2. QUOTATIONS APIS
// ==============================
export const fetchMyQuotations = async (params = { role: 'creator' }) => {
  const response = await api.get('/quotations/', { params });
  return response.data;
};

export const submitQuotation = async (quotationData) => {
  const response = await api.post('/quotations/', quotationData);
  return response.data;
};

export const updateQuotation = async (quotationId, quotationData) => {
  const response = await api.patch(`/quotations/${quotationId}/`, quotationData);
  return response.data;
};

export const fetchQuotationsForRequirement = async (requirementId) => {
  const response = await api.get(`/quotations/requirement/${requirementId}/`);
  return response.data;
};

export const decideQuotation = async (quotationId, action) => {
  // action: 'accept' or 'reject'
  const response = await api.post(`/quotations/${quotationId}/${action}/`);
  return response.data;
};

// ==============================
// 3. COMMUNICATION / CHAT APIS
// ==============================
export const fetchConversations = async () => {
  const response = await api.get('/communication/conversations/');
  return response.data;
};

export const startConversation = async (participantData) => {
  const response = await api.post('/communication/conversations/', participantData);
  return response.data;
};

export const fetchMessages = async (conversationId) => {
  const response = await api.get(`/communication/conversations/${conversationId}/messages/`);
  return response.data;
};

export const sendMessage = async (conversationId, messageData) => {
  const response = await api.post(`/communication/conversations/${conversationId}/messages/`, messageData);
  return response.data;
};

export const markMessagesAsRead = async (conversationId) => {
  const response = await api.post(`/communication/conversations/${conversationId}/read/`);
  return response.data;
};