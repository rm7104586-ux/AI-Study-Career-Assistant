from django.conf import settings
from django.db import models


class Activity(models.Model):
    ACTIVITY_TYPES = [
        ("chat", "AI Chat"),
        ("notes", "Notes Analyzer"),
        ("quiz", "Quiz"),
        ("resume", "Resume Analyzer"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    activity_type = models.CharField(
        max_length=20,
        choices=ACTIVITY_TYPES,
    )

    title = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.title}"