import axiosClient from './axiosClient';
import { restaurantApi } from './restaurantApi';
import { reviewApi } from './reviewApi';

export const dashboardApi = {
  getDashboardData: async () => {
    try {
      const response = await axiosClient.get('/dashboard');
      const data = response.data?.data || response.data;
      return data;
    } catch (err) {
      console.warn('Backend unavailable, generating real mock dashboard stats.', err?.message);
      const savedUser = JSON.parse(localStorage.getItem('tasteTrack_user') || '{}');
      const favIds = savedUser.favorites || [];
      const { restaurants } = await restaurantApi.getRestaurants();
      const favRestaurants = (restaurants || []).filter((r) => favIds.includes(String(r._id)));

      // Calculate real review statistics from local stored reviews
      const savedReviews = JSON.parse(localStorage.getItem('tasteTrack_reviews') || '[]');
      const userReviews = savedReviews.filter(
        (r) => r.user?._id === savedUser._id || r.user === savedUser._id
      );
      const totalReviews = userReviews.length;
      const uniqueVisited = new Set(userReviews.map((r) => String(r.restaurant))).size;
      const sumRatings = userReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
      const avgRatingGiven = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

      return {
        stats: {
          totalFavorites: favIds.length,
          totalReviews,
          totalVisited: uniqueVisited,
          avgRatingGiven,
        },
        favorites: favRestaurants,
        recentActivity: [],
      };
    }
  },
};
