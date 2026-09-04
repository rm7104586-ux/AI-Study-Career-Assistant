from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.urls")
    ),

    path(
        "api/auth/login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),

    path(
        "api/auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    path(
        "api/ai/",
        include("ai_chat.urls")
    ),
    path("", lambda request: HttpResponse("AI Study & Career Assistant API is running")),
]