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
  Pencil,
  Utensils,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardApi } from '../api/dashboardApi';
import { restaurantApi } from '../api/restaurantApi';
import { favoriteApi } from '../api/favoriteApi';
import RestaurantCard from '../components/RestaurantCard';
import Modal from '../components/Modal';
import ImageUploadInput from '../components/ImageUploadInput';

/**
 * Geocode a human-readable address to lat/lng using the free Nominatim API.
 * Returns { lat, lon } or throws if not found.
 */
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data || data.length === 0) throw new Error('Address not found on map');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);

  // Admin Add Restaurant Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Italian',
    cuisine: 'Italian',
    priceRange: '$$',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    website: '',
    openingHours: 'Mon-Sun: 11:30 AM - 10:00 PM',
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin: all restaurants list + delete modal
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [deletingRestaurantId, setDeletingRestaurantId] = useState(null);
  const [deletingRestaurantName, setDeletingRestaurantName] = useState('');
  const [isDeleteRestaurantModalOpen, setIsDeleteRestaurantModalOpen] = useState(false);
  const [isDeletingRestaurant, setIsDeletingRestaurant] = useState(false);

  useEffect(() => {
    fetchDashboard();
    if (user?.role === 'admin') fetchAllRestaurants();
  }, [user?._id]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!user?.favorites || user.favorites.length === 0) {
        setFavoriteRestaurants([]);
        return;
      }
      setIsLoadingFavs(true);
      try {
        const res = await favoriteApi.getFavorites();
        setFavoriteRestaurants(res.data || res.favorites || []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setIsLoadingFavs(false);
      }
    };

    if (user) fetchUserFavorites();
  }, [user?.favorites?.length, user?.favorites?.join?.(',')]);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllRestaurants = async () => {
    setIsLoadingRestaurants(true);
    try {
      const data = await restaurantApi.getRestaurants();
      setAllRestaurants(data.restaurants || []);
    } catch (err) {
      console.error('Restaurant list fetch error:', err);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const confirmDeleteRestaurant = (id, name) => {
    setDeletingRestaurantId(id);
    setDeletingRestaurantName(name);
    setIsDeleteRestaurantModalOpen(true);
  };

  const handleDeleteRestaurant = async () => {
    setIsDeletingRestaurant(true);
    try {
      await restaurantApi.deleteRestaurant(deletingRestaurantId);
      addToast('Restaurant Deleted', `${deletingRestaurantName} has been removed.`, 'info');
      setIsDeleteRestaurantModalOpen(false);
      setDeletingRestaurantId(null);
      fetchAllRestaurants();
      fetchDashboard();
    } catch (err) {
      addToast('Error', 'Failed to delete restaurant.', 'error');
    } finally {
      setIsDeletingRestaurant(false);
    }
  };

  /**
   * Auto-geocode the address when the user leaves the address field.
   */
  const handleAddressBlur = async () => {
    if (!formData.address.trim()) return;
    // Only auto-fill if both lat/lng are still empty
    if (formData.latitude && formData.longitude) return;
    setIsGeocoding(true);
    try {
      const { lat, lon } = await geocodeAddress(formData.address);
      setFormData((prev) => ({ ...prev, latitude: String(lat), longitude: String(lon) }));
      addToast('Location Found', `Coordinates set: ${lat.toFixed(4)}, ${lon.toFixed(4)}`, 'success');
    } catch {
      addToast('Geocoding Failed', 'Could not find coordinates for this address. Please enter them manually.', 'info');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      addToast('Validation Error', 'Restaurant name and address are required.', 'error');
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      addToast('Location Required', 'Please enter valid latitude and longitude (or enter the address first to auto-fill).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('cuisine', formData.cuisine);
      submitData.append('priceRange', formData.priceRange);
      submitData.append('address', formData.address);
      submitData.append('latitude', String(lat));
      submitData.append('longitude', String(lon));
      submitData.append('phone', formData.phone);
      submitData.append('website', formData.website);
      submitData.append('openingHours', formData.openingHours);

      if (formData.imageFiles && formData.imageFiles.length > 0) {
        formData.imageFiles.forEach((file) => submitData.append('images', file));
      }

      await restaurantApi.createRestaurant(submitData);

      addToast('Success!', `${formData.name} was added to TasteTrack!`, 'success');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        description: '',
        category: 'Italian',
        cuisine: 'Italian',
        priceRange: '$$',
        address: '',
        latitude: '',
        longitude: '',
        imageFiles: [],
        phone: '',
        website: '',
        openingHours: 'Mon-Sun: 11:30 AM - 10:00 PM',
      });

      // Refresh both lists so the new restaurant appears immediately
      fetchDashboard();
      fetchAllRestaurants();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create restaurant.';
      addToast('Error', msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const stats = {
    totalFavorites: user.favorites?.length || 0,
    totalReviews: dashboardData?.stats?.totalReviews ?? 0,
    totalVisited: dashboardData?.stats?.totalVisited ?? 0,
    avgRatingGiven: dashboardData?.stats?.avgRatingGiven ?? 0,
  };

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

        {isLoadingFavs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <div key={n} className="h-64 bg-neutral-200/60 rounded-2xl animate-pulse" />)}
          </div>
        ) : favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.map((restaurant) => (
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

      {/* ── Admin Add Restaurant Modal ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Restaurant">
        <form onSubmit={handleAddRestaurantSubmit} className="space-y-3.5">

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              id="add-restaurant-name"
              placeholder="e.g. Osteria Francescana"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Category</label>
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
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Price Range</label>
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

          {/* Address + geocoding */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Full Address *
            </label>
            <div className="relative">
              <input
                type="text"
                id="add-restaurant-address"
                placeholder="123 Foodie Blvd, City, Country"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onBlur={handleAddressBlur}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 pr-8"
                required
              />
              {isGeocoding && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-500 animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Tab out of the address field to auto-fill coordinates
            </p>
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                id="add-restaurant-lat"
                placeholder="e.g. 41.9028"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                id="add-restaurant-lng"
                placeholder="e.g. 12.4964"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of atmosphere, special dishes, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Cuisine</label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <ImageUploadInput
            multiple={true}
            maxFiles={5}
            label="Upload Restaurant Photos"
            onChange={(files) => setFormData({ ...formData, imageFiles: files })}
          />

          <button
            type="submit"
            id="add-restaurant-submit"
            disabled={isSubmitting || isGeocoding}
            className="w-full py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Save Restaurant'}
          </button>
        </form>
      </Modal>

      {/* ── Admin: All Restaurants Management Table ── */}
      {user.role === 'admin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#222222]">Manage All Restaurants</h2>
              <p className="text-xs text-[#717171]">Admin controls — edit or remove any listing</p>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FF385C]/10 text-[#FF385C] font-bold text-[10px] rounded-md">
              <Shield className="w-3 h-3" /> Admin Panel
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#DDDDDD] overflow-hidden">
            {isLoadingRestaurants ? (
              <div className="p-8 space-y-3 animate-pulse">
                {[1, 2, 3].map((n) => <div key={n} className="h-12 bg-[#EBEBEB] rounded-xl" />)}
              </div>
            ) : allRestaurants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#EBEBEB] bg-[#F7F7F7]">
                      <th className="px-5 py-3 text-left font-bold text-[#222222] uppercase tracking-wider">Restaurant</th>
                      <th className="px-4 py-3 text-left font-bold text-[#222222] uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="px-4 py-3 text-left font-bold text-[#222222] uppercase tracking-wider hidden md:table-cell">Price</th>
                      <th className="px-4 py-3 text-left font-bold text-[#222222] uppercase tracking-wider hidden lg:table-cell">Rating</th>
                      <th className="px-4 py-3 text-right font-bold text-[#222222] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB]">
                    {allRestaurants.map((restaurant) => (
                      <tr key={restaurant._id} className="hover:bg-[#F7F7F7] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80'}
                              alt={restaurant.name}
                              className="w-9 h-9 rounded-xl object-cover border border-[#DDDDDD] shrink-0"
                            />
                            <div>
                              <p className="font-bold text-[#222222] leading-tight">{restaurant.name}</p>
                              <p className="text-[#717171] text-[10px] truncate max-w-[160px]">{restaurant.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-[#717171]">{restaurant.category || restaurant.cuisine}</td>
                        <td className="px-4 py-3.5 hidden md:table-cell font-semibold text-[#222222]">{restaurant.priceRange || '$$'}</td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                            <span className="font-semibold text-[#222222]">{restaurant.averageRating || '0'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/restaurants/${restaurant._id}`}
                              className="p-1.5 rounded-lg text-[#717171] hover:text-[#222222] hover:bg-[#EBEBEB] transition"
                              title="View & Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => confirmDeleteRestaurant(restaurant._id, restaurant.name)}
                              className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF385C] hover:bg-[#FFF0F0] transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <Utensils className="w-8 h-8 text-[#DDDDDD] mx-auto" />
                <p className="text-xs text-[#717171]">No restaurants found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Restaurant Confirmation Modal ── */}
      <Modal
        isOpen={isDeleteRestaurantModalOpen}
        onClose={() => setIsDeleteRestaurantModalOpen(false)}
        title="Delete Restaurant"
      >
        <div className="space-y-5">
          <p className="text-sm text-[#717171]">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-[#222222]">{deletingRestaurantName}</span>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsDeleteRestaurantModalOpen(false)}
              className="px-4 py-2 border border-[#DDDDDD] text-[#222222] text-xs font-semibold rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRestaurant}
              disabled={isDeletingRestaurant}
              className="px-4 py-2 bg-[#FF385C] text-white text-xs font-bold rounded-xl hover:bg-[#E00B41] transition cursor-pointer disabled:opacity-60"
            >
              {isDeletingRestaurant ? 'Deleting...' : 'Delete Restaurant'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
