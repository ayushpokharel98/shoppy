from django.contrib import admin
from .models import CustomUser, Cart, CartItem

admin.site.register(CustomUser)
admin.site.register(Cart)
admin.site.register(CartItem)