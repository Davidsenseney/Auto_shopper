import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  Server,
  Code2,
  Cpu,
  FileCode,
  Globe,
  Terminal,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION & WEB PAGE SETTINGS SCREEN (JavaScript / JSX)
 * ============================================================================
 * Provides copyable Django models, DRF serializers, views, URLs, and
 * a dedicated Web Page JSX / JS embedding guide for easy deployment.
 * ============================================================================
 */
export const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeSnippets = {
    webpage: `<!-- ===================================================================== -->
<!-- HOW TO EMBED THIS BRI AI AUTO-SHOPPER (JSX / JS) IN ANY WEB PAGE     -->
<!-- ===================================================================== -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bri - AI Auto-Shopper</title>
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Django CSRF & Context Injection (if rendering from Django template) -->
  <script>
    window.__DJANGO_API_URL__ = "/api/v1";
    window.__CSRF_TOKEN__ = "{{ csrf_token }}";
  </script>
</head>
<body class="bg-[#F8FAF9] text-[#191B1C] antialiased">
  <!-- Container where the React/JSX App mounts -->
  <div id="root"></div>

  <!-- Vite or bundled ESModule script -->
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,

    models: `# In your Django app: yourapp/models.py
from django.db import models
from django.contrib.auth.models import User

class UserNutritionProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='nutrition_profile')
    active_framework = models.CharField(max_length=64, default="high-protein")
    auto_substitute_alternatives = models.BooleanField(default=True)
    target_calories = models.IntegerField(default=2150)
    target_protein_pct = models.IntegerField(default=40)
    target_carbs_pct = models.IntegerField(default=35)
    target_fats_pct = models.IntegerField(default=25)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Nutrition Profile"

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image_url = models.URLField(max_length=500)
    prep_time_minutes = models.IntegerField(default=20)
    cost_per_serving = models.DecimalField(max_digits=6, decimal_places=2)
    servings = models.IntegerField(default=2)
    calories = models.IntegerField(default=450)
    protein_grams = models.IntegerField(default=30)
    carbs_grams = models.IntegerField(default=15)
    fats_grams = models.IntegerField(default=15)
    macro_match_pct = models.IntegerField(default=95)
    macro_framework = models.CharField(max_length=128, default="High Protein")

    def __str__(self):
        return self.title

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    name = models.CharField(max_length=255)
    note = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=32, choices=[('in_cart', 'In Cart'), ('in_pantry', 'In Pantry')])
    can_swap = models.BooleanField(default=False)

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    kroger_sku = models.CharField(max_length=64)
    name = models.CharField(max_length=255)
    store_badge = models.CharField(max_length=128, default="Kroger Fresh")
    attribute_badge = models.CharField(max_length=128, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    unit_price_info = models.CharField(max_length=64)
    quantity = models.PositiveIntegerField(default=1)
    icon_type = models.CharField(max_length=32, default="general")
    created_at = models.DateTimeField(auto_now_add=True)

class AllergyItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='allergies')
    name = models.CharField(max_length=128)
    severity = models.CharField(max_length=32, choices=[
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('AUTO-SWAP', 'Auto-Swap'),
        ('PREFERENCE', 'Preference'),
    ])
    description = models.TextField()`,

    serializers: `# In your Django app: yourapp/serializers.py
from rest_framework import serializers
from .models import UserNutritionProfile, Recipe, RecipeIngredient, CartItem, AllergyItem

class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ['id', 'name', 'note', 'price', 'status', 'can_swap']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    badges = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'slug', 'description', 'image_url',
            'prep_time_minutes', 'cost_per_serving', 'servings',
            'calories', 'protein_grams', 'carbs_grams', 'fats_grams',
            'macro_match_pct', 'macro_framework', 'ingredients', 'badges'
        ]

    def get_badges(self, obj):
        return [f"{obj.prep_time_minutes}m prep", f"\${obj.cost_per_serving}/serv", obj.macro_framework]

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = [
            'id', 'kroger_sku', 'name', 'store_badge',
            'attribute_badge', 'price', 'unit_price_info',
            'quantity', 'icon_type'
        ]

class AllergyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllergyItem
        fields = ['id', 'name', 'severity', 'description']`,

    views: `# In your Django app: yourapp/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, CartItem, AllergyItem, UserNutritionProfile
from .serializers import RecipeSerializer, CartItemSerializer, AllergyItemSerializer

class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        total_spent = sum(item.price * item.quantity for item in cart_items)
        
        return Response({
            "currentOrder": {
                "amount": float(total_spent),
                "delta": "+12%",
                "subtext": "Auto-checkout in 2 days"
            },
            "mealsPlanned": {
                "count": 18,
                "target": 21,
                "delta": "+85%",
                "subtext": "Weekly goal on track"
            },
            "healthScore": {
                "score": 96,
                "total": 100,
                "delta": "+4%",
                "subtext": "Nutrient target met"
            },
            "budgetUsed": {
                "percentage": int((total_spent / 350.0) * 100),
                "spent": float(total_spent),
                "total": 350.0,
                "delta": "-5%",
                "subtext": f"\${total_spent:.2f} of \$350 spent"
            }
        })

class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all().prefetch_related('ingredients')

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AssistantChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get("message", "")
        # Plug in your AI / Gemini model or rule-based shopper here:
        return Response({
            "id": f"msg-{request.user.id}",
            "sender": "assistant",
            "senderName": "Bri Assistant",
            "content": f"Received: '{user_message}'. Auto-cart updated with certified allergen-safe alternatives.",
            "timestamp": "Just now"
        })`,

    urls: `# In your Django app: yourapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardOverviewView, RecipeViewSet, CartItemViewSet, AssistantChatView

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'cart/items', CartItemViewSet, basename='cart-item')

urlpatterns = [
    path('dashboard/overview/', DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('assistant/chat/', AssistantChatView.as_view(), name='assistant-chat'),
    path('', include(router.urls)),
]`,

    settings: `# In your Django project: myproject/settings.py
INSTALLED_APPS = [
    # Django core apps...
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party packages
    'rest_framework',
    'corsheaders',

    # Your app
    'shopper_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Put near top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # ...
]

# Allow React dev server or production frontend domain
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]`,
  };

  const tabs = [
    { id: 'webpage', label: 'Web Page (HTML/JS/JSX)', icon: Globe },
    { id: 'models', label: 'models.py', icon: Database },
    { id: 'serializers', label: 'serializers.py', icon: Code2 },
    { id: 'views', label: 'views.py', icon: Server },
    { id: 'urls', label: 'urls.py', icon: FileCode },
    { id: 'settings', label: 'settings.py (CORS)', icon: Cpu },
  ];

  return (
    <div className="flex flex-col gap-6" id="bri-settings-view">
      {/* Title */}
      <div>
        <h2 className="text-2xl lg:text-[28px] font-extrabold text-[#191B1C] tracking-tight">
          Web Page & Django Backend Integration
        </h2>
        <p className="text-sm text-[#595F61] mt-1 font-normal">
          Exported JavaScript & JSX components with production Django models, DRF endpoints, and HTML embedding templates.
        </p>
      </div>

      {/* Integration Overview Card */}
      <section className="bg-gradient-to-br from-[#191B1C] to-[#2E3336] rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#63EF46] to-[#46B8EF] p-[2px] flex items-center justify-center">
              <div className="w-full h-full bg-[#191B1C] rounded-[14px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#63EF46]" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">JavaScript / JSX Web Architecture</h3>
              <p className="text-xs text-slate-300">
                Connected to React 19 + Tailwind CSS + standard browser Fetch API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-[#63EF46] border border-[#63EF46]/30">
              ● JSX & JS Ready
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/20 text-[#46B8EF] border border-[#46B8EF]/30">
              ● Django 4.x / 5.x Ready
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          All components are written in clean JavaScript and JSX, with zero TypeScript dependencies.
          They can be served as a Vite SPA, compiled into an npm package, or loaded directly in standard Django template HTML pages.
        </p>
      </section>

      {/* Code Browser Card */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#63EF46]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Container */}
        <div className="relative p-5 bg-[#0f1416]">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => handleCopy(codeSnippets[activeTab], activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700 shadow-sm"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[520px] p-2">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>
      </section>
    </div>
  );
};
