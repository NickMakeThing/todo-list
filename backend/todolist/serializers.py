from rest_framework import serializers
from .models import Task, List
from django.contrib.auth.models import User
import django.contrib.auth as auth
import django.contrib.auth.password_validation 

class BulkSerializer(serializers.Serializer):
    idArr = serializers.ListField(child=serializers.IntegerField())
    priority = serializers.ListField(child=serializers.IntegerField())
    colour = serializers.ListField(child=serializers.CharField(max_length=21))
    listName = serializers.CharField(max_length=25)
    taskName = serializers.CharField(max_length=40)
    #completed= 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','listId','taskName','priority','completed','colour','description')

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id','listName','userid','colour')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','password')
    def validate(self, data):
        if data['password']!=data[password2]:
            raise serializer.ValidationError(
                'Passwords do not match'
            )
        return data
    def create(self, validated):
        print(validated)
        user = User.objects.create_user(
            validated['username'],None,validated['password']
            )
        return user

class LoginSerializer(serializers.Serializer):
    #right/read only in serializer?
    #commenting these two lines out results in "username does not exist"
    password = serializers.CharField(max_length=128, write_only=True)
    username = serializers.CharField(max_length=128, write_only=True)
    def validate(self, data):
        try:
            username = User.objects.get(username=data['username'])
        except:
            raise serializers.ValidationError(
                'This username does not exist'
            )
        if not username.check_password(data['password']):
            raise serializers.ValidationError(
                'Incorrect password'
            )
        return username
    
"""
    xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:8000/test/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.onload = () => {console.log('loaded: ',xhr.response, xhr.status)}
    xhr.send()
"""