from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.response import Response
from .models import Task, List
from django.middleware.csrf import get_token
from django.views.generic import TemplateView
from .serializers import TaskSerializer, ListSerializer, UserSerializer, LoginSerializer, UpdateSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.views.decorators.csrf import csrf_protect

def updateItems(updates,model):
    if(updates):
        serializer = UpdateSerializer(data=updates, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        fields = [field for field in data[0].keys() if not 'id' in field]
        instances = [model(**item) for item in data]
        model.objects.bulk_update(instances,fields)
    return
    
class TasksView(viewsets.ModelViewSet): #authentication and permission classes
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def patch(self, request, *args, **kwargs): 
        if not self.authenticate_request(request.user,request.data):
            return Response(status=403)
        updateItems(request.data,Task)
        return Response(status=206)

    def delete(self, request, *args, **kwargs):
        if not self.authenticate_request(request.user,request.data['update']):
            return Response(status=403)
        updateItems(request.data['update'],Task)
        toDelete = self.get_queryset().filter(id__in=request.data['delete'])
        if not toDelete:
            return Response()
        self.perform_destroy(toDelete) 
        return Response(status=204) 

    def get_queryset(self):
        return Task.objects.select_related('listId').filter(listId=self.kwargs['listId'])
        
    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        owner_of_list = List.objects.get(id=request.data['listId']).userid
        if request.user!=owner_of_list:
            return Response(status=403)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)   
    
    def list(self, request, *args, **kwargs):
        if request.user != List.objects.get(id=self.kwargs['listId']).userid:
            return Response(status=403)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    def authenticate_request(self, user, data):
        tasks = self.get_queryset()
        if (user != tasks[0].listId.userid):
                return False
        for i in data:
            if not tasks.filter(id=i['id']).exists():
                return False
        return True

class ListsView(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return List.objects.filter(userid=self.request.user)

    def create(self, request, *args, **kwargs):
        request.data['userid']=request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def patch(self, request, *args, **kwargs): 
        print('\n\n',request.data,'\n\n')
        if not self.authenticate_request(request.user,request.data):
            return Response(status=403)
        updateItems(request.data,List)
        return Response(status=206)
        
    def delete(self, request, *args, **kwargs):
        lists=self.get_queryset().filter(id__in=list(request.data))
        self.perform_destroy(lists) 
        return Response(status=204)

    def authenticate_request(self, user, data):
        lists = self.get_queryset()
        for i in data:
            if not lists.filter(id=i['id']).exists():
                return False
        return True

class RegistrationView(CreateAPIView):
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response('user created', status=status.HTTP_201_CREATED)
    
    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view.csrf_exempt = False
        return view

class Login(GenericAPIView): 
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth.login(request,serializer.validated_data)
        return Response('Success')

    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view.csrf_exempt = False
        return view

class Template(TemplateView):
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        response = self.render_to_response(context)
        token = get_token(request)
        response.set_cookie('csrftoken', token)
        return response

def logout(request):
    auth.logout(request)
    return redirect('/')
