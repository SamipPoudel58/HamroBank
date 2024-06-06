# models.py
from django.db import models

class Cheque(models.Model):
    chequeImg = models.ImageField(upload_to='signatures/')
    accountNo = models.CharField(max_length=100)
