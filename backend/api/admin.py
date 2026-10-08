from django.contrib import admin
from .models import RecentChat, Recipe, KrogerAccount, RecipeResult, HealthProfile

# Register your models here.
@admin.register(RecentChat)
class RecentChatAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "updated_at")
    list_filter = ("created_at",)
    search_fields = ("id",)
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

