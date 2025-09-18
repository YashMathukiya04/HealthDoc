# api/management/commands/create_sample.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import DoctorProfile, PatientProfile, Medicine, Appointment, LabReportRequest, Prescription

from datetime import date, time

User = get_user_model()

class Command(BaseCommand):
    help = "Create sample users and data"

    def handle(self, *args, **options):
        # ---------- Create Users ----------
        if not User.objects.filter(username='admin1').exists():
            admin = User.objects.create_superuser(
                username='admin1',
                password='adminpass',
                email='admin@example.com',
                role=User.ROLE_ADMIN
            )
            self.stdout.write(self.style.SUCCESS("Created admin1/adminpass"))

        if not User.objects.filter(username='doctor1').exists():
            doctor_user = User.objects.create_user(
                username='doctor1',
                password='doctorpass',
                email='doc@example.com',
                role=User.ROLE_DOCTOR
            )
        else:
            doctor_user = User.objects.get(username='doctor1')

        if not DoctorProfile.objects.filter(user=doctor_user).exists():
            DoctorProfile.objects.create(
                user=doctor_user,
                specialization='Cardiology',
                qualifications='MBBS, MD',
                experience_years=5
            )
            self.stdout.write(self.style.SUCCESS("Created doctor1/doctorpass"))
        else:
            self.stdout.write(self.style.WARNING("DoctorProfile for doctor1 already exists"))

        if not User.objects.filter(username='reception1').exists():
            User.objects.create_user(
                username='reception1',
                password='receptionpass',
                role=User.ROLE_RECEPTIONIST
            )
            self.stdout.write(self.style.SUCCESS("Created reception1/receptionpass"))

        if not User.objects.filter(username='patient1').exists():
            patient_user = User.objects.create_user(
                username='patient1',
                password='patientpass',
                role=User.ROLE_PATIENT
            )
        else:
            patient_user = User.objects.get(username='patient1')

        if not PatientProfile.objects.filter(user=patient_user).exists():
            PatientProfile.objects.create(
                user=patient_user,
                dob=date(1990, 1, 1),
                gender='Male',
                blood_group='O+',
                registration_type=PatientProfile.REG_SELF
            )
            self.stdout.write(self.style.SUCCESS("Created patient1/patientpass"))
        else:
            self.stdout.write(self.style.WARNING("PatientProfile for patient1 already exists"))

        # ---------- Create Medicines ----------
        medicines = [
            {"name": "Paracetamol", "description": "Painkiller", "stock": 100, "price": 10},
            {"name": "Amoxicillin", "description": "Antibiotic", "stock": 50, "price": 20},
            {"name": "Ibuprofen", "description": "Anti-inflammatory", "stock": 75, "price": 15},
        ]
        for med in medicines:
            if not Medicine.objects.filter(name=med["name"]).exists():
                Medicine.objects.create(**med)
                self.stdout.write(self.style.SUCCESS(f"Created medicine: {med['name']}"))

        # ---------- Create Appointment ----------
        doctor_profile = DoctorProfile.objects.first()
        patient_profile = PatientProfile.objects.first()
        if doctor_profile and patient_profile:
            if not Appointment.objects.filter(doctor=doctor_profile, patient=patient_profile, date=date.today()).exists():
                Appointment.objects.create(
                    doctor=doctor_profile,
                    patient=patient_profile,
                    date=date.today(),
                    time=time(10, 0),
                    status=Appointment.STATUS_PENDING,
                    created_by=doctor_profile.user
                )
                self.stdout.write(self.style.SUCCESS("Created sample appointment"))

        # ---------- Create Prescription ----------
        appointment = Appointment.objects.first()
        if appointment:
            prescription = Prescription.objects.create(
                doctor=doctor_profile,
                patient=patient_profile,
                appointment=appointment,
                notes="Take medicines as prescribed"
            )
            self.stdout.write(self.style.SUCCESS("Created sample prescription"))

        # ---------- Create Lab Report Request ----------
        if doctor_profile and patient_profile:
            if not LabReportRequest.objects.filter(doctor=doctor_profile, patient=patient_profile, test_name="Blood Test").exists():
                LabReportRequest.objects.create(
                    doctor=doctor_profile,
                    patient=patient_profile,
                    test_name="Blood Test",
                    status='REQUESTED'
                )
                self.stdout.write(self.style.SUCCESS("Created sample lab report request"))

        self.stdout.write(self.style.SUCCESS("Sample data creation completed!"))
