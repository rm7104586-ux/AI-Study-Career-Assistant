from django.urls import path

from .views import (
    ActivityListView,
    ChatView,
    NotesUploadView,
    QuizView,
    ResumeUploadView,
)


urlpatterns = [
    path("chat/", ChatView.as_view(), name="chat"),
    path("notes/", NotesUploadView.as_view(), name="notes"),
    path("quiz/", QuizView.as_view(), name="quiz"),
    path("resume/", ResumeUploadView.as_view(), name="resume"),
    path("activity/", ActivityListView.as_view(), name="activity"),
]