import axiosClient from './axiosClient';

export const reviewApi = {
  /**
   * GET /api/restaurants/:id/reviews
   * Backend returns { success, count, data: [...] }
   */
  getReviewsByRestaurant: async (restaurantId) => {
    const response = await axiosClient.get(`/restaurants/${restaurantId}/reviews`);
    // Backend wraps reviews in `data`, normalise to `reviews` for callers
    return { reviews: response.data.data ?? [] };
  },

  /**
   * POST /api/reviews
   * Body: { restaurant, rating, title, comment }
   * Backend returns { success, data: populatedReview }
   */
  addReview: async (data) => {
    // Normalise: callers may pass `restaurantId`, backend expects `restaurant`
    const payload = {
      restaurant: data.restaurant ?? data.restaurantId,
      rating: Number(data.rating),
      title: data.title,
      comment: data.comment,
    };
    const response = await axiosClient.post('/reviews', payload);
    return response.data;
  },

  /**
   * PUT /api/reviews/:id
   * Body: { rating, title, comment }
   */
  updateReview: async (id, data) => {
    const response = await axiosClient.put(`/reviews/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/reviews/:id
   */
  deleteReview: async (id) => {
    const response = await axiosClient.delete(`/reviews/${id}`);
    return response.data;
  },
};
