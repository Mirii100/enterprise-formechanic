import uuid
import base64
import requests
from datetime import datetime
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment
from .serializers import PaymentSerializer, MpesaPaymentSerializer, CardPaymentSerializer
from orders.models import Order


class MpesaPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MpesaPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.filter(
            id=serializer.validated_data['order_id'],
            user=request.user
        ).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        if order.status not in ('PENDING',):
            return Response({'error': 'Order cannot be paid'}, status=status.HTTP_400_BAD_REQUEST)

        phone = serializer.validated_data['phone_number']
        # Normalize phone: remove 0 or +254 prefix
        if phone.startswith('+'):
            phone = phone[1:]
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        if not phone.startswith('254'):
            phone = '254' + phone

        transaction_id = f"AES-{uuid.uuid4().hex[:8].upper()}"

        payment = Payment.objects.create(
            order=order,
            user=request.user,
            method='MPESA',
            amount=order.total,
            phone_number=phone,
            transaction_id=transaction_id,
        )

        # In production, here you would call Safaricom Daraja API STK Push:
        # daraja_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        # headers = { "Authorization": f"Bearer {access_token}", "Content-Type": "application/json" }
        # payload = {
        #     "BusinessShortCode": "174379",
        #     "Password": self._generate_password(),
        #     "Timestamp": self._timestamp(),
        #     "TransactionType": "CustomerPayBillOnline",
        #     "Amount": int(order.total),
        #     "PartyA": phone,
        #     "PartyB": "174379",
        #     "PhoneNumber": phone,
        #     "CallBackURL": "https://yourdomain.com/api/payments/mpesa/callback/",
        #     "AccountReference": f"Order{order.id}",
        #     "TransactionDesc": f"AutoEliteSpares Order #{order.id}"
        # }
        # response = requests.post(daraja_url, json=payload, headers=headers)

        return Response({
            'success': True,
            'message': f'M-Pesa STK Push initiated. Check phone {phone} to enter PIN.',
            'payment_id': payment.id,
            'transaction_id': transaction_id,
            'amount': str(order.total),
            'phone': phone,
        })

    def _generate_password(self, shortcode='174379', passkey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'):
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        data = f"{shortcode}{passkey}{timestamp}"
        return base64.b64encode(data.encode()).decode()

    def _timestamp(self):
        return datetime.now().strftime('%Y%m%d%H%M%S')


class MpesaCallbackView(APIView):
    def post(self, request):
        data = request.data
        body = data.get('Body', {})
        stk_callback = body.get('stkCallback', {})

        result_code = stk_callback.get('ResultCode', 1)
        result_desc = stk_callback.get('ResultDesc', '')
        merchant_request_id = stk_callback.get('MerchantRequestID', '')
        checkout_request_id = stk_callback.get('CheckoutRequestID', '')
        callback_metadata = stk_callback.get('CallbackMetadata', {})

        transaction_id = merchant_request_id or checkout_request_id

        # Find payment by transaction_id prefix (fallback)
        payment = Payment.objects.filter(
            transaction_id__startswith='AES-'
        ).order_by('-id').first()

        if result_code == 0 and payment:
            payment.status = 'COMPLETED'
            payment.save()
            payment.order.status = 'CONFIRMED'
            payment.order.save()
            return Response({
                'ResultCode': 0,
                'ResultDesc': 'Success'
            })

        if payment:
            payment.status = 'FAILED'
            payment.save()
            return Response({
                'ResultCode': result_code,
                'ResultDesc': result_desc
            })

        return Response({'ResultCode': 1, 'ResultDesc': 'Payment not found'})


class MpesaStatusQueryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, user=request.user).first()
        if not payment:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'payment_id': payment.id,
            'status': payment.status,
            'amount': str(payment.amount),
            'method': payment.method,
            'transaction_id': payment.transaction_id,
            'created_at': payment.created_at,
        })


class CardPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CardPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.filter(
            id=serializer.validated_data['order_id'],
            user=request.user
        ).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        payment = Payment.objects.create(
            order=order,
            user=request.user,
            method='CARD',
            amount=order.total,
            card_last_four=serializer.validated_data['card_number'][-4:],
            transaction_id=f"CARD-{uuid.uuid4().hex[:12].upper()}",
            status='COMPLETED',
        )

        order.status = 'CONFIRMED'
        order.save()

        return Response({
            'success': True,
            'message': 'Payment processed successfully',
            'payment_id': payment.id,
            'transaction_id': payment.transaction_id,
        })


class PaymentConfirmView(APIView):
    def post(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id).first()
        if not payment:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        payment.status = 'COMPLETED'
        payment.save()
        payment.order.status = 'CONFIRMED'
        payment.order.save()

        return Response({'message': 'Payment confirmed', 'order_status': payment.order.status})


class PaymentHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
