from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    image = models.ImageField(upload_to='categories/', blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='brands/', blank=True)

    def __str__(self):
        return self.name


class VehicleMake(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class VehicleModel(models.Model):
    make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('make', 'name')

    def __str__(self):
        return f"{self.make.name} {self.name}"


class VehicleYear(models.Model):
    vehicle_model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name='years')
    year = models.IntegerField()

    class Meta:
        unique_together = ('vehicle_model', 'year')

    def __str__(self):
        return str(self.year)


class Engine(models.Model):
    vehicle_year = models.ForeignKey(VehicleYear, on_delete=models.CASCADE, related_name='engines')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.vehicle_year} - {self.name}"


class Product(models.Model):
    CONDITION_CHOICES = [
        ('OEM', 'Original Equipment Manufacturer'),
        ('AFTERMARKET', 'Aftermarket'),
        ('GENUINE', 'Genuine'),
        ('REFURBISHED', 'Refurbished'),
    ]

    name = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=100, unique=True)
    oem_number = models.CharField(max_length=200, blank=True, help_text='Original OEM part number')
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='OEM')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    compatible_vehicles = models.ManyToManyField(Engine, blank=True, related_name='products')
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    warranty = models.CharField(max_length=200, blank=True, default='6 Months')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=200, blank=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}★)"
