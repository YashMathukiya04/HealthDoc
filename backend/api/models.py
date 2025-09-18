# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone


class User(AbstractUser):
    # Define roles for all users
    ROLE_ADMIN = 'admin'
    ROLE_RECEPTIONIST = 'receptionist'
    ROLE_DOCTOR = 'doctor'
    ROLE_PATIENT = 'patient'
    ROLE_LAB_TECHNICIAN = 'lab_technician'
    ROLE_PHARMACIST = 'pharmacist'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_RECEPTIONIST, 'Receptionist'),
        (ROLE_DOCTOR, 'Doctor'),
        (ROLE_PATIENT, 'Patient'),
        (ROLE_LAB_TECHNICIAN, 'Lab Technician'),
        (ROLE_PHARMACIST, 'Pharmacist'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"



class PatientProfile(models.Model):
    REGISTRATION_SELF = 'self'
    REGISTRATION_RECEPTIONIST = 'receptionist'

    REGISTRATION_CHOICES = [
        (REGISTRATION_SELF, 'Self'),
        (REGISTRATION_RECEPTIONIST, 'Receptionist'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile")
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')])
    address = models.TextField(blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)

    registration_type = models.CharField(max_length=20, choices=REGISTRATION_CHOICES)
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="registered_patients")

    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Patient: {self.user.username}"


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    qualifications = models.TextField()
    experience = models.IntegerField(default=0)
    availability = models.JSONField(default=dict)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("RESCHEDULED", "Rescheduled"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    ]
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)


class Prescription(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class PrescriptionMedicine(models.Model):
    STATUS_CHOICES = [("PENDING", "Pending"), ("DISPENSED", "Dispensed")]

    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    medicine_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    pharmacist_note = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")


class LabReportRequest(models.Model):
    STATUS_CHOICES = [("REQUESTED", "Requested"), ("COMPLETED", "Completed")]

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="REQUESTED")
    created_at = models.DateTimeField(auto_now_add=True)


class LabReportResult(models.Model):
    request = models.OneToOneField(LabReportRequest, on_delete=models.CASCADE)
    pathologist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    result_file = models.FileField(upload_to="lab_reports/")
    result_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    TYPE_CHOICES = [("APPOINTMENT", "Appointment"), ("PRESCRIPTION", "Prescription"), ("LAB_REPORT", "Lab Report")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


# Medicine table (for Pharmacist role)
class Medicine(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    manufacturer = models.CharField(max_length=200, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name
