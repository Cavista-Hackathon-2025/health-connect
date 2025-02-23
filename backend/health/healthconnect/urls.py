from django.urls import path,include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView,SpectacularRedocView
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as rest_view
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()

## router

router.register(r'create-account', CreateAccount,basename='create-account')

router.register(r'doctor-details', DoctorDetailView,basename='doctor-details')

router.register(r'patient-ai-generated-result', PatientGeneratedResultView,basename='patient-ai-generated-result')

router.register(r'patient-diagnosis', PatientDiagnosisView,basename='patient-diagnosis')

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('login/', LoginView.as_view(),name='login'),
    path('generate-diagnosis',generate_diagnosis.as_view(),name='generate-diagnosis')
] +  router.urls + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
