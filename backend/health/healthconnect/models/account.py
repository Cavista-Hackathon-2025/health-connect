from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models
import uuid
from django.conf import settings


## custome user models

class HealthManager(BaseUserManager):
    
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password role is required
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email,password=None):
    
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class HealthUser(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255,blank=True,null=True)
    last_name = models.CharField(max_length=255,blank=True,null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)

    objects = HealthManager()

    USERNAME_FIELD = 'email'
    
    
    def __str__(self):
        return self.email
    
    
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin