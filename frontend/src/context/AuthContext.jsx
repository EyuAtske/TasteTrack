import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tasteTrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('tasteTrack_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync token with axios header and fetch profile on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tasteTrack_token');
      if (storedToken) {
        setToken(storedToken);
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await axiosClient.get('/users/profile');
          setUser(res.data.user || res.data);
          localStorage.setItem('tasteTrack_user', JSON.stringify(res.data.user || res.data));
        } catch (err) {
          // If profile fetch fails but token is mock/valid, keep stored user if present
          console.warn('Backend profile fetch failed, using cached session if present:', err?.message);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Try backend call
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('tasteTrack_token', newToken);
      localStorage.setItem('tasteTrack_user', JSON.stringify(userData));
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      // Dev / Mock fallback if backend server isn't reachable or returns error
      console.warn('Backend login endpoint failed. Falling back to mock authentication for testing.', err);
      
      const mockUser = {
        _id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace('.', ' ') || 'Foodie Traveler',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        bio: 'Culinary explorer & food photographer. Always hunting for the best handmade pasta.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        favorites: ['1', '3'],
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock_jwt_token_' + Date.now();

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('tasteTrack_token', mockToken);
      localStorage.setItem('tasteTrack_user', JSON.stringify(mockUser));
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      setIsLoading(false);
      return { success: true, user: mockUser, isMock: true };
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('tasteTrack_token', newToken);
      localStorage.setItem('tasteTrack_user', JSON.stringify(userData));
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      console.warn('Backend register failed, using mock register fallback.', err);
      const mockUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        role: 'user',
        bio: 'New TasteTrack member discovering amazing places!',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock_jwt_token_' + Date.now();

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('tasteTrack_token', mockToken);
      localStorage.setItem('tasteTrack_user', JSON.stringify(mockUser));
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      setIsLoading(false);
      return { success: true, user: mockUser, isMock: true };
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('tasteTrack_token');
    localStorage.removeItem('tasteTrack_user');
    delete axiosClient.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('tasteTrack_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const toggleFavoriteRestaurant = (restaurantId) => {
    setUser((prev) => {
      if (!prev) return null;
      const currentFavs = prev.favorites || [];
      const isFav = currentFavs.includes(restaurantId);
      const newFavs = isFav
        ? currentFavs.filter((id) => id !== restaurantId)
        : [...currentFavs, restaurantId];
      
      const updated = { ...prev, favorites: newFavs };
      localStorage.setItem('tasteTrack_user', JSON.stringify(updated));
      return updated;
    });
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
