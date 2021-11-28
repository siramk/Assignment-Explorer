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

        questions = {q.id: q for q in assignment.questions.all()}
        ques_responses = data['answers']

        answered_correct_count = 0

        for qId, ques_response in ques_responses.items():
            if questions[int(qId)].answer.title == ques_response:
                answered_correct_count += 1

        grade = answered_correct_count / len(questions) * 100
        graded_asnt.grade = grade
        graded_asnt.save()
        return graded_asnt
    

    
    class GradedAssignmentCreateView(CreateAPIView):
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def post(self, request):
        print("req_data= ", request.data)
        serializer = GradedAssignmentSerializer(data=request.data)
        serializer.is_valid()
        graded_assignment = serializer.create(request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)


class GradedAssignmentUpdateView(UpdateAPIView):
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def put(self, request):
        username = self.request.query_params.get('username', None)
        asnt_id = self.request.query_params.get('asntId', None)
        graded_assnt = GradedAssignment.objects.get(student__username=username,
                                                    assignment__id=asnt_id)
        serializer = GradedAssignmentSerializer(graded_asnt, data=request.data)
        serializer.is_valid()  # TODO: check if the submission time is less than start + duration
        graded_assignment = serializer.create(request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
        return Response(status=HTTP_400_BAD_REQUEST)
