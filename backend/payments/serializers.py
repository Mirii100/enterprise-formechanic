from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'status', 'transaction_id']


class MpesaPaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=20)


class CardPaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    card_number = serializers.CharField(max_length=16)
    expiry = serializers.CharField(max_length=5)
    cvv = serializers.CharField(max_length=4)
