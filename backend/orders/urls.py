from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', views.CartAddItemView.as_view(), name='cart-add'),
    path('cart/items/<int:item_id>/', views.CartUpdateItemView.as_view(), name='cart-update'),
    path('cart/items/<int:item_id>/remove/', views.CartRemoveItemView.as_view(), name='cart-remove'),
    path('create/', views.CreateOrderView.as_view(), name='order-create'),
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<int:id>/', views.OrderDetailView.as_view(), name='order-detail'),
]
