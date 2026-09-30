import axiosClient from './axiosClient';
import { restaurantApi } from './restaurantApi';

// The backend returns { success, data: { platformStats, recentActivity, userStats } }
// and favorites come from GET /favorites. This maps both into the shape the
// Dashboard page uses: { stats, favorites, recentActivity }.
export const dashboardApi = {
  getDashboardData: async () => {
    try {
      const [dashRes, favRes] = await Promise.all([
        axiosClient.get('/dashboard'),
        axiosClient.get('/favorites'),
      ]);

      const d = dashRes.data?.data || {};
      const favorites = favRes.data?.data || favRes.data?.favorites || [];

      return {
        stats: {
          totalFavorites: favorites.length,
          totalReviews: d.userStats?.reviewsCount ?? 0,
          // one review per restaurant per user, so reviews written = places visited
          totalVisited: d.userStats?.reviewsCount ?? 0,
          avgRatingGiven: '—',
        },
        favorites,
        platformStats: d.platformStats,
        recentActivity: (d.recentActivity || []).map((r) => ({
          id: r._id,
          type: 'review',
          title: `${r.user?.name || 'Someone'} reviewed ${r.restaurant?.name || 'a restaurant'}`,
          score: r.rating,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
        })),
      };
    } catch (err) {
      if (err.response) throw err; // real server error (e.g. 401): don't show fake data
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
        recentActivity: [],
      };
    }
  },
};