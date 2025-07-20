from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'role', 'bio', 'profile_picture', 
            'display_name', 'expertise', 'hourly_rate', 'is_verified_pro',
            'company_name', 'industry'
        ]
        read_only_fields = ['id', 'user', 'is_verified_pro']
    
    def get_display_name(self, obj):
        # Return the user's full name if available, otherwise username
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.username