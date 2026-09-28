import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Utensils, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = ['All', 'Italian', 'Japanese', 'BBQ', 'Vegan', 'Fine Dining', 'Cafes'];
const PRICE_RANGES = ['All', '$', '$$', '$$$', '$$$$'];

export default function RestaurantList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [category, priceRange, sortBy]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantApi.getRestaurants({
        search: searchQuery,
        category: category !== 'All' ? category : undefined,
        priceRange: priceRange !== 'All' ? priceRange : undefined,
      });

      let list = data.restaurants || [];

      // Client sort
      if (sortBy === 'rating') {
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      } else if (sortBy === 'reviews') {
        list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      } else if (sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      setRestaurants(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery, category });
    fetchRestaurants();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setPriceRange('All');
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Explore Restaurants
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover {restaurants.length} top-tier spots curated for your palate
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, dish, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-rose-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-2xl transition cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-700 mr-2">
            <SlidersHorizontal className="w-4 h-4 text-rose-500" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 outline-none cursor-pointer hover:border-neutral-300"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>

          {/* Price Range Dropdown */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 outline-none cursor-pointer hover:border-neutral-300"
          >
            {PRICE_RANGES.map((pr) => (
              <option key={pr} value={pr}>Price: {pr}</option>
            ))}
          </select>

          {/* Reset Filters button */}
          {(category !== 'All' || priceRange !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer ml-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs text-neutral-600 ml-auto">
          <span className="font-semibold text-neutral-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold text-neutral-800 outline-none cursor-pointer"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-neutral-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">No matching restaurants</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We couldn't find any places matching your current search parameters or category selection.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-neutral-900 text-white font-semibold text-xs rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
