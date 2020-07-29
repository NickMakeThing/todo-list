from django.db import models
from django.contrib.auth.models import User
# Create your models here.#
class List(models.Model):
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    listName = models.CharField(max_length=20)
    #colour = models.CharField(max_length=21)
    #
    
class Task(models.Model):
    listId = models.ForeignKey('List',on_delete=models.CASCADE)
    taskName = models.CharField(max_length=20)
    priority = models.IntegerField()
    description = models.CharField(max_length=250, null=True)
    colour = models.CharField(max_length=21)
    #completed (boolean)