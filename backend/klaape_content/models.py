from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Video(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='videos')
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_premium = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    view_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class Klaapening(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='klaapenings')
    content_type = models.CharField(max_length=20, choices=[
        ('quick_tip', 'Quick Tip'),
        ('question', 'Question'),
        ('showcase', 'Showcase'),
        ('challenge', 'Challenge'),
        ('poll', 'Poll')
    ])
    text = models.TextField()
    media = models.FileField(upload_to='klaapening/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.creator.username}'s {self.content_type}"

class LiveSession(models.Model):
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_sessions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    price_per_minute = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=False)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
