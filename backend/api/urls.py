from django.urls import path
from .views import (
    chat_endpoint,
    save_chat_endpoint,
    store_search,
    save_preferences,
    search_kroger_products,
    HealthProfileCreateAPIView,
    RecipeListView,
    RegisterView,
    VerifyEmailView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('chat/', chat_endpoint, name='chat_endpoint'),
    path('shopping/extract/', save_chat_endpoint, name='save_chat_endpoint'),
    path('kroger/stores/', store_search, name='store_search'),
    path('preferences/', save_preferences, name='save_preferences'),
    path('kroger-search/', search_kroger_products, name='kroger-search'),
    path("recipes/", RecipeListView.as_view(), name="recipe-list"),
    path('health-profile/', HealthProfileCreateAPIView.as_view(), name='health-profile-create'),
    path('register/',RegisterView.as_view(),name='register'),
    path('verify-email/',VerifyEmailView.as_view(),name='verify-email'),
    path('login/',TokenObtainPairView.as_view(),name='login'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token-refresh'),
]
