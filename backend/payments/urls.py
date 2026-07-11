from django.urls import path
from . import views

urlpatterns = [
    path('mpesa/', views.MpesaPaymentView.as_view(), name='mpesa-pay'),
    path('mpesa/callback/', views.MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('mpesa/<int:payment_id>/status/', views.MpesaStatusQueryView.as_view(), name='mpesa-status'),
    path('card/', views.CardPaymentView.as_view(), name='card-pay'),
    path('<int:payment_id>/confirm/', views.PaymentConfirmView.as_view(), name='payment-confirm'),
    path('history/', views.PaymentHistoryView.as_view(), name='payment-history'),
]
