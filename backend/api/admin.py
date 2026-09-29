from django.contrib import admin
from .models import RecentChat, Recipe
from .models import RecentChat, HealthProfile, Allergy, Recipe

# Register your models here.
@admin.register(RecentChat)
class RecentChatAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "updated_at")
    list_filter = ("created_at",)
    search_fields = ("id",)
    readonly_fields = ("created_at", "updated_at")

admin.site.register(Recipe)
admin.site.register(HealthProfile)
admin.site.register(Allergy)
