import api from './api';

// ==============================
// 1. ORDERS APIS
// ==============================
export const fetchOrders = async (params = {}) => {
  const response = await api.get('/orders/', { params });
  return response.data;
};

export const fetchOrderDetails = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const updateOrderStatus = async (id, data) => {
  const response = await api.patch(`/orders/${id}/status/`, data);
  return response.data;
};

export const uploadOrderDesign = async (id, { design_file_url, design_notes }) => {
  const response = await api.post(`/orders/${id}/design-upload/`, {
    design_file_url,
    design_notes,
  });
  return response.data;
};

export const reviewOrderDesign = async (id, { action, feedback }) => {
  const response = await api.post(`/orders/${id}/design-review/`, {
    action,
    feedback,
  });
  return response.data;
};

export const cancelOrder = async (id, reason) => {
  const response = await api.post(`/orders/${id}/cancel/`, { reason });
  return response.data;
};

// ==============================
// 2. REVIEWS APIS
// ==============================
export const fetchReviews = async (params = {}) => {
  const response = await api.get('/reviews/', { params });
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews/', reviewData);
  return response.data;
};

export const fetchOrderReview = async (orderId) => {
  const response = await api.get(`/reviews/order/${orderId}/`);
  return response.data;
};

export const fetchCreatorReviewSummary = async (creatorId) => {
  const response = await api.get(`/reviews/creator/${creatorId}/summary/`);
  return response.data;
};

// ==============================
// 3. NOTIFICATIONS APIS
// ==============================
export const fetchNotifications = async (params = {}) => {
  const response = await api.get('/notifications/', { params });
  return response.data;
};

export const fetchUnreadNotificationCount = async () => {
  const response = await api.get('/notifications/unread-count/');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.post(`/notifications/${id}/read/`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post('/notifications/mark-all-read/');
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}/`);
  return response.data;
};

// ==============================
// 4. COMPLAINTS APIS
// ==============================
export const fetchComplaints = async (params = {}) => {
  const response = await api.get('/complaints/', { params });
  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await api.post('/complaints/', complaintData);
  return response.data;
};

export const fetchComplaintDetails = async (id) => {
  const response = await api.get(`/complaints/${id}/`);
  return response.data;
};

export const updateComplaint = async (id, data) => {
  const response = await api.patch(`/complaints/${id}/`, data);
  return response.data;
};

export const resolveComplaint = async (id, { resolution_notes, status = 'Resolved' }) => {
  const response = await api.post(`/complaints/${id}/resolve/`, {
    resolution_notes,
    status,
  });
  return response.data;
};

export const fetchComplaintStatistics = async () => {
  const response = await api.get('/complaints/statistics/');
  return response.data;
};

// ==============================
// 5. ADMIN PLATFORM APIS
// ==============================
export const fetchAdminStatistics = async () => {
  const response = await api.get('/admin/statistics/');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await api.get('/admin/users/');
  return response.data;
};

export const updateAdminUser = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/`, data);
  return response.data;
};

export const fetchAdminCreators = async () => {
  const response = await api.get('/admin/creators/');
  return response.data;
};

export const verifyAdminCreator = async (id, is_verified) => {
  const response = await api.patch(`/admin/creators/${id}/verify/`, { is_verified });
  return response.data;
};

export const fetchAdminOrders = async () => {
  const response = await api.get('/admin/orders/');
  return response.data;
};

export const fetchAdminRequirements = async () => {
  const response = await api.get('/admin/requirements/');
  return response.data;
};

export const fetchAdminQuotations = async () => {
  const response = await api.get('/admin/quotations/');
  return response.data;
};

export const fetchAdminComplaints = async () => {
  const response = await api.get('/admin/complaints/');
  return response.data;
};

export const fetchAdminReviews = async () => {
  const response = await api.get('/admin/reviews/');
  return response.data;
};

export const deleteAdminReview = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}/`);
  return response.data;
};
