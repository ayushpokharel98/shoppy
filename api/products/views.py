from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializer import CategorySerializer, ProductSerializer
from .filters import ProductFilter
from django.db.models import Count
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    
    search_fields = ['name']
    
    filterset_class = ProductFilter
    
class CategoryListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = CategorySerializer
    queryset = Category.objects.annotate(productCount=Count('products'))

class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Product.objects.all()
    
class ProductManipulateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Product.objects.all()

class CategoryCreateView(generics.CreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Category.objects.all()

class CategoryUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Category.objects.all()

