from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    ProviderViewSet,
)
from duett_api.patients.views import ServiceMatchCreateView

router = routers.SimpleRouter()
router.register(r"", ProviderViewSet)

# /api/providers/
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()

urlpatterns = [
    path("", include(router.urls)),
]
    path(
        "<int:provider_pk>/match-services/",
        ServiceMatchCreateView.as_view(),
        name="service-create-match",
    ),
]
