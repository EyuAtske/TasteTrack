import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Compass, Utensils, X, Navigation } from 'lucide-react';

const POPULAR_LOCATIONS = [
  'Anywhere',
  'Bole',
  'Addis Ababa',
  'Gabon St',
  'Atlas',
  'Rwanda St',
  'Brooklyn',
  'Downtown',
];

const CATEGORIES = [
  { id: 'All', label: 'All Cuisines' },
  { id: 'Italian', label: 'Italian' },
  { id: 'Japanese', label: 'Japanese' },
  { id: 'BBQ', label: 'BBQ' },
  { id: 'Vegan', label: 'Vegan' },
  { id: 'Fine Dining', label: 'Fine Dining' },
  { id: 'Cafes', label: 'Cafes' },
];

const PRICES = ['All', '$', '$$', '$$$', '$$$$'];

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [categoryInput, setCategoryInput] = useState(searchParams.get('category') || 'All');
  const [priceInput, setPriceInput] = useState(searchParams.get('priceRange') || 'All');
  const [keywordInput, setKeywordInput] = useState(searchParams.get('search') || '');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocationInput(searchParams.get('location') || '');
      setCategoryInput(searchParams.get('category') || 'All');
      setPriceInput(searchParams.get('priceRange') || 'All');
      setKeywordInput(searchParams.get('search') || '');
    }
  }, [isOpen, searchParams]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const realCity =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.suburb ||
              data?.address?.neighbourhood ||
              data?.address?.county ||
              data?.address?.state ||
              'Current Location';
            setLocationInput(realCity);
          } catch (e) {
            setLocationInput('Current Location');
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          console.warn('Geolocation error or permission denied:', err);
          setLocationInput('Current Location');
          setIsLocating(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setLocationInput('Current Location');
      setIsLocating(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();

    if (locationInput.trim() && locationInput !== 'Anywhere') {
      query.set('location', locationInput.trim());
    }
    if (categoryInput && categoryInput !== 'All') {
      query.set('category', categoryInput);
    }
    if (priceInput && priceInput !== 'All') {
      query.set('priceRange', priceInput);
    }
    if (keywordInput.trim()) {
      query.set('search', keywordInput.trim());
    }

    onClose();
    navigate(`/restaurants?${query.toString()}`);
  };

  const handlePopularLocationClick = (loc) => {
    const selectedLoc = loc === 'Anywhere' ? '' : loc;
    setLocationInput(selectedLoc);
  };

  const handleReset = () => {
    setLocationInput('');
    setCategoryInput('All');
    setPriceInput('All');
    setKeywordInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-200 text-[#222222]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#FF385C]" />
            <h3 className="text-base font-extrabold tracking-tight">Search Dining Spots</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSearchSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Where / Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#222222]">
                Where (Location)
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 text-xs font-bold text-[#FF385C] hover:underline cursor-pointer disabled:opacity-50"
              >
                <Navigation className="w-3.5 h-3.5 fill-[#FF385C]" />
                <span>{isLocating ? 'Detecting location...' : 'Use current location'}</span>
              </button>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
              <input
                type="text"
                placeholder="Search destinations, neighborhoods, cities (e.g. Bole, Addis Ababa)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl outline-none focus:border-[#222222] focus:bg-white transition font-medium"
              />
            </div>

            {/* Popular location chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#717171] font-semibold mr-1">Popular:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handlePopularLocationClick(loc)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    (loc === 'Anywhere' && !locationInput) || locationInput === loc
                      ? 'bg-[#222222] text-white'
                      : 'bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#717171]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Cuisine / Category */}
          <div className="space-y-3 pt-2 border-t border-[#EBEBEB]">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#222222]">
              Cuisine Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryInput(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    categoryInput === cat.id
                      ? 'border-[#FF385C] bg-[#FF385C]/10 text-[#FF385C]'
                      : 'border-[#DDDDDD] bg-white text-[#717171] hover:border-[#222222] hover:text-[#222222]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Price Range & Keyword */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EBEBEB]">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#222222]">
                Price Range
              </label>
              <div className="flex items-center gap-1.5">
                {PRICES.map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPriceInput(pr)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      priceInput === pr
                        ? 'border-[#222222] bg-[#222222] text-white'
                        : 'border-[#DDDDDD] bg-white text-[#717171] hover:border-[#222222]'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#222222]">
                Dish or Keyword
              </label>
              <input
                type="text"
                placeholder="e.g. Wood-fired pizza, Omakase..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl outline-none focus:border-[#222222] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBEB]">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-[#717171] hover:text-[#222222] hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-[#DDDDDD] text-[#222222] font-semibold text-xs rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search Spots</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
