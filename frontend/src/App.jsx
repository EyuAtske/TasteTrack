import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RestaurantForm from './pages/RestaurantForm';
import { UtensilsCrossed, User, PlusCircle, LogIn, UserPlus } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Top Navbar with Page Tabs */}
      <header className="bg-white border-b border-neutral-200 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <div 
            onClick={() => setCurrentPage('login')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF385C] flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#FF385C]">
              TasteTrack
            </span>
          </div>

          {/* Member 4 Navigation Switcher */}
          <nav className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setCurrentPage('login')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'login' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-rose-500" />
              Log In
            </button>

            <button
              onClick={() => setCurrentPage('register')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'register' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-rose-500" />
              Sign Up
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'profile' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              <User className="w-3.5 h-3.5 text-rose-500" />
              User Profile
            </button>

            <button
              onClick={() => setCurrentPage('restaurant-form')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'restaurant-form' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
              Admin Form
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {currentPage === 'login' && (
          <Login 
            onNavigateToRegister={() => setCurrentPage('register')} 
            onLoginSuccess={() => setCurrentPage('profile')}
          />
        )}
        {currentPage === 'register' && (
          <Register 
            onNavigateToLogin={() => setCurrentPage('login')} 
            onRegisterSuccess={() => setCurrentPage('profile')}
          />
        )}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'restaurant-form' && <RestaurantForm />}
      </main>
    </div>
  );
}