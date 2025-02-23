from rest_framework.authentication import TokenAuthentication

# Change the keyword to 'Bearer'
class BearerTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'  # Change the keyword to 'Bearer'