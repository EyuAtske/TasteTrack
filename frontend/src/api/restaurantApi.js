import axiosClient from './axiosClient';
import { INITIAL_RESTAURANTS } from '../data/mockRestaurants';

// Local storage cache for mock mode persistence
const getLocalMockRestaurants = () => {
  const saved = localStorage.getItem('tasteTrack_restaurants');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_RESTAURANTS;
    }
  }
  localStorage.setItem('tasteTrack_restaurants', JSON.stringify(INITIAL_RESTAURANTS));
  return INITIAL_RESTAURANTS;
};

const saveLocalMockRestaurants = (restaurants) => {
  localStorage.setItem('tasteTrack_restaurants', JSON.stringify(restaurants));
};

export const restaurantApi = {
  getRestaurants: async (params = {}) => {
    try {
      const response = await axiosClient.get('/restaurants', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, returning mock restaurant dataset.', err?.message);
      let list = getLocalMockRestaurants();

      // Filter by search query if provided
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.cuisine.toLowerCase().includes(q) ||
            (r.address && r.address.toLowerCase().includes(q))
        );
      }

      // Filter by location query if provided
      if (params.location && params.location !== 'Anywhere') {
        const loc = params.location.toLowerCase();
        list = list.filter((r) => r.address && r.address.toLowerCase().includes(loc));
      }

      // Filter by category
      if (params.category && params.category !== 'All') {
        list = list.filter((r) => r.category.toLowerCase() === params.category.toLowerCase());
      }

      // Filter by price
      if (params.priceRange && params.priceRange !== 'All') {
        list = list.filter((r) => r.priceRange === params.priceRange);
      }

      return { restaurants: list, count: list.length };
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await axiosClient.get(`/restaurants/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`Backend unavailable, returning mock restaurant #${id}.`, err?.message);
      const list = getLocalMockRestaurants();
      const restaurant = list.find((r) => r._id === id || r._id === String(id));
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      return { restaurant };
    }
  },

  createRestaurant: async (data) => {
    try {
      const response = await axiosClient.post('/restaurants', data);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, creating mock restaurant entry.', err?.message);
      const list = getLocalMockRestaurants();
      const newEntry = {
        _id: 'rest_' + Date.now(),
        ...data,
        averageRating: data.averageRating || 5.0,
        reviewCount: 0,
        featured: false,
      };
      const updated = [newEntry, ...list];
      saveLocalMockRestaurants(updated);
      return { restaurant: newEntry, message: 'Restaurant created successfully (Mock mode)' };
    }
  },

  updateRestaurant: async (id, data) => {
    try {
      const response = await axiosClient.put(`/restaurants/${id}`, data);
      return response.data;
    } catch (err) {
      const list = getLocalMockRestaurants();
      const updated = list.map((r) => (r._id === id ? { ...r, ...data } : r));
      saveLocalMockRestaurants(updated);
      return { message: 'Restaurant updated successfully (Mock mode)' };
    }
  },

  deleteRestaurant: async (id) => {
    try {
      const response = await axiosClient.delete(`/restaurants/${id}`);
      return response.data;
    } catch (err) {
      const list = getLocalMockRestaurants();
      const updated = list.filter((r) => r._id !== id);
      saveLocalMockRestaurants(updated);
      return { message: 'Restaurant deleted successfully (Mock mode)' };
    }
  },
};
