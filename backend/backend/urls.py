from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from todolist import views

router = routers.DefaultRouter()
router.register(r'tasks/(?P<listId>[0-9]+)', views.TasksView, basename='tasks')
router.register('lists', views.ListsView, basename='lists')
urlpatterns = [
    path('admin/', admin.site.urls), 
    path('register/', views.RegistrationView.as_view()), #wont work in router.register because not a viewset? https://stackoverflow.com/questions/56052906/django-rest-framework-type-object-x-has-no-attribute-get-extra-actions/56053013
    path('login/', views.Login.as_view()),
    path('logout/', views.logout),
    path('api/', include(router.urls)),  
    path('',views.Template.as_view(template_name='build/index.html'))
]
"""
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns"""