import React from 'react';
import { Search, Bell, Sparkles, ChevronDown } from 'lucide-react';

/**
 * Top Navigation Header (JavaScript / JSX)
 * Includes search bar with dynamic auto-query, notifications, auto-shopper badge, and profile menu.
 */
export const TopHeader = ({
  searchQuery,
  onSearchChange,
  activeCartCount,
  onOpenCart,
}) => {
  return (
    <header
      className="sticky top-0 z-30 bg-[#F8FAF9]/85 backdrop-blur-md border-b border-[#191B1C]/[0.05] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4"
      id="bri-top-header"
    >
      {/* Search Input Box */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-[#848D90] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search recipes, ingredients, health tags, or pantry..."
            id="global-search-input"
            className="w-full bg-[#FFFFFF] border border-[#191B1C]/[0.08] rounded-full pl-10 pr-4 py-2 text-xs lg:text-sm text-[#191B1C] placeholder-[#848D90] focus:outline-none focus:ring-2 focus:ring-[#46B8EF]/30 focus:border-[#46B8EF] shadow-[0_2px_8px_rgba(25,27,28,0.03)] transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Auto-Shopper Badge, Notifications, User Profile */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        {/* Bri Active Status Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#191B1C]/[0.06] shadow-xs text-xs font-semibold text-[#191B1C]"
          title="Bri AI Auto-Shopper Active & Syncing"
        >
          <span className="w-2 h-2 rounded-full bg-[#63EF46] animate-pulse"></span>
          <span>Auto-Shopper Active</span>
        </div>

        {/* Cart Quick Shortcut Button */}
        <button
          onClick={onOpenCart}
          id="header-cart-shortcut-btn"
          className="relative p-2 rounded-full bg-white border border-[#191B1C]/[0.08] hover:bg-[#F3F4F5] text-[#191B1C] shadow-xs transition cursor-pointer"
          title="View Active Kroger Cart"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          {activeCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {activeCartCount}
            </span>
          )}
        </button>

        {/* Notifications Icon Button */}
        <button
          className="relative p-2 rounded-full bg-white border border-[#191B1C]/[0.08] hover:bg-[#F3F4F5] text-[#595F61] transition cursor-pointer"
          title="Notifications"
          onClick={() => alert('Notifications: Bri auto-saved $14.30 on Kroger digital coupons today!')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#46B8EF]" />
        </button>

        {/* User Profile Capsule */}
        <div
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white border border-[#191B1C]/[0.08] shadow-xs cursor-pointer hover:border-[#191B1C]/20 transition"
          id="user-profile-menu"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#191B1C] to-[#3B4245] text-white flex items-center justify-center font-bold text-xs">
            JD
          </div>
          <span className="hidden md:inline text-xs font-bold text-[#191B1C]">
            John Doe
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#848D90]" />
        </div>
      </div>
    </header>
  );
};
