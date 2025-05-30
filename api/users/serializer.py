from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from phonenumber_field.serializerfields import PhoneNumberField, PhoneNumber
from .models import CustomUser, Cart, CartItem
from products.serializer import ProductSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'address', 'phone_number', 'profile_picture', 'is_staff']
    
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, validators = [validate_password])
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        return user

class ProfileSerializer(serializers.ModelSerializer):
    address = serializers.CharField()
    phone_number = PhoneNumberField(region='NP')
    class Meta:
        model = CustomUser
        fields = ['address', 'phone_number', 'profile_picture']
    
    def validate_phone_number(self, value:PhoneNumber):
        if not str(value).startswith('+977'):
            raise serializers.ValidationError("Only Nepali (+977) phone numbers are allowed!")
        return value

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = CartItem
        fields = ['id','product', 'quantity', 'date_added']
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    class Meta:
        model = Cart
        fields = ['user', 'items']