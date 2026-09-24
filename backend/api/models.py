from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class RecentChat(models.Model):
    """stores recent chat messages for a user in the for perperation of payload.json"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="recent_chats")

    data = models.JSONField(default=dict)
    source_messages = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Recent Chat"
        verbose_name_plural = "Recent Chats"
        ordering = ["-created_at"]

    def __str__(self):
        name= self.user.username if self.user else "Anonymous"
        return f"{name} - {self.created_at}"