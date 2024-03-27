# models.py
from django.db import models

class Cheque(models.Model):
    image1 = models.ImageField(upload_to='signatures/')
    image2 = models.ImageField(upload_to='signatures/')
    accountNumber = models.CharField(max_length=100)
