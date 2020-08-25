from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.response import Response
from .models import Task, List
from .serializers import TaskSerializer, ListSerializer, UserSerializer, LoginSerializer, UpdateSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

def updateItems(updates,model):
    if(updates):
        serializer = UpdateSerializer(data=updates, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        fields = [field for field in data[0].keys() if not 'id' in field]
        instances = [model(**item) for item in data]
        model.objects.bulk_update(instances,fields)
    return

#context manager
#@atomic_transaction
#@detail_route or @action for priority
class TasksView(viewsets.ModelViewSet): #authentication and permission classes
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    #can just dqueryset.update(field1=x,field2=y,field3=..) but will this work for patch/partial update?
    #also can use bulkupdate https://docs.djangoproject.com/en/3.0/ref/models/querysets/#bulk-update
    def patch(self, request, *args, **kwargs): #"PATCH /api/tasks/1/ HTTP/1.1" 405 42 when using partial_update without defining patch
        if not self.authenticate_request(request.user,request.data):
            return Response(status=403)
        updateItems(request.data,Task)
        return Response(status=206)

    def delete(self, request, *args, **kwargs):
        #had to define delete because destroy() only responds to delete when sent to /<specifictaskid>
        if not self.authenticate_request(request.user,request.data['update']):
            return Response(status=403)
        updateItems(request.data['update'],Task)
        toDelete = self.get_queryset().filter(id__in=request.data['delete'])
        if not toDelete:
            return Response()
        self.perform_destroy(toDelete) #difference between this and stuff.delete()?
        return Response(status=204) #(status=status.HTTP_204_NO_CONTENT) gets 500 NameError: name 'status' is not defined

    def get_queryset(self):
        return Task.objects.select_related('listId').filter(listId=self.kwargs['listId']) # and do join to check if list has userid
        
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
    
    #self.filter_backends used in filter_queryset
    #filter_queryset in this method by defualt
    #pagination in this method by defualt
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

class Login(GenericAPIView): #add validation. use serializer for validation?
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth.login(request,serializer.validated_data)
        return Response('Success')

def logout(request):
    auth.logout(request)
    return redirect('/')

#setting cookie works and seems its httponly attribute is set by default
#next is to create and store session and delete it on logout
#https://stackoverflow.com/questions/34782493/difference-between-csrf-and-x-csrf-token/34783845

#https://stackoverflow.com/questions/48093906/django-rest-modelviewset-filtering-objects