import axiosClient from './axiosClient';

export const dashboardApi = {
  /**
   * GET /api/dashboard  (protected — requires JWT)
   * Returns { success, data: { platformStats, recentActivity, stats, favorites, userStats } }
   */
  getDashboardData: async () => {
    const response = await axiosClient.get('/dashboard');
    return response.data?.data || response.data;
  },
};
