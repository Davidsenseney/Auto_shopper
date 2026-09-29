from rest_framework import serializers
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