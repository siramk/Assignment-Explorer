from django.urls import path
from api.views.graded_assignments import (GradedAssignmentListView,
                                          GradedAssignmentCreateView,
                                          GradedAssignmentUpdateView)

urlpatterns = [
    path('', GradedAssignmentListView.as_view()),
    path('create/', GradedAssignmentCreateView.as_view()),
    path('update/', GradedAssignmentUpdateView.as_view()),

]
