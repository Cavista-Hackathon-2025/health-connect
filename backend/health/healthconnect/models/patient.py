
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models
import uuid
from django.conf import settings


class DiagnosisModel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diagnosis_model')
    full_name = models.CharField(max_length=255,null=True,blank=True)
    age = models.CharField(max_length=255,null=True,blank=True)
    gender = models.CharField(max_length=255,null=True,blank=True)
    phone = models.CharField(max_length=255,null=True,blank=True)
    symptoms = models.TextField()
    medical_history = models.TextField()
    allergies = models.TextField()
    current_medication = models.TextField()
    test_result_text= models.TextField(blank=True,null=True)
    test_result_image = models.FileField(upload_to='doctors/',null=True,blank=True)
    
    def __str__(self):
        return self.full_name
    
    

class PatientGenarateResult(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patientgenarateResult')
    daily_health_tip = models.TextField()
    hydration_Tip = models.TextField()
    mental_health_tip = models.TextField()
    sleep_tip = models.TextField()
    stress_management_tip = models.TextField()
    healthy_lifestyle_habit = models.TextField()
    Immune_boosting_tip = models.TextField()
    food_and_nutrution = models.TextField()
    
    
    
class DoctorRecommendation(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_recommendation')
    full_name = models.CharField(max_length=255,null=True,blank=True)
    phone = models.CharField(max_length=255,null=True,blank=True)
    gender = models.CharField(max_length=255,null=True,blank=True)
    specialization = models.CharField(max_length=255,null=True,blank=True)
    years_of_experience = models.CharField(max_length=255,null=True,blank=True)
    qualifications = models.CharField(max_length=255,null=True,blank=True)
    consultation_fee = models.CharField(max_length=255,null=True,blank=True)
    availability = models.CharField(max_length=255,null=True,blank=True)