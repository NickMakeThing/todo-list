from rest_framework import serializers
from .models import Task, List
from django.contrib.auth.models import User
import django.contrib.auth as auth
import django.contrib.auth.password_validation 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','listId','taskName','priority','completed','colour','description')
    
class UpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    priority = serializers.IntegerField()
    colour = serializers.CharField(max_length=21)
    taskName = serializers.CharField(max_length=40)
    listName = serializers.CharField(max_length=25)
    completed = serializers.BooleanField()
    description =serializers.CharField(max_length=250)

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id','listName','userid','colour')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','password')
    def create(self, validated):
        print(validated)
        user = User.objects.create_user(
            validated['username'],None,validated['password']
            )
        return user

class LoginSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128, write_only=True)
    username = serializers.CharField(max_length=128, write_only=True)
    def validate(self, data):
        try:
            username = User.objects.get(username=data['username'])
        except:
            raise serializers.ValidationError(
                {'username':'This username does not exist'}
            )
        if not username.check_password(data['password']):
            raise serializers.ValidationError(
                {'password':'Incorrect password'}
            )
        return username
    
