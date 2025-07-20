from django.db import models
from django.contrib.auth.models import User
from klaape_content.models import Video, LiveSession

class Purchase(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    video = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255)
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.buyer.username} purchased {self.video.title}"

class LiveSessionBooking(models.Model):
    session = models.ForeignKey(LiveSession, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ])
    duration_minutes = models.IntegerField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booked_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s booking with {self.session.expert.username}"

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    content_creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    video = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True, blank=True)
    live_session = models.ForeignKey(LiveSession, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.reviewer.username}'s review"
