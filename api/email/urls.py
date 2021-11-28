from django.urls import path
from api.views.email import SendEmail


urlpatterns = [
    path('', SendEmail.as_view()),
]
