from django.db import models
from django.contrib.auth.models import User
# Create your models here.

from django.conf import settings
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """Creates an authorization token and a calendar for each new user"""
    if created:
        Token.objects.create(user=instance)
        Calendar.objects.create(name=instance.username, owner=instance)

calendar_name_validator = RegexValidator(r'^[0-9a-zA-z/ ]*$', 'Please only use alphanumeric values, spaces, and /.')
class Calendar(models.Model):
    """Represents calendar with user owner"""
    calendar_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, blank=False, validators=[calendar_name_validator])
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class Event(models.Model):
    """Represents a calendar event"""
    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=20, blank=True, default='(No title)')
    start_date = models.DateTimeField() # determine validation later
    end_date = models.DateTimeField()
    desc = models.TextField(max_length=200, blank=True)
    repeat = models.DurationField(null=True, blank=True) # think through this logic
    stop_date = models.DateField(blank=True, null=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)

class CalendarSubscription(models.Model):
    """Represents subscription to someone else's calendar"""
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)

# Will possibly implement this later
# class Task(models.Model):
#     """Represents task created by users"""
#     task_id = models.AutoField(primary_key=True)
#     task_name = models.CharField(max_length=20, default='(No title)')
#     start_date = models.DateTimeField()
#     desc = models.TextField(max_length=200, blank=True)
    
    