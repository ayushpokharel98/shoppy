from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .serializer import UserRegisterSerializer, UserSerializer, ProfileSerializer, CartSerializer, CartItemSerializer
from .models import CustomUser, Cart, CartItem
from products.models import Product


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code != 200:
            return response

        tokens = response.data
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        res = Response({'success': True}, status=status.HTTP_200_OK)
        res.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
        res.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )

        return res


class CookieTokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'refreshed': False}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
            access_token = serializer.validated_data['access']

            res = Response({'refreshed': True}, status=status.HTTP_200_OK)
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res

        except Exception:
            return Response({'refreshed': False}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()


class ProfileUpdateRetrieveView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    def post(self, request):
        response = Response({'success': True}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token', path='/', samesite='None')
        response.delete_cookie('refresh_token', path='/', samesite='None')
        return response

class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'authenticated': True})
    
class IsAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({'admin': True})
    
class UserDetails(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class CartDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer
    
    def get_object(self):
        return Cart.objects.get(user = self.request.user)
    
class CartItemActionView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    
class CartItemAddView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    
    def create(self, request, *args, **kwargs):
        user_cart = request.user.cart
        
        try:
            product = Product.objects.get(id=kwargs['id'])
        except Product.DoesNotExist:
            raise NotFound("Product not found!")
        
        cart_item, created = CartItem.objects.get_or_create(
            cart = user_cart,
            product = product,
        )
        
        if not created:
            cart_item.quantity +=1
            cart_item.save()
            
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
            