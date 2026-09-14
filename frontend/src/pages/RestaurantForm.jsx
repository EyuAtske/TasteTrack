import { useState } from 'react';
import { Store, MapPin, Clock, Phone, Sparkles, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const CATEGORIES = ['Fine Dining', 'Casual Dining', 'Cafe & Bakery', 'Bistro', 'Street Food', 'Bar & Lounge'];
const CUISINES = ['Italian', 'Ethiopian', 'Japanese', 'Mexican', 'French', 'Mediterranean', 'American'];
const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$'];

export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    name: 'Trattoria Bella Vista',
    description: 'Authentic handmade pasta, wood-fired artisan pizza, and organic wines in a cozy setting.',
    category: 'Casual Dining',
    cuisine: 'Italian',
    priceRange: 'birr',
    address: 'Summit Fiyel bet ',
    contact: '+251935678934',
    openingHours: 'Mon-Sun: 11:30 AM - 10:00 PM',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange迷 = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Restaurant "${formData.name}" published successfully!`);
    }, 700);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
          Admin Portal • Week 2
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
          Add New Restaurant
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Create and manage restaurant listings with live Airbnb card preview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4" /> 1. General Details
              </h2>

              <Input
                label="Restaurant Name"
                value={formData.name}
                onChange={(e) => handleChange迷('name', e.target.value)}
                placeholder="e.g. Osteria Francescana"
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange迷('description', e.target.value)}
                  className="w-full text-sm text-neutral-900 bg-white rounded-xl border border-neutral-200 p-3.5 focus:border-neutral-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange迷('category', e.target.value)}
                    className="w-full text-sm text-neutral-900 bg-white rounded-xl border border-neutral-200 p-3 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                    Cuisine Type
                  </label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => handleChange迷('cuisine', e.target.value)}
                    className="w-full text-sm text-neutral-900 bg-white rounded-xl border border-neutral-200 p-3 outline-none"
                  >
                    {CUISINES.map((cui) => (
                      <option key={cui} value={cui}>
                        {cui}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                  Price Range
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRICE_OPTIONS.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => handleChange迷('priceRange', price)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        formData.priceRange === price
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Location & Contact */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 2. Location & Contact
              </h2>

              <Input
                label="Full Address"
                value={formData.address}
                onChange={(e) => handleChange迷('address', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  value={formData.contact}
                  onChange={(e) => handleChange迷('contact', e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Opening Hours"
                  value={formData.openingHours}
                  onChange={(e) => handleChange迷('openingHours', e.target.value)}
                  leftIcon={<Clock className="w-4 h-4" />}
                />
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Photo */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> 3. Photo URL
              </h2>
              <Input
                label="Cover Image Link"
                value={formData.coverImage}
                onChange={(e) => handleChange迷('coverImage', e.target.value)}
                helperText="Paste direct image link from Unsplash or web"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              Publish Listing
            </Button>
          </form>
        </div>

        {/* Right Live Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Airbnb Card
            </span>
            <span className="text-neutral-400 font-normal">Real-time update</span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="relative aspect-4/3 w-full bg-neutral-100">
              <img
                src={formData.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3.5 right-3.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                {formData.priceRange}
              </div>
              <div className="absolute bottom-3.5 left-3.5 px-3 py-1 bg-neutral-900/80 backdrop-blur-md rounded-full text-xs font-medium text-white shadow-sm">
                {formData.cuisine} • {formData.category}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-neutral-900 text-lg leading-snug">
                  {formData.name || 'Untitled Restaurant'}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  ★ 4.9 <span className="text-neutral-400 font-normal">(18)</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span className="truncate">{formData.address || 'Address'}</span>
              </p>

              <p className="text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
                {formData.description}
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  {formData.openingHours || 'Open daily'}
                </span>
                <span className="font-semibold text-rose-600 hover:underline cursor-pointer">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}