import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  Search,
  Globe,
  Menu,
  User,
  Heart,
  LogOut,
  Shield,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#EBEBEB] text-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo in Airbnb Coral #FF385C */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
            <img
              src="/TasteTrackLogo.png"
              alt="TasteTrack Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-extrabold text-xl tracking-tight text-[#FF385C]">
              TasteTrack
            </span>
          </Link>

          {/* Center: Airbnb Compact Search Capsule */}
          <button
            onClick={() => navigate('/restaurants')}
            className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#DDDDDD] shadow-xs hover:shadow-md transition duration-200 cursor-pointer text-xs font-semibold"
          >
            <span className="text-[#222222]">Anywhere</span>
            <span className="w-1 h-1 rounded-full bg-[#DDDDDD]" />
            <span className="text-[#222222]">Any cuisine</span>
            <span className="w-1 h-1 rounded-full bg-[#DDDDDD]" />
            <span className="text-[#717171]">Search restaurants</span>
            <div className="w-7 h-7 rounded-full bg-[#FF385C] text-white flex items-center justify-center ml-1">
              <Search className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Right: Actions & User Capsule Pill */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] rounded-full transition"
            >
              <PlusCircle className="w-4 h-4 text-[#FF385C]" />
              <span>Add a restaurant</span>
            </Link>

            <button
              className="hidden sm:flex items-center justify-center p-2.5 text-[#222222] hover:bg-[#F7F7F7] rounded-full transition cursor-pointer"
              title="Global settings"
            >
              <Globe className="w-4.5 h-4.5" />
            </button>

            {/* Airbnb Signature User Menu Capsule */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-[#DDDDDD] hover:shadow-md bg-white transition cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#222222]" />
                {isAuthenticated && user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#DDDDDD]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#717171] text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#DDDDDD] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs font-medium"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-[#EBEBEB]">
                        <p className="font-bold text-[#222222] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#717171] truncate">{user?.email}</p>
                        {user?.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-[#FF385C]/10 text-[#FF385C] font-bold text-[10px] rounded-md">
                            <Shield className="w-3 h-3" /> Admin Mode
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F7] text-[#222222]"
                      >
                        <span>Dashboard & Wishlist</span>
                        <Heart className="w-4 h-4 text-[#FF385C]" />
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F7] text-[#222222]"
                      >
                        <span>Account settings</span>
                        <User className="w-4 h-4 text-[#717171]" />
                      </Link>

                      <Link
                        to="/restaurants"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F7] text-[#222222]"
                      >
                        <span>Explore restaurants</span>
                      </Link>

                      <div className="border-t border-[#EBEBEB] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F7] text-[#FF385C] font-semibold cursor-pointer"
                      >
                        <span>Log out</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-[#F7F7F7] text-[#222222] font-bold"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-[#F7F7F7] text-[#222222]"
                      >
                        Sign up
                      </Link>
                      <div className="border-t border-[#EBEBEB] my-1" />
                      <Link
                        to="/restaurants"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-[#F7F7F7] text-[#717171]"
                      >
                        Browse all places
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
