from rest_framework import serializers
from .models import Task, List
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','listId','taskName','priority')

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id','listName','userid')

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

class LoginSerializer():
    pass
    
"""
    xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:8000/test/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.onload = () => {console.log('loaded: ',xhr.response, xhr.status)}
    xhr.send()
"""