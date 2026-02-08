import api from './api';

export const authService = {
  // User login - backend returns { success, message, data: token }
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data;
    if (token) {
      localStorage.setItem('token', token);
      const profileRes = await api.get('/user/profile');
      const user = profileRes.data;
      if (user) localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }
    throw new Error(response.message || 'Login failed');
  },

  // User registration
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Send OTP to email
  sendOtp: async (email) => {
    const response = await api.post(`/auth/send-otp?email=${encodeURIComponent(email)}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await api.post(`/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // User logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user - fetch from backend when token exists
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await api.get('/user/profile');
      return response.data || null;
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/user/change-password', passwordData);
    if (!response.success) throw new Error(response.message);
    return response;
  }
};