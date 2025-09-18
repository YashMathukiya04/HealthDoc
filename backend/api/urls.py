
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientSelfRegisterView, ReceptionistRegisterPatientView, router
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # auth endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # registration endpoints
    path('auth/register/', PatientSelfRegisterView.as_view(), name='patient_self_register'),
    path('auth/register-by-receptionist/', ReceptionistRegisterPatientView.as_view(), name='patient_register_by_receptionist'),

    # API router (viewsets)
    path('', include(router.urls)),
]

# before testing api end poins 

'''

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientSelfRegisterView, ReceptionistRegisterPatientView, router
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Swagger imports
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="HealthDoc API",
        default_version='v1',
        description="API documentation for HealthDoc Hospital Management System",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', PatientSelfRegisterView.as_view(), name='patient_self_register'),
    path('auth/register-by-receptionist/', ReceptionistRegisterPatientView.as_view(), name='patient_register_by_receptionist'),
    path('', include(router.urls)),

    # Swagger docs
    path('swagger(<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
'''