import React from 'react';
import { X, Sparkles, Clock, DollarSign, ShieldAlert, Check } from 'lucide-react';

export const RecipeDetailModal = ({ recipe, onClose, onAddToCart }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#191B1C]/[0.08] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
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

        <h3 className="text-xl font-extrabold text-[#191B1C] mb-2">{recipe.title}</h3>
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
