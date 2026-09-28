import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Utensils,
  Pizza,
  Fish,
  Flame,
  Salad,
  Wine,
  Coffee,
  Star,
  Compass,
  Heart,
  ShieldCheck,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = [
  { id: 'All', label: 'All Places', icon: Utensils },
  { id: 'Italian', label: 'Italian', icon: Pizza },
  { id: 'Japanese', label: 'Japanese', icon: Fish },
  { id: 'BBQ', label: 'BBQ', icon: Flame },
  { id: 'Vegan', label: 'Vegan', icon: Salad },
  { id: 'Fine Dining', label: 'Fine Dining', icon: Wine },
  { id: 'Cafes', label: 'Cafes', icon: Coffee },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [searchPrice, setSearchPrice] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantApi.getRestaurants({ category: selectedCategory });
      setRestaurants(data.restaurants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirbnbSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchLocation.trim()) queryParams.set('search', searchLocation.trim());
    if (searchCuisine.trim()) queryParams.set('category', searchCuisine.trim());
    if (searchPrice !== 'All') queryParams.set('priceRange', searchPrice);

    navigate(`/restaurants?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-10 text-[#222222]">
      {/* Floating Airbnb Signature Search Bar Section */}
      <section className="pt-2 pb-4 flex flex-col items-center">
        {/* Airbnb Search Capsule */}
        <form
          onSubmit={handleAirbnbSearchSubmit}
          className="w-full max-w-4xl bg-white rounded-full border border-[#DDDDDD] shadow-lg hover:shadow-xl transition-shadow duration-300 p-2 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-[#EBEBEB]"
        >
          {/* Segment 1: Location */}
          <div className="flex-1 w-full px-6 py-2 flex flex-col justify-center hover:bg-neutral-100/70 rounded-full transition cursor-pointer">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#222222]">
              Where
            </label>
            <input
              type="text"
              placeholder="Search destinations, neighborhoods..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full text-xs font-semibold text-[#222222] placeholder-[#717171] bg-transparent outline-none truncate"
            />
          </div>

          {/* Segment 2: Cuisine */}
          <div className="flex-1 w-full px-6 py-2 flex flex-col justify-center hover:bg-neutral-100/70 rounded-full transition cursor-pointer">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#222222]">
              Cuisine
            </label>
            <input
              type="text"
              placeholder="Italian, Sushi, BBQ, Vegan..."
              value={searchCuisine}
              onChange={(e) => setSearchCuisine(e.target.value)}
              className="w-full text-xs font-semibold text-[#222222] placeholder-[#717171] bg-transparent outline-none truncate"
            />
          </div>

          {/* Segment 3: Price Range */}
          <div className="w-full md:w-48 px-6 py-2 flex flex-col justify-center hover:bg-neutral-100/70 rounded-full transition cursor-pointer">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#222222]">
              Price
            </label>
            <select
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              className="w-full text-xs font-semibold text-[#222222] bg-transparent outline-none cursor-pointer"
            >
              <option value="All">Any price</option>
              <option value="$">$ (Budget)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Upscale)</option>
              <option value="$$$$">$$$$ (Fine dining)</option>
            </select>
          </div>

          {/* Search Button Circle */}
          <div className="p-1 w-full md:w-auto flex justify-end">
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
              title="Search restaurants"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </section>

      {/* Airbnb Style Category Tabs */}
      <section className="border-b border-[#EBEBEB] pb-3">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-none px-2 py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 pb-3 min-w-[64px] border-b-2 transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#222222] text-[#222222] font-bold'
                    : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD] font-medium'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[#222222]' : 'text-[#717171] group-hover:text-[#222222]'
                  }`}
                />
                <span className="text-xs tracking-tight whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid: Airbnb Neighborhood Discoveries */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#222222]">
              {selectedCategory === 'All' ? 'Top-rated spots near you' : `${selectedCategory} dining`}
            </h2>
            <p className="text-xs text-[#717171] mt-0.5">Handpicked places loved by local foodies</p>
          </div>
          <Link
            to="/restaurants"
            className="flex items-center gap-1 text-xs font-semibold text-[#222222] hover:underline"
          >
            <span>Show all ({restaurants.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-3 animate-pulse">
                <div className="aspect-square bg-[#EBEBEB] rounded-2xl" />
                <div className="h-4 bg-[#EBEBEB] rounded w-3/4" />
                <div className="h-3 bg-[#EBEBEB] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#DDDDDD] p-8 space-y-3">
            <Utensils className="w-10 h-10 text-[#717171] mx-auto" />
            <h3 className="text-base font-bold text-[#222222]">No dining spots found</h3>
            <p className="text-xs text-[#717171]">Try switching categories or clearing search filters.</p>
          </div>
        )}
      </section>

      {/* Airbnb Feature Card Banner */}
      <section className="bg-[#F7F7F7] rounded-3xl p-8 sm:p-12 border border-[#EBEBEB] space-y-8">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TasteTrack Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222]">
            Discover places with total confidence
          </h2>
          <p className="text-xs sm:text-sm text-[#717171]">
            Every review on TasteTrack is published by real community diners and verified taste critics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-[#FF385C]" />
            </div>
            <h3 className="font-bold text-sm text-[#222222]">Verified Diner Ratings</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Transparent review scores reflecting authentic dish quality, service, and ambiance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 fill-[#FF385C]" />
            </div>
            <h3 className="font-bold text-sm text-[#222222]">Saved Wishlists</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Bookmark restaurants you want to visit and share lists with friends seamlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#222222]">Community Trusted</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Join over 12,000 foodies tracking their favorite restaurants around the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
