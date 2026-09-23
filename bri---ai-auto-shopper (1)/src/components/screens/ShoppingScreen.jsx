import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Fish,
  Beef,
  Flame,
  Wheat,
  Droplet,
  Truck,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION GUIDE: SHOPPING & CART MANAGEMENT (JavaScript / JSX)
 * ============================================================================
 * In Django REST Framework:
 * 
 * 1. Endpoint: GET /api/v1/cart/items/
 *    Returns the active cart with real Kroger SKU mapping.
 * 
 * 2. Quantity updates:
 *    PATCH /api/v1/cart/items/<id>/
 *    Payload: { "quantity": 2 }
 * 
 * 3. Kroger Auto-Checkout dispatch:
 *    POST /api/v1/cart/checkout/
 *    Dispatches order to Kroger Partner API or Instacart Connect via Celery task.
 * ============================================================================
 */

export const ShoppingScreen = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState('cart');
  const [groupBy, setGroupBy] = useState('recipe');
  const [appliedSavings, setAppliedSavings] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null);

  const filteredItems = cartItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.storeBadge.toLowerCase().includes(q) ||
      item.linkedRecipe.toLowerCase().includes(q)
    );
  });

  const totalCartValue = filteredItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getItemIcon = (iconType) => {
    switch (iconType) {
      case 'fish':
        return <Fish className="w-5 h-5 text-sky-600" />;
      case 'meat':
        return <Beef className="w-5 h-5 text-rose-600" />;
      case 'berries':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'broccoli':
        return <Flame className="w-5 h-5 text-emerald-600" />;
      case 'oats':
        return <Wheat className="w-5 h-5 text-amber-600" />;
      case 'oil':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleCheckout = () => {
    setCheckoutStatus('Submitting order to Kroger Direct API...');
    setTimeout(() => {
      setCheckoutStatus('Success! Kroger Direct delivery scheduled for Thursday 5:00 PM.');
      setTimeout(() => setCheckoutStatus(null), 5000);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6" id="bri-shopping-view">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl lg:text-[28px] font-extrabold text-[#191B1C] tracking-tight">
          Shopping & Cart Management
        </h2>
        <p className="text-sm text-[#595F61] mt-1 font-normal">
          Smart auto-optimized Kroger cart aligned with your active recipes and macro targets
        </p>
      </div>

      {/* 4 Metrics Summary Cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Cart Metrics"
        id="cart-metrics-grid"
      >
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Current Order</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">
            ${totalCartValue.toFixed(2)}
          </div>
          <div className="text-xs text-[#848D90]">Auto-checkout in 2 days</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Primary Store</span>
            <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              Direct API
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">
            Kroger Direct
          </div>
          <div className="text-xs text-[#848D90]">Pickup & delivery synced</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Budget</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              -5%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">68% Used</div>
          <div className="text-xs text-[#848D90]">$238 of $350 monthly spent</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Auto-Sync Status</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-time
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">Active</div>
          <div className="text-xs text-[#848D90]">Aisle inventory verified</div>
        </div>
      </section>

      {/* Main Cart Container */}
      <section
        className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6"
        id="shopping-cart-container"
      >
        {/* Navigation Tabs & Group By Selector */}
        <div className="border-b border-gray-100 pb-px mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex space-x-7 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('cart')}
              className={`pb-3 cursor-pointer flex items-center gap-2 transition ${
                activeTab === 'cart'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Active Auto-Cart</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {cartItems.length} Items
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lists')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'lists'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Saved Lists
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'compare'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Store Comparison
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'past'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Past Orders
            </button>
          </nav>

          <div className="flex items-center gap-2 pb-2 sm:pb-0">
            <span className="text-xs text-slate-500 font-medium">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="recipe">Recipe / Meal</option>
              <option value="department">Store Department</option>
            </select>
          </div>
        </div>

        {/* Bri AI Auto-Optimizer Banner */}
        <div
          className="bg-[#eefcf4] border border-[#c3f2d6] rounded-xl p-3.5 mb-6 flex items-center justify-between flex-wrap gap-3"
          id="cart-optimizer-banner"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#22c55e] text-white flex items-center justify-center font-bold text-xs shrink-0">
              B
            </div>
            <p className="text-xs text-gray-800">
              <strong className="font-bold text-gray-900">Bri AI Auto-Optimizer:</strong> 2 item swaps
              saved <span className="font-semibold text-emerald-700">$4.20</span> and replaced
              non-organic produce with verified residue-free items.
            </p>
          </div>
          <button
            onClick={() => setAppliedSavings(true)}
            className={`font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer ${
              appliedSavings
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-sky-600'
            }`}
          >
            {appliedSavings ? '✓ Savings Applied' : 'Apply Kroger Savings'}
          </button>
        </div>

        {/* Checkout Status Toast */}
        {checkoutStatus && (
          <div className="mb-4 p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs font-semibold text-sky-900 flex items-center justify-between animate-fadeIn">
            <span>{checkoutStatus}</span>
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
        )}

        {/* Cart Item Cards List */}
        <div className="flex flex-col gap-3.5" id="cart-items-list">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-xs transition"
              >
                {/* Left: Thumbnail & Metadata */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getItemIcon(item.iconType)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.storeBadge}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {item.attributeBadge}
                      </span>
                      {item.savingsBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60">
                          {item.savingsBadge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {item.linkedRecipe}
                    </p>
                  </div>
                </div>

                {/* Right: Quantity Controls, Price, Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Unit price & total */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-base font-extrabold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{item.unitPriceInfo}</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/60 p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Swap store for ${item.name}: Kroger Direct offers lowest basket price.`)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                      title="Swap store"
                    >
                      Swap Store
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Fulfillment & Auto-Checkout Footer Bar */}
        <div
          className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
          id="order-fulfillment-summary"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TOTAL CART VALUE
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">
                ${totalCartValue.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                (Kroger Boost Free Delivery Included)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Auto-fulfillment scheduled: <strong>Thursday 5:00 PM</strong> at your saved address
            </p>
          </div>

          <button
            onClick={handleCheckout}
            id="review-auto-checkout-btn"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(70,184,239,0.35)] hover:shadow-[0_6px_18px_rgba(70,184,239,0.45)] hover:-translate-y-0.5 transition cursor-pointer"
          >
            <span>Review & Auto-Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
