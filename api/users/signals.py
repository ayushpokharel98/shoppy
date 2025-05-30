from .models import CustomUser, Cart
from django.dispatch import receiver
from django.db.models.signals import post_save

@receiver(post_save, sender=CustomUser)
def create_cart(sender, created, instance, **kwargs):
    if created:
        Cart.objects.create(user=instance)