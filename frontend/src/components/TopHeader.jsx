import React, { useState } from 'react';
import { Search, Bell, Sparkles, ChevronDown } from 'lucide-react';

export const TopHeader = ({
  searchQuery,
  onSearchChange,
  activeCartCount,
  onOpenCart,
  currentUser,
  onNavigate,
  onSignOut,
}) => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest User');
  const userInitials = getInitials(displayName);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:8000/api/kroger-search/?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[TopHeader Error] Kroger search returned status ${response.status} (${response.statusText}):`, errorText);
          return;
        }
        const data = await response.json();
        
        // Kroger API typically returns items inside the 'data' array
        setProducts(data.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("[TopHeader Error] Failed communicating with backend on Kroger search:", error);
      }
    }
  };

  const handleSelectProduct = (product) => {
    console.log("Selected product:", product.description);
    alert(`Selected: ${product.description}`);
    // TODO: Add your logic here to send this product to your cart/backend database!
    setIsOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-30 bg-[#F8FAF9]/85 backdrop-blur-md border-b border-[#191B1C]/[0.05] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4"
      id="bri-top-header"
    >
      {/* Search Input Box & Dropdown Container */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-[#848D90] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search recipes, ingredients, health tags, or pantry..."
            id="global-search-input"
            className="w-full bg-[#FFFFFF] border border-[#191B1C]/[0.08] rounded-full pl-10 pr-4 py-2 text-xs lg:text-sm text-[#191B1C] placeholder-[#848D90] focus:outline-none focus:ring-2 focus:ring-[#46B8EF]/30 focus:border-[#46B8EF] shadow-[0_2px_8px_rgba(25,27,28,0.03)] transition-all"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && products.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#191B1C]/10 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-50 p-2">
            <div className="px-3 py-2 text-[11px] font-bold text-[#848D90] uppercase tracking-wider border-b border-gray-100 flex justify-between">
              <span>Kroger Search Results</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-red-500 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
            {products.map((product) => {
              const price = product.items?.[0]?.price?.regular;
              return (
                <div
                  key={product.productId}
                  onClick={() => handleSelectProduct(product)}
                  className="p-3 hover:bg-[#F3F4F5] rounded-xl cursor-pointer transition flex items-center justify-between gap-2 border-b border-gray-50 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    {product.images?.[0]?.perspective?.front && (
                      <img 
                        src={product.images[0].perspective.front} 
                        alt={product.description} 
                        className="w-10 h-10 object-contain bg-white rounded border p-1"
                      />
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#191B1C] line-clamp-1">{product.description}</p>
                      <p className="text-[11px] text-[#848D90]">Brand: {product.brand || 'Generic'}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-600">
                      {price ? `$${price.toFixed(2)}` : 'Price N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Controls: Auto-Shopper Badge, Notifications, User Profile */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#191B1C]/[0.06] shadow-xs text-xs font-semibold text-[#191B1C]"
          title="Bri AI Auto-Shopper Active & Syncing"
        >
          <span className="w-2 h-2 rounded-full bg-[#63EF46] animate-pulse"></span>
          <span>Auto-Shopper Active</span>
        </div>

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

        <button
          className="relative p-2 rounded-full bg-white border border-[#191B1C]/[0.08] hover:bg-[#F3F4F5] text-[#595F61] transition cursor-pointer"
          title="Notifications"
          onClick={() => alert('Notifications: Bri auto-saved $14.30 on Kroger digital coupons today!')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#46B8EF]" />
        </button>

        {/* User Profile & Sign-In Menu */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-[#191B1C]/[0.08] shadow-xs cursor-pointer hover:border-[#191B1C]/20 transition select-none"
            id="user-profile-menu"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#191B1C] to-[#3B4245] text-white flex items-center justify-center font-bold text-xs">
              {userInitials}
            </div>
            <span className="hidden md:inline text-xs font-bold text-[#191B1C] max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#848D90]" />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#191B1C]/[0.08] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-[#191B1C] truncate">{displayName}</p>
                <p className="text-[11px] text-[#848D90] truncate">
                  {currentUser?.email || 'Not signed in'}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigate) onNavigate('signin');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#191B1C] hover:bg-[#F3FAFE] hover:text-[#0b4d61] rounded-xl transition flex items-center justify-between cursor-pointer"
                >
                  <span>{currentUser?.isAuthenticated ? 'Switch Account' : 'Sign In / Landing Page'}</span>
                  <span className="text-[10px] bg-[#63EF46]/20 text-[#0c2b14] px-1.5 py-0.5 rounded font-bold">
                    Email
                  </span>
                </button>

                {currentUser?.isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onSignOut) onSignOut();
                      if (onNavigate) onNavigate('signin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};