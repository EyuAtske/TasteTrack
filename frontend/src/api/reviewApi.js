import axiosClient from './axiosClient';
import { INITIAL_REVIEWS } from '../data/mockRestaurants';

const getLocalMockReviews = () => {
  const saved = localStorage.getItem('tasteTrack_reviews');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  }
  localStorage.setItem('tasteTrack_reviews', JSON.stringify(INITIAL_REVIEWS));
  return INITIAL_REVIEWS;
};

const saveLocalMockReviews = (reviews) => {
  localStorage.setItem('tasteTrack_reviews', JSON.stringify(reviews));
};

export const reviewApi = {
  getReviewsByRestaurant: async (restaurantId) => {
    try {
      const response = await axiosClient.get(`/restaurants/${restaurantId}/reviews`);
      return response.data;
    } catch (err) {
      console.warn(`Backend unavailable, returning mock reviews for restaurant #${restaurantId}.`, err?.message);
      const list = getLocalMockReviews();
      const filtered = list.filter((r) => String(r.restaurant) === String(restaurantId));
      return { reviews: filtered };
    }
  },

  addReview: async (data) => {
    try {
      const response = await axiosClient.post('/reviews', data);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, creating mock review.', err?.message);
      const list = getLocalMockReviews();
      const savedUser = JSON.parse(localStorage.getItem('tasteTrack_user') || '{}');
      const newReview = {
        _id: 'rev_' + Date.now(),
        restaurant: data.restaurantId || data.restaurant,
        user: {
          _id: savedUser._id || 'usr_current',
          name: savedUser.name || 'Anonymous Gourmet',
          profileImage: savedUser.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
        rating: Number(data.rating),
        title: data.title,
        comment: data.comment,
        createdAt: new Date().toISOString(),
      };
      const updated = [newReview, ...list];
      saveLocalMockReviews(updated);
      return { review: newReview, message: 'Review posted successfully (Mock mode)' };
    }
  },

  updateReview: async (id, data) => {
    try {
      const response = await axiosClient.put(`/reviews/${id}`, data);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, updating mock review.', err?.message);
      const list = getLocalMockReviews();
      const updated = list.map((r) =>
        r._id === id
          ? { ...r, rating: Number(data.rating), title: data.title, comment: data.comment }
          : r
      );
      saveLocalMockReviews(updated);
      return { message: 'Review updated (Mock mode)' };
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await axiosClient.delete(`/reviews/${id}`);
      return response.data;
    } catch (err) {
      const list = getLocalMockReviews();
      const updated = list.filter((r) => r._id !== id);
      saveLocalMockReviews(updated);
      return { message: 'Review removed (Mock mode)' };
    }
  },
};
