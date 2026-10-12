import json
import os
from google import genai
from google.genai import types
from pathlib import Path
from .models import HealthProfile, UserPreference, RecentChat, RecipeResult, Recipe

#json helper functions

def get_user_payload(user=None, session_key=None):
    payload_path = Path(__file__).resolve().parent / "payload.json"
    with open(payload_path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    health = HealthProfile.objects.filter(user=user).first() if user and user.is_authenticated else None
    if health:
        payload["user_profile"]["health_requirements"]["requirements"] = health.dietary_restrictions
        payload["user_profile"]["health_requirements"]["allergies"] = health.allergies
    prefs = UserPreference.objects.filter(user=user).first() if user and user.is_authenticated else None
    if prefs:
        if prefs.budget:
            payload["user_profile"]["budget"] = float(prefs.budget)
        if prefs.preferred_store:
            payload["user_profile"]["store_preferences"] = [prefs.preferred_store.location_id]
    recent_chat = RecentChat.objects.filter(user=user).order_by("-created_at").first() if user and user.is_authenticated else None
    if recent_chat and recent_chat.data:
        payload["recent_chat_context"] = recent_chat.data
    with open(payload_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    return payload

MEAL_PLANNER_SYSTEM_INSTRUCTION = """
You are an expert chef, nutritionist, and grocery meal-planning engine.
Your goal is to generate personalized meal plans and a consolidated grocery cart list based on user context.
CRITICAL RULES:
1. ALLERGIES & RESTRICTIONS: Strict adherence. If an allergy or restriction is listed, NEVER include those ingredients or derivatives.
2. BUDGET: The total estimated cost of all recipes must not exceed the user's specified budget.
3. STORE CATALOG & PANTRY: Prioritize ingredients from 'available_store_catalog' and use items from 'ingredient_inventory' to reduce total shopping cost.
4. PORTIONS: Account for the number of people and meals specified in recent_chat_context.
5. OUTPUT: You must output ONLY valid JSON matching the requested structure.
"""
def create_meal_plan_prompt(payload: dict) -> str:
    """Formats the payload into a clean, contextual prompt for Gemini."""
    payload_str = json.dumps(payload, indent=2)
    return f"""
Please generate a tailored meal plan based on the following user profile, preferences, and grocery context:
=== USER AND STORE CONTEXT ===
{payload_str}
==============================
TASK:
1. Generate recommended recipes satisfying all health, taste, and budget requirements.
2. Generate a consolidated grocery shopping list for all ingredients needed.
3. Return ONLY a single JSON object with this exact structure:
{{
  "summary": "Brief explanation of the plan",
  "total_estimated_cost": 42.50,
  "recipes": [
    {{
      "title": "Recipe Title",
      "description": "Short description",
      "prep_time_minutes": 30,
      "servings": 4,
      "calories": 500,
      "protein_grams": 40,
      "carbs_grams": 30,
      "fats_grams": 15,
      "cost_per_serving": 3.50,
      "ingredients": [
        {{"name": "ingredient name", "quantity": 1.0, "unit": "lbs"}}
      ],
      "steps": ["step 1", "step 2"]
    }}
  ],
  "grocery_list": [
    {{"item": "ingredient name", "quantity": 1.0, "unit": "lbs", "store_sku": "sku 001"}}
  ]
}}
"""


client = genai.Client(api_key=os.environ.get("Google_API_KEY"))
MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.1-pro-preview",
]
def generate_meal_plan_with_gemini(payload: dict):
    prompt_text = create_meal_plan_prompt(payload)
    last_error = None
    for model_name in MODELS:
        try:
            print(f"[MealPlan] Trying Gemini model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt_text,
                config=types.GenerateContentConfig(
                    system_instruction=MEAL_PLANNER_SYSTEM_INSTRUCTION,
                    temperature=0.3,
                    response_mime_type="application/json",
                ),
            )
            raw_text = (response.text or "").strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
                raw_text = raw_text.rsplit("```", 1)[0].strip()
            parsed_data = json.loads(raw_text)
            print(f"[MealPlan] Success with model: {model_name}")
            return parsed_data
        except json.JSONDecodeError as jde:
            print(f"[MealPlan Error] JSON parse failed for model {model_name}: {jde}")
            last_error = f"JSONDecodeError: {jde}"
            continue
        except Exception as e:
            print(f"[MealPlan Error] Model {model_name} failed: {type(e).__name__}: {e}")
            last_error = e
            continue
    print(f"[MealPlan Error] All Gemini models failed. Last error: {last_error}")
    return None

def save_meal_plan_to_database(result_data: dict, user=None, chat=None):
    """
    Takes Gemini's parsed JSON output and saves it into RecipeResult and Recipe models.
    """
    if not result_data:
        return None
    recipes_data = result_data.get("recipes", [])
    grocery_list = result_data.get("grocery_list", [])
    recipe_result = RecipeResult.objects.create(
        user=user if user and user.is_authenticated else None,
        chat=chat,
        recipes=recipes_data,
        ingredients=grocery_list
    )
    created_recipes = []
    for r in recipes_data:
        recipe = Recipe.objects.create(
            title=r.get("title", "Untitled Recipe"),
            description=r.get("description", ""),
            prep_time_minutes=r.get("prep_time_minutes", 20),
            servings=r.get("servings", 1),
            cost_per_serving=r.get("cost_per_serving", 0.00),
            calories=r.get("calories", 0),
            protein_grams=r.get("protein_grams", 0),
            carbs_grams=r.get("carbs_grams", 0),
            fats_grams=r.get("fats_grams", 0),
            ingredients=r.get("ingredients", []),
            steps=r.get("steps", [])
        )
        created_recipes.append(recipe)
    return {
        "recipe_result": recipe_result,
        "recipes": created_recipes
    }   

def process_user_meal_plan(user=None, session_key=None):
    """
    Full pipeline:
    1. Assemble payload from DB
    2. Send to Gemini
    3. Store response in models
    """
    payload = get_user_payload(user=user, session_key=session_key)
    gemini_output = generate_meal_plan_with_gemini(payload)
    if not gemini_output:
        raise Exception("Failed to generate meal plan from Gemini.")
    recent_chat = RecentChat.objects.filter(user=user).order_by("-created_at").first() if user and user.is_authenticated else None
    saved_records = save_meal_plan_to_database(gemini_output, user=user, chat=recent_chat)
    return {
        "data": gemini_output,
        "result_id": saved_records["recipe_result"].id
    }
