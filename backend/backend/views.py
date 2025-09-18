# backend/views.py
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to HealthDoc API! Visit /api/ for API endpoints.")
