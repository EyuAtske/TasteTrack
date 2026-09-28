import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, DollarSign, ArrowUpRight } from 'lucide-react';
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
      addToast('Authentication Required', 'Please log in to save restaurants to your favorites.', 'info');
      return;
    }

    toggleFavoriteRestaurant(String(restaurant._id));
    if (isFavorite) {
      addToast('Removed from favorites', `${restaurant.name} was removed from your wishlist.`, 'info');
    } else {
      addToast('Saved to favorites!', `${restaurant.name} was added to your saved spots.`, 'success');
    }
  };

  const image = restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Header Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Favorite Bookmark Badge */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md hover:bg-white flex items-center justify-center text-neutral-700 hover:text-rose-500 transition-colors shadow-md cursor-pointer group/fav"
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-transform active:scale-125 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-700 group-hover/fav:text-rose-500'
            }`}
          />
        </button>

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-[11px] font-semibold text-white tracking-wide">
          {restaurant.category || restaurant.cuisine}
        </div>

        {/* Price Tag Badge */}
        <div className="absolute bottom-3 left-3 z-10 font-bold text-xs text-white bg-emerald-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-xs">
          {restaurant.priceRange || '$$'}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-neutral-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
              <Link to={`/restaurants/${restaurant._id}`}>{restaurant.name}</Link>
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200/60 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-900">{restaurant.averageRating || '4.8'}</span>
            </div>
          </div>

          {/* Location / Address */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
            {restaurant.description}
          </p>
        </div>

        {/* Bottom Bar: Action Link */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-auto">
          <span className="text-[11px] font-medium text-neutral-400">
            {restaurant.reviewCount ? `${restaurant.reviewCount} reviews` : 'Top rated'}
          </span>
          <Link
            to={`/restaurants/${restaurant._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
