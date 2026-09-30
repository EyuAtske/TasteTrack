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
      const isFormData = data instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await axiosClient.post('/restaurants', data, { headers });
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, creating mock restaurant entry.', err?.message);
      const list = getLocalMockRestaurants();

      let payload = {};
      if (data instanceof FormData) {
        data.forEach((val, key) => {
          if (key !== 'images') payload[key] = val;
        });
      } else {
        payload = { ...data };
      }

      // Convert image files or fallback image
      let images = payload.images || [];
      if (data instanceof FormData) {
        const files = data.getAll('images');
        if (files && files.length > 0 && files[0] instanceof File) {
          images = files.map((f) => URL.createObjectURL(f));
        }
      }

      const newEntry = {
        _id: 'rest_' + Date.now(),
        name: payload.name || 'New Restaurant',
        description: payload.description || '',
        category: payload.category || 'Italian',
        cuisine: payload.cuisine || 'Italian',
        priceRange: payload.priceRange || '$$',
        address: payload.address || '',
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
        contact: {
          phone: payload.phone || '',
          website: payload.website || '',
        },
        openingHours: payload.openingHours || 'Mon-Sun: 11:30 AM - 10:00 PM',
        averageRating: 5.0,
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
      const isFormData = data instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await axiosClient.put(`/restaurants/${id}`, data, { headers });
      return response.data;
    } catch (err) {
      const list = getLocalMockRestaurants();
      let payload = {};
      let uploadedImages = [];

      if (data instanceof FormData) {
        data.forEach((val, key) => {
          if (key !== 'images') payload[key] = val;
        });
        const files = data.getAll('images');
        if (files && files.length > 0 && files[0] instanceof File) {
          uploadedImages = files.map((f) => URL.createObjectURL(f));
        }
      } else {
        payload = { ...data };
      }

      const updated = list.map((r) => {
        if (r._id === id) {
          const finalImages = uploadedImages.length > 0 ? uploadedImages : (payload.images || r.images);
          return {
            ...r,
            ...payload,
            images: finalImages,
          };
        }
        return r;
      });

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
