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
from .models.patient import PatientGenarateResult
from .models.patient import DiagnosisModel
from rest_framework.views import APIView
from .llm_ai.utils import generate_result_for_patient_diagnosis
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # To handle file uploads
    serializer_class = DiagnosisSerializer

    def get_queryset(self):
        return DiagnosisModel.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class DoctorDetailView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # To handle 
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
           
           ## ai generate health tips
           ai_diagnosis_result = generate_result_for_patient_diagnosis(patient_diagnosis_result,avaliable_professional_doctors)
           
           print("ai",ai_diagnosis_result)
           
           ## create patient GenarateResult
           
        #    PatientGenarateResult.objects.create(user=user)
           
           
           
           return Response({"details":"result generated successfully"},status=status.HTTP_200_OK)
        
               
        except Exception as e:
            return Response({"error":f"error occur{e}"})
       
