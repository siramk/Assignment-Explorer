from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView
)
from api.serializers import GradedAssignmentSerializer
from django.utils import timezone
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.response import Response
from django.db import connection
from api.models import Assignment, GradedAssignment
from api.utils import Utils
from datetime import timedelta


class GradedAssignmentListView(ListAPIView):
    serializer_class = GradedAssignmentSerializer

    def get_queryset(self):
        queryset = GradedAssignment.objects.all()
        username = self.request.query_params.get('username', None)
        asnt_id = self.request.query_params.get('asntId', None)

        if username is not None and asnt_id is not None:
            queryset = queryset.filter(student__username=username,
                                       assignment__id=asnt_id)
        elif username is not None:
            queryset = queryset.filter(student__username=username)

        return queryset


class GradedAssignmentCreateView(CreateAPIView):
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def post(self, request):
        if not self.is_create_valid(request.data):
            return Response({'message': "Assignment expired"}, status=HTTP_400_BAD_REQUEST)

        data = self.request.data
        username = data['username']
        asnt_id = data['asntId']
        graded_asnt = GradedAssignment.objects.all().filter(student__username=username,
                                                            assignment__id=asnt_id)
        if graded_asnt:
            if graded_asnt.first().attempt_end_time is not None:
                return Response({'message': "Already attempted!"}, status=HTTP_400_BAD_REQUEST)
            return Response(data={"message": "this graded_asnt is already created!"},
                            status=HTTP_201_CREATED)

        serializer = GradedAssignmentSerializer(data=request.data)
        serializer.is_valid()
        graded_assignment = serializer.create(request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)

    def is_create_valid(self, data):
        asnt_id = data['asntId']
        assnt = Assignment.objects.get(id=asnt_id)
        deadline = assnt.deadline

        if deadline > timezone.now():
            return True
        return False


class GradedAssignmentUpdateView(UpdateAPIView):
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def put(self, request):
        data = self.request.data
        username = data['username']
        asnt_id = data['asntId']
        graded_asnt = GradedAssignment.objects.get(student__username=username,
                                                   assignment__id=asnt_id)
        if not self.is_submit_valid(graded_asnt, data):
            return Response(data={'error': "Assignment expired"}, status=HTTP_400_BAD_REQUEST)

        serializer = GradedAssignmentSerializer(graded_asnt, data=request.data)
        serializer.is_valid()
        graded_assignment = serializer.update(graded_asnt, request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
        return Response(status=HTTP_400_BAD_REQUEST)

    def is_submit_valid(self, graded_assnt, data):
        if graded_assnt.attempt_end_time != None:
            return False
        assnt = graded_assnt.assignment
        deadline = assnt.deadline
        duration = assnt.duration
        attmpt_start_time = graded_assnt.attempt_start_time
        max_attmpt_end_time = attmpt_start_time + \
            timedelta(minutes=duration + 1)
        # added extra time to consider network delays
        if deadline < attmpt_start_time:
            return False
        elif max_attmpt_end_time < timezone.now():
            return False
        return True
