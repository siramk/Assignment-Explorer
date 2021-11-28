from __future__ import print_function
import os.path
import base64
import googleapiclient
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client.client import GoogleCredentials, HttpAccessTokenRefreshError
from email.mime.text import MIMEText


SCOPES = ['https://www.googleapis.com/auth/gmail.send']
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Email:

    def __init__(self):
        self.service = None
        self.FROM_EMAIL = "siramk@iitbhilai.ac.in"
        self.GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID") or None
        self.GOOGLE_CLIENT_SECRET = os.environ.get(
            "GOOGLE_CLIENT_SECRET") or None
        self.GOOGLE_TOKEN_URI = "https://accounts.google.com/o/oauth2/token"
        self.REFRESH_TOKEN = os.environ.get("REFRESH_TOKEN") or None

    def login(self):
        creds = GoogleCredentials(None,
                                  self.GOOGLE_CLIENT_ID,
                                  self.GOOGLE_CLIENT_SECRET,
                                  self.REFRESH_TOKEN,
                                  None,
                                  self.GOOGLE_TOKEN_URI,
                                  None)

        self.service = googleapiclient.discovery.build(
            'gmail', 'v1', http=creds.authorize(Http()))

    def create_msg(self, message_text, to, subject):

        message = MIMEText(message_text)
        message['to'] = ','.join(to)
        message['from'] = self.FROM_EMAIL
        message['subject'] = subject
        raw = base64.urlsafe_b64encode(message.as_bytes())
        raw = raw.decode()

        return {'raw': raw}

    def send_msg(self, message):
        try:
            mail = (self.service.users().messages().send(userId='me', body=message)
                    .execute())
            print('Message Id: %s' % mail['id'])
            return mail
        except Exception as error:
            print('An error occurred: %s' % error)
