from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    ProviderViewSet,
)
from duett_api.patients.views import ServiceMatchCreateView

try:
    router = routers.SimpleRouter()
    router.register(r"", ProviderViewSet)
except Exception as e:
    print(f"An error occurred: {e}")
    # Add appropriate error handling code here
finally:
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
