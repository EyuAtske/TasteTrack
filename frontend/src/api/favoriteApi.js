import axiosClient from './axiosClient';
import { restaurantApi } from './restaurantApi';

export const favoriteApi = {
  getFavorites: async () => {
    try {
      const response = await axiosClient.get('/favorites');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, fetching favorites from mock user state.', err?.message);
      const savedUser = JSON.parse(localStorage.getItem('tasteTrack_user') || '{}');
      const favIds = savedUser.favorites || [];
      const { restaurants } = await restaurantApi.getRestaurants();
      const favRestaurants = (restaurants || []).filter((r) => favIds.includes(String(r._id)));
      return { success: true, count: favRestaurants.length, data: favRestaurants, favorites: favRestaurants };
    }
  },

  addFavorite: async (restaurantId) => {
    try {
      const response = await axiosClient.post('/favorites', { restaurantId });
      return response.data;
    } catch (err) {
      return { message: 'Added to favorites (Mock mode)' };
    }
  },

  removeFavorite: async (restaurantId) => {
    try {
      const response = await axiosClient.delete(`/favorites/${restaurantId}`);
      return response.data;
    } catch (err) {
      return { message: 'Removed from favorites (Mock mode)' };
    }
  },
};
