from api.email.email import Email
from rest_framework.views import APIView

from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.response import Response
from api.utils import Utils


class SendEmail(APIView):
    def post(self, request):
        if request.user.is_student:
            return Response(status=HTTP_400_BAD_REQUEST)
        mail = request.data
        email = Email()
        email.login()
        msg = email.create_msg(
            mail.get('body'), mail.get('to'), mail.get('subject'))
        if email.send_msg(msg) == None:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=HTTP_200_OK)
