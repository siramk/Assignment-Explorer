from rest_framework import serializers
from datetime import datetime
import pytz
from users.models import User
from .models import Assignment, Question, Choice, GradedAssignment
from django.core.exceptions import ValidationError
from django.utils import timezone


class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class QuestionSerializer(serializers.ModelSerializer):
    choices = StringSerializer(many=True)
    answer = StringSerializer(many=False)

    class Meta:
        model = Question
        fields = ('id', 'choices', 'question', 'order', 'answer')


class AssignmentSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    teacher = StringSerializer(many=False)

    class Meta:
        model = Assignment
        fields = ('__all__')

    def get_questions(self, obj):
        questions = QuestionSerializer(obj.questions.all(), many=True).data
        return questions

    @staticmethod
    def get_date_time_obj(datestring):
        return datetime.strptime(datestring, '%Y-%m-%dT%H:%M:%SZ')

    def create(self, request):
        data = request.data

        assignment = Assignment()
        teacher = User.objects.get(username=data['teacher'])
        assignment.teacher = teacher
        assignment.title = data['title']
        assignment.duration = data['duration']
        assignment.deadline = self.get_date_time_obj(data['deadline'])
        assignment.save()
        try:
            order = 1
            for q in data['questions']:
                choice_objects = []
                for c in q['choices']:
                    newC = Choice()
                    newC.title = c
                    newC.save()
                    choice_objects.append(newC)

                newQ = Question()
                newQ.question = q['title']
                newQ.order = order
                newQ.save()

                for choice in choice_objects:
                    newQ.choices.add(choice)

                answer_id = self.get_answer_id(q['choices'], q['answer'])
                if answer_id is None:
                    raise serializers.ValidationError(
                        "Answer is not present in Choices")
                newQ.answer = Choice.objects.get(
                    id=choice_objects[answer_id].id)
                newQ.assignment = assignment
                newQ.save()
                order += 1
            return assignment
        except Exception as e:
            assignment.delete()
            raise e

    def update(self, assignment, request):

        data = request.data

        assignment.title = data['title']
        assignment.duration = data['duration']
        assignment.deadline = self.get_date_time_obj(data['deadline'])
        assignment.save()

        # delete old questions of this assignment
        # Question.objects.filter(assignment__id=assignment.id).delete()
        assignment.questions.all().delete()
        # create new questios of this assignment
        order = 1
        for q in data['questions']:
            choice_objects = []
            for c in q['choices']:
                newC = Choice()
                newC.title = c
                newC.save()
                choice_objects.append(newC)

            newQ = Question()
            newQ.question = q['title']
            newQ.order = order
            newQ.save()

            for choice in choice_objects:
                newQ.choices.add(choice)

            answer_id = self.get_answer_id(q['choices'], q['answer'])
            if answer_id is None:
                raise serializers.ValidationError(
                    "Answer is not present in Choices")
            newQ.answer = Choice.objects.get(id=choice_objects[answer_id].id)
            newQ.assignment = assignment
            newQ.save()
            order += 1

        return assignment

    def get_answer_id(self, choices, answer):
        for index, choice in enumerate(choices):
            if choice == answer:
                return index


class GradedAssignmentSerializer(serializers.ModelSerializer):
    student = StringSerializer(many=False)
    assignment = StringSerializer(many=False)

    class Meta:
        model = GradedAssignment
        fields = ('__all__')

    def get_duration(self, obj):
        return obj.assignment.duration

    def get_deadline(self, obj):
        print("deadline= ", obj.assignment.deadline)
        return obj.assignment.deadline

    def get_attempt_start_time(self, obj):
        return obj.attempt_start_time

    def create(self, request):
        data = request.data

        assignment = Assignment.objects.get(id=data['asntId'])
        student = User.objects.get(username=data['username'])

        graded_asnt = GradedAssignment()
        graded_asnt.assignment = assignment
        graded_asnt.student = student
        graded_asnt.save()

        return graded_asnt

    def update(self, graded_asnt, request):
        data = request.data

        assignment = Assignment.objects.get(id=data['asntId'])

        questions = {q.id: q for q in assignment.questions.all()}
        ques_responses = data['answers']

        answered_correct_count = 0

        for qId, ques_response in ques_responses.items():
            if questions[int(qId)].answer.title == ques_response:
                answered_correct_count += 1

        grade = answered_correct_count / len(questions) * 100
        graded_asnt.grade = grade
        graded_asnt.attempt_end_time = timezone.now()
        graded_asnt.save()
        return graded_asnt
