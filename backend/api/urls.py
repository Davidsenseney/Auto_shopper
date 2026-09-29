from django.urls import path
from .views import chat_endpoint, save_chat_endpoint, RecipeListView

urlpatterns = [
    path('chat/', chat_endpoint, name='chat_endpoint'),
    path('shopping/extract/', save_chat_endpoint, name='save_chat_endpoint'),
    path("recipes/", RecipeListView.as_view(), name="recipe-list"),
]
