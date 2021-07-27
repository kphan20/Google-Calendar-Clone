from django.urls import include, path
from rest_framework import routers, urlpatterns
from rest_framework.authtoken.views import obtain_auth_token

from api.views import CustomAuthToken

from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'events', views.EventViewSet)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-token-auth/', CustomAuthToken.as_view()),
    path('register/', views.register_user),
    path('get-calendars/', views.get_calendars),
    path('event-create/', views.create_event),
    path('edit-event/<int:pk>', views.edit_event),
    path('', include(router.urls)),
]
