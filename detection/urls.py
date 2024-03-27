from django.urls import path
from .views import check_forgery


urlpatterns = [
    path('check_forgery/', check_forgery, name='check_forgery'),
]
