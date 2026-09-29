from django.urls import path
from .views import (
    chat_endpoint,
    save_chat_endpoint,
    store_search,
    save_preferences,
    search_kroger_products,
)

urlpatterns = [
    path('chat/', chat_endpoint, name='chat_endpoint'),
    path('shopping/extract/', save_chat_endpoint, name='save_chat_endpoint'),
    path('kroger/stores/', store_search, name='store_search'),
    path('preferences/', save_preferences, name='save_preferences'),
    path('kroger-search/', search_kroger_products, name='kroger-search'),
]