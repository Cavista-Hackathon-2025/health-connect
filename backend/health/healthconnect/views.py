from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
# Create your views here.
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import *
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models.account import HealthUser
from .models.doctor import DoctorsModel
from .models.patient import PatientGenarateResult,DoctorRecommendation
from .models.patient import DiagnosisModel
from rest_framework.views import APIView
from .llm_ai.utils import generate_result_for_patient_diagnosis,generate_recommended_doctor_for_patient
class CreateAccount(viewsets.ModelViewSet):
    """
    endpoint to create account for employer or applicant
    """
    queryset = HealthUser.objects.all()
    serializer_class = CreateAccountSerializer
    def create(self, request, *args, **kwargs):
        serializer = CreateAccountSerializer(data=request.data)
        if HealthUser.objects.filter(email=request.data["email"]).exists():
                return Response(
                    {'detail': 'Account already exists with this email'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif serializer.is_valid():
            ## check if user already exist
                
            serializer.validated_data["password"] = make_password(serializer.validated_data["password"])
            # serializer.validated_data['is_active'] = False
            serializer.save()
                
        return Response({
            'userdata':serializer.data,
            'detail': 'Account created. Please verify your email to activate the account.'
        }, status=status.HTTP_201_CREATED)
    
        
        
        
    
class LoginView(ObtainAuthToken):
        
        serializer_class = LoginSerializer
        """
        custom authToken to add extral field and change username field to email
        """

        def post(self, request, *args, **kwargs):
            serializer = self.serializer_class(data=request.data,
                                            context={'request': request})
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            user.save()

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email,
                "is_active": user.is_active
            })
            


class PatientDiagnosisView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DiagnosisSerializer

    def get_queryset(self):
        return DiagnosisModel.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class DoctorDetailView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] 
    serializer_class = DoctorModelSerializer

    def get_queryset(self):
        return DoctorsModel.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
        
        
        


class PatientGeneratedResultView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
 
    serializer_class = PatientGenarateResultSerializer

    def get_queryset(self):
        return PatientGenarateResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
        
        

class DoctorRecommendationView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
 
    serializer_class = DoctorRecommendationsSerializer

    def get_queryset(self):
        return DoctorRecommendation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
        
        
        
        
        


class generate_diagnosis(APIView):
    """ """
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        user = request.user
        try:
           # get avaliable_professional_doctors
           avaliable_professional_doctors = DoctorsModel.objects.all()
           print("doctor",avaliable_professional_doctors)
           
           
            # get patient_diagnosis_result
           patient_diagnosis_result = get_object_or_404(DiagnosisModel,user=user)
           
           # generate recommended doctors
           recommended_doctors = generate_recommended_doctor_for_patient(patient_diagnosis_result)
           print(" recommended_doctors:", recommended_doctors.doctors)
           for doctors in recommended_doctors.doctors:
               
               obj,create = DoctorRecommendation.objects.update_or_create(
                user=user,
                 full_name=doctors.full_name,
                 phone=doctors.phone,
                 gender=doctors.gender,
                 specialization=doctors.specialization,
                 years_of_experience=doctors.years_of_experience,
                 consultation_fee=doctors.consultation_fee,
                   
               )
           
           ## ai generate health tips
           ai_diagnosis_result = generate_result_for_patient_diagnosis(patient_diagnosis_result)
           
           print("ai",ai_diagnosis_result.daily_health_tip)
           
           ## create patient GenarateResult
           
           obj,created =PatientGenarateResult.objects.update_or_create(user=user,
            daily_health_tip=ai_diagnosis_result.daily_health_tip,
            hydration_Tip=ai_diagnosis_result.hydration_tip,mental_health_tip=ai_diagnosis_result.mental_health_tip,
            sleep_tip=ai_diagnosis_result.sleep_tip,
            stress_management_tip=ai_diagnosis_result.stress_management_tip,healthy_lifestyle_habit=ai_diagnosis_result.healthy_lifestyle_habit,
             Immune_boosting_tip=ai_diagnosis_result.immune_boosting_tip,
             food_and_nutrution=ai_diagnosis_result.food_and_nutrution
            )
           return Response({"details":"result generated successfully"},status=status.HTTP_200_OK)
        
               
        except Exception as e:
            return Response({"error":f"error occur{e}"})
       
