# api/views.py
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import (
    User, PatientProfile, DoctorProfile, PharmacistProfile, ReceptionistProfile, PathologistProfile,
    Appointment, Medicine, Prescription, LabReportRequest, LabReportResult, Notification
)
from .serializers import (UserSerializer, RegisterPatientSerializer, PatientProfileSerializer, DoctorProfileSerializer, AppointmentSerializer, PrescriptionSerializer, MedicineSerializer, LabRequestSerializer, LabResultSerializer, NotificationSerializer)

from .permissions import IsDoctor, IsReceptionist, IsPharmacist, IsPathologist, IsAdmin, IsPatient

User = get_user_model()

# Simple user management endpoint (admin creates other users)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

# Endpoint: current-user
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# Patient self registration
class PatientSelfRegisterView(generics.CreateAPIView):
    serializer_class = RegisterPatientSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

# Receptionist registering patient
class ReceptionistRegisterPatientView(generics.CreateAPIView):
    serializer_class = RegisterPatientSerializer
    permission_classes = [IsAuthenticated, IsReceptionist]

    def perform_create(self, serializer):
        request = self.request
        user = serializer.save()
        # update patient profile registration type and registered_by
        profile = user.patient_profile
        profile.registration_type = profile.REG_RECEPTION
        profile.registered_by = request.user
        profile.save()

# Doctor profile view
class DoctorProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorProfile.objects.select_related('user').all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

# Patient profile view
class PatientProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PatientProfile.objects.select_related('user','registered_by').all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

# Appointments
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('patient__user','doctor__user').all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.ROLE_PATIENT:
            return Appointment.objects.filter(patient__user=user)
        if user.role == User.ROLE_DOCTOR:
            return Appointment.objects.filter(doctor__user=user)
        if user.role == User.ROLE_RECEPTIONIST or user.role == User.ROLE_ADMIN:
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        data = serializer.validated_data
        # If patient is creating, ensure it's their patientprofile
        if user.role == User.ROLE_PATIENT:
            patient_profile = getattr(user, 'patient_profile', None)
            if not patient_profile:
                raise serializers.ValidationError("No patient profile.")
            serializer.save(created_by=user, patient=patient_profile)
        else:
            serializer.save(created_by=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsReceptionist])
    def reschedule(self, request, pk=None):
        appt = self.get_object()
        date = request.data.get('date')
        time = request.data.get('time')
        if date:
            appt.date = date
        if time:
            appt.time = time
        appt.status = Appointment.STATUS_RESCHEDULED
        appt.save()
        Notification.objects.create(user=appt.patient.user, message=f"Your appointment was rescheduled to {appt.date} {appt.time}", type=Notification.TYPE_APPT)
        return Response({'status':'rescheduled'})

# Medicines
class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated, IsPharmacist|IsAdmin]

# Prescriptions
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related('doctor','patient','appointment').all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create','update','partial_update','destroy']:
            return [IsAuthenticated(), IsDoctor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.ROLE_PATIENT:
            return Prescription.objects.filter(patient__user=user)
        if user.role == User.ROLE_DOCTOR:
            return Prescription.objects.filter(doctor__user=user)
        if user.role == User.ROLE_PHARMACIST:
            return Prescription.objects.all()
        return Prescription.objects.none()

# Lab requests and results
class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabReportRequest.objects.select_related('doctor','patient').all()
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsDoctor()]
        return [IsAuthenticated()]

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabReportResult.objects.select_related('request','pathologist').all()
    serializer_class = LabResultSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create','partial_update','finalize']:
            return [IsAuthenticated(), IsPathologist()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsPathologist])
    def finalize(self, request, pk=None):
        result = self.get_object()
        result_text = request.data.get('result_text', '')
        if 'result_file' in request.FILES:
            result.result_file = request.FILES['result_file']
        if result_text:
            result.result_text = result_text
        # store pathologist as current user
        result.pathologist = request.user
        result.is_final = True
        result.save()
        Notification.objects.create(user=result.request.patient.user, message=f"Your lab report '{result.request.test_name}' is ready.", type=Notification.TYPE_LAB)
        return Response({'status':'finalized'})

# Notifications
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

# api/views.py (add these below existing imports and viewsets)

from .serializers import PharmacistProfileSerializer, ReceptionistProfileSerializer, PathologistProfileSerializer

class PharmacistProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PharmacistProfile.objects.select_related('user').all()
    serializer_class = PharmacistProfileSerializer
    permission_classes = [IsAuthenticated]

class ReceptionistProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReceptionistProfile.objects.select_related('user').all()
    serializer_class = ReceptionistProfileSerializer
    permission_classes = [IsAuthenticated]

class PathologistProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PathologistProfile.objects.select_related('user').all()
    serializer_class = PathologistProfileSerializer
    permission_classes = [IsAuthenticated]



from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to HealthDoc API!")

# api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Appointment, Prescription, LabReportRequest
from .serializers import AppointmentSerializer, PrescriptionSerializer, LabRequestSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patient_appointments(request):
    patient = request.user.patient_profile
    appointments = Appointment.objects.filter(patient=patient)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patient_prescriptions(request):
    patient = request.user.patient_profile
    prescriptions = Prescription.objects.filter(patient=patient)
    serializer = PrescriptionSerializer(prescriptions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patient_lab_reports(request):
    patient = request.user.patient_profile
    lab_reports = LabReportRequest.objects.filter(patient=patient)
    serializer = LabRequestSerializer(lab_reports, many=True)
    return Response(serializer.data)
