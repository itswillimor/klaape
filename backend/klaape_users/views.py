from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UserProfile
from .api.serializers import UserProfileSerializer
from .serializers import UserRegistrationSerializer, UserLoginSerializer

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

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def signup(request):
    print(f"[SIGNUP] Received data: {request.data}")
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        print(f"[SIGNUP] User created: {user.username}")
        return Response({
            'message': 'User created successfully',
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_201_CREATED)
    print(f"[SIGNUP] Validation errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def login_user(request):
    print(f"[LOGIN] Received data: {request.data}")
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        print(f"[LOGIN] Attempting login for: {username}")
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            print(f"[LOGIN] Login successful for: {username}")
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            print(f"[LOGIN] Authentication failed for: {username}")
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    print(f"[LOGIN] Validation errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)