import profile
from requests import request
import os
import requests
from requests.auth import HTTPBasicAuth
from django.core.cache import cache
from django.http import JsonResponse
from google import genai
from google.genai import types
from rest_framework import generics,permissions,status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from .models import RecentChat, KrogerStore, UserPreference, Recipe, HealthProfile, UserProfile, KrogerProduct
from pathlib import Path
from . import kroger
from .serializers import RecipeSerializer, HealthProfileSerializer, RegisterSerializer, KrogerProductSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        serializer= self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile = user.profile
        token= profile.verification_token
        
        verification_link = f"http://localhost:5173/verify?token={token}"
        send_mail(
            subject="Welcome! Verify Your Email",
            message=f"Click on the link to verify your email: {verification_link}",
            from_email=os.environ.get("AuthEmail"),
            recipient_list=[user.email],
            fail_silently=False
        )
        return Response({"message": "User registered successfully. Please check your email to verify your account."}, status=status.HTTP_201_CREATED)

class VerifyEmailView(APIView):
    def post(self,request):
        token= request.data.get("token")
        try:
            profile= UserProfile.objects.get(verification_token=token)
            if profile.is_verified:
                return Response({"message":"Already verified"})
            profile.is_verified=True
            profile.save()
            return Response({"message": "Email verified successfully"})
        except UserProfile.DoesNotExist:
            return Response({"message": "Invalid verification token"}, status=status.HTTP_400_BAD_REQUEST)



    

client = genai.Client(api_key=os.environ.get("Google_API_KEY"))
#for model in client.models.list():
   # if "generateContent" in model.supported_actions:
   #     print(model.name)
MODELS = [
   "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.1-pro-preview",
]

SYSTEM_PROMPT = (
    "you are Bri, a helpful and friendly AI assistant. You are here to help users create meals, "
    "ingrediant lists and recipes Your Goal is to talk to users about their food preferences and habits. "
    "You need to get as much of the following information from the user: "
    "number_of_people, dietary_restrictions, preferred_cuisines, meal_types, cooking_time, skill_level, "
    "budget, favorite_ingredients, disliked_ingredients, health_goals, allergies, meal_frequency, "
    "and any other relevant information that can help you provide personalized meal recommendations. "
)


@api_view(['POST'])
def chat_endpoint(request):
    try:
        raw_messages = request.data.get('messages', [])
        if not raw_messages:
            return Response({"error": "No messages provided."}, status=status.HTTP_400_BAD_REQUEST)

        contents = []
        for msg in raw_messages:
            role = "user" if msg.get('sender') == 'user' else 'model'
            text = msg.get('text', '')
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=text)],
                )
            )

        last_error = None
        for model_name in MODELS:
            try:
                print(f"Trying model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        temperature=0.7,
                    ),
                )
                print(f"Success with: {model_name}")
                return Response({"reply": response.text}, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"Failed {model_name}: {e}")
                last_error = e
                continue

        print(f"All models failed. Last error: {last_error}")
        return Response(
            {"error": "An error occurred while processing the request."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        print(f"Error in chat_endpoint: {e}")
        return Response(
            {"error": "An error occurred while processing the request."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["POST"])
def save_chat_endpoint(request):
    try:
        raw_messages = request.data.get("messages", [])
        if not raw_messages:
            return Response(
                {"error": "No messages provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload_path = Path(__file__).resolve().parent / "payload.json"
        with open(payload_path, encoding="utf-8") as f:
            payload = json.load(f)
        schema_example = payload["recent_chat_context"]

        extract_prompt = (
            "Extract grocery preferences from the conversation. "
            "Return ONLY valid JSON matching this schema (same keys). "
            "Use null for unknown fields. No markdown.\n\n"
            f"{json.dumps(schema_example, indent=2)}"
        )

        contents = []
        for msg in raw_messages:
            role = "user" if msg.get("sender") == "user" else "model"
            text = msg.get("text", "")
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=text)],
                )
            )

        # Gemini requires the last turn to be from the user (not the model)
        contents.append(
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=(
                            "Extract grocery preferences as JSON matching the "
                            "schema now. Return ONLY valid JSON."
                        )
                    )
                ],
            )
        )

        extracted_dict = None
        last_error = None

        for model_name in MODELS:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=extract_prompt,
                        temperature=0.2,
                    ),
                )
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("\n", 1)[-1]
                    text = text.rsplit("```", 1)[0].strip()

                extracted_dict = json.loads(text)
                break
            except Exception as e:
                print(f"Failed {model_name}: {e}")
                last_error = e
                continue

        if extracted_dict is None:
            return Response(
                {"error": f"Failed to extract: {last_error}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        ctx = RecentChat.objects.create(
            user=request.user if request.user.is_authenticated else None,
            data=extracted_dict,
            source_messages=raw_messages,
        )
        return Response(
            {"id": ctx.id, "recent_chat_context": ctx.data},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(f"Error in save_chat_endpoint: {e}")
        return Response(
            {"error": "An error occurred while saving the chat."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["GET"])
def store_search(request):
    zip_code = request.query_params.get("zip")
    if not zip_code:
        return Response({"error": "zip required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        stores = kroger.search_stores(zip_code)
    except Exception as e:
        print(f"Kroger store search failed: {e}")
        return Response({"error": "Kroger lookup failed."}, status=status.HTTP_502_BAD_GATEWAY)

    return Response({"stores": [
        {
            "location_id": s["locationId"],
            "name": s["name"],
            "chain": s.get("chain", ""),
            "address": s["address"]["addressLine1"],
            "city": s["address"]["city"],
            "state": s["address"]["state"],
            "zip_code": s["address"]["zipCode"],
        } for s in stores
    ]})


@api_view(["POST"])
def save_preferences(request):
    body = request.data

    store = None
    if body.get("store"):
        s = body["store"]
        store, _ = KrogerStore.objects.update_or_create(
            location_id=s["location_id"],
            defaults={k: s.get(k, "") for k in
                      ("name", "chain", "address", "city", "state", "zip_code")},
        )

    if request.user.is_authenticated:
        lookup = {"user": request.user}
    else:
        if not request.session.session_key:
            request.session.create()
        lookup = {"user": None, "session_key": request.session.session_key}

    prefs, _ = UserPreference.objects.update_or_create(
        **lookup,
        defaults={
            "preferred_store": store,
            "budget": body.get("budget"),
            "household_size": body.get("household_size", 1),
            "dietary_restrictions": body.get("dietary_restrictions", []),
            "cuisines": body.get("cuisines", []),
        },
    )
    return Response({"ok": True, "id": prefs.id}, status=status.HTTP_201_CREATED)

def get_kroger_token():
    # Optional: Cache the token for 25 minutes (Kroger tokens last 30 mins)
    token = cache.get('kroger_access_token')
    if token:
        return token

    client_id = os.getenv("KROGER_CLIENT_ID")
    client_secret = os.getenv("KROGER_CLIENT_SECRET")
    
    url = "https://api.kroger.com/v1/connect/oauth2/token"
    response = requests.post(
        url,
        data={"grant_type": "client_credentials", "scope": "product.compact"},
        auth=HTTPBasicAuth(client_id, client_secret)
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        # Cache it for 1500 seconds (25 minutes)
        cache.set('kroger_access_token', token, 1500)
        return token
    return None

def search_kroger_products(request):
    """
    GET /api/kroger-search/?q=<term>&location_id=<id>

    Calls kroger.search_products() (which correctly passes locationId so Kroger
    returns real price data) and forwards the raw product list to the frontend.
    Falls back to the old token-only path when no location_id is supplied, but
    prices will be absent in that case.
    """
    query = request.GET.get('q', 'milk')
    location_id = request.GET.get('location_id', '')

    if not query.strip():
        return JsonResponse({"error": "q param is required"}, status=400)

    try:
        if location_id:
            # Use kroger.py helper — passes locationId so prices are included
            raw_products = kroger.search_products(query, location_id, limit=10)
        else:
            # Fallback: no locationId → prices will be absent
            token = kroger.get_client_token()
            headers = {
                'Authorization': f'Bearer {token}',
                'Accept': 'application/json',
            }
            params = {'filter.term': query, 'filter.limit': 10}
            resp = requests.get(
                'https://api.kroger.com/v1/products', headers=headers, params=params, timeout=10
            )
            resp.raise_for_status()
            raw_products = resp.json().get('data', [])
    except Exception as e:
        print(f"Kroger product search error: {e}")
        return JsonResponse({"error": "Failed to fetch products from Kroger"}, status=502)

    return JsonResponse({"data": raw_products}, safe=False)

class HealthProfileCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HealthProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return HealthProfile.objects.filter(user=self.request.user)
        return HealthProfile.objects.filter(user=None)
    
class RecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]


# ---------------------------------------------------------------------------
# Kroger product / cart views
# ---------------------------------------------------------------------------

class KrogerProductListView(generics.ListAPIView):
    """
    GET /api/kroger/products/?location_id=<id>

    Returns cached KrogerProduct rows from the database.
    Optionally filter by `location_id` query param to scope results to one store.
    """
    serializer_class = KrogerProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = KrogerProduct.objects.select_related("store").all()
        location_id = self.request.query_params.get("location_id")
        if location_id:
            qs = qs.filter(store__location_id=location_id)
        return qs


@api_view(["GET"])
def kroger_product_search(request):
    """
    GET /api/kroger/product-search/?term=<search>&location_id=<id>

    Calls the live Kroger Products API via kroger.py and returns the top match
    without touching the database.  Good for quick look-ups from the frontend.
    """
    term = request.query_params.get("term")
    location_id = request.query_params.get("location_id")

    if not term:
        return Response({"error": "'term' query param is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not location_id:
        return Response({"error": "'location_id' query param is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = kroger.best_product_match(term, location_id)
    except Exception as e:
        print(f"Kroger product search failed: {e}")
        return Response({"error": "Kroger API request failed."}, status=status.HTTP_502_BAD_GATEWAY)

    if result is None:
        return Response({"product": None, "message": "No match found."}, status=status.HTTP_200_OK)

    return Response({"product": result}, status=status.HTTP_200_OK)


@api_view(["POST"])
def build_cart(request):
    """
    POST /api/kroger/cart/build/

    Body (JSON)::
        {
            "location_id": "<kroger_location_id>",
            "ingredients": ["chicken breast", "broccoli", "olive oil"]
        }

    For every ingredient:
      1. Calls kroger.best_product_match() against the live Kroger API.
      2. Upserts the result into the KrogerProduct DB table so future requests
         can use the cached version.
      3. Returns the full assembled cart with prices and any items that had
         no match.

    Response::
        {
            "location_id": "...",
            "cart": [ { ...KrogerProduct fields... } ],
            "not_found": [ "...", "..." ]
        }
    """
    location_id = request.data.get("location_id")
    ingredients = request.data.get("ingredients", [])

    if not location_id:
        return Response({"error": "'location_id' is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not ingredients or not isinstance(ingredients, list):
        return Response({"error": "'ingredients' must be a non-empty list."}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure the store record exists in the DB (needed as FK for KrogerProduct)
    store = KrogerStore.objects.filter(location_id=location_id).first()
    if store is None:
        # Try to pull the store info from the live API so we can create it
        try:
            store_data = kroger.search_stores(location_id, limit=1)
            if store_data:
                s = store_data[0]
                store, _ = KrogerStore.objects.update_or_create(
                    location_id=s["locationId"],
                    defaults={
                        "name": s.get("name", ""),
                        "chain": s.get("chain", ""),
                        "address": s["address"].get("addressLine1", ""),
                        "city": s["address"].get("city", ""),
                        "state": s["address"].get("state", ""),
                        "zip_code": s["address"].get("zipCode", ""),
                    },
                )
        except Exception as e:
            print(f"Could not resolve store {location_id}: {e}")

    if store is None:
        return Response(
            {"error": f"Store '{location_id}' not found. Save it via /api/preferences/ first."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart_items = []
    not_found = []

    for ingredient in ingredients:
        try:
            match = kroger.best_product_match(ingredient, location_id)
        except Exception as e:
            print(f"Kroger lookup failed for '{ingredient}': {e}")
            not_found.append(ingredient)
            continue

        if match is None:
            not_found.append(ingredient)
            continue

        # Upsert into the local DB cache
        product, _ = KrogerProduct.objects.update_or_create(
            upc=match["upc"],
            store=store,
            defaults={
                "product_id": match.get("product_id", ""),
                "description": match.get("description", ""),
                "size": match.get("size", ""),
                "price": match.get("price"),
            },
        )
        cart_items.append(product)

    serializer = KrogerProductSerializer(cart_items, many=True)
    return Response(
        {
            "location_id": location_id,
            "cart": serializer.data,
            "not_found": not_found,
        },
        status=status.HTTP_200_OK,
    )
