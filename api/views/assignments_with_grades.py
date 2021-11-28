from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.db import connection
from api.models import Assignment, GradedAssignment
from api.utils import Utils


class AssignmentsWithGradeListView(ListAPIView):
    serializer_class = None
    queryset = []

    def list(self, request):
        student_id = request.user.id
        data = self.get_assngs_with_grade([student_id])

        return Response(data=data, status=HTTP_200_OK)

    def get_assngs_with_grade(self, params):
        query = ''' SELECT api_ass.id     AS id,
                    api_ass.duration      AS duration,
                    api_ass.created_at    AS created_at,
                    api_ass.deadline      AS deadline,
                    grades.attempt_start_time AS attempt_start_time,
                    grades.attempt_end_time   AS attempt_end_time,
                    grade,
                    title,
                    users.username AS teacher
                FROM   (api_assignment AS api_ass
                        LEFT JOIN (SELECT *
                                FROM   api_gradedassignment
                                WHERE  student_id = %s) AS grades
                            ON api_ass.id = grades.assignment_id)
                    INNER JOIN users_user AS users
                            ON teacher_id = users.id '''

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            assgns_with_grade = Utils.dictfetchall(cursor)

        return assgns_with_grade
