import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  UtensilsCrossed,
  Pencil,
  Trash2,
  Shield,
  Search,
  Loader2,
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import ImageUploadInput from '../components/ImageUploadInput';
import RestaurantMap from '../components/RestaurantMap';

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavoriteRestaurant } = useAuth();
  const { addToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ── Write/Edit Review Modal ──
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // ── Delete Review Confirmation ──
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);

  // ── Edit Restaurant Modal (Admin) ──
  const [isEditRestaurantModalOpen, setIsEditRestaurantModalOpen] = useState(false);
  const [editRestaurantForm, setEditRestaurantForm] = useState({});
  const [isSavingRestaurant, setIsSavingRestaurant] = useState(false);
  const [removedImages, setRemovedImages] = useState([]); // existing photo URLs marked for removal
  const [editSession, setEditSession] = useState(0); // remounts the photo picker on each open
  const [isGeocoding, setIsGeocoding] = useState(false);

  // ── Delete Restaurant Confirmation (Admin) ──
  const [isDeleteRestaurantModalOpen, setIsDeleteRestaurantModalOpen] = useState(false);
  const [isDeletingRestaurant, setIsDeletingRestaurant] = useState(false);

  const fetchRestaurantAndReviews = async () => {
    setIsLoading(true);
    try {
      const restData = await restaurantApi.getRestaurantById(id);
      // Backend returns { success, data: restaurant }; mock mode returns { restaurant }
      const rest = restData.restaurant || restData.data || restData;
      setRestaurant(rest);
      setRemovedImages([]);
      setSelectedImage(0);
      setEditRestaurantForm({
        name: rest.name || '',
        description: rest.description || '',
        category: rest.category || '',
        cuisine: rest.cuisine || '',
        priceRange: rest.priceRange || '$$',
        address: rest.address || '',
        latitude: rest.latitude ?? '',
        longitude: rest.longitude ?? '',
        openingHours: rest.openingHours || '',
        phone: rest.contact?.phone || '',
        website: rest.contact?.website || '',
      });

      const revData = await reviewApi.getReviewsByRestaurant(id);
      setReviews(revData.reviews || revData.data || []);
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to load restaurant details.', 'error');
    } fontally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantAndReviews();
  }, [id]);

  const isFavorite = user?.favorites?.includes(String(id));
  const isAdmin = user?.role === 'admin';

  const handleToggleFavorite = async () => {
    if (!user) {
      addToast('Login Required', 'Please log in to save restaurants to your favorites.', 'info');
      return;
    }
    const wasFavorite = isFavorite;
    const ok = await toggleFavoriteRestaurant(String(id));
    if (!ok) {
      addToast('Error', 'Could not update your favorites. Please log in again and retry.', 'error');
      return;
    }
    if (wasFavorite) {
      addToast('Removed from favorites', `${restaurant.name} removed from saved places.`, 'info');
    } else {
      addToast('Saved to favorites!', `${restaurant.name} added to your saved list.`, 'success');
    }
  };

  const handleGeocodeAddress = async () => {
    if (!editRestaurantForm.address?.trim()) return;
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(editRestaurantForm.address)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setEditRestaurantForm((prev) => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        }));
        addToast('Location found!', `Coordinates updated: (${data[0].lat}, ${data[0].lon})`, 'success');
      } else {
        addToast('Geocode Notice', 'Could not locate address automatically. Please enter lat/lng manually.', 'info');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // ── Open Write or Edit Review Modal ──
  const openReviewModal = (review = null) => {
    if (!user) {
      addToast('Login Required', 'Please log in to write a review.', 'info');
      return;
    }
    if (review) {
      setEditingReview(review);
      setNewRating(review.rating);
      setNewTitle(review.title);
      setNewComment(review.comment);
    } else {
      setEditingReview(null);
      setNewRating(5);
      setNewTitle('');
      setNewComment('');
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      addToast('Validation Error', 'Please fill in both title and comment.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        // Update existing review
        await reviewApi.updateReview(editingReview._id, {
          rating: newRating,
          title: newTitle,
          comment: newComment,
        });
        addToast('Review Updated!', 'Your review has been updated.', 'success');
      } else {
        // Create new review
        await reviewApi.addReview({
          restaurantId: id,
          rating: newRating,
          title: newTitle,
          comment: newComment,
        });
        addToast('Review Published!', 'Thank you for contributing to TasteTrack!', 'success');
      }

      setIsReviewModalOpen(false);
      setEditingReview(null);
      setNewTitle('');
      setNewComment('');
      setNewRating(5);

      // Refresh reviews & restaurant details
      const revData = await reviewApi.getReviewsByRestaurant(id);
      setReviews(revData.reviews || revData.data || []);
      const restData = await restaurantApi.getRestaurantById(id);
      setRestaurant(restData.restaurant || restData);
    } catch (err) {
      addToast('Error', 'Failed to save review. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // ── Delete Review ──
  const confirmDeleteReview = (reviewId) => {
    setDeletingReviewId(reviewId);
    setIsDeleteReviewModalOpen(true);
  };

  const handleDeleteReview = async () => {
    try {
      await reviewApi.deleteReview(deletingReviewId);
      addToast('Review Deleted', 'Your review has been removed.', 'info');
      setIsDeleteReviewModalOpen(false);
      setDeletingReviewId(null);
      const revData = await reviewApi.getReviewsByRestaurant(id);
      setReviews(revData.reviews || revData.data || []);
      const restData = await restaurantApi.getRestaurantById(id);
      setRestaurant(restData.restaurant || restData);
    } catch (err) {
      addToast('Error', 'Failed to delete review.', 'error');
    }
  };

  // ── Edit Restaurant (Admin) ──
  const handleEditRestaurantSubmit = async (e) => {
    e.preventDefault();
    setIsSavingRestaurant(true);
    try {
      const submitData = new FormData();
      submitData.append('name', editRestaurantForm.name);
      submitData.append('description', editRestaurantForm.description);
      submitData.append('category', editRestaurantForm.category);
      submitData.append('cuisine', editRestaurantForm.cuisine);
      submitData.append('priceRange', editRestaurantForm.priceRange);
      submitData.append('address', editRestaurantForm.address);
      if (editRestaurantForm.latitude !== undefined && editRestaurantForm.latitude !== '') {
        submitData.append('latitude', editRestaurantForm.latitude);
      }
      if (editRestaurantForm.longitude !== undefined && editRestaurantForm.longitude !== '') {
        submitData.append('longitude', editRestaurantForm.longitude);
      }
      submitData.append('openingHours', editRestaurantForm.openingHours);
      submitData.append('phone', editRestaurantForm.phone || '');
      submitData.append('website', editRestaurantForm.website || '');
      submitData.append('removedImages', JSON.stringify(removedImages));

      if (editRestaurantForm.imageFiles && editRestaurantForm.imageFiles.length > 0) {
        editRestaurantForm.imageFiles.forEach((file) => {
          submitData.append('images', file);
        });
      }

      await restaurantApi.updateRestaurant(id, submitData);
      addToast('Restaurant Updated!', `${editRestaurantForm.name} details saved.`, 'success');
      setIsEditRestaurantModalOpen(false);
      fetchRestaurantAndReviews();
    } catch (err) {
      addToast('Error', 'Failed to update restaurant details.', 'error');
    } finally {
      setIsSavingRestaurant(false);
    }
  };

  // ── Delete Restaurant (Admin) ──
  const handleDeleteRestaurant = async () => {
    setIsDeletingRestaurant(true);
    try {
      await restaurantApi.deleteRestaurant(id);
      addToast('Restaurant Deleted', `${restaurant.name} has been removed from TasteTrack.`, 'info');
      setIsDeleteRestaurantModalOpen(false);
      navigate('/restaurants');
    } catch (err) {
      addToast('Error', 'Failed to delete restaurant.', 'error');
      setIsDeletingRestaurant(false);
    }
  };

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-96 bg-[#EBEBEB] rounded-3xl" />
        <div className="h-40 bg-[#EBEBEB] rounded-3xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#DDDDDD] p-8 space-y-4">
        <UtensilsCrossed className="w-12 h-12 text-[#DDDDDD] mx-auto" />
        <h2 className="text-xl font-bold text-[#222222]">Restaurant Not Found</h2>
        <p className="text-xs text-[#717171]">The requested restaurant may have been removed or doesn't exist.</p>
        <Link to="/restaurants" className="inline-block px-5 py-2.5 bg-[#222222] text-white rounded-xl text-xs font-semibold">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const images = restaurant.images?.length > 0
    ? restaurant.images
    : ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80'];

  return (
    <div className="space-y-8 text-[#222222]">
      {/* Back button & Admin Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#717171] hover:text-[#222222] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to results
        </Link>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FF385C]/10 text-[#FF385C] font-bold text-[10px] rounded-md">
              <Shield className="w-3 h-3" /> Admin Controls
            </span>
            <button
              onClick={() => {
                setRemovedImages([]);
                setEditRestaurantForm((f) => ({ ...f, imageFiles: [] }));
                setEditSession((n) => n + 1);
                setIsEditRestaurantModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#222222] text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteRestaurantModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF385C] text-white text-xs font-semibold rounded-xl hover:bg-[#E00B41] transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-16/9 md:aspect-21/9 rounded-3xl overflow-hidden bg-[#EBEBEB] shadow-xl border border-[#DDDDDD]">
          <img
            src={images[selectedImage]}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Banner Overlay */}
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
                <MapPin className="w-4 h-4 text-[#FF385C] shrink-0" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#222222] rounded-2xl flex items-center gap-2 shadow-lg">
                <Star className="w-5 h-5 fill-[#222222] text-[#222222]" />
                <div>
                  <div className="text-sm font-black leading-none">
                    {restaurant.averageRating ? Number(restaurant.averageRating).toFixed(1) : 'New'}
                  </div>
                  <div className="text-[10px] text-[#717171] font-semibold mt-0.5">{reviews.length} reviews</div>
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-3.5 rounded-2xl backdrop-blur-md transition-all shadow-lg cursor-pointer ${
                  isFavorite ? 'bg-[#FF385C] text-white' : 'bg-white/90 text-[#222222] hover:bg-white hover:text-[#FF385C]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                  selectedImage === idx ? 'border-[#FF385C] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Description & Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* About */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDDDDD] space-y-4">
            <h2 className="text-xl font-bold tracking-tight">About {restaurant.name}</h2>
            <p className="text-sm text-[#717171] leading-relaxed">{restaurant.description}</p>
          </div>

          {/* Interactive Map */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDDDDD] space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF385C]" /> Location & Map
            </h2>
            <p className="text-xs text-[#717171]">{restaurant.address}</p>
            <RestaurantMap
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
              name={restaurant.name}
              address={restaurant.address}
              height="300px"
            />
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDDDDD] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Diner Reviews</h2>
                <p className="text-xs text-[#717171]">Based on authentic foodie experiences</p>
              </div>
              <button
                onClick={() => openReviewModal()}
                className="px-4 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-5 divide-y divide-[#EBEBEB]">
                {reviews.map((rev) => {
                  const revUserId = rev.user?._id || rev.user;
                  const currentUserId = user?._id || user?.id;
                  const isOwner = user && String(revUserId) === String(currentUserId);
                  const canModify = isOwner || isAdmin;

                  return (
                    <div key={rev._id} className="pt-5 first:pt-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={rev.user?.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#DDDDDD]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#222222]">{rev.user?.name || 'Gourmet Diner'}</p>
                            <p className="text-[10px] text-[#717171]">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <RatingStars rating={rev.rating} size="xs" />
                          {canModify && (
                            <div className="flex items-center gap-1.5 ml-2">
                              <button
                                onClick={() => openReviewModal(rev)}
                                className="p-1.5 rounded-lg text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7] transition cursor-pointer"
                                title="Edit review"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => confirmDeleteReview(rev._id)}
                                className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF385C] hover:bg-[#FFF0F0] transition cursor-pointer"
                                title="Delete review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-[#222222]">{rev.title}</h4>
                      <p className="text-xs text-[#717171] leading-relaxed">{rev.comment}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <MessageSquare className="w-8 h-8 text-[#DDDDDD] mx-auto" />
                <p className="text-xs text-[#717171]">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#DDDDDD] space-y-5 sticky top-24">
            <h3 className="text-base font-bold border-b border-[#EBEBEB] pb-3">Restaurant Details</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#717171] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Opening Hours</p>
                  <p className="text-[#717171] mt-0.5">{restaurant.openingHours || 'Hours not listed'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#717171] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Address</p>
                  <p className="text-[#717171] mt-0.5">{restaurant.address}</p>
                </div>
              </div>

              {restaurant.contact?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#717171] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Telephone</p>
                    <a href={`tel:${restaurant.contact.phone}`} className="text-[#FF385C] font-semibold hover:underline mt-0.5 block">
                      {restaurant.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {restaurant.contact?.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#717171] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Website</p>
                    <a
                      href={restaurant.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF385C] font-semibold hover:underline mt-0.5 block truncate max-w-[200px]"
                    >
                      Visit official site
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#EBEBEB]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Link Copied!', 'Restaurant link copied to clipboard.', 'success');
                }}
                className="w-full py-2.5 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Write / Edit Review Modal ── */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }}
        title={editingReview ? 'Edit Your Review' : `Review ${restaurant.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">Your Rating</label>
            <RatingStars rating={newRating} size="lg" interactive onChange={setNewRating} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">Review Headline</label>
            <input
              type="text"
              placeholder="e.g. Incredible hand-rolled pasta!"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C] focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">Detailed Experience</label>
            <textarea
              rows={4}
              placeholder="Tell other foodies about the atmosphere, service, and dishes..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C] focus:bg-white resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-60"
          >
            {isSubmittingReview ? (editingReview ? 'Saving...' : 'Publishing...') : (editingReview ? 'Save Changes' : 'Publish Review')}
          </button>
        </form>
      </Modal>

      {/* ── Delete Review Confirmation Modal ── */}
      <Modal
        isOpen={isDeleteReviewModalOpen}
        onClose={() => setIsDeleteReviewModalOpen(false)}
        title="Delete Review"
      >
        <div className="space-y-5">
          <p className="text-sm text-[#717171]">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setIsDeleteReviewModalOpen(false)}
              className="px-4 py-2 border border-[#DDDDDD] text-[#222222] text-xs font-semibold rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteReview}
              className="px-4 py-2 bg-[#FF385C] text-white text-xs font-bold rounded-xl hover:bg-[#E00B41] transition cursor-pointer"
            >
              Delete Review
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Restaurant Modal (Admin) ── */}
      <Modal
        isOpen={isEditRestaurantModalOpen}
        onClose={() => setIsEditRestaurantModalOpen(false)}
        title="Edit Restaurant"
      >
        <form onSubmit={handleEditRestaurantSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Restaurant Name</label>
            <input
              type="text"
              value={editRestaurantForm.name || ''}
              onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Category</label>
              <select
                value={editRestaurantForm.category || ''}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none"
              >
                <option>Italian</option>
                <option>Japanese</option>
                <option>BBQ</option>
                <option>Vegan</option>
                <option>Fine Dining</option>
                <option>Cafes</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Price Range</label>
              <select
                value={editRestaurantForm.priceRange || '$$'}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, priceRange: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none"
              >
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider">Address</label>
              <button
                type="button"
                onClick={handleGeocodeAddress}
                disabled={isGeocoding}
                className="text-[10px] font-semibold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isGeocoding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                <span>Auto-find coordinates</span>
              </button>
            </div>
            <input
              type="text"
              value={editRestaurantForm.address || ''}
              onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, address: e.target.value })}
              onBlur={handleGeocodeAddress}
              className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={editRestaurantForm.latitude ?? ''}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, latitude: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
                placeholder="e.g. 40.7128"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={editRestaurantForm.longitude ?? ''}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, longitude: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
                placeholder="e.g. -74.0060"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Opening Hours</label>
            <input
              type="text"
              value={editRestaurantForm.openingHours || ''}
              onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, openingHours: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={3}
              value={editRestaurantForm.description || ''}
              onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                value={editRestaurantForm.phone || ''}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Website</label>
              <input
                type="text"
                value={editRestaurantForm.website || ''}
                onChange={(e) => setEditRestaurantForm({ ...editRestaurantForm, website: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#FF385C]"
              />
            </div>
          </div>

          <ImageUploadInput
            key={editSession}
            multiple={true}
            maxFiles={5}
            initialImages={restaurant?.images || []}
            label="Photos (click × to remove, or upload new ones)"
            onChange={(files) => setEditRestaurantForm({ ...editRestaurantForm, imageFiles: files })}
            onExistingChange={(kept) =>
              setRemovedImages((restaurant?.images || []).filter((url) => !kept.includes(url)))
            }
          />

          <button
            type="submit"
            disabled={isSavingRestaurant}
            className="w-full py-3 bg-[#222222] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-60"
          >
            {isSavingRestaurant ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* ── Delete Restaurant Confirmation (Admin) ── */}
      <Modal
        isOpen={isDeleteRestaurantModalOpen}
        onClose={() => setIsDeleteRestaurantModalOpen(false)}
        title="Delete Restaurant"
      >
        <div className="space-y-5">
          <p className="text-sm text-[#717171]">
            Are you sure you want to permanently delete <span className="font-bold text-[#222222]">{restaurant.name}</span>? This will also remove all its reviews and cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
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