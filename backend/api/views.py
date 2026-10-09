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
from .models import RecentChat, KrogerStore, UserPreference, Recipe, HealthProfile, UserProfile
from pathlib import Path
from . import kroger 
from .serializers import RecipeSerializer,HealthProfileSerializer, RegisterSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .services import process_user_meal_plan

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
        print(f"[save_chat_endpoint Error]: {type(e).__name__}: {e}")
        return Response(
            {"error": f"An error occurred while saving the chat: {str(e)}"},
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
    # Get search term from frontend query parameters (e.g., /api/search?q=milk)
    query = request.GET.get('q', 'milk')
    
    token = get_kroger_token()
    if not token:
        return JsonResponse({"error": "Failed to authenticate with Kroger API"}, status=500)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json'
    }
    params = {
        'filter.term': query,
        'filter.limit': 10
    }
    
    response = requests.get('https://api.kroger.com/v1/products', headers=headers, params=params)
    
    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)
    else:
        return JsonResponse({"error": "Failed to fetch products from Kroger"}, status=response.status_code)
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

@api_view(["POST"])
def generate_meal_plan_view(request):
    try:
        session_key = request.session.session_key
        result = process_user_meal_plan(
            user=request.user if request.user.is_authenticated else None,
            session_key=session_key,
        )
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"[generate_meal_plan_view Error]: {type(e).__name__}: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

