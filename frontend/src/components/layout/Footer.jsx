import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Globe, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">TasteTrack</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Discover authentic culinary experiences, honest foodie reviews, and curated top-rated restaurants around your city.
            </p>
            <div className="flex items-center gap-3 pt-1 text-neutral-400">
              <span className="p-1.5 rounded-lg bg-neutral-800 hover:text-white transition"><Globe className="w-4 h-4" /></span>
              <span className="p-1.5 rounded-lg bg-neutral-800 hover:text-white transition"><Share2 className="w-4 h-4" /></span>
              <span className="p-1.5 rounded-lg bg-neutral-800 hover:text-white transition"><MessageCircle className="w-4 h-4" /></span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Popular Cuisines</h4>
            <ul className="space-y-2">
              <li><Link to="/restaurants?category=Italian" className="hover:text-white transition">Italian Trattorias</Link></li>
              <li><Link to="/restaurants?category=Japanese" className="hover:text-white transition">Japanese Omakase</Link></li>
              <li><Link to="/restaurants?category=BBQ" className="hover:text-white transition">Smokey Craft BBQ</Link></li>
              <li><Link to="/restaurants?category=Vegan" className="hover:text-white transition">Plant-based & Vegan</Link></li>
              <li><Link to="/restaurants?category=Cafes" className="hover:text-white transition">Artisan Coffee & Cafes</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Explore TasteTrack</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home Page</Link></li>
              <li><Link to="/restaurants" className="hover:text-white transition">Browse All Restaurants</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Member Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white mb-2">TasteTrack Insider</h4>
            <p className="text-xs text-neutral-400">
              Get weekly recommendations for secret dining spots and newly opened places.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white outline-none focus:border-rose-500 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} TasteTrack Inc. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
