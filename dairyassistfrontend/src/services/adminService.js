import api from './api';

export const adminService = {
  // --- Authentication ---
  adminLogin: async (credentials) => {
    const response = await api.post('/admin/auth/login', credentials);
    const data = response.data || response;
    const token = data.token || data;

    if (token && typeof token === 'string') {
      localStorage.setItem('adminToken', token);
      try {
        const profileRes = await api.get('/admin/auth/profile');
        const admin = profileRes.data || profileRes;
        if (admin) localStorage.setItem('admin', JSON.stringify(admin));
        return { token, admin };
      } catch (e) {
        console.warn('Login successful but profile fetch failed', e);
        return { token };
      }
    }
    throw new Error(response.message || 'Admin login failed');
  },

  adminLogout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  },

  getAdminProfile: async () => {
    const response = await api.get('/admin/auth/profile');
    return response.data || response;
  },

  isAdminAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // --- User Management ---
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data || response || [];
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data || response;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data || response;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status?status=${encodeURIComponent(status)}`);
    return response.data || response;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data || response;
  },

  // --- Product Management ---
  getAllProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data || response || [];
  },

  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data || response;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data || response;
  },

  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/products/upload-image', formData);
    return response.data || response; 
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data || response;
  },

  // --- Variant Management ---
  getProductVariants: async (productId) => {
    const response = await api.get(`/admin/products/${productId}/variants`);
    return response.data || response || [];
  },

  addVariant: async (productId, variantData) => {
    const response = await api.post(`/admin/products/${productId}/variants`, variantData);
    return response.data || response;
  },

  updateVariant: async (variantId, variantData) => {
    const response = await api.put(`/admin/products/variants/${variantId}`, variantData);
    return response.data || response;
  },

  deleteVariant: async (variantId) => {
    const response = await api.delete(`/admin/products/variants/${variantId}`);
    return response.data || response;
  },

  // --- Order Management ---
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data || response || []; // Ensures array is always returned
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/admin/orders/${id}/status?status=${encodeURIComponent(status)}`);
    return response.data || response;
  },

  // --- Delivery Management ---
  getAllDeliveries: async () => {
    const response = await api.get('/admin/deliveries');
    return response.data || response || [];
  },

  assignDriver: async (deliveryId, driverName, contactNumber) => {
    const response = await api.put(`/admin/deliveries/${deliveryId}/assign`, null, {
      params: { driverName, contactNumber }
    });
    return response.data || response;
  },

  updateDeliveryStatus: async (deliveryId, status) => {
    const response = await api.patch(`/admin/deliveries/${deliveryId}/status?status=${status}`);
    return response.data || response;
  },

  // --- Payment Management ---
  getAllPayments: async () => {
    const response = await api.get('/admin/payments');
    return response.data || response || [];
  },

  updatePaymentStatus: async (paymentId, status) => {
    const response = await api.patch(`/admin/payments/${paymentId}/status?status=${status}`);
    return response.data || response;
  },

  // --- Feed Management ---
  getFeedConfig: async () => {
    const response = await api.get('/admin/feed/config');
    return response.data || response;
  },

  updateFeedConfig: async (configData) => {
    const response = await api.put('/admin/feed/config', configData);
    return response.data || response;
  },

  getFeedAnalytics: async () => {
    const response = await api.get('/admin/feed/analytics');
    return response.data || response || [];
  },

  getFeedLatestPrediction: async () => {
    const response = await api.get('/admin/feed/prediction');
    return response.data || response;
  },

  getFeedReorders: async () => {
    const response = await api.get('/admin/feed/reorders');
    return response.data || response || [];
  },

  updateReorderStatus: async (reorderId, status) => {
    const response = await api.patch(`/admin/feed/reorders/${reorderId}/status?status=${status}`);
    return response.data || response;
  },

  getFeedSummary: async () => {
    const response = await api.get('/admin/feed/summary');
    return response.data || response || {};
  },

  // --- Dashboard ---
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/overview');
    return response.data || response || {};
  }
};