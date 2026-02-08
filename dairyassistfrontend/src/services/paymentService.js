import axios from 'axios';
import api from './api'; // Use your centralized api config if available

const API_URL = 'http://localhost:8080/api/payment'; 

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const paymentService = {
  // GET Payment History
  getPaymentHistory: async () => {
    try {
      // Calling the new endpoint we will create in the controller
      const response = await api.get('/payment/user-history');
      return response.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createRazorpayOrder: async (amount) => {
    try {
      const response = await axios.post(
        `${API_URL}/create-order`, 
        { amount: amount }, 
        getAuthHeader()
      );
      return response.data.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyPayment: async (orderId, paymentId, signature) => {
    try {
      await axios.post(
        `${API_URL}/verify`,
        { orderId, paymentId, signature },
        getAuthHeader()
      );
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};