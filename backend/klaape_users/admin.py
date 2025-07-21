from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'userprofile__role', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    def get_role(self, obj):
        try:
            return obj.userprofile.role.title()
        except:
            return 'No Profile'
    get_role.short_description = 'Role'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'company_name', 'is_verified_pro', 'hourly_rate')
    list_filter = ('role', 'is_verified_pro')
    search_fields = ('user__username', 'user__email', 'company_name')
    list_editable = ('is_verified_pro',)
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'role', 'bio', 'profile_picture')
        }),
        ('Pro Creator Fields', {
            'fields': ('expertise', 'hourly_rate', 'is_verified_pro'),
            'classes': ('collapse',)
        }),
        ('Business Fields', {
            'fields': ('company_name', 'industry'),
            'classes': ('collapse',)
        }),
    )

# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)