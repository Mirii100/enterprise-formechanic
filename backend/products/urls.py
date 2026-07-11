from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'brands', views.BrandViewSet)

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', views.ProductReviewCreateView.as_view(), name='product-review'),
    path('vehicles/', views.vehicle_hierarchy, name='vehicle-hierarchy'),
    path('suggestions/', views.search_suggestions, name='search-suggestions'),
    path('featured/', views.featured_products, name='featured-products'),
]

urlpatterns += router.urls
