# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CurrentUserView, PatientSelfRegisterView, ReceptionistRegisterPatientView,
    DoctorProfileViewSet, PatientProfileViewSet, AppointmentViewSet,
    MedicineViewSet, PrescriptionViewSet, LabRequestViewSet, LabResultViewSet, NotificationViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'doctors', DoctorProfileViewSet, basename='doctorprofile')
router.register(r'patients', PatientProfileViewSet, basename='patientprofile')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'lab-requests', LabRequestViewSet, basename='labrequest')
router.register(r'lab-results', LabResultViewSet, basename='labresult')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('auth/register/', PatientSelfRegisterView.as_view(), name='patient_self_register'),
    path('auth/register-by-receptionist/', ReceptionistRegisterPatientView.as_view(), name='patient_register_by_receptionist'),
]
