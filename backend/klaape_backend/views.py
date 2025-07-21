from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to Klaape API",
        "version": "1.0.0",
        "status": "online"
    })
