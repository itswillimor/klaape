from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[
        ('regular', 'Regular User'),
        ('pro', 'Pro Creator'),
        ('business', 'Business')
    ])
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    # Pro-specific fields
    expertise = models.ManyToManyField('klaape_content.Category', blank=True, related_name='experts')
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_verified_pro = models.BooleanField(default=False)
    
    # Business-specific fields
    company_name = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"
