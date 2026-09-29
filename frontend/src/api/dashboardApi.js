import axiosClient from './axiosClient';
import { restaurantApi } from './restaurantApi';
import { reviewApi } from './reviewApi';

export const dashboardApi = {
  getDashboardData: async () => {
    try {
      const response = await axiosClient.get('/dashboard');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, generating mock dashboard stats.', err?.message);
      const savedUser = JSON.parse(localStorage.getItem('tasteTrack_user') || '{}');
      const favIds = savedUser.favorites || ['1', '3'];
      const { restaurants } = await restaurantApi.getRestaurants();
      const favRestaurants = restaurants.filter((r) => favIds.includes(String(r._id)));

      return {
        stats: {
          totalFavorites: favIds.length,
          totalReviews: 4,
          totalVisited: 12,
          avgRatingGiven: 4.8,
        },
        favorites: favRestaurants,
        recentActivity: [
          { id: 1, type: 'review', title: 'Reviewed Trattoria Bella Vista', score: 5, date: '2 days ago' },
          { id: 2, type: 'favorite', title: 'Saved Sakura Omakase & Bar to Wishlist', date: '5 days ago' },
          { id: 3, type: 'profile', title: 'Updated profile bio and avatar', date: '1 week ago' },
        ],
      };
    }
  },
};
