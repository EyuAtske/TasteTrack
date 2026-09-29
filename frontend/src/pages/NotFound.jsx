import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      {/* 404 Visual */}
      <div className="space-y-2">
        <p className="text-8xl font-black text-[#EBEBEB] select-none tracking-tight">404</p>
        <div className="w-16 h-16 rounded-2xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-extrabold text-[#222222] tracking-tight">
          Page not found
        </h1>
        <p className="text-sm text-[#717171] leading-relaxed">
          The page you're looking for doesn't exist or may have been removed. Try heading back home or browsing our restaurants.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-[#DDDDDD] text-[#222222] font-semibold text-xs rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#222222] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link
          to="/restaurants"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold text-xs rounded-xl transition"
        >
          <Search className="w-4 h-4" />
          Browse Restaurants
        </Link>
      </div>
    </div>
  );
}
