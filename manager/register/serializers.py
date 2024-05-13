from rest_framework import serializers
from .models import Company, UserProfile, Invite
from django.contrib.auth.models import User
from projects.models import Project


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def get_friends(self, obj):
        friends = obj.friends.all()
        return UserSerializer(friends, many=True).data
