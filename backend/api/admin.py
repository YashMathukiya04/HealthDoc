# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User, PatientProfile, DoctorProfile, Appointment, Prescription, PrescriptionMedicine, Medicine, LabReportRequest, LabReportResult, Notification, PathologistProfile , PharmacistProfile , ReceptionistProfile

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    fieldsets = DefaultUserAdmin.fieldsets + (
        ('Custom', {'fields': ('role','phone')}),
    )

admin.site.register(PatientProfile)
admin.site.register(DoctorProfile)
admin.site.register(Appointment)
admin.site.register(Prescription)
admin.site.register(PrescriptionMedicine)
admin.site.register(PharmacistProfile)
admin.site.register(ReceptionistProfile)
admin.site.register(PathologistProfile)
admin.site.register(Medicine)
admin.site.register(LabReportRequest)
admin.site.register(LabReportResult)
admin.site.register(Notification)
