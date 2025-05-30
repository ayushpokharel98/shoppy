from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from products.models import Product

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    address = models.TextField()
    phone_number = PhoneNumberField(region = 'NP')
    profile_picture = models.ImageField(upload_to="users/", default="users/default.png")
    
    def __str__(self):
        return self.username
    
class Cart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.user.username}'s Cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)

    

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
    