/**
 * Bri - AI Auto-Shopper Core Schemas & Constants (JavaScript / ESModule)
 * 
 * ============================================================================
 * DJANGO INTEGRATION GUIDE:
 * Each model definition below corresponds directly to a Django Model
 * and a Django REST Framework (DRF) / Django Ninja Serializer.
 * ============================================================================
 */

/**
 * Screen identifiers for navigation
 */
export const SCREENS = {
  DASHBOARD: 'dashboard',
  RECIPES: 'recipes',
  HEALTH: 'health',
  SHOPPING: 'shopping',
  SETTINGS: 'settings',
};

/**
 * Severity constants for allergies
 */
export const ALLERGY_SEVERITIES = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  AUTO_SWAP: 'AUTO-SWAP',
  PREFERENCE: 'PREFERENCE',
};

/**
 * Enforcement policies for dietary restrictions
 */
export const ENFORCEMENT_TYPES = {
  STRICT_BLOCK: 'Strict Cart Auto-Block',
  SMART_SWAP: 'Smart Swap Priority',
};
