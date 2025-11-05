from django.urls import path
from ..personal_views.formation_views import formations_view

app_name = 'formations'

urlpatterns = [
    path('', formations_view, name='formations'),
]

