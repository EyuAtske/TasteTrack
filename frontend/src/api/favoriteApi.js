import axiosClient from './axiosClient';
import { restaurantApi } from './restaurantApi';

export const favoriteApi = {
  // Returns { favorites: [restaurant, ...] }
  getFavorites: async () => {
    try {
      const response = await axiosClient.get('/favorites');
      const body = response.data;
      return { ...body, favorites: body.data || body.favorites || [] };
    } catch (err) {
      if (err.response) throw err; // the server answered with an error: don't hide it
      console.warn('Backend unavailable, fetching favorites from mock user state.', err?.message);
      const savedUser = JSON.parse(localStorage.getItem('tasteTrack_user') || '{}');
      const favIds = savedUser.favorites || ['1', '3'];
      const { restaurants } = await restaurantApi.getRestaurants();
      const favRestaurants = restaurants.filter((r) => favIds.includes(String(r._id)));
      return { favorites: favRestaurants };
    }
  },

  addFavorite: async (restaurantId) => {
    try {
      const response = await axiosClient.post('/favorites', { restaurantId });
      return response.data;
    } catch (err) {
      if (err.response) throw err; // real server error: let the caller roll back
      return { message: 'Added to favorites (Mock mode)' };
    }
  },

  removeFavorite: async (restaurantId) => {
    try {
      const response = await axiosClient.delete(`/favorites/${restaurantId}`);
      return response.data;
    } catch (err) {
      if (err.response) throw err;
      return { message: 'Removed from favorites (Mock mode)' };
    }
  },
};