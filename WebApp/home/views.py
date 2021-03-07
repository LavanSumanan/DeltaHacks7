from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home_view(request):
    return HttpResponse("You're now logged in :)")

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
