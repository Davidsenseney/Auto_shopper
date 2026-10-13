import React, { useEffect } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';

export const RecipeDetailModal = ({ recipe, onClose, onAddToCart }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!recipe) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-detail-title"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#191B1C]/[0.08] shadow-2xl p-6 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close recipe details"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {recipe.macroFramework || 'Health Profile Match'}
          </span>
          {recipe.inCart && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              In Cart
            </span>
          )}
        </div>

        <h3 id="recipe-detail-title" className="text-xl font-extrabold text-[#191B1C] mb-2">
          {recipe.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#595F61] mb-4 leading-relaxed">
          {recipe.description}
        </p>

        {/* Nutritional Facts */}
        <div className="grid grid-cols-3 gap-2 bg-[#F8FAF9] p-3 rounded-2xl mb-4 text-center">
          <div>
            <span className="text-[10px] text-[#848D90] uppercase font-bold">Protein</span>
            <p className="text-sm font-extrabold text-[#191B1C]">{recipe.proteinGrams || 35}g</p>
          </div>
          <div>
            <span className="text-[10px] text-[#848D90] uppercase font-bold">Carbs</span>
            <p className="text-sm font-extrabold text-[#191B1C]">{recipe.carbsGrams || 20}g</p>
          </div>
          <div>
            <span className="text-[10px] text-[#848D90] uppercase font-bold">Est. Cost</span>
            <p className="text-sm font-extrabold text-emerald-600">
              ${(recipe.costPerServing || 4.25).toFixed(2)}
            </p>
          </div>
        </div>

        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
          <section aria-labelledby="recipe-ingredients-title" className="mb-5">
            <h4 id="recipe-ingredients-title" className="text-base font-bold text-[#191B1C] mb-3">
              Ingredients
            </h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => {
                const name =
                  typeof ingredient === 'string'
                    ? ingredient
                    : ingredient?.name ??
                      ingredient?.item ??
                      ingredient?.ingredient_name ??
                      ingredient?.ingredient?.name ??
                      ingredient?.ingredient;
                const quantity =
                  typeof ingredient === 'object' && ingredient !== null
                    ? [ingredient.quantity, ingredient.unit].filter(Boolean).join(' ')
                    : '';
                const note =
                  typeof ingredient === 'object' && ingredient !== null
                    ? ingredient.note
                    : null;

                return (
                  <li
                    key={ingredient?.id ?? `${name ?? 'ingredient'}-${index}`}
                    className="rounded-xl bg-[#F8FAF9] px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-[#191B1C]">
                      {name || 'Ingredient'}
                    </span>
                    {quantity && (
                      <span className="ml-2 text-sm text-[#595F61]">{quantity}</span>
                    )}
                    {note && (
                      <span className="ml-2 text-sm text-[#595F61]">{note}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="recipe-steps-title" className="mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h4 id="recipe-steps-title" className="text-base font-bold text-[#191B1C]">
              How to Make It
            </h4>
            {recipe.prepTimeMinutes != null && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#595F61]">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {recipe.prepTimeMinutes} mins
              </span>
            )}
          </div>
          {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
            <ol className="space-y-3">
              {recipe.steps.map((step, index) => {
                const title =
                  typeof step === 'object' && step !== null ? step.title : null;
                const instruction =
                  typeof step === 'string' ? step : step?.instruction;
                const timerLabel =
                  typeof step === 'object' && step !== null ? step.timerLabel : null;

                return (
                  <li
                    key={typeof step === 'object' && step !== null ? step.stepNumber ?? index : index}
                    className="flex items-start gap-3 rounded-2xl bg-[#F8FAF9] p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                      {typeof step === 'object' && step !== null
                        ? step.stepNumber ?? index + 1
                        : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {title && (
                        <h5 className="text-sm font-bold text-[#191B1C]">{title}</h5>
                      )}
                      <p className="text-sm text-[#595F61] leading-relaxed">
                        {instruction || 'Follow this recipe step.'}
                      </p>
                      {timerLabel && (
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {timerLabel}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="rounded-2xl bg-[#F8FAF9] p-4 text-sm text-[#595F61]">
              Cooking steps are not available for this recipe yet.
            </p>
          )}
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (onAddToCart) onAddToCart(recipe);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-[#0c2b14] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] hover:opacity-95 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-900" />
            <span>Add Ingredients to Kroger Cart</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-sm font-semibold text-[#595F61] hover:bg-gray-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
