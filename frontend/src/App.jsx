import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardScreen } from './pages/DashboardScreen';
import { RecipesScreen } from './pages/RecipesScreen';
import { HealthScreen } from './pages/HealthScreen';
import { ShoppingScreen } from './pages/ShoppingScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { LandingSignInScreen } from './pages/LandingSignInScreen';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { VerifyEmailScreen } from './components/VerifyEmailScreen';

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
 * - Landing / Sign In: Hero landing page, email sign-in, verification & demo login
 * - Dashboard: metrics, assistant chat, action cards
 * - Recipes: meal planning, macro filters, detailed recipe modal
 * - Health: allergy safeguards, dietary framework selector, macronutrient bar
 * - Shopping: live Kroger cart items, quantity stepper, checkout dispatch
 * - Settings: Django backend integration blueprint and web page embedding guide
 * ============================================================================
 */
export function App() {
  // Navigation State - defaults to 'signin' landing page for instant viewing
  const [activeScreen, setActiveScreen] = useState(() => {
    if (window.location.pathname === '/verify') return 'verify';
    return 'signin';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState({
    email: 'john@example.com',
    name: 'John Doe',
    isAuthenticated: false,
  });



  // Domain State (Can be populated from Django REST API endpoints via src/services/djangoApi.js)
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [allergies, setAllergies] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [frameworks, setFrameworks] = useState(INITIAL_DIETARY_FRAMEWORKS.map((fw) => ({ ...fw, isActive: false })));
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  useEffect(() => {
    const loadHeallthProfile = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const headers = tokenData.access ? { Authorization: `Bearer ${tokenData.access}` } : {};
        const response = await fetch('/api/health-profile/', {headers});
        if (!response.ok) throw new Error('Could not load health profile');

        const rows = await response.json();
        if (!Array.isArray(rows) || rows.length === 0) {
          setAllergies([]);
          setRestrictions([]);
          return;
        }

        const profile = rows[rows.length - 1];

        setAllergies(
          (profile.allergies || []).map((allergy, index) => ({
            id: `allergy-${index}-${allergy.allergen_name}`,
            name: allergy.allergen_name,
            severity: allergy.severity,
            description: 'Saved from your health profile',
            badgeStyle:
              allergy.severity === 'SEVERE'
                ? 'critical'
                : allergy.severity === 'MODERATE'
                  ? 'high'
                  : 'preference',
          }))
        );
        setRestrictions(
          (profile.dietary_restrictions || []).map((title, index) => ({
            id: `restriction-${index}`,
            title,
            description: 'Saved from your health profile.',
            enforcement: 'Strict Cart Auto-Block',
          }))
        );
        setFrameworks((prev) =>
          prev.map((fw) => ({
            ...fw,
            isActive: (profile.desired_diets || []).includes(fw.name),
          }))
        );
      } catch (error) {
        console.error('Failed to load health profile:', error);
      }
    }
    loadHeallthProfile();
  }, [currentUser]);
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/');
        if (!response.ok) throw new Error('Could not load recipes');

        const rows = await response.json();
        const recipesFromApi = rows.map((recipe) => ({
          ...recipe,
          id: String(recipe.id),
          imageUrl: recipe.image_url,
          prepTimeMinutes: recipe.prep_time_minutes,
          costPerServing: Number(recipe.cost_per_serving),
          proteinGrams: recipe.protein_grams,
          carbsGrams: recipe.carbs_grams,
          fatsGrams: recipe.fats_grams,
          macroFramework: recipe.macro_framework,
          inCart: recipe.in_cart,
        }));

        setRecipes(recipesFromApi);
      } catch (error) {
        console.error('Failed to load recipes:', error);
      }
    };
    loadRecipes();
  }, []);
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
  const handleGoShopping = async () => {
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

  const handleSignInSuccess = (user) => {
    setCurrentUser(user);
    setActiveScreen('dashboard');
  };

  const handleSignOut = () => {
    setCurrentUser({
      email: '',
      name: 'Guest User',
      isAuthenticated: false,
    });
    setActiveScreen('signin');
  };

  // If user is on the sign-in landing screen, display the dedicated full-page landing experience
  if (activeScreen === 'signin') {
    return (
      <LandingSignInScreen
        initialEmail={currentUser?.email || ''}
        onSignInSuccess={handleSignInSuccess}
        onExploreDemo={() => setActiveScreen('dashboard')}
      />
    );
  }

  if (activeScreen === 'verify') {
    return (
      <VerifyEmailScreen
        onNavigateToLogin={() => {
          window.history.pushState({}, '', '/');
          setActiveScreen('signin');
        }}
      />
    );
  }


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
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCartCount={cartItems.length}
          onOpenCart={() => setActiveScreen('shopping')}
          currentUser={currentUser}
          onNavigate={(screenId) => setActiveScreen(screenId)}
          onSignOut={handleSignOut}
        />

        {/* Screen Router Viewport */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <DashboardScreen
              stats={stats}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onQuickAddCart={() => { }}
              onGoShopping={handleGoShopping}
              cartItems={cartItems}
            />
          )
          }
          {activeScreen === 'recipes' && (
            <RecipesScreen
              recipes={recipes}
              searchQuery={searchQuery}
              onSelectRecipe={setSelectedRecipe}
              onAddRecipeToCart={handleAddRecipeToCart}
            />
          )}
          {activeScreen === 'health' && (
            <HealthScreen
              allergies={allergies}
              restrictions={restrictions}
              frameworks={frameworks}
              onUpdateAllergies={setAllergies}
              onUpdateRestrictions={setRestrictions}
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