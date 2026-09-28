import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Globe, Share2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] text-[#222222] text-xs border-t border-[#DDDDDD] pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">Support</h4>
            <ul className="space-y-2.5 text-[#717171]">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">TasteTrack Cover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">Hosting & Owners</h4>
            <ul className="space-y-2.5 text-[#717171]">
              <li><Link to="/dashboard" className="hover:underline">Add your restaurant</Link></li>
              <li><a href="#" className="hover:underline">Owner resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Host responsibly</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">TasteTrack</h4>
            <ul className="space-y-2.5 text-[#717171]">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#FF385C] font-extrabold text-base">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              <span>TasteTrack</span>
            </div>
            <p className="text-xs text-[#717171] leading-relaxed">
              Find and review top culinary spots around the world. Designed with Airbnb inspired simplicity.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-[#DDDDDD] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#717171]">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} TasteTrack, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>

          <div className="flex items-center gap-4 font-semibold text-[#222222]">
            <button className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </button>
            <button className="flex items-center gap-1 hover:underline cursor-pointer">
              <span>$ USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
