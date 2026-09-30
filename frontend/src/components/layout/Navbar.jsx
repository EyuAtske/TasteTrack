import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchModal from '../SearchModal';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isHomePage = location.pathname === '/';
  const activeLocation = searchParams.get('location') || 'Anywhere';
  const activeCategory = searchParams.get('category') || 'Any cuisine';
  const activeKeyword = searchParams.get('search');

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  // Determine navbar search capsule visibility
  const showNavSearch = !isHomePage || isScrolled;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] text-[#222222] transition-all duration-300">
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

            {/* Center: Airbnb Interactive Compact Search Capsule */}
            <div className={`transition-all duration-300 ease-out ${
              showNavSearch
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-90 -translate-y-2 pointer-events-none'
            }`}>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#DDDDDD] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-xs font-semibold bg-white hover:scale-105 active:scale-95"
              >
                <span className={`truncate max-w-[120px] ${activeLocation !== 'Anywhere' ? 'text-[#FF385C] font-extrabold' : 'text-[#222222]'}`}>
                  {activeLocation}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#DDDDDD]" />
                <span className={`truncate max-w-[110px] ${activeCategory !== 'Any cuisine' ? 'text-[#FF385C] font-extrabold' : 'text-[#222222]'}`}>
                  {activeCategory}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#DDDDDD]" />
                <span className="text-[#717171] truncate max-w-[120px]">
                  {activeKeyword ? `"${activeKeyword}"` : 'Search spots'}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#FF385C] text-white flex items-center justify-center ml-1 shrink-0 shadow-xs">
                  <Search className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            </div>

          {/* Right: Actions & User Capsule Pill */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] rounded-full transition"
            >
              <PlusCircle className="w-4 h-4 text-[#FF385C]" />
              <span>Add a restaurant</span>
            </Link>


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
    <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
}
