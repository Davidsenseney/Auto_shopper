import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  HeartPulse,
  ShoppingBag,
  Settings,
  Store,
  Sparkles,
  Database,
} from 'lucide-react';

/**
 * Sidebar Navigation (JavaScript / JSX)
 * Persistent sidebar with Bri logo, active screen indicator, Kroger sync card, and Django integration tab.
 */
export const Sidebar = ({
  activeScreen,
  onNavigate,
  cartCount,
  recipesCount,
  allergiesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'recipes',
      label: 'Recipes & Meal Planning',
      icon: UtensilsCrossed,
      badge: recipesCount ? `${recipesCount}` : null,
    },
    {
      id: 'health',
      label: 'Health & Nutrition Profile',
      icon: HeartPulse,
      badge: allergiesCount ? `${allergiesCount} Active` : null,
    },
    {
      id: 'shopping',
      label: 'Shopping & Cart',
      icon: ShoppingBag,
      badge: cartCount ? `${cartCount}` : null,
    },
    {
      id: 'settings',
      label: 'Django Integration & Settings',
      icon: Database,
      badge: 'API Ready',
    },
  ];

  return (
    <aside
      className="w-64 lg:w-72 bg-[#FFFFFF] border-r border-[#191B1C]/[0.06] flex flex-col justify-between p-5 shrink-0 min-h-screen"
      id="bri-main-sidebar"
    >
      <div className="flex flex-col gap-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 px-2 pt-2">
          {/* Bri Geometric App Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#63EF46] to-[#46B8EF] p-[2px] shadow-[0_4px_12px_rgba(99,239,70,0.3)] flex items-center justify-center">
            <div className="w-full h-full bg-[#191B1C] rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#63EF46] to-[#46B8EF]">
                B
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-[#191B1C] tracking-tight">
                Bri
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#63EF46]/20 to-[#46B8EF]/20 text-[#0b3c1b] border border-[#63EF46]/30">
                AI Auto-Shopper
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#848D90] leading-none mt-0.5">
              Health-Optimized Grocery Sync
            </span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between w-full px-3.5 py-3 rounded-2xl text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#191B1C] to-[#2B2F31] text-[#FFFFFF] shadow-[0_4px_14px_rgba(25,27,28,0.14)]'
                    : 'text-[#595F61] hover:text-[#191B1C] hover:bg-[#F3F4F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#63EF46]' : 'text-[#848D90]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#63EF46] text-[#0c2b14]'
                        : item.id === 'settings'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#EAEAEA] text-[#595F61]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Kroger Sync & Auto-Order Status Box */}
      <div className="flex flex-col gap-4 pt-6 border-t border-[#191B1C]/[0.05]">
        {/* Kroger Integration Status Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F5FBF6] to-[#EFF7FA] border border-[#63EF46]/20 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-xs text-[#191B1C]">Kroger Direct Sync</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Connected
            </span>
          </div>

          <p className="text-[11px] text-[#595F61] leading-relaxed">
            Next auto-order scheduled for <strong className="text-[#191B1C]">Thursday, 5:00 PM</strong> with free delivery.
          </p>

          <button
            onClick={() => onNavigate('shopping')}
            className="w-full text-xs font-bold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 py-1.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Review Auto-Cart</span>
          </button>
        </div>

        {/* User Mini Profile Footnote */}
        <div className="flex items-center justify-between px-2 text-[11px] text-[#848D90]">
          <span>Logged in as <strong>john@example.com</strong></span>
          <span className="text-[#63EF46] font-bold">● Live</span>
        </div>
      </div>
    </aside>
  );
};
