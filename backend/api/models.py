from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class HealthProfile(models.Model):
    # Stores the arrays like Vegan, Low Carb, etc. as JSON data
    dietary_restrictions = models.JSONField(default=list, blank=True)
    desired_diets = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Health Profile #{self.id}"

class Allergy(models.Model):
    SEVERITY_CHOICES = [
        ('MILD', 'Mild'),
        ('MODERATE', 'Moderate'),
        ('SEVERE', 'Severe'),
    ]
    profile = models.ForeignKey(HealthProfile, on_delete=models.CASCADE, related_name='allergies')
    allergen_name = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices= SEVERITY_CHOICES, default='MODERATE')

    def __str__(self):
        return f"{self.allergen_name} ({self.severity})"

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