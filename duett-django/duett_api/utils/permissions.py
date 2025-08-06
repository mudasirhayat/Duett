from rest_framework import permissions


class ObjectPermission(permissions.BasePermission):
    """
def has_permission(self, request, view, obj):
    try:
        return obj.id == request.user.id
    except AttributeError:
        return False
