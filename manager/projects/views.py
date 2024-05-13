from django.shortcuts import render
from django.db.models import Avg
from register.models import Project
from projects.models import Task
from projects.forms import TaskRegistrationForm
from rest_framework.permissions import IsAuthenticated
from projects.forms import ProjectRegistrationForm

# Create your views here.
from rest_framework import generics
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer


class ProjectListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetailAPIView(generics.RetrieveAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class TaskListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetailAPIView(generics.RetrieveAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


def projects(request):
    projects = Project.objects.all()
    avg_projects = Project.objects.all().aggregate(
        Avg('complete_per'))['complete_per__avg']
    tasks = Task.objects.all()
    overdue_tasks = tasks.filter(due='2')

    context = {
        'avg_projects': avg_projects,
        'projects': projects,
        'tasks': tasks,
        'overdue_tasks': overdue_tasks,
    }
    return render(request, 'projects.html', context)


def newTask(request):
    if request.method == 'POST':
        form = TaskRegistrationForm(request.POST)
        context = {'form': form}
        if form.is_valid():
            form.save()
            created = True
            context = {
                'created': created,
                'form': form,
            }
            return render(request, 'new_task.html', context)
        else:
            return render(request, 'new_task.html', context)
    else:
        form = TaskRegistrationForm()
        context = {
            'form': form,
        }
        return render(request, 'new_task.html', context)


def newProject(request):
    if request.method == 'POST':
        form = ProjectRegistrationForm(request.POST)
        context = {'form': form}
        if form.is_valid():
            form.save()
            created = True
            form = ProjectRegistrationForm()
            context = {
                'created': created,
                'form': form,
            }
            return render(request, 'new_project.html', context)
        else:
            return render(request, 'new_project.html', context)
    else:
        form = ProjectRegistrationForm()
        context = {
            'form': form,
        }
        return render(request, 'new_project.html', context)
