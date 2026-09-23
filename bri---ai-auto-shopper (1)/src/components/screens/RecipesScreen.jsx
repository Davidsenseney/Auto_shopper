import React, { useState } from 'react';
import {
  Check,
  Plus,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION GUIDE: RECIPES & MEAL PLANNING SCREEN (JavaScript / JSX)
 * ============================================================================
 * In Django REST Framework:
 * 
 * 1. Endpoint: GET /api/v1/recipes/
 *    Filters supported via query parameters:
 *    - ?filter=high-protein
 *    - ?max_time=30
 *    - ?max_cost=5
 * 
 *    # In Django views.py:
 *    class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
 *        serializer_class = RecipeSerializer
 *        def get_queryset(self):
 *            qs = Recipe.objects.all()
 *            category = self.request.query_params.get('category')
 *            if category:
 *                qs = qs.filter(category=category)
 *            return qs
 * 
 * 2. Add to Cart:
 *    POST /api/v1/cart/add-recipe-ingredients/
 *    Payload: { "recipe_id": "salmon-lemon-asparagus" }
 * ============================================================================
 */

export const RecipesScreen = ({
  recipes,
  onSelectRecipe,
  onAddRecipeToCart,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState('meal_plan');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [cartAddedNotice, setCartAddedNotice] = useState(null);

  const filters = [
    'All',
    'High Protein',
    'Quick (<30m)',
    'Under $5/serving',
    'Low Glycemic',
    'Pantry Ready',
  ];

  const filteredRecipes = recipes.filter((r) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.macroFramework.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Quick filter
    if (selectedFilter === 'High Protein') {
      return r.badges.includes('High Protein') || r.proteinGrams >= 25;
    }
    if (selectedFilter === 'Quick (<30m)') {
      return r.prepTimeMinutes <= 30;
    }
    if (selectedFilter === 'Under $5/serving') {
      return r.costPerServing <= 5;
    }
    if (selectedFilter === 'Pantry Ready') {
      return r.inCart;
    }
    return true;
  });

  const handleAddToCart = (recipe) => {
    onAddRecipeToCart(recipe);
    setCartAddedNotice(`Added ingredients for "${recipe.title}" to Bri Auto-Cart!`);
    setTimeout(() => setCartAddedNotice(null), 3500);
  };

  return (
    <div className="flex flex-col gap-6" id="bri-recipes-view">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#191B1C] tracking-tight">
          Recipes & Meal Planning
        </h2>
        <p className="text-sm text-[#595F61] mt-1 font-normal">
          Personalized, nutrient-dense meal plans synced directly to your Bri auto-cart
        </p>
      </div>

      {/* Stats Row (4 Metric Cards) */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Metrics Summary"
        id="recipes-metrics-grid"
      >
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Active Recipes</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              +3 this week
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">14</div>
          <div className="text-xs text-[#848D90]">Weekly meal queue active</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Avg Prep Time</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              -10% faster
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">22 mins</div>
          <div className="text-xs text-[#848D90]">Optimized for weekday speed</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Macro Alignment</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              +2%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">96%</div>
          <div className="text-xs text-[#848D90]">High protein & fiber targets met</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#595F61]">Est. Recipe Cost</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save $1.20
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#191B1C] mb-1 tracking-tight">
            $4.15 <span className="text-xs font-normal text-[#848D90]">/ serving</span>
          </div>
          <div className="text-xs text-[#848D90]">$87.15 estimated weekly total</div>
        </div>
      </section>

      {/* Main Container for Tabs, Banner, and Recipe Cards */}
      <section
        className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6"
        id="recipes-collection-container"
      >
        {/* Tabs Navigation */}
        <div className="border-b border-gray-100 pb-px mb-5">
          <nav className="flex space-x-7 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('meal_plan')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'meal_plan'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Weekly Meal Plan
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'favorites'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Saved & AI Favorites
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'swaps'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Nutritional Swaps
            </button>
            <button
              onClick={() => setActiveTab('pantry')}
              className={`pb-3 cursor-pointer transition ${
                activeTab === 'pantry'
                  ? 'text-gray-900 border-b-2 border-emerald-500 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Pantry Match
            </button>
          </nav>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-5" id="recipe-quick-filters">
          <span className="text-xs font-semibold text-gray-400 mr-1">Quick Filters:</span>
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* AI Recommendation Alert Banner */}
        <div
          className="bg-[#eefcf4] border border-[#c3f2d6] rounded-xl p-3.5 mb-6 flex items-center justify-between flex-wrap gap-3"
          id="ai-recommendation-banner"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#22c55e] text-white flex items-center justify-center font-bold text-xs shrink-0">
              B
            </div>
            <p className="text-xs text-gray-800">
              <strong className="font-bold text-gray-900">Bri AI:</strong> 3 ingredients in these
              recipes are currently on sale at your preferred grocer, saving{' '}
              <span className="font-semibold text-emerald-700">$6.40 this week</span>.
            </p>
          </div>
          <button
            onClick={() => alert('One-Click Cart Update: Applied digital manufacturer coupons to Kroger direct auto-cart!')}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-sky-600 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
          >
            One-Click Cart Update
          </button>
        </div>

        {/* Cart Update Toast Notification */}
        {cartAddedNotice && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span>{cartAddedNotice}</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        )}

        {/* Recipe Cards Grid (2x2 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="recipe-cards-grid">
          {filteredRecipes.map((recipe) => {
            const hasDetailAction = recipe.id === 'salmon-lemon-asparagus' || recipe.id === 'blueberry-overnight-oats';

            return (
              <div
                key={recipe.id}
                className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between bg-white"
              >
                <div>
                  {/* Pill Badges */}
                  <div className="flex items-center flex-wrap gap-1.5 mb-3">
                    {recipe.badges.map((badge, idx) => {
                      let badgeStyle = 'bg-gray-100 text-gray-600';
                      if (badge.includes('Protein')) {
                        badgeStyle = 'bg-amber-50 text-amber-700 border border-amber-200/50';
                      } else if (badge.includes('Fiber')) {
                        badgeStyle = 'bg-purple-50 text-purple-700 border border-purple-200/50';
                      } else if (badge.includes('Vegan')) {
                        badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
                      } else if (badge.includes('Keto')) {
                        badgeStyle = 'bg-red-50 text-rose-600 border border-rose-200/50';
                      } else if (badge.includes('Breakfast')) {
                        badgeStyle = 'bg-sky-50 text-sky-700 border border-sky-200/50';
                      }

                      return (
                        <span
                          key={idx}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${badgeStyle}`}
                        >
                          {badge}
                        </span>
                      );
                    })}

                    {recipe.inCart && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 ml-auto">
                        {recipe.inCartBadge || 'In Cart'}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-base font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:text-sky-700 transition"
                    onClick={() => onSelectRecipe(recipe)}
                  >
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Macros Pill Container */}
                  <div className="bg-[#f8fafb] rounded-xl px-4 py-2.5 text-xs text-gray-700 flex items-center gap-2 mb-5 font-medium flex-wrap">
                    <span>
                      🍗 <strong className="text-gray-900">{recipe.proteinGrams}g</strong> Protein
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      🌾 <strong className="text-gray-900">{recipe.carbsGrams}g</strong> Carbs
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      🥑 <strong className="text-gray-900">{recipe.fatsGrams}g</strong> Healthy Fats
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {hasDetailAction ? (
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="w-full py-2 bg-[#f0f4f7] hover:bg-[#e6ecf0] text-gray-800 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      View Recipe
                    </button>
                    <button
                      onClick={() => alert(`Swapping ingredients for ${recipe.title}: Bri found certified organic alternatives.`)}
                      className="w-full py-2 bg-[#f0f4f7] hover:bg-[#e6ecf0] text-gray-800 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Swap Ingredients
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => handleAddToCart(recipe)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#2dd4bf] to-[#38bdf8] text-gray-900 text-xs font-bold rounded-xl shadow-sm hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 font-extrabold" />
                      <span>Add Ingredients to Bri Cart</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
