from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductReview, VehicleMake, VehicleModel, VehicleYear, Engine


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'user', 'user_name', 'rating', 'title', 'comment', 'is_verified_purchase', 'created_at']
        read_only_fields = ['user', 'is_verified_purchase']


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'children', 'image', 'description']

    def get_children(self, obj):
        children = obj.children.all()
        if children:
            return CategorySerializer(children, many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class EngineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engine
        fields = ['id', 'name']


class VehicleYearSerializer(serializers.ModelSerializer):
    engines = EngineSerializer(many=True, read_only=True)

    class Meta:
        model = VehicleYear
        fields = ['id', 'year', 'engines']


class VehicleModelSerializer(serializers.ModelSerializer):
    years = serializers.SerializerMethodField()

    class Meta:
        model = VehicleModel
        fields = ['id', 'name', 'years']

    def get_years(self, obj):
        return VehicleYearSerializer(obj.years.all(), many=True).data


class VehicleMakeSerializer(serializers.ModelSerializer):
    models = serializers.SerializerMethodField()

    class Meta:
        model = VehicleMake
        fields = ['id', 'name', 'slug', 'models']

    def get_models(self, obj):
        return VehicleModelSerializer(obj.models.all(), many=True).data


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'sku', 'price', 'compare_price', 'stock', 'is_featured',
                  'condition', 'primary_image', 'category_name', 'brand_name', 'created_at']

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            return img.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class ProductSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False)
    category = serializers.IntegerField(required=False)
    brand = serializers.IntegerField(required=False)
    min_price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    max_price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    condition = serializers.ChoiceField(required=False, choices=['OEM', 'AFTERMARKET', 'GENUINE', 'REFURBISHED'])
    in_stock = serializers.BooleanField(required=False)
    make = serializers.IntegerField(required=False)
    model = serializers.IntegerField(required=False)
    year = serializers.IntegerField(required=False)
    engine = serializers.IntegerField(required=False)
