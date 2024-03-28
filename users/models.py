from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    isAdmin = models.BooleanField(default=False, blank=True)
    signImg = models.ImageField(upload_to="user_signatures/", null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, null=True)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["name", "username"]
