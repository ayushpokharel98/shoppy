from django.urls import path
from .views import (
    RegisterView,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    ProfileUpdateRetrieveView,
    LogoutView,
    IsAuthenticatedView,
    UserDetails,
    CartDetailView,
    CartItemActionView,
    CartItemAddView,
    IsAdminView
)

urlpatterns = [
    path('', UserDetails.as_view(), name="details"),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CookieTokenObtainPairView.as_view(), name="token"),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name="token-refresh"),
    path('profile/', ProfileUpdateRetrieveView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('is-authenticated/', IsAuthenticatedView.as_view(), name='is-authenticated'),
    path('cart/', CartDetailView.as_view(), name="cart"),
    path('cart/item/<int:pk>/', CartItemActionView.as_view(), name='cart-item'),
    path('cart/add/<int:id>/', CartItemAddView.as_view(), name="cart_add"),
    path('is-admin/', IsAdminView.as_view(), name="is-admin"),
]
