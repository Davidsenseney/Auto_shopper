import os
from google import genai
from google.genai import types
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from .models import RecentChat
from pathlib import Path

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