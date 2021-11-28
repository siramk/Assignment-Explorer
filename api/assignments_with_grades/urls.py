from django.urls import path
from api.views.assignments_with_grades import AssignmentsWithGradeListView

urlpatterns = [
    path('', AssignmentsWithGradeListView.as_view())
]
