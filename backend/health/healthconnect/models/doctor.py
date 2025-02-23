from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models
import uuid
from django.conf import settings

  

class DoctorsModel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctors_model')
    full_name = models.CharField(max_length=255,null=True,blank=True)
    phone = models.CharField(max_length=255,null=True,blank=True)
    gender = models.CharField(max_length=255,null=True,blank=True)
    specialization = models.CharField(max_length=255,null=True,blank=True)
    years_of_experience = models.CharField(max_length=255,null=True,blank=True)
    qualifications = models.CharField(max_length=255,null=True,blank=True)
    consultation_fee = models.CharField(max_length=255,null=True,blank=True)
    availability = models.CharField(max_length=255,null=True,blank=True)
    profile_picture = models.FileField(upload_to='doctors/',null=True,blank=True)
    short_Bio = models.TextField()
    
    
    def __str__(self):
        return self.full_name