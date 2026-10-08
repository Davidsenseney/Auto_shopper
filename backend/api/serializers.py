from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, HealthProfile, UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        HealthProfile.objects.create(user=user)

        return user


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"

class HealthProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = HealthProfile
        fields = ['id', 'user', 'username', 'dietary_restrictions', 'desired_diets','allergies']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if user:
            profile, _= HealthProfile.objects.get_or_create(user=user)

        else:
            profile = HealthProfile.objects.filter(user=None).first()
        
        if profile:
            profile.dietary_restrictions = validated_data.get('dietary_restrictions', [])
            profile.desired_diets = validated_data.get('desired_diets', [])
            profile.allergies = validated_data.get('allergies', [])
            profile.save()
            return profile
        return HealthProfile.objects.create(user=user, **validated_data)
