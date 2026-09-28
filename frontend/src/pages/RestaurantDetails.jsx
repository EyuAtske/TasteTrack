import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Heart,
  MessageSquare,
  ArrowLeft,
  Share2,
  CheckCircle2,
  UtensilsCrossed,
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';

export default function RestaurantDetails() {
  const { id } = useParams();
  const { user, toggleFavoriteRestaurant } = useAuth();
  const { addToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRestaurantAndReviews();
  }, [id]);

  const fetchRestaurantAndReviews = async () => {
    setIsLoading(true);
    try {
      const restData = await restaurantApi.getRestaurantById(id);
      setRestaurant(restData.restaurant || restData);

      const revData = await reviewApi.getReviewsByRestaurant(id);
      setReviews(revData.reviews || []);
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to load restaurant details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = user?.favorites?.includes(String(id));

  const handleToggleFavorite = () => {
    if (!user) {
      addToast('Login Required', 'Please log in to save restaurants to your favorites.', 'info');
      return;
    }

    toggleFavoriteRestaurant(String(id));
    if (isFavorite) {
      addToast('Removed from favorites', `${restaurant.name} removed from saved places.`, 'info');
    } else {
      addToast('Saved to favorites!', `${restaurant.name} added to your saved list.`, 'success');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      addToast('Validation Error', 'Please fill in both review title and comment.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewApi.addReview({
        restaurantId: id,
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });

      addToast('Review Published!', 'Thank you for contributing to TasteTrack!', 'success');
      setIsReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
      setNewRating(5);

      // Refresh reviews list
      const revData = await reviewApi.getReviewsByRestaurant(id);
      setReviews(revData.reviews || []);
    } catch (err) {
      addToast('Submission Error', 'Failed to post your review. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-96 bg-neutral-200 rounded-3xl" />
        <div className="h-40 bg-neutral-200 rounded-3xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-4">
        <UtensilsCrossed className="w-12 h-12 text-neutral-300 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-800">Restaurant Not Found</h2>
        <p className="text-xs text-neutral-500">The requested restaurant may have been removed or doesn't exist.</p>
        <Link to="/restaurants" className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const images = restaurant.images && restaurant.images.length > 0
    ? restaurant.images
    : ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80'];

  return (
    <div className="space-y-8">
      {/* Back button link */}
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search results
      </Link>

      {/* Main Image Gallery & Banner */}
      <div className="space-y-4">
        <div className="relative aspect-16/9 md:aspect-21/9 rounded-3xl overflow-hidden bg-neutral-900 shadow-xl border border-neutral-200">
          <img
            src={images[selectedImage]}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Banner Overlays */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                  {restaurant.category || restaurant.cuisine}
                </span>
                <span className="px-3 py-1 bg-emerald-600/90 rounded-full text-xs font-bold">
                  {restaurant.priceRange || '$$'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{restaurant.name}</h1>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            {/* Rating badge & Favorite Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 bg-white/90 backdrop-blur-md text-neutral-900 rounded-2xl flex items-center gap-2 shadow-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <div className="text-sm font-black leading-none">{restaurant.averageRating || '4.8'}</div>
                  <div className="text-[10px] text-neutral-500 font-semibold mt-0.5">{reviews.length} reviews</div>
                </div>
              </div>

              <button
                onClick={handleToggleFavorite}
                className={`p-3.5 rounded-2xl backdrop-blur-md transition-all shadow-lg cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/90 text-neutral-800 hover:bg-white hover:text-rose-600'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                  selectedImage === idx ? 'border-rose-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Description & Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">About {restaurant.name}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {restaurant.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">Diner Reviews</h2>
                <p className="text-xs text-neutral-500">Based on authentic foodie experiences</p>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    addToast('Login Required', 'Please log in to write a review.', 'info');
                    return;
                  }
                  setIsReviewModalOpen(true);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-neutral-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={rev.user?.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{rev.user?.name || 'Gourmet Diner'}</p>
                          <p className="text-[10px] text-neutral-400">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>

                      <RatingStars rating={rev.rating} size="xs" />
                    </div>

                    <h4 className="text-sm font-bold text-neutral-800">{rev.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-xs">No reviews written yet for this restaurant. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Contact & Opening Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Restaurant Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">Opening Hours</p>
                  <p className="text-neutral-600 mt-0.5">{restaurant.openingHours || 'Mon-Sun: 11:30 AM - 10:00 PM'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">Address</p>
                  <p className="text-neutral-600 mt-0.5">{restaurant.address}</p>
                </div>
              </div>

              {restaurant.contact?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-800">Telephone</p>
                    <a href={`tel:${restaurant.contact.phone}`} className="text-rose-600 font-semibold hover:underline mt-0.5 block">
                      {restaurant.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {restaurant.contact?.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-800">Website</p>
                    <a
                      href={restaurant.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 font-semibold hover:underline mt-0.5 block truncate max-w-[200px]"
                    >
                      Visit official site
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Link Copied!', 'Restaurant link copied to clipboard.', 'success');
                }}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Restaurant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${restaurant.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Your Rating
            </label>
            <RatingStars rating={newRating} size="lg" interactive onChange={setNewRating} />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Incredible hand-rolled pasta!"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Detailed Experience
            </label>
            <textarea
              rows={4}
              placeholder="Tell other foodies about the atmosphere, service, and dish recommendations..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition cursor-pointer"
          >
            {isSubmittingReview ? 'Publishing...' : 'Publish Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
