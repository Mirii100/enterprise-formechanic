from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_vendor = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    company_name = models.CharField(max_length=200, blank=True)

    groups = models.ManyToManyField(
        'auth.Group', related_name='accounts_users', blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='accounts_users_permissions', blank=True
    )

    def __str__(self):
        return self.email or self.username


class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_codes')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.code}"


class SavedVehicle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_vehicles')
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    engine = models.CharField(max_length=100, blank=True)
    nickname = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=50, default='Home')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Kenya')
    phone = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.street}, {self.city}"
