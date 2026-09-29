import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * - Shows a spinner while auth state is being determined on first load.
 * - Redirects unauthenticated users to /login, preserving the intended URL
 *   so they are sent back after successful login.
 * - If `adminOnly` is true, also verifies the user has the 'admin' role.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Still resolving token / profile from localStorage
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-[#717171]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF385C]" />
        <p className="text-xs font-semibold">Checking authentication…</p>
      </div>
    );
  }

  // Not logged in → redirect to login, save intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not an admin → redirect to home with a warning
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
