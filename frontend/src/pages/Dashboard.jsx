import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Star,
  MessageSquare,
  Compass,
  Plus,
  Shield,
  Trash2,
  ExternalLink,
  Utensils,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardApi } from '../api/dashboardApi';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Add Restaurant Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Italian',
    cuisine: 'Italian',
    priceRange: '$$',
    address: '',
    imageUrl: '',
    phone: '',
    website: '',
    openingHours: 'Mon-Sun: 11:30 AM - 10:00 PM',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      addToast('Validation Error', 'Restaurant name and address are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await restaurantApi.createRestaurant({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        cuisine: formData.cuisine,
        priceRange: formData.priceRange,
        address: formData.address,
        images: formData.imageUrl ? [formData.imageUrl] : [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        ],
        contact: {
          phone: formData.phone,
          website: formData.website,
        },
        openingHours: formData.openingHours,
      });

      addToast('Success!', `${formData.name} was added to TasteTrack!`, 'success');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        description: '',
        category: 'Italian',
        cuisine: 'Italian',
        priceRange: '$$',
        address: '',
        imageUrl: '',
        phone: '',
        website: '',
        openingHours: 'Mon-Sun: 11:30 AM - 10:00 PM',
      });
      fetchDashboard();
    } catch (err) {
      addToast('Error', 'Failed to create restaurant.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-4">
        <UserCheck className="w-12 h-12 text-neutral-300 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-800">Authentication Required</h2>
        <p className="text-xs text-neutral-500">Please log in to view your personal foodie dashboard.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold">
          Log In Now
        </Link>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalFavorites: user.favorites?.length || 0,
    totalReviews: 4,
    totalVisited: 12,
    avgRatingGiven: 4.8,
  };

  const favorites = dashboardData?.favorites || [];

  return (
    <div className="space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-rose-500/30 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
            <p className="text-xs text-neutral-600 mt-2 font-medium line-clamp-1">{user.bio || 'Food Explorer & Critic'}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/profile"
            className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xl transition"
          >
            Edit Profile
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Saved Favorites</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{stats.totalFavorites}</p>
          <p className="text-[10px] text-neutral-400">Bookmarked spots</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reviews Written</span>
            <MessageSquare className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{stats.totalReviews}</p>
          <p className="text-[10px] text-neutral-400">Community contributions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Places Visited</span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{stats.totalVisited}</p>
          <p className="text-[10px] text-neutral-400">Explored venues</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Rating Given</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{stats.avgRatingGiven} / 5</p>
          <p className="text-[10px] text-neutral-400">Generous critic</p>
        </div>
      </div>

      {/* Saved Favorites Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Your Saved Wishlist</h2>
            <p className="text-xs text-neutral-500">Quick access to restaurants you want to visit or revisit</p>
          </div>
          <Link to="/restaurants" className="text-xs font-bold text-rose-600 hover:underline">
            Explore More
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-3">
            <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800">No saved restaurants yet</h3>
            <p className="text-xs text-neutral-500">
              Click the heart icon on any restaurant card to add it to your saved wishlist!
            </p>
            <Link
              to="/restaurants"
              className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
            >
              Browse Restaurants
            </Link>
          </div>
        )}
      </div>

      {/* Admin Add Restaurant Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Restaurant"
      >
        <form onSubmit={handleAddRestaurantSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Osteria Francescana"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
              >
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="BBQ">BBQ</option>
                <option value="Vegan">Vegan</option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="Cafes">Cafes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Price Range
              </label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
              >
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Upscale)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Full Address *
            </label>
            <input
              type="text"
              placeholder="123 Foodie Blvd, City, Zip"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of atmosphere, special dishes, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            {isSubmitting ? 'Creating...' : 'Save Restaurant'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
