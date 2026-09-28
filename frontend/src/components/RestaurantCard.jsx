import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RestaurantCard({ restaurant }) {
  const { user, toggleFavoriteRestaurant } = useAuth();
  const { addToast } = useToast();

  const isFavorite = user?.favorites?.includes(String(restaurant._id));

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Login Required', 'Please log in to save restaurants to your favorites.', 'info');
      return;
    }

    toggleFavoriteRestaurant(String(restaurant._id));
    if (isFavorite) {
      addToast('Removed from wishlist', `${restaurant.name} was removed from your saved spots.`, 'info');
    } else {
      addToast('Saved to wishlist!', `${restaurant.name} was added to your saved spots.`, 'success');
    }
  };

  const image = restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col space-y-3 cursor-pointer">
      {/* Image Container with Airbnb Heart Floating Bookmark */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#EBEBEB]">
        <img
          src={image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Favorite Bookmark Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white flex items-center justify-center text-[#222222] transition cursor-pointer shadow-sm hover:scale-110 active:scale-95"
          title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-[#222222] hover:text-[#FF385C]'
            }`}
          />
        </button>

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wide">
          {restaurant.category || restaurant.cuisine}
        </div>
      </div>

      {/* Info Content Section (Airbnb Card Metadata style) */}
      <div className="space-y-1 text-xs">
        {/* Row 1: Name & Rating */}
        <div className="flex items-center justify-between gap-2 font-bold text-[#222222]">
          <Link to={`/restaurants/${restaurant._id}`} className="hover:underline truncate">
            {restaurant.name}
          </Link>
          <div className="flex items-center gap-1 shrink-0 font-medium text-xs">
            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
            <span>{restaurant.averageRating || '4.8'}</span>
          </div>
        </div>

        {/* Row 2: Neighborhood / Location */}
        <p className="text-[#717171] line-clamp-1">
          {restaurant.address}
        </p>

        {/* Row 3: Cuisine & Hours */}
        <p className="text-[#717171] truncate">
          {restaurant.cuisine} • {restaurant.reviewCount ? `${restaurant.reviewCount} reviews` : 'Top rated'}
        </p>

        {/* Row 4: Price Tag */}
        <div className="pt-0.5 text-xs font-semibold text-[#222222]">
          <span>{restaurant.priceRange || '$$'}</span> <span className="font-normal text-[#717171]">per guest</span>
        </div>
      </div>
    </div>
  );
}
