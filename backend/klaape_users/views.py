from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UserProfile
from .api.serializers import UserProfileSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Regular users can only see their own profile
        user = self.request.user
        if user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=user)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request, user_id):
    # Get the user profile or create if it doesn't exist
    user = get_object_or_404(User, id=user_id)
    
    # Check permissions - users can only access their own profile unless they're staff
    if request.user.id != user.id and not request.user.is_staff:
        return Response({"detail": "You do not have permission to access this profile"}, 
                        status=status.HTTP_403_FORBIDDEN)
    
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_profile_image(request, user_id):
    # Get the user profile
    user = get_object_or_404(User, id=user_id)
    
    # Check permissions
    if request.user.id != user.id and not request.user.is_staff:
        return Response({"detail": "You do not have permission to modify this profile"}, 
                        status=status.HTTP_403_FORBIDDEN)
    
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if request.method == 'POST':
        parser_classes = (MultiPartParser, FormParser)
        if 'image' not in request.FILES:
            return Response({"detail": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.profile_picture = request.FILES['image']
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
