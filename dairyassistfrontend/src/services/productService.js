import api from './api';
import { cartService } from './cartService';

export const productService = {
  // Get all products - backend: GET /api/products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data || response;
  },

  // Get product by ID - backend: GET /api/products/{id}
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data || response;
  },

  // Get product variants - backend: GET /api/products/{productId}/variants
  getProductVariants: async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data || response;
  },

  // Get variant by ID - backend: GET /api/products/variant/{variantId}
  getVariantById: async (variantId) => {
    const response = await api.get(`/products/variant/${variantId}`);
    return response.data || response;
  },

  // Add to cart - delegates to cartService
  addToCart: async (productId, variantId, quantity) => {
    return cartService.addToCart(productId, variantId, quantity);
  },

  // Add custom variant to cart
  addCustomToCart: async (productId, customVariant) => {
    return cartService.addCustomToCart(productId, customVariant);
  }
};