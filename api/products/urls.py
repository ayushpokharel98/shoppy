from django.urls import path
from .views import ProductListView, CategoryListView, ProductCreateView, ProductManipulateView, CategoryCreateView, CategoryUpdateView
urlpatterns = [
    path('', ProductListView.as_view(), name="prodcuts"),
    path('categories/', CategoryListView.as_view(), name="categories"),
    path('create/', ProductCreateView.as_view(), name="product-create"),
    path('<int:pk>/', ProductManipulateView.as_view(), name="product-all-actions"),
    path('category/create/', CategoryCreateView.as_view(), name="category-create"),
    path('category/<int:pk>/', CategoryUpdateView.as_view(), name="category-update"),
]

