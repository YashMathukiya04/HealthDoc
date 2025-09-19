from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import (
    DoctorProfile, PatientProfile, PharmacistProfile, ReceptionistProfile, PathologistProfile,
    Medicine, Appointment, LabReportRequest, Prescription
)
from datetime import date, time

User = get_user_model()

class Command(BaseCommand):
    help = "Create sample users and data"

    def handle(self, *args, **options):
        # ---------- Create Admin ----------
        if not User.objects.filter(username='admin1').exists():
            admin = User.objects.create_superuser(
                username='admin1',
                password='adminpass',
                email='admin@example.com',
                role=User.ROLE_ADMIN
            )
            self.stdout.write(self.style.SUCCESS("Created admin1/adminpass"))

        # ---------- Create Doctor ----------
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

        # ---------- Create Patient ----------
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

        # ---------- Create Receptionist ----------
        if not User.objects.filter(username='reception1').exists():
            receptionist_user = User.objects.create_user(
                username='reception1',
                password='receptionpass',
                role=User.ROLE_RECEPTIONIST
            )
        else:
            receptionist_user = User.objects.get(username='reception1')

        if not ReceptionistProfile.objects.filter(user=receptionist_user).exists():
            ReceptionistProfile.objects.create(
                user=receptionist_user,
                shift="Morning",
                desk_number="R1"
            )
            self.stdout.write(self.style.SUCCESS("Created receptionist1/receptionpass"))

        # ---------- Create Pharmacist ----------
        if not User.objects.filter(username='pharma1').exists():
            pharmacist_user = User.objects.create_user(
                username='pharma1',
                password='pharmapass',
                role=User.ROLE_PHARMACIST
            )
        else:
            pharmacist_user = User.objects.get(username='pharma1')

        if not PharmacistProfile.objects.filter(user=pharmacist_user).exists():
            PharmacistProfile.objects.create(
                user=pharmacist_user,
                qualifications="B.Pharm",
                experience_years=2
            )
            self.stdout.write(self.style.SUCCESS("Created pharma1/pharmapass"))

        # ---------- Create Pathologist ----------
        if not User.objects.filter(username='patho1').exists():
            pathologist_user = User.objects.create_user(
                username='patho1',
                password='pathopass',
                role=User.ROLE_PATHOLOGIST
            )
        else:
            pathologist_user = User.objects.get(username='patho1')

        if not PathologistProfile.objects.filter(user=pathologist_user).exists():
            PathologistProfile.objects.create(
                user=pathologist_user,
                qualifications="MD Pathology",
                specialization="Hematology",
                experience_years=4
            )
            self.stdout.write(self.style.SUCCESS("Created patho1/pathopass"))

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
            if not Prescription.objects.filter(appointment=appointment).exists():
                Prescription.objects.create(
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

        self.stdout.write(self.style.SUCCESS("✅ Sample data creation completed!"))
