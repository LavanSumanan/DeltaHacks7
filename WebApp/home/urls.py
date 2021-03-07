from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.home_view, name='home_view'),
    path('learnmore/', views.learnMore_view, name='learnMore_view')
]
