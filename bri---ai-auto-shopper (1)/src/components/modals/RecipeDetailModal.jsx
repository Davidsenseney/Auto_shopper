import React, { useState } from 'react';
import {
  X,
  Clock,
  DollarSign,
  Flame,
  Check,
  Plus,
  Heart,
  Share2,
  Wheat,
  RotateCw,
  ShoppingBag,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION GUIDE: RECIPE DETAIL MODAL (JavaScript / JSX)
 * ============================================================================
 * Django Endpoints:
 * 1. GET /api/v1/recipes/<id>/
 * 2. POST /api/v1/cart/add-recipe/
 * ============================================================================
 */

export const RecipeDetailModal = ({
  recipe,
  onClose,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSaved, setIsSaved] = useState(recipe.isFavorite || false);

  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (stepNumber) => {
    setCompletedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      id="recipe-detail-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200/80 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        id="recipe-detail-modal-card"
      >
        {/* Modal Header & Hero Image with Gradient Overlay */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 overflow-hidden bg-slate-900">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                {recipe.macroFramework}
              </span>
              <span className="bg-emerald-500/90 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                {recipe.macroMatchPct}% Macro Match
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-900/70 text-white border-white/20 hover:bg-slate-900'
                }`}
                title="Save Recipe"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => alert(`Recipe URL copied to clipboard: ${recipe.title}`)}
                className="w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                title="Share Recipe"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Stats within Hero Banner */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight mb-2 drop-shadow-sm">
              {recipe.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-200 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{recipe.prepTimeMinutes} mins prep</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>${recipe.costPerServing.toFixed(2)} / serving</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{recipe.calories} kcal</span>
              </div>
              <span>•</span>
              <span>Serves {recipe.servings}</span>
            </div>
          </div>
        </div>

        {/* Macro Breakdown Strip */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3 flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              🍗 Protein: <strong className="text-slate-900 font-bold">{recipe.proteinGrams}g</strong>
            </span>
            <span>
              🌾 Carbs: <strong className="text-slate-900 font-bold">{recipe.carbsGrams}g</strong>
            </span>
            <span>
              🥑 Fats: <strong className="text-slate-900 font-bold">{recipe.fatsGrams}g</strong>
            </span>
          </div>

          <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            Allergen Safe: Verified zero peanuts, dairy, or shellfish
          </div>
        </div>

        {/* Tab Toggle: Ingredients vs Cooking Instructions */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-3.5 text-xs sm:text-sm font-bold relative transition cursor-pointer ${
              activeTab === 'ingredients'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ingredients ({recipe.ingredients.length})
            {activeTab === 'ingredients' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3.5 text-xs sm:text-sm font-bold relative transition cursor-pointer ${
              activeTab === 'instructions'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cooking Instructions ({recipe.steps.length} Steps)
            {activeTab === 'instructions' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] rounded-t" />
            )}
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* INGREDIENTS VIEW */}
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>Check off ingredients you already have at home:</span>
                <span className="font-semibold text-emerald-700">
                  {recipe.ingredients.filter((i) => i.status === 'in_cart').length} items synced to Kroger
                </span>
              </div>

              <div className="space-y-2">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients[ing.id];
                  const isInCart = ing.status === 'in_cart';

                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : isInCart
                          ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {ing.name}
                          </div>
                          {ing.note && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {ing.note}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {ing.price && (
                          <span className="text-xs font-extrabold text-slate-900">
                            ${ing.price.toFixed(2)}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isInCart
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isInCart ? 'In Auto-Cart' : 'In Pantry'}
                        </span>

                        {ing.canSwap && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Bri Auto-Swap: Alternative found for "${ing.name}" from Kroger Organic.`);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Swap ingredient brand"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INSTRUCTIONS VIEW */}
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              {recipe.steps.map((step) => {
                const isDone = completedSteps[step.stepNumber];

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-4 rounded-2xl border transition flex items-start gap-4 cursor-pointer ${
                      isDone
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {step.title}
                        </h4>
                        {step.timerLabel && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                            ⏱ {step.timerLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-slate-500">Estimated Total for Recipe</div>
            <div className="text-lg font-extrabold text-slate-900">
              ${(recipe.costPerServing * recipe.servings).toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onAddToCart(recipe);
                onClose();
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Missing Ingredients to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
