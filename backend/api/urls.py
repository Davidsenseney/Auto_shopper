from django.urls import path
from .views import chat_endpoint, save_chat_endpoint, HealthProfileCreateAPIView

urlpatterns = [
    path('chat/', chat_endpoint, name='chat_endpoint'),
    path('shopping/extract/', save_chat_endpoint, name='save_chat_endpoint'),
    path('health-profile/', HealthProfileCreateAPIView.as_view(), name='health-profile-create'),
]
