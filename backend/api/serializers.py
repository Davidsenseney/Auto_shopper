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

        return user


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"

class HealthProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = HealthProfile
        fields = ['id', 'dietary_restrictions', 'desired_diets','allergies']

    def create(self, validated_data):
        profile = HealthProfile.objects.last()
        if profile:
            profile.dietary_restrictions = validated_data.get('dietary_restrictions', [])
            profile.desired_diets = validated_data.get('desired_diets', [])
            profile.allergies = validated_data.get('allergies', [])
            profile.save()
            return profile
        return HealthProfile.objects.create(**validated_data)
