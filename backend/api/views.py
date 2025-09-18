# api/views.py
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    User, PatientProfile, DoctorProfile, Appointment,
    Prescription, PrescriptionMedicine, Medicine,
    LabReportRequest, LabReportResult, Notification
)
from .serializers import (
    UserSerializer, RegisterPatientSerializer, PatientProfileSerializer,
    DoctorProfileSerializer, AppointmentSerializer, MedicineSerializer,
    PrescriptionSerializer, LabReportRequestSerializer, LabReportResultSerializer,
    NotificationSerializer
)
from .permissions import (
    IsDoctor, IsPatient, IsReceptionist,
    IsPharmacist, IsPathologist, IsAdmin
)
from rest_framework.routers import DefaultRouter

# --------------------------
# USER MANAGEMENT
# --------------------------

class UserViewSet(viewsets.ModelViewSet):
    """Admin can manage all users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

# --------------------------
# PATIENT REGISTRATION
# --------------------------

class PatientSelfRegisterView(generics.CreateAPIView):
    """Patient self-signup"""
    queryset = User.objects.all()
    serializer_class = RegisterPatientSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx.update({'request': self.request})
        return ctx


class ReceptionistRegisterPatientView(generics.CreateAPIView):
    """Receptionist registers patient"""
    queryset = User.objects.all()
    serializer_class = RegisterPatientSerializer
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx.update({'request': self.request})
        return ctx

# --------------------------
# PROFILES
# --------------------------

class DoctorProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorProfile.objects.select_related('user').all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]


class PatientProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PatientProfile.objects.select_related('user', 'registered_by').all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

# --------------------------
# APPOINTMENTS
# --------------------------

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('patient__user', 'doctor__user').all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.ROLE_PATIENT:
            return Appointment.objects.filter(patient__user=user)
        if user.role == User.ROLE_DOCTOR:
            return Appointment.objects.filter(doctor__user=user)
        if user.role in (User.ROLE_RECEPTIONIST, User.ROLE_ADMIN):
            return Appointment.objects.all()
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()
        if user.role == User.ROLE_PATIENT:
            # patient books own appointment
            patient_profile = getattr(user, 'patientprofile', None)
            if not patient_profile:
                return Response({'detail': 'No patient profile'}, status=status.HTTP_400_BAD_REQUEST)
            data['patient_id'] = patient_profile.id
        elif user.role not in (User.ROLE_RECEPTIONIST, User.ROLE_ADMIN):
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        appt = serializer.save(created_by=user)
        return Response(self.get_serializer(appt).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsReceptionist])
    def reschedule(self, request, pk=None):
        appt = self.get_object()
        new_date = request.data.get('date')
        new_time = request.data.get('time')
        if not new_date or not new_time:
            return Response({'detail': 'date and time required'}, status=status.HTTP_400_BAD_REQUEST)
        appt.date = new_date
        appt.time = new_time
        appt.status = 'RESCHEDULED'
        appt.save()
        Notification.objects.create(
            user=appt.patient.user,
            message=f"Your appointment was rescheduled to {appt.date} {appt.time}",
            type='APPOINTMENT'
        )
        return Response({'status': 'rescheduled'})

# --------------------------
# MEDICINE & PRESCRIPTIONS
# --------------------------

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related('doctor', 'patient', 'appointment').all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
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
        return super().get_queryset()

# --------------------------
# LAB REPORTS
# --------------------------

class LabReportRequestViewSet(viewsets.ModelViewSet):
    queryset = LabReportRequest.objects.select_related('doctor', 'patient').all()
    serializer_class = LabReportRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsDoctor()]
        return [IsAuthenticated()]


class LabReportResultViewSet(viewsets.ModelViewSet):
    queryset = LabReportResult.objects.select_related('request', 'pathologist').all()
    serializer_class = LabReportResultSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'finalize']:
            return [IsAuthenticated(), IsPathologist()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsPathologist])
    def finalize(self, request, pk=None):
        result = self.get_object()
        result_text = request.data.get('result_text')
        if 'result_file' in request.FILES:
            result.result_file = request.FILES['result_file']
        if result_text:
            result.result_text = result_text
        result.pathologist = request.user
        result.is_final = True
        result.save()
        Notification.objects.create(
            user=result.request.patient.user,
            message=f"Your lab report '{result.request.test_name}' is ready.",
            type='LAB_REPORT'
        )
        return Response(self.get_serializer(result).data)

# --------------------------
# NOTIFICATIONS
# --------------------------

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

# --------------------------
# ROUTER
# --------------------------

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'doctors', DoctorProfileViewSet, basename='doctor')
router.register(r'patients', PatientProfileViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'lab-requests', LabReportRequestViewSet, basename='labrequest')
router.register(r'lab-results', LabReportResultViewSet, basename='labresult')
router.register(r'notifications', NotificationViewSet, basename='notification')
