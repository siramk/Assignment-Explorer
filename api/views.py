from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView
)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from django.db import connection
from .models import Assignment, GradedAssignment
from .serializers import AssignmentSerializer, GradedAssignmentSerializer
from api.email.email import Email
from django.utils import timezone
