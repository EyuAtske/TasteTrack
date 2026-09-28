import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Utensils, Star, Flame, Compass, Award, ArrowRight, Heart } from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = [
  { id: 'All', label: 'All Cuisines', icon: '🍽️' },
  { id: 'Italian', label: 'Italian', icon: '🍕' },
  { id: 'Japanese', label: 'Japanese', icon: '🍣' },
  { id: 'BBQ', label: 'Craft BBQ', icon: '🥩' },
  { id: 'Vegan', label: 'Plant-Based', icon: '🥗' },
  { id: 'Fine Dining', label: 'Fine Dining', icon: '🍷' },
  { id: 'Cafes', label: 'Cafes & Bakery', icon: '☕' },
];

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await restaurantApi.getRestaurants({ category: selectedCategory });
        setFeaturedRestaurants(data.restaurants || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, [selectedCategory]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[480px] sm:min-h-[520px] flex items-center justify-center p-6 sm:p-12 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80"
          alt="Restaurant hero"
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-black/30" />

        <div className="relative z-10 max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-rose-300">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Discover the world's most irresistible flavors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find Your Next <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">Unforgettable Meal</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            TasteTrack connects passionate food lovers with top-rated restaurants, hidden neighborhood gems, and authentic foodie reviews.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
            <div className="p-2 bg-white rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
              <div className="flex-1 flex items-center gap-3 pl-4 w-full">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by restaurant name, dish, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl sm:rounded-full transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-300 pt-2">
            <span className="font-semibold text-neutral-400">Popular:</span>
            <button onClick={() => navigate('/restaurants?category=Italian')} className="hover:text-rose-300 underline underline-offset-2">Wood-fired Pizza</button>
            <span>•</span>
            <button onClick={() => navigate('/restaurants?category=Japanese')} className="hover:text-rose-300 underline underline-offset-2">Sushi Omakase</button>
            <span>•</span>
            <button onClick={() => navigate('/restaurants?category=BBQ')} className="hover:text-rose-300 underline underline-offset-2">Smokey BBQ</button>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Explore by Category</h2>
            <p className="text-xs text-neutral-500">Pick a cuisine to filter top dining spots around town</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-105'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Restaurants Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {selectedCategory === 'All' ? 'Trending Dining Spots' : `${selectedCategory} Restaurants`}
            </h2>
            <p className="text-xs text-neutral-500">Highest rated places curated by TasteTrack members</p>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-neutral-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-8">
            <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No restaurants found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try selecting another category or clear filters.</p>
          </div>
        )}
      </section>

      {/* Why Choose TasteTrack Feature Grid */}
      <section className="bg-gradient-to-b from-rose-50/50 to-neutral-100/50 rounded-3xl p-8 sm:p-12 border border-rose-100/60 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Why Foodies Love TasteTrack
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Designed to make food discovery seamless, honest, and delightfully social.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">Honest Ratings & Reviews</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Read real feedback from verified diners. No fake promotional hype—just genuine taste experiences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">Personalized Wishlists</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Save your favorite restaurants with a single click and organize your bucket list for upcoming weekend dining.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">Smart Search & Filter</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Filter by cuisine, price range ($ to $$$$), opening hours, and location to find exactly what you're craving.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Join Banner */}
      <section className="bg-neutral-900 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to start tracking your food journey?</h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Create an account today to write reviews, save favorites, and unlock your personal foodie dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Join TasteTrack
          </Link>
        </div>
      </section>
    </div>
  );
}
