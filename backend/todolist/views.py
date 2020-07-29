from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.response import Response
from .models import Task, List
from .serializers import TaskSerializer, ListSerializer, UserSerializer

class TasksView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def patch(self, request, *args, **kwargs): #"PATCH /api/tasks/1/ HTTP/1.1" 405 42 when using partial_update without defining patch
        print('\n\n',request.data,'\n\n')
        ids = []
        for i in request.data:
            ids.append(i['id'])
        stuff=self.get_queryset().filter(id__in=list(ids))
        serializer = self.get_serializer(instance=stuff, data=request.data, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        print(serializer, '\n\n')
        self.perform_update(serializer)
        return Response(serializer.data)

    """def partial_update(self, request, *args, **kwargs): #"PATCH /api/tasks/1/ HTTP/1.1" 405 42
        print('\n\n',request.data,'\n\n')
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)"""

    def delete(self, request, *args, **kwargs):
        #had to define delete because destroy() only responds to delete when sent to /<specifictaskid>
        stuff=self.get_queryset().filter(id__in=list(request.data))
        print('\n\n',stuff,'\n\n')
        self.perform_destroy(stuff) #difference between this and stuff.delete()?
        return Response(status=204) #(status=status.HTTP_204_NO_CONTENT) gets 500 NameError: name 'status' is not defined

    def get_queryset(self):
        return Task.objects.filter(listId=self.kwargs['listId'])
        
    def destroy(self, request, *args, **kwargs):
        print(request.data)
        #instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class ListsView(viewsets.ModelViewSet):
    queryset = List.objects.all()
    serializer_class = ListSerializer
 
class RegistrationView(CreateAPIView):
    serializer_class = UserSerializer

class Login(GenericAPIView): #add validation. use serializer for validation?
    def post(self, request, *args, **kwargs):
        print(request.data)
        username = request.data['username']
        password = request.data['password']
        check = auth.authenticate(username=username,password=password)
        print(check)
        if check:
            print('success')
            auth.login(request, check)
            return Response('Success')
        else:
            print('fail')
            return Response('Login failed')

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