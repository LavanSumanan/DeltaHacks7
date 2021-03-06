"""mysite URL Configuration
"""
from django.urls import path, include

app_name='login'
urlpatterns = [
    path('', include('login.urls')),
    path('home/',include('home.urls'))
]
