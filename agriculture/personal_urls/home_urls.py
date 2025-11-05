from django.urls import path
from agriculture.personal_views import home_views

urlpatterns = [
    path('', home_views.home_view, name='home'),
]
