from django.db.models import Q
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Brand, Product, ProductReview, VehicleMake, VehicleModel, VehicleYear, Engine
from .serializers import (
    CategorySerializer, BrandSerializer, ProductListSerializer, ProductDetailSerializer,
    ProductReviewSerializer, VehicleMakeSerializer, VehicleModelSerializer, EngineSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category_slug = self.request.query_params.get('category')
        brand_slug = self.request.query_params.get('brand')
        search = self.request.query_params.get('search')
        condition = self.request.query_params.get('condition')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        in_stock = self.request.query_params.get('in_stock')
        featured = self.request.query_params.get('featured')
        engine_id = self.request.query_params.get('engine')

        if category_slug:
            category = Category.objects.filter(slug=category_slug).first()
            if category:
                descendants = [category]
                for child in category.children.all():
                    descendants.append(child)
                    descendants.extend(child.children.all())
                queryset = queryset.filter(category__in=descendants)

        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search) |
                Q(sku__icontains=search) | Q(oem_number__icontains=search)
            )

        if condition:
            queryset = queryset.filter(condition=condition)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if in_stock:
            queryset = queryset.filter(stock__gt=0)

        if featured:
            queryset = queryset.filter(is_featured=True)

        if engine_id:
            queryset = queryset.filter(compatible_vehicles__id=engine_id)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class ProductReviewCreateView(generics.CreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def vehicle_hierarchy(request):
    makes = VehicleMake.objects.all()
    serializer = VehicleMakeSerializer(makes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search_suggestions(request):
    query = request.query_params.get('q', '')
    if len(query) < 2:
        return Response([])
    products = Product.objects.filter(
        is_active=True,
        name__icontains=query
    )[:10]
    results = [{'id': p.id, 'name': p.name, 'slug': p.slug, 'price': str(p.price)} for p in products]
    return Response(results)


@api_view(['GET'])
def featured_products(request):
    products = Product.objects.filter(is_active=True, is_featured=True)[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)
