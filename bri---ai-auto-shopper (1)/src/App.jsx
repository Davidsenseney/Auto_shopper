import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { RecipesScreen } from './components/screens/RecipesScreen';
import { HealthScreen } from './components/screens/HealthScreen';
import { ShoppingScreen } from './components/screens/ShoppingScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { RecipeDetailModal } from './components/modals/RecipeDetailModal';

import {
  INITIAL_DASHBOARD_STATS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_RECIPES,
  INITIAL_ALLERGIES,
  INITIAL_DIETARY_RESTRICTIONS,
  INITIAL_DIETARY_FRAMEWORKS,
  INITIAL_CART_ITEMS,
} from './data/initialData';

/**
 * ============================================================================
 * BRI - AI AUTO-SHOPPER (MAIN REACT APPLICATION COMPONENT in JSX / JS)
 * ============================================================================
 * State Architecture & Screen Routing:
 * - Dashboard: metrics, assistant chat, action cards
 * - Recipes: meal planning, macro filters, detailed recipe modal
 * - Health: allergy safeguards, dietary framework selector, macronutrient bar
 * - Shopping: live Kroger cart items, quantity stepper, checkout dispatch
 * - Settings: Django backend integration blueprint and web page embedding guide
 * ============================================================================
 */
export function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain State (Can be populated from Django REST API endpoints via src/services/djangoApi.js)
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [allergies, setAllergies] = useState(INITIAL_ALLERGIES);
  const [restrictions, setRestrictions] = useState(INITIAL_DIETARY_RESTRICTIONS);
  const [frameworks, setFrameworks] = useState(INITIAL_DIETARY_FRAMEWORKS);
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  // Active Recipe for Detail Modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Simulated Smart Shopper AI Response
    const handleSendMessage = async (content) => {
      const userMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        senderName: 'You',
        timestamp: 'Just now',
        content,
      };
      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      const payload = {
        messages: updatedMessages.map((m) => ({
          sender: m.sender === 'user' ? 'user' : 'bot',
          text: m.content,
        })),
      };
      try {
        const response = await fetch('/api/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Chat request failed');
        const data = await response.json();
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-bot-${Date.now()}`,
            sender: 'assistant',
            senderName: 'Bri Assistant',
            timestamp: 'Just now',
            content: data.reply,
          },
        ]);
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            sender: 'assistant',
            senderName: 'Bri Assistant',
            timestamp: 'Just now',
            content: 'Sorry, there was an error processing your request.',
          },
        ]);
      }
    };
    const handleGoShopping=async()=>{
      const message = chatMessages.map((m) => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.content,
      }));

      try {
        const response = await fetch('/api/shopping/extract/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: message }),
        });
        if (!response.ok) throw new Error('Shopping request failed');
        const data = await response.json();
        console.log("Saved RecentChat", data.id, data.id.source_messages);
      } catch (err) {
        console.error(err);
        alert('Could not save Chat preferences for shopping. Please try again.');
      }
    };
  // Add Recipe Ingredients to Cart
  const handleAddRecipeToCart = (recipe) => {
    const missingIngredients = recipe.ingredients.filter(
      (ing) => ing.status === 'in_cart'
    );

    const newCartItems = missingIngredients.map((ing) => ({
      id: `cart-${recipe.id}-${ing.id}`,
      name: ing.name,
      storeBadge: 'Kroger Fresh Direct',
      attributeBadge: 'Recipe Match',
      linkedRecipe: `Linked to: ${recipe.title}`,
      price: ing.price || 4.50,
      unitPriceInfo: `$${(ing.price || 4.50).toFixed(2)} / pack`,
      quantity: 1,
      iconType: recipe.id.includes('salmon') ? 'fish' : 'broccoli',
    }));

    // Avoid duplicates
    setCartItems((prev) => {
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
      const filtered = newCartItems.filter((i) => !existingNames.has(i.name.toLowerCase()));
      return [...filtered, ...prev];
    });

    // Mark recipe as inCart
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipe.id ? { ...r, inCart: true, inCartBadge: 'In Cart (Auto-Added)' } : r
      )
    );
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#191B1C] flex font-sans antialiased">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={(screenId) => {
          setActiveScreen(screenId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItems.length}
        recipesCount={recipes.length}
        allergiesCount={allergies.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCartCount={cartItems.length}
          onOpenCart={() => setActiveScreen('shopping')}
        />

        {/* Screen Router Viewport */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <DashboardScreen
              stats={stats}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onQuickAddCart={()=>{}}
              onGoShopping={handleGoShopping}
              cartItems={cartItems}
            />
          )
} 

          {activeScreen === 'health' && (
            <HealthScreen
              allergies={allergies}
              restrictions={restrictions}
              frameworks={frameworks}
            />
          )}

          {activeScreen === 'shopping' && (
            <ShoppingScreen
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveCartItem}
              searchQuery={searchQuery}
            />
          )}

          {activeScreen === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {/* High-Fidelity Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToCart={handleAddRecipeToCart}
        />
      )}
    </div>
  );
}
export default App;