from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Calendar, Event, CalendarSubscription

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'start_date', 'end_date', 'desc', 'event_id']
class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = []
class CalendarSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarSubscription
        fields = []