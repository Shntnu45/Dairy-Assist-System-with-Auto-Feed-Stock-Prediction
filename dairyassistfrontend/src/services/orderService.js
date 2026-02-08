import api from './api';

export const orderService = {
  // Checkout preview - backend: POST /api/checkout/preview
  previewCheckout: async () => {
    const response = await api.post('/checkout/preview');
    return response.data || null;
  },

  // Place order after payment - backend: POST /api/order/place?addressId=X&razorpayTxnId=Y
  placeOrder: async (addressId, razorpayTxnId) => {
    const response = await api.post(`/order/place?addressId=${addressId}&razorpayTxnId=${encodeURIComponent(razorpayTxnId)}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Get user orders - backend: GET /api/user/orders
  getUserOrders: async () => {
    const response = await api.get('/user/orders');
    return response.data || [];
  },

  // Get order by ID - backend: GET /api/user/orders/{orderId}
  getOrderById: async (orderId) => {
    const response = await api.get(`/user/orders/${orderId}`);
    return response.data || null;
  },

  // Get delivery status - backend: GET /api/user/orders/{orderId}/delivery-status
  getDeliveryStatus: async (orderId) => {
    const response = await api.get(`/user/orders/${orderId}/delivery-status`);
    return response.data || null;
  },

  // Get delivery address - backend: GET /api/user/orders/{orderId}/delivery-address
  getDeliveryAddress: async (orderId) => {
    const response = await api.get(`/user/orders/${orderId}/delivery-address`);
    return response.data || null;
  }
};