import smtplib
from dataclasses import dataclass
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict

from services.database.database import DatabaseService
from utils.env import Environment


@dataclass
class EmailService:
    def __init__(self, smtp_config: Dict[str, str]):
        self.smtp_config = smtp_config

    def send_email(self, sender_email: str, receiver_emails: str, subject: str, body: str):
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_emails
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        print(self.smtp_config)
        print(sender_email)
        try:
            with smtplib.SMTP(self.smtp_config['server'], self.smtp_config['port']) as server:
                server.starttls()
                server.login(sender_email, self.smtp_config['password'])
                server.sendmail(sender_email, receiver_emails.split(','), msg.as_string())
            print(f"Email đã gửi đến {receiver_emails} lúc {datetime.now()}")
        except Exception as e:
            print(f"Gửi mail thất bại: {e}")


# Gửi mail nhăc nhở
def scheduled_email_task(env : Environment, email_service: EmailService, body: str):
    try:
        lst_user_email = DatabaseService.getUserEnableNotify(env)
        for email in lst_user_email:
            # Send the email
            email_service.send_email(
                sender_email=env.email_sender,
                receiver_emails=email,
                subject=env.email_subject,
                body=body
            )
    except Exception as e:
        print(f"Error in scheduled task: {e}")

smtp_config = {
    'server':"smtp.gmail.com",
    'port': 587,
    'password': "ynxe laab rimt bxik"
}
mail_service = EmailService(smtp_config)