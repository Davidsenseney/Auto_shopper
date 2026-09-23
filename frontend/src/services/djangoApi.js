/**
 * ============================================================================
 * BRI AI AUTO-SHOPPER - DJANGO API CLIENT (JavaScript / Fetch)
 * ============================================================================
 * This service handles HTTP requests between the React frontend and a Django backend.
 * It automatically extracts CSRF tokens from cookies (Django's standard protection)
 * and includes authorization headers.
 * 
 * Works in standard web pages, SPAs, and server-rendered Django templates.
 * ============================================================================
 */

const DJANGO_BASE_URL = (typeof window !== 'undefined' && window.__DJANGO_API_URL__) 
  || import.meta.env?.VITE_DJANGO_API_URL 
  || '/api/v1';

/**
 * Utility to extract Django's csrftoken from document.cookie
 */
function getCsrfToken() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : '';
}

/**
 * Common wrapper around fetch with CSRF and JSON parsing
 */
async function request(endpoint, options = {}) {
  const url = `${DJANGO_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Django API error [${response.status}]: ${errorBody}`);
  }

  return response.json();
}

/**
 * Django API endpoints export
 */
export const DjangoApi = {
  // 1. Dashboard Overview & Metrics
  getDashboardOverview: () => request('/dashboard/overview/'),

  // 2. Chat with Assistant
  sendChatMessage: (message) =>
    request('/assistant/chat/', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // 3. Recipes Endpoints
  getRecipes: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`/recipes/${searchParams ? `?${searchParams}` : ''}`);
  },

  getRecipeDetail: (recipeId) => request(`/recipes/${recipeId}/`),

  addRecipeIngredientsToCart: (recipeId) =>
    request('/cart/add-recipe/', {
      method: 'POST',
      body: JSON.stringify({ recipe_id: recipeId }),
    }),

  // 4. Health & Nutrition Profile
  getHealthProfile: () => request('/health/profile/'),

  updateDietaryFramework: (frameworkId) =>
    request('/health/framework/', {
      method: 'PUT',
      body: JSON.stringify({ framework_id: frameworkId }),
    }),

  addAllergy: (allergyData) =>
    request('/health/allergies/', {
      method: 'POST',
      body: JSON.stringify(allergyData),
    }),

  // 5. Kroger / Store Cart Management
  getCartItems: () => request('/cart/items/'),

  updateCartQuantity: (itemId, quantity) =>
    request(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  removeCartItem: (itemId) =>
    request(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    }),

  checkoutCart: () =>
    request('/cart/checkout/', {
      method: 'POST',
      body: JSON.stringify({ trigger_auto_delivery: true }),
    }),
};
