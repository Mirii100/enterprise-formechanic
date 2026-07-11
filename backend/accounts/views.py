import string
import random
from datetime import timedelta
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import User, PasswordResetCode, SavedVehicle, Address
from .serializers import UserSerializer, RegisterSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, SavedVehicleSerializer, AddressSerializer


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)
        Token.objects.get_or_create(user=user)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        logout(request)
        return Response({'message': 'Logged out'})


class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'If the email exists, a reset code has been sent'})

        code = ''.join(random.choices(string.digits, k=6))
        PasswordResetCode.objects.create(user=user, code=code)

        # In production, send email here
        print(f"[DEV] Password reset code for {email}: {code}")

        return Response({'message': 'Reset code sent to your email', 'code': code if user.username == 'admin' else None})


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            reset_code = PasswordResetCode.objects.filter(
                user=user,
                code=serializer.validated_data['code'],
                is_used=False,
                created_at__gte=timezone.now() - timedelta(hours=1)
            ).latest('created_at')
        except (User.DoesNotExist, PasswordResetCode.DoesNotExist):
            return Response({'error': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        reset_code.is_used = True
        reset_code.save()

        return Response({'message': 'Password reset successful'})


class SavedVehicleListCreateView(generics.ListCreateAPIView):
    serializer_class = SavedVehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedVehicle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedVehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SavedVehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedVehicle.objects.filter(user=self.request.user)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
