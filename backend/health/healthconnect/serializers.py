from .models.account import HealthUser
from .models.doctor import DoctorsModel
from .models.patient import DiagnosisModel,PatientGenarateResult
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate


class PatientGenarateResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientGenarateResult
        fields = '__all__'
        read_only_fields = ['is_active', 'id','user']
    

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosisModel
        fields = ['id','full_name','age','gender','phone','symptoms','medical_history','allergies',
                  'current_medication','test_result_text',
                  'test_result_image']
        read_only_fields = ['is_active', 'id','user'] 


class DoctorModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorsModel
        fields = ['id','full_name','phone','gender',
                  'specialization',
                  'years_of_experience',
                  'qualifications','availability',
                  'consultation_fee','profile_picture','short_Bio']
        
        read_only_fields = ['is_active', 'id','user'] 
        
        
class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthUser
        fields = ['email', 'password', 'first_name', 'last_name', 'is_active', 'id',]
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False}, 
            'last_name': {'required': False},   
        }
        read_only_fields = ['is_active', 'id']     
        
        


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(label=_("email"))
    password = serializers.CharField(label=_("password"), style={'input_type': 'password'}, trim_whitespace=False)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
       
    
        ## check user verification status
        active_user  = get_object_or_404(HealthUser,email=email)
        
        if not active_user.is_active:
            msg = _('Please verify your account and try logging in again.')
            raise serializers.ValidationError(msg, code='authorization')
        

        elif email and password:
            user =  authenticate(request=self.context.get('request'),email=email,password=password)
            print(user)
            
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
        
        attrs['user'] = user
        
        return attrs
    
    
