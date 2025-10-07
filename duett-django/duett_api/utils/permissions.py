from rest_framework import permissions


class ObjectPermission(permissions.BasePermission):
    def has_permission(self, request, view, obj):
        try:
            # Add your permission logic here
            return True
        except Exception as e:
            return False
    try:
        return obj.id == request.user.id
    except AttributeError:
        return False
