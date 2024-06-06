# serializers.py
from rest_framework import serializers
from .models import Cheque

class ChequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cheque
        fields = ['chequeImg', 'accountNo']
