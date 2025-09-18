
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import (
    User, PatientProfile, DoctorProfile, Appointment, Prescription,
    PrescriptionMedicine, LabReportRequest, LabReportResult, Notification
)

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('username','email','first_name','last_name','role','is_active')
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Role & Contact', {'fields': ('role','phone')}),
    )

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user','registration_type','registered_by','is_verified','created_at')
    search_fields = ('user__username','user__email','registered_by__username')

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user','specialization','experience')

admin.site.register(Appointment)
admin.site.register(Prescription)
admin.site.register(PrescriptionMedicine)
admin.site.register(LabReportRequest)
admin.site.register(LabReportResult)
admin.site.register(Notification)
