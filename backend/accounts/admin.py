from django.contrib import admin
from .models import User, SavedVehicle, Address

admin.site.register(User)
admin.site.register(SavedVehicle)
admin.site.register(Address)
