from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, HealthProfile, Allergy, UserProfile

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
from .models import HealthProfile, Allergy

class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ['allergen_name', 'severity']

class HealthProfileSerializer(serializers.ModelSerializer):
    allergies = AllergySerializer(many=True)

    class Meta:
        model = HealthProfile
        fields = ['id', 'dietary_restrictions', 'desired_diets','allergies']

    def create(self, validated_data):
        allergies_data = validated_data.pop('allergies', [])

        profile = HealthProfile.objects.create(**validated_data)

        for allergy_data in allergies_data:
            Allergy.objects.create(profile=profile, **allergy_data)

        return profile

