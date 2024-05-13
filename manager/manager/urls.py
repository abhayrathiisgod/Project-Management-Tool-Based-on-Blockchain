"""
URL configuration for manager project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.contrib import admin
from django.urls import path
from django.urls import include
from projects import views
from register.urls import TeamsListAPIView, UserProfileListAPIView, ProjectListAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', include('register.urls', namespace='register')),
    path('projects/', include('projects.urls', namespace='projects')),


    # rest apiss
    path('api/v1/Teamsapi/', TeamsListAPIView.as_view()),
    path('api/v1/UserProfile/', UserProfileListAPIView.as_view()),
    path('api/v1/ProjectList/', ProjectListAPIView.as_view()),

    # main project
    path('api/v1/projects/', views.ProjectListAPIView.as_view(), name='project-list'),
    # main task
    path('api/v1/tasks/', views.TaskListAPIView.as_view(), name='task-list'),

    path('', include('core.urls', namespace='core')),

]
