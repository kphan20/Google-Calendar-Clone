from copy import error
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from api.serializers import *
from api.models import *

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

class CustomAuthToken(ObtainAuthToken):
    """Extension of ObtainAuthToken class to customize response"""
    def post(self, request, *args, **kwargs):
        """Creates/retrieves auth token and returns the token with the user's username"""
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid()
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
        })
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_event(request):
    """Processing for event creation"""
    request_data = request.data
    try:
        calendar = Calendar.objects.get(calendar_id=request_data['calendar_id'])
        serializer = EventSerializer(data=request_data, context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(calendar=calendar)
            return Response({}, status=status.HTTP_201_CREATED)
    except error:
        print(error)
        return Response({}, status.HTTP_409_CONFLICT)

@api_view(['PUT']) 
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_event(request, pk):
    """Processing for event edit"""
    try:
        event = Event.objects.get(event_id=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = EventSerializer(event, data=request.data)
    if serializer.is_valid(raise_exception=True):
        try:
            calendar=Calendar.objects.get(calendar_id=request.data['calendar_id'])
            serializer.save(calendar=calendar)
        except Calendar.DoesNotExist:
            return Response({'response': 'calendar busted'})
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
def register_user(request):
    """Processing for user creation"""
    request_data = request.data
    request_data['password'] = make_password(request_data['password'])
    serializer = UserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        data = serializer.data
        token = Token.objects.get_or_create(user=user)
        print(token)
        return Response({
            'token': token[0].key,
            'username': data['username']
        })
    return Response(serializer._errors)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_calendars(request):
    """Retrieves the current user's calendars and associated events"""
    try:
        user = User.objects.get(username=request.query_params['username'])
        own_calendars = Calendar.objects.filter(owner=user)
        subscribed_calendars = CalendarSubscription.objects.filter(user_id=user).values('calendar')
        returned_dict = {}
        returned_dict['own_calendars'] = retrieve_events(own_calendars)
        returned_dict['subscribed_calendars'] = retrieve_events(subscribed_calendars)
        return Response(returned_dict)
    except error:
        print(error)
        print(request)
    finally:
        print(request.query_params)
    return Response({'result': 'failure'})

def retrieve_events(calendar_queryset):
    """Helper method to organize calendars and events in dictionary"""
    individual_cal_dict = {}
    for calendar in calendar_queryset:
        events = Event.objects.filter(calendar=calendar).order_by('start_date', '-end_date')
        event_dict = {}
        index = 0
        for event in events:
            event_dict[index] = EventSerializer(event).data
            index += 1
        individual_cal_dict[str(calendar.calendar_id) + '\\' + calendar.name] = event_dict
    return individual_cal_dict

# Individual Model Viewsets for testing
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    
class CalendarSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = CalendarSubscription.objects.all()
    serializer_class = CalendarSubscriptionSerializer
    
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
