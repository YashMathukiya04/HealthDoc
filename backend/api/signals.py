# api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import PatientProfile, DoctorProfile, User

@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        # auto create patientprofile only if role is PATIENT
        if instance.role == User.ROLE_PATIENT:
            PatientProfile.objects.create(user=instance, registration_type=PatientProfile.REG_SELF)
        if instance.role == User.ROLE_DOCTOR:
            DoctorProfile.objects.create(user=instance)
