from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import User, PatientProfile, DoctorProfile

@receiver(post_save, sender=User)
def create_profile_for_user(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.role == User.ROLE_PATIENT:
        # create default patient profile; registration_type will be set by registration flow
        PatientProfile.objects.create(user=instance, registration_type=PatientProfile.REGISTRATION_SELF, is_verified=False)
    elif instance.role == User.ROLE_DOCTOR:
        DoctorProfile.objects.create(user=instance)
    # receptionist/pharmacist/pathologist/admin: no auto profile required here
