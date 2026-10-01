import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { favoriteApi } from '../api/favoriteApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /**
   * Initialise from localStorage so a page refresh doesn't instantly log the
   * user out — the useEffect below will validate the token against the backend
   * and update or clear state accordingly.
   */
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tasteTrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('tasteTrack_token') || null);

  const [isLoading, setIsLoading] = useState(true);

  // On mount: validate the stored token by fetching the live profile.
  // If the token is expired / invalid the backend returns 401 → we log out.
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tasteTrack_token');
      if (storedToken) {
        // Ensure every axios request carries the token
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await axiosClient.get('/users/profile');
          const freshUser = res.data.user || res.data;
          setUser(freshUser);
          localStorage.setItem('tasteTrack_user', JSON.stringify(freshUser));
        } catch (err) {
          // Token is invalid / expired — clear everything
          console.warn('Token validation failed, logging out:', err?.response?.status);
          clearAuthState();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const persistAuthState = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('tasteTrack_token', newToken);
    localStorage.setItem('tasteTrack_user', JSON.stringify(userData));
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tasteTrack_token');
    localStorage.removeItem('tasteTrack_user');
    delete axiosClient.defaults.headers.common['Authorization'];
  };

  /**
   * Login — throws on failure (caller shows the error to the user).
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      persistAuthState(newToken, userData);
      return { success: true, user: userData };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register — throws on failure (caller shows the error to the user).
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      persistAuthState(newToken, userData);
      return { success: true, user: userData };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout — always succeeds client-side even if the backend call fails.
   */
  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    clearAuthState();
  };

  /**
   * Update local user object after profile edits.
   */
  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('tasteTrack_user', JSON.stringify(next));
      return next;
    });
  };

  /**
   * Toggle a restaurant in the user's favorites list.
   * Optimistic update → sync with backend.
   */
  const toggleFavoriteRestaurant = async (restaurantId) => {
    let isCurrentlyFav = false;
    setUser((prev) => {
      if (!prev) return null;
      const currentFavs = prev.favorites || [];
      isCurrentlyFav = currentFavs.some((id) => String(id) === String(restaurantId));
      const newFavs = isCurrentlyFav
        ? currentFavs.filter((id) => String(id) !== String(restaurantId))
        : [...currentFavs, restaurantId];
      const updated = { ...prev, favorites: newFavs };
      localStorage.setItem('tasteTrack_user', JSON.stringify(updated));
      return updated;
    });

    try {
      if (isCurrentlyFav) {
        await favoriteApi.removeFavorite(restaurantId);
      } else {
        await favoriteApi.addFavorite(restaurantId);
      }
    } catch (err) {
      console.warn('Failed to sync favorite with backend:', err?.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        toggleFavoriteRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};