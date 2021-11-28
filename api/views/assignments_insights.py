from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection
from api.models import Assignment, GradedAssignment
from api.utils import Utils


class TeacherAssgnsInsights(APIView):

    def get(self, request):
        # permissions check
        if request.user.is_student:
            return Response(status=HTTP_400_BAD_REQUEST)

        teacher_id = request.user.id

        # data fecth
        nof_students = self.get_nof_students()
        assgn_statuses = self.get_assgn_statuses(teacher_id)

        # data manipulation - adding a key req for frontend, adding nof_students_unattempted
        key = 0
        for assgn_status in assgn_statuses:
            assgn_status['nof_students_unattempted'] = nof_students - \
                assgn_status['nof_students_attempted']
            assgn_status['key'] = key
            key += 1

        return Response(data=assgn_statuses, status=HTTP_200_OK)

    def get_assgn_statuses(self, teacher_id):
        assgn_ids_query = ''' SELECT id, title FROM 'api_assignment' WHERE teacher_id=%s '''
        with connection.cursor() as cursor:
            cursor.execute(assgn_ids_query, [teacher_id, ])
            assgns = Utils.dictfetchall(cursor)
            id_to_tile = self.map_id_to_title(assgns)
            assgn_ids = tuple(id_to_tile.keys())

            attempted_assgn_statuses_query = ''' SELECT   assignment_id,
                                    COUNT(id) AS nof_students_attempted
                            FROM     api_gradedassignment
                            WHERE    assignment_id IN (%s)
                            GROUP BY assignment_id ''' % ','.join(["%s" for _ in range(len(assgn_ids))])

            cursor.execute(attempted_assgn_statuses_query, assgn_ids)
            attempted_assgn_statuses = Utils.dictfetchall(cursor)

            assgns_with_no_attempts = self.get_assgns_with_no_attempts(
                attempted_assgn_statuses, assgn_ids, id_to_tile)
            assgn_statuses_with_title = self.get_assgn_statuses_with_title(
                attempted_assgn_statuses, id_to_tile)
        return assgn_statuses_with_title + assgns_with_no_attempts

    def get_assgns_with_no_attempts(self, attempted_assgn_statuses, assgn_ids, id_to_tile):
        attempted_assgn_ids = set()
        assgns_with_no_attempts = []
        for assgn in attempted_assgn_statuses:
            attempted_assgn_ids.add(assgn['assignment_id'])
        for id in assgn_ids:
            if id not in attempted_assgn_ids:
                assgns_with_no_attempts.append({
                    'assignment_id': id,
                    'title': id_to_tile[id],
                    'nof_students_attempted': 0
                })
        return assgns_with_no_attempts

    def get_assgn_statuses_with_title(self, assgn_statuses, id_to_tile):
        for assgn_status in assgn_statuses:
            assgn_status['title'] = id_to_tile[assgn_status['assignment_id']]
        return assgn_statuses

    def map_id_to_title(self, assgns):
        id_to_tile = dict()
        for assgn in assgns:
            id_to_tile[assgn['id']] = assgn['title']
        return id_to_tile

    def get_nof_students(self):
        query = ''' SELECT COUNT(id) FROM users_user where is_student=1 '''

        with connection.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchone()[0]


class TeacherAssgnInsightDetail(APIView):

    def get(self, request, assgn_id):
        if request.user.is_student:
            return Response(status=HTTP_400_BAD_REQUEST)

        students = {
            'attempted_students': self.get_attemped_students(assgn_id),
            'unattempted_students': self.unattempted_students(assgn_id)
        }
        self.add_keys(students)
        return Response(data=students, status=HTTP_200_OK)

    def add_keys(self, students):
        i = 0
        for student in students['attempted_students']:
            student['key'] = i
            i += 1
        i = 0
        for student in students['unattempted_students']:
            student['key'] = i
            i += 1

    def get_attemped_students(self, assgn_id):
        query = '''SELECT    users.id AS user_id,
                            users.username AS username,
                            users.email AS email,
                            graded_assgns.grade AS grade
                    FROM      users_user AS users
                    LEFT JOIN
                            (
                                    SELECT student_id,
                                            attempt_start_time,
                                            attempt_end_time,
                                            grade
                                    FROM   api_gradedassignment
                                    WHERE  assignment_id = %s) AS graded_assgns
                    ON        users.id = graded_assgns.student_id
                    WHERE     attempt_end_time NOT null'''
        with connection.cursor() as cursor:
            cursor.execute(query, (assgn_id,))
            return Utils.dictfetchall(cursor)

    def unattempted_students(self, assgn_id):
        query = '''SELECT    users.id AS user_id,
                            users.username AS username,
                            users.email AS email,
                            graded_assgns.grade AS grade
                    FROM      users_user AS users
                    LEFT JOIN
                            (
                                    SELECT student_id,
                                            attempt_start_time,
                                            attempt_end_time,
                                            grade
                                    FROM   api_gradedassignment
                                    WHERE  assignment_id = %s) AS graded_assgns
                    ON        users.id = graded_assgns.student_id
                    WHERE     users.is_student=1 AND attempt_end_time IS null'''
        with connection.cursor() as cursor:
            cursor.execute(query, (assgn_id,))
            return Utils.dictfetchall(cursor)
