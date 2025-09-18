# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    PatientProfile, DoctorProfile, Appointment,
    Prescription, PrescriptionMedicine, Medicine,
    LabReportRequest, LabReportResult, Notification
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','first_name','last_name','role','phone','is_active')

class RegisterPatientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    dob = serializers.DateField(write_only=True, required=False, allow_null=True)
    gender = serializers.CharField(write_only=True, required=False, allow_null=True)
    address = serializers.CharField(write_only=True, required=False)
    blood_group = serializers.CharField(write_only=True, required=False)
    emergency_contact = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username','email','first_name','last_name','password','phone','dob','gender','address','blood_group','emergency_contact')

    def create(self, validated_data):
        profile_fields = {}
        for k in ('dob','gender','address','blood_group','emergency_contact'):
            if k in validated_data:
                profile_fields[k] = validated_data.pop(k)
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.role = User.ROLE_PATIENT
        user.set_password(password)
        user.save()
        # create or update patient profile
        PatientProfile.objects.update_or_create(user=user, defaults={**profile_fields, 'registration_type': PatientProfile.REG_SELF})
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.filter(role=User.ROLE_PATIENT), source='user')

    class Meta:
        model = PatientProfile
        fields = ('id','user','user_id','dob','gender','address','blood_group','emergency_contact','registration_type','registered_by','created_at')

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.filter(role=User.ROLE_DOCTOR), source='user')

    class Meta:
        model = DoctorProfile
        fields = ('id','user','user_id','specialization','qualifications','experience_years','availability')

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientProfileSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=PatientProfile.objects.all(), source='patient')
    doctor = DoctorProfileSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=DoctorProfile.objects.all(), source='doctor')

    class Meta:
        model = Appointment
        fields = ('id','patient','patient_id','doctor','doctor_id','date','time','status','created_by','created_at','updated_at')

    def validate(self, data):
        # validate doctor availability (very simple)
        doctor = data['doctor']
        date = data['date']
        time = data['time']
        if Appointment.objects.filter(doctor=doctor, date=date, time=time).exists():
            raise serializers.ValidationError("Doctor already has appointment at this date/time")
        return data

class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ('id','medicine_name','dosage','duration','pharmacist_note','status')

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionMedicineSerializer(many=True, write_only=True)
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Appointment.objects.all(), source='appointment', required=False)

    class Meta:
        model = Prescription
        fields = ('id','doctor','patient','appointment','appointment_id','notes','items','created_at')

    def create(self, validated_data):
        items = validated_data.pop('items', [])
        prescription = Prescription.objects.create(**validated_data)
        for it in items:
            PrescriptionMedicine.objects.create(prescription=prescription, **it)
        return prescription

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ('id','name','description','manufacturer','stock','price','expiry_date')

class LabRequestSerializer(serializers.ModelSerializer):
    doctor = DoctorProfileSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=DoctorProfile.objects.all(), source='doctor')
    patient = PatientProfileSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=PatientProfile.objects.all(), source='patient')

    class Meta:
        model = LabReportRequest
        fields = ('id','doctor','doctor_id','patient','patient_id','appointment','test_name','status','created_at')

class LabResultSerializer(serializers.ModelSerializer):
    request = LabRequestSerializer(read_only=True)
    request_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=LabReportRequest.objects.all(), source='request')

    class Meta:
        model = LabReportResult
        fields = ('id','request','request_id','pathologist','result_file','result_text','created_at','is_final')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id','user','message','type','is_read','created_at')
