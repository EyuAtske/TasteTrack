import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Utensils, SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = ['All', 'Italian', 'Japanese', 'BBQ', 'Vegan', 'Fine Dining', 'Cafes'];
const PRICE_RANGES = ['All', '$', '$$', '$$$', '$$$$'];
const PAGE_SIZE = 12; // 12 fits both the 3-column and 4-column grids

// Page numbers to show: 1 ... 4 5 6 ... 10
const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
    result.push(p);
  });
  return result;
};

export default function RestaurantList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const priceRange = searchParams.get('priceRange') || 'All';
  const locationQuery = searchParams.get('location') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [inputSearch, setInputSearch] = useState(searchQuery);
  const [inputLocation, setInputLocation] = useState(locationQuery);
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);

  // Sync internal input fields and reload whenever the URL (filters / page) or sort changes
  useEffect(() => {
    setInputSearch(searchParams.get('search') || '');
    setInputLocation(searchParams.get('location') || '');
    fetchRestaurants();
  }, [searchParams, sortBy]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantApi.getRestaurants({
        page,
        limit: PAGE_SIZE,
        sort: sortBy,
        search: searchParams.get('search') || undefined,
        location: searchParams.get('location') || undefined,
        category: searchParams.get('category') && searchParams.get('category') !== 'All' ? searchParams.get('category') : undefined,
        priceRange: searchParams.get('priceRange') && searchParams.get('priceRange') !== 'All' ? searchParams.get('priceRange') : undefined,
      });

      const list = [...(data.restaurants || data.data || [])];

      if (data.totalPages === undefined) {
        // Offline/mock mode: the API did not paginate or sort, so sort locally
        if (sortBy === 'rating') {
          list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        } else if (sortBy === 'name') {
          list.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      setRestaurants(list);
      setTotal(data.total ?? list.length);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Any change to filters/search/sort goes back to page 1
  const withFirstPage = (params) => {
    params.delete('page');
    return params;
  };

  const goToPage = (p) => {
    const newParams = new URLSearchParams(searchParams);
    if (p <= 1) newParams.delete('page');
    else newParams.set('page', String(p));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputSearch.trim()) {
      newParams.set('search', inputSearch.trim());
    } else {
      newParams.delete('search');
    }
    if (inputLocation.trim()) {
      newParams.set('location', inputLocation.trim());
    } else {
      newParams.delete('location');
    }
    setSearchParams(withFirstPage(newParams));
  };

  const handleCategoryChange = (newCat) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCat && newCat !== 'All') {
      newParams.set('category', newCat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(withFirstPage(newParams));
  };

  const handlePriceChange = (newPrice) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPrice && newPrice !== 'All') {
      newParams.set('priceRange', newPrice);
    } else {
      newParams.delete('priceRange');
    }
    setSearchParams(withFirstPage(newParams));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (searchParams.get('page')) {
      setSearchParams(withFirstPage(new URLSearchParams(searchParams)));
    }
  };

  const resetFilters = () => {
    setInputSearch('');
    setInputLocation('');
    setSearchParams({});
  };

  const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Explore Restaurants
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover {total} top-tier spots curated for your palate
          </p>
        </div>

        {/* Search & Location Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-rose-500 focus:bg-white transition"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Location e.g. NY, Brooklyn"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              className="w-full pl-3 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-rose-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-2xl transition cursor-pointer shrink-0"
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
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 outline-none cursor-pointer hover:border-neutral-300"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>

          {/* Price Range Dropdown */}
          <select
            value={priceRange}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 outline-none cursor-pointer hover:border-neutral-300"
          >
            {PRICE_RANGES.map((pr) => (
              <option key={pr} value={pr}>Price: {pr}</option>
            ))}
          </select>

          {/* Reset Filters button */}
          {(category !== 'All' || priceRange !== 'All' || searchQuery || locationQuery) && (
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
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold text-neutral-800 outline-none cursor-pointer"
          >
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
            <option value="newest">Newest</option>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {getPageNumbers(page, totalPages).map((p, i) =>
                  p === '...' ? (
                    <span key={`gap-${i}`} className="px-2 text-xs text-neutral-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                        p === page
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-500">
                Showing {firstShown}–{lastShown} of {total} restaurants
              </p>
            </div>
          )}
        </>
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