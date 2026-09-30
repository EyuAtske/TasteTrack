import axiosClient from './axiosClient';

export const restaurantApi = {
  /**
   * GET /api/restaurants
   * Supports: search, location, category, priceRange, page, limit
   */
  getRestaurants: async (params = {}) => {
    const response = await axiosClient.get('/restaurants', { params });
    // Backend returns both `data` and `restaurants` arrays — normalise
    const list = response.data.restaurants ?? response.data.data ?? [];
    return { restaurants: list, count: response.data.count, total: response.data.total };
  },

  /**
   * GET /api/restaurants/:id
   * Backend returns { success, data: restaurant }
   */
  getRestaurantById: async (id) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    // Callers use `restData.restaurant || restData` — expose both shapes
    return { restaurant: response.data.data, ...response.data };
  },

  /**
   * POST /api/restaurants  (admin only, multipart/form-data)
   * Returns { success, data: newRestaurant }
   */
  createRestaurant: async (data) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axiosClient.post('/restaurants', data, { headers });
    return response.data;
  },

  /**
   * PUT /api/restaurants/:id  (admin only, multipart/form-data)
   * Returns { success, data: updatedRestaurant }
   */
  updateRestaurant: async (id, data) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axiosClient.put(`/restaurants/${id}`, data, { headers });
    return response.data;
  },

  /**
   * DELETE /api/restaurants/:id  (admin only)
   */
  deleteRestaurant: async (id) => {
    const response = await axiosClient.delete(`/restaurants/${id}`);
    return response.data;
  },
};
