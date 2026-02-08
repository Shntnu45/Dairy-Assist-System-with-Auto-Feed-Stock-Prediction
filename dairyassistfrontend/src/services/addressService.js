import api from './api';

export const addressService = {
  // Get user addresses - backend: GET /api/address or /api/user/address
  getUserAddresses: async () => {
    const response = await api.get('/address');
    return response.data || [];
  },

  // Add new address - backend: POST /api/address (requires addressLine, latitude, longitude, isDefault)
  addAddress: async (addressData) => {
    const payload = {
      addressLine: addressData.addressLine || '',
      latitude: addressData.latitude ?? 0,
      longitude: addressData.longitude ?? 0,
      isDefault: addressData.isDefault ?? false
    };
    const response = await api.post('/address', payload);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Update address - backend: PUT /api/address/{id}
  updateAddress: async (addressId, addressData) => {
    const payload = {
      addressLine: addressData.addressLine || '',
      latitude: addressData.latitude ?? 0,
      longitude: addressData.longitude ?? 0,
      isDefault: addressData.isDefault ?? false
    };
    const response = await api.put(`/address/${addressId}`, payload);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Delete address - backend: DELETE /api/address/{id}
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/address/${addressId}`);
    if (!response.success) throw new Error(response.message);
    return response;
  },

  // Get address by ID - backend: GET /api/address/{id}
  getAddressById: async (addressId) => {
    const response = await api.get(`/address/${addressId}`);
    return response.data || null;
  }
};