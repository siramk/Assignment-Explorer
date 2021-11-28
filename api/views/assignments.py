from rest_framework import viewsets
from api.serializers import AssignmentSerializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.response import Response
from api.models import Assignment, GradedAssignment
from api.utils import Utils


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    queryset = Assignment.objects.all()

    def get_queryset(self):
        queryset = Assignment.objects.all()
        if self.request.user.is_student:
            return queryset

        user_id = self.request.user.id

        if user_id is not None:
            queryset = queryset.filter(teacher__id=user_id)

        return queryset

    def create(self, request):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            assignment = serializer.create(request)
            if assignment:
                return Response(status=HTTP_201_CREATED)
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        assignment = Assignment.objects.get(id=request.data['id'])
        serializer = AssignmentSerializer(assignment, data=request.data)
        if serializer.is_valid():
            assignment = serializer.update(assignment, request)
            if assignment:
                return Response(status=HTTP_201_CREATED)
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)
