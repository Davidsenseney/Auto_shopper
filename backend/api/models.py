from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    user= models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_verified = models.BooleanField(default=False)
    verification_token= models.UUIDField(default=uuid.uuid4, editable=False)
    def __str__(self):
        return f"{self.user.username}'s Profile"

class HealthProfile(models.Model):
    # Stores the arrays like Vegan, Low Carb, etc. as JSON data
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name="health_profile")
    dietary_restrictions = models.JSONField(default=list, blank=True)
    desired_diets = models.JSONField(default=list, blank=True)
    allergies = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name = self.user.username if self.user else f"#{self.id}"
        return f"{name}'s Health Profile"

class RecentChat(models.Model):
    """stores recent chat messages for a user in preparation of payload.json"""
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
        name = self.user.username if self.user else "Anonymous"
        return f"{name} - {self.created_at}"

class KrogerStore(models.Model):
    location_id = models.CharField(max_length=8, unique=True)  # Kroger's locationId
    name = models.CharField(max_length=200)
    chain = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=2, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.name} ({self.location_id})"


class UserPreference(models.Model):
    # null user + session_key lets anonymous visitors save preferences too
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name="preference")
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    preferred_store = models.ForeignKey(KrogerStore, null=True, blank=True, on_delete=models.SET_NULL)
    budget = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    household_size = models.PositiveIntegerField(default=1)
    dietary_restrictions = models.JSONField(default=list, blank=True)
    cuisines = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user or self.session_key or 'unknown'}"


class KrogerAccount(models.Model):
    """Needed later for the Cart API (OAuth). Skip the migration for this if you want to wait."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="kroger_account")
    refresh_token = models.TextField()  # encrypt before production
    updated_at = models.DateTimeField(auto_now=True)


class KrogerProduct(models.Model):
    upc = models.CharField(max_length=20)
    product_id = models.CharField(max_length=20, blank=True)
    store = models.ForeignKey(KrogerStore, on_delete=models.CASCADE, related_name="products")
    description = models.CharField(max_length=300)
    size = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("upc", "store")


class RecipeResult(models.Model):
    """Gemini's output, so the cart step can be retried without regenerating."""
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name="recipe_results")
    chat = models.ForeignKey(RecentChat, null=True, blank=True, on_delete=models.SET_NULL)
    recipes = models.JSONField(default=list)
    ingredients = models.JSONField(default=list)  # [{"name": "chicken breast", "quantity": 2, "unit": "lb"}]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name = self.user.username if self.user else "Anonymous"
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
