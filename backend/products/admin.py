from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, ProductReview, VehicleMake, VehicleModel, VehicleYear, Engine


class ProductImageInline(admin.TabularInline):
    model = ProductImage


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'price', 'stock', 'condition', 'is_active', 'is_featured']
    list_filter = ['condition', 'is_active', 'is_featured', 'brand', 'category']
    search_fields = ['name', 'sku', 'oem_number']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]


admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product, ProductAdmin)
admin.site.register(VehicleMake)
admin.site.register(VehicleModel)
admin.site.register(VehicleYear)
admin.site.register(Engine)
