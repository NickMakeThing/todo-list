from django.db import models
import random
from django.contrib.auth.models import User
# Create your models here.#
def randomColour(): #'pink'
    return random.choice(['#333399','purple','#00d6bd','#a90a0a','#40cc3e','#df7334','#a9993c'])

class List(models.Model):
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    listName = models.CharField(max_length=25)
    colour = models.CharField(max_length=21, default=randomColour)
    #
    
class Task(models.Model):
    listId = models.ForeignKey('List',on_delete=models.CASCADE)
    taskName = models.CharField(max_length=40)
    priority = models.IntegerField()
    description = models.CharField(max_length=250, default = ' ')
    colour = models.CharField(max_length=21,default='#079d41')
    completed = models.BooleanField(default=False)

