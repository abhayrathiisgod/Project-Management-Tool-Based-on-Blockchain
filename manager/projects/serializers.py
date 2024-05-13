
from rest_framework import serializers
from .models import Project, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    task_set = TaskSerializer(many=True)

    class Meta:
        model = Project
        fields = '__all__'
