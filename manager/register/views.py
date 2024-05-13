from django.shortcuts import render
from django.contrib.auth import login
from django.shortcuts import redirect
from projects.models import Task
from .models import UserProfile
from .models import Invite
from .forms import RegistrationForm
from .forms import CompanyRegistrationForm
from .forms import ProfilePictureForm
from rest_framework import generics
from .models import Company, Project
from rest_framework.permissions import IsAuthenticated
from .serializers import CompanySerializer, UserProfileSerializer, ProjectSerializer

# Create your views here.


class TeamsListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class UserProfileListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class ProjectListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        context = {'form': form}
        if form.is_valid():
            user = form.save()
            created = True
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            context = {'created': created}
            return render(request, 'reg_form.html', context)
        else:
            return render(request, 'reg_form.html', context)
    else:
        form = RegistrationForm()
        context = {
            'form': form,
        }
        return render(request, 'reg_form.html', context)


def usersView(request):
    users = UserProfile.objects.all()
    tasks = Task.objects.all()
    context = {
        'users': users,
        'tasks': tasks,
    }
    return render(request, 'users.html', context)


def user_view(request, profile_id):
    user = UserProfile.objects.get(id=profile_id)
    context = {
        'user_view': user,
    }
    return render(request, 'user.html', context)


def profile(request):
    if request.method == 'POST':
        img_form = ProfilePictureForm(request.POST, request.FILES)
        if img_form.is_valid():
            img_form.save()  # Save the form data
            updated = True
            context = {'img_form': img_form, 'updated': updated}
            return render(request, 'profile.html', context)
    else:
        img_form = ProfilePictureForm()

    context = {'img_form': img_form}
    return render(request, 'profile.html', context)


def newCompany(request):
    if request.method == 'POST':
        form = CompanyRegistrationForm(request.POST)
        context = {'form': form}
        if form.is_valid():
            form.save()
            created = True
            form = CompanyRegistrationForm()
            context = {
                'created': created,
                'form': form,
            }
            return render(request, 'new_company.html', context)
        else:
            return render(request, 'new_company.html', context)
    else:
        form = CompanyRegistrationForm()
        context = {
            'form': form,
        }
        return render(request, 'new_company.html', context)


def invites(request):
    return render(request, 'invites.html')


def invite(request, profile_id):
    profile_to_invite = UserProfile.objects.get(id=profile_id)
    logged_profile = get_active_profile(request)
    if not profile_to_invite in logged_profile.friends.all():
        logged_profile.invite(profile_to_invite)
    return redirect('core:index')


def deleteInvite(request, invite_id):
    logged_user = get_active_profile(request)
    logged_user.received_invites.get(id=invite_id).delete()
    return render(request, 'invites.html')


def acceptInvite(request, invite_id):
    invite = Invite.objects.get(id=invite_id)
    invite.accept()
    return redirect('register:invites')


def remove_friend(request, profile_id):
    user = get_active_profile(request)
    user.remove_friend(profile_id)
    return redirect('register:friends')


def get_active_profile(request):
    user_id = request.user.userprofile_set.values_list()[0][0]
    return UserProfile.objects.get(id=user_id)


def friends(request):
    if request.user.is_authenticated:
        user = get_active_profile(request)
        friends = user.friends.all()
        context = {
            'friends': friends,
        }
    else:
        users_prof = UserProfile.objects.all()
        context = {
            'users_prof': users_prof,
        }
    return render(request, 'friends.html', context)
