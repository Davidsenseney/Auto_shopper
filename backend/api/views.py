import os
from google import genai
from google.genai import types
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

client = genai.Client(api_key=os.environ.get("Google_API_KEY"))


SYSTEM_PROMPT=( "you are Bri, a helpful and friendly AI assistant. You are here to help users create meals, ingrediant lists and recipes Your Goal is to talk to users about their food preferences and habits. You need to get as much of the following information from the user: " 
"number_of_people, dietary_restrictions, preferred_cuisines, meal_types, cooking_time, skill_level, budget, favorite_ingredients, disliked_ingredients, health_goals, allergies, meal_frequency, and any other relevant information that can help you provide personalized meal recommendations. " 
)
@api_view(['POST'])
def chat_endpoint(request):
    try:
        raw_messages = request.data.get('messages', [])
        if not raw_messages:
            return Response({"error": "No messages provided."}, status=status.HTTP_400_BAD_REQUEST)

        contents=[]
        for msg in raw_messages:
            role = "user" if msg.get('sender') == 'user' else 'model'
            text = msg.get('text', '')
            contents.append(
                types.Content
                (role=role,
                 parts=[types.Part.from_text(text=text)]
                 )
            )
        response= client.models.generate_content(
            model='gemini-3.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,)
        )
        return Response({"reply": response.text}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in chat_endpoint: {e}")
        return Response({"error": "An error occurred while processing the request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
