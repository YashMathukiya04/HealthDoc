# api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.conf import settings

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("The username must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_ADMIN = 'ADMIN'
    ROLE_DOCTOR = 'DOCTOR'
    ROLE_RECEPTIONIST = 'RECEPTIONIST'
    ROLE_PHARMACIST = 'PHARMACIST'
    ROLE_PATHOLOGIST = 'PATHOLOGIST'
    ROLE_PATIENT = 'PATIENT'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_DOCTOR, 'Doctor'),
        (ROLE_RECEPTIONIST, 'Receptionist'),
        (ROLE_PHARMACIST, 'Pharmacist'),
        (ROLE_PATHOLOGIST, 'Pathologist'),
        (ROLE_PATIENT, 'Patient'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PATIENT)
    phone = models.CharField(max_length=20, blank=True, null=True)

    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"


class PatientProfile(models.Model):
    REG_SELF = 'SELF'
    REG_RECEPTION = 'RECEPTIONIST'
    REG_CHOICES = [
        (REG_SELF, 'Self Registered'),
        (REG_RECEPTION, 'Registered by Receptionist'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    address = models.TextField(blank=True, null=True)
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)

    registration_type = models.CharField(max_length=20, choices=REG_CHOICES, default=REG_SELF)
    registered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='registered_patients')

    created_at = models.DateTimeField(auto_now_add=True)
    # NOTE: no approval_status as you requested

    def __str__(self):
        return f"PatientProfile: {self.user.username}"


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=120, blank=True, null=True)
    qualifications = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    availability = models.JSONField(default=dict, blank=True)  # {"mon":["09:00-13:00"], ...}

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username} - {self.specialization or ''}"


class Appointment(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_APPROVED = 'APPROVED'
    STATUS_RESCHEDULED = 'RESCHEDULED'
    STATUS_CANCELLED = 'CANCELLED'
    STATUS_COMPLETED = 'COMPLETED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_RESCHEDULED, 'Rescheduled'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField(default='09:00')  # any default time
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('doctor', 'date', 'time')

    def __str__(self):
        return f"Appt: {self.patient.user.username} with {self.doctor.user.username} on {self.date} {self.time}"


class Prescription(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='prescriptions')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription #{self.id} for {self.patient.user.username}"


class PrescriptionMedicine(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='items')
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=120)
    duration = models.CharField(max_length=120)
    pharmacist_note = models.TextField(blank=True, null=True)
    STATUS_PENDING = 'PENDING'
    STATUS_DISPENSED = 'DISPENSED'
    STATUS_CHOICES = [(STATUS_PENDING, 'Pending'), (STATUS_DISPENSED, 'Dispensed')]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)


class Medicine(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    manufacturer = models.CharField(max_length=200, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class LabReportRequest(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='lab_requests', null=True, blank=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='lab_requests')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    test_name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=[('REQUESTED','Requested'),('COMPLETED','Completed')], default='REQUESTED')
    created_at = models.DateTimeField(auto_now_add=True)


class LabReportResult(models.Model):
    request = models.OneToOneField(LabReportRequest, on_delete=models.CASCADE, related_name='result')
    pathologist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    result_file = models.FileField(upload_to='lab_reports/', null=True, blank=True)
    result_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_final = models.BooleanField(default=False)


class Notification(models.Model):
    TYPE_APPT = 'APPOINTMENT'
    TYPE_PRESC = 'PRESCRIPTION'
    TYPE_LAB = 'LAB_REPORT'
    TYPE_CHOICES = [(TYPE_APPT,'Appointment'),(TYPE_PRESC,'Prescription'),(TYPE_LAB,'Lab Report')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default=TYPE_APPT)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
