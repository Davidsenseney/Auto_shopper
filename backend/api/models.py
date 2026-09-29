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

class Recipe(models.Model):
    #Stores Recipe information
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url=models.URLField(blank=True)
    prep_time_minutes = models.PositiveIntegerField()
    cost_per_serving = models.DecimalField(max_digits=6, decimal_places=2)
    servings = models.PositiveIntegerField(default=1)
    calories = models.PositiveIntegerField(default=0)
    badges = models.JSONField(default=list, blank=True)
    protein_grams = models.PositiveIntegerField(default=0)
    carbs_grams = models.PositiveIntegerField(default=0)
    fats_grams = models.PositiveIntegerField(default=0)
    macro_framework = models.CharField(max_length=100, blank=True)
    in_cart = models.BooleanField(default=False)
    ingredients = models.JSONField(default=list, blank=True)
    steps = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title