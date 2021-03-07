from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash

from . import models 

# Create your views here.
def home_view(request):
    user_info = models.UserInfo.objects.get(user=request.user)
    if request.user.is_authenticated:
        context = { 'user_info' : user_info}
        return render(request, 'generic.djhtml', context)
    return redirect('login:login_view')

def addData_view(request):
    return render(request, 'generic.djhtml', context)

def stats_view(request):
    return render(request, 'generic.djhtml', context)

def learnMore_view(request):
    return render(request, 'generic.djhtml', context)


def __BPInterpretation(systolic, diastolic):
    if (systolic > 180) or (diastolic > 120):
        return "Crisis"
    elif (systolic >= 140) or (diastolic >= 90):
        return "Stage 2"
    elif (systolic >= 130 and systolic < 140) or (diastolic >= 80 and diastolic < 90):
        return "Stage 1"
    elif (systolic < 130 and systolic >= 120) and diastolic < 80:
        return "Elevated"
    elif systolic < 120 and diastolic < 80:
        return "Normal"
