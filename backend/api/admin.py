from django.contrib import admin
from .models import RecentChat, Recipe, KrogerAccount, RecipeResult, HealthProfile
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user_id", "user", "is_verified", "verification_token")
    list_filter = ("is_verified",)
    search_fields = ("user__username",)
    readonly_fields = ("verification_token",)

# Register your models here.
@admin.register(RecentChat)
class RecentChatAdmin(admin.ModelAdmin):
    list_display = ("chat_id", "user", "created_at", "updated_at")
    list_filter = ("created_at",)
    search_fields = ("chat_id",)
    readonly_fields = ("created_at", "updated_at")

@admin.register(KrogerAccount)
class KrogerAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "updated_at")
    search_fields = ("user__username",)


@admin.register(RecipeResult)
class RecipeResultAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username",)
admin.site.register(Recipe)

@admin.register(HealthProfile)
class HealthProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("id", "user__username")
    readonly_fields = ("created_at",)

