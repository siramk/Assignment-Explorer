from django.urls import path
from api.views.assignments_insights import (
    TeacherAssgnsInsights,
    TeacherAssgnInsightDetail
)


urlpatterns = [
    path('teacher/', TeacherAssgnsInsights.as_view()),
    path('teacher/<int:assgn_id>/', TeacherAssgnInsightDetail.as_view()),

]
