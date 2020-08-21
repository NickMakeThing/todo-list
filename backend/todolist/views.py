from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.response import Response
from .models import Task, List
from .serializers import TaskSerializer, ListSerializer, UserSerializer, LoginSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

def updatePriority(updates,tasks,serializerCallback):
    for i in tasks:
        i.priority = updates[str(i.id)]
    Task.objects.bulk_update(tasks,['priority'])
    return
#context manager
#@atomic_transaction
#@detail_route or @action for priority
class TasksView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    #can just dqueryset.update(field1=x,field2=y,field3=..) but will this work for patch/partial update?
    #also can use bulkupdate https://docs.djangoproject.com/en/3.0/ref/models/querysets/#bulk-update
    def patch(self, request, *args, **kwargs): #"PATCH /api/tasks/1/ HTTP/1.1" 405 42 when using partial_update without defining patch
        print('\n\n',request.data,'\n\n')
        serializer = TaskSerializer(data=request.data, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        tasks = [Task(**item) for item in data]
        print('\n\n',data,'\n\n')
        Task.objects.bulk_update(tasks,list(request.data.pop())[-1:])
        return Response(status=206)
        """tasks = self.get_queryset().filter(id__in=list(request.data['idArr']))
        del request.data['idArr']
        if 'priority' in request.data:
            updatePriority(request.data['priority'],tasks,self.get_serializer)
            return Response(status=206)
        #success in detecting max char count in coulour,failed to detect wrong id input
        #bigger problem is format to validate many partial is vastly different from format to use .update(**args) and bulk_update
        #a=[{'id':'abc','colour':'123456789012345678901234567890'},{'id':247,'colour':'123456789012345678901234567890'}]
        #serializer = self.get_serializer(data=a, many=True, partial=True)
        #serializer.is_valid(raise_exception=True) #returns true
        #print(serializer.is_valid(raise_exception=True))
        tasks.update(**request.data)
        return Response(status=206)"""

    """def partial_update(self, request, *args, **kwargs): #"PATCH /api/tasks/1/ HTTP/1.1" 405 42
        print('\n\n',request.data,'\n\n')
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)"""

    def delete(self, request, *args, **kwargs):
        #had to define delete because destroy() only responds to delete when sent to /<specifictaskid>
        print('\n\n',request.data,'\n\n')
        tasks = self.get_queryset().filter(id__in=list(request.data['idArr']))
        toDelete=self.get_queryset().filter(id__in=list(request.data['delete']))
        if not toDelete:
            return Response()
        updatePriority(request.data['priority'],tasks,self.get_serializer)
        self.perform_destroy(toDelete) #difference between this and stuff.delete()?
        return Response(status=204) #(status=status.HTTP_204_NO_CONTENT) gets 500 NameError: name 'status' is not defined

    def get_queryset(self):
        return Task.objects.filter(listId=self.kwargs['listId']) # and do join to check if list has userid
        
    def destroy(self, request, *args, **kwargs):
        print(request.data)
        #instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class ListsView(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        print(self.request.user)
        return List.objects.filter(userid=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['userid']=request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def patch(self, request, *args, **kwargs): 
        print(self.request.user)
        print('\n\n',request.data,'\n\n')
        tasks = self.get_queryset().filter(id__in=list(request.data['idArr']))
        del request.data['idArr']
        tasks.update(**request.data)
        return Response(status=206)
        
    def delete(self, request, *args, **kwargs):
        lists=self.get_queryset().filter(id__in=list(request.data))
        print('\n\n',lists,'\n\n')
        self.perform_destroy(lists) 
        return Response(status=204)
 
class RegistrationView(CreateAPIView):
    serializer_class = UserSerializer

class Login(GenericAPIView): #add validation. use serializer for validation?
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth.login(request,serializer.validated_data)
        return Response('Success')

def logout(request):
    auth.logout(request)
    return redirect('/')
"""
class testcookie(GenericAPIView):
    def get(self, request, *args, **kwargs):
        print(request.headers)
        return Response('test')
    def post(self, request, *args, **kwargs):
        print(request.headers)
        return Response('test')
        #after login stops working
        #fix was to add header X-CSRFTOKEN to ajax header
  """
#Response({'cookiesistest=ass':'dsfdsf'},headers={'Set-Cookie':'test=ass'})


#setting cookie works and seems its httponly attribute is set by default
#next is to create and store session and delete it on logout
#https://stackoverflow.com/questions/34782493/difference-between-csrf-and-x-csrf-token/34783845

#https://stackoverflow.com/questions/48093906/django-rest-modelviewset-filtering-objects