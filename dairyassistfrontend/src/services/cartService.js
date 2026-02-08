import api from './api';

export const cartService = {
  // Get user cart - backend: GET /api/cart (returns items, subtotal, totalItems, finalAmount)
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data || { items: [], subtotal: 0, totalItems: 0, finalAmount: 0 };
  },

  // Add item to cart - backend: POST /api/cart/add with { variantId, quantity }
  addToCart: async (productId, variantId, quantity) => {
    const response = await api.post('/cart/add', {
      variantId,
      quantity
    });
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Update cart item quantity - backend: PUT /api/cart/update?cartId=X&quantity=Y
  updateCartItem: async (cartId, quantity) => {
    const response = await api.put(`/cart/update?cartId=${cartId}&quantity=${quantity}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Remove item from cart - backend: DELETE /api/cart/remove/{cartItemId}
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Add custom variant to cart
  addCustomToCart: async (productId, customVariant) => {
    const response = await api.post('/cart/add-custom', {
      productId,
      size: customVariant.size,
      price: customVariant.price,
      quantity: customVariant.quantity
    });
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Clear entire cart - backend: DELETE /api/cart/clear
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    if (!response.success) throw new Error(response.message);
    return response;
  }
};