"""
Config File
"""
import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

PORT = 8080
HOST = '0.0.0.0'

DB_NAME = os.environ['DB_NAME']

SQLALCHEMY_DATABASE_URI = \
    f"mysql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}" \
    f"@{os.environ['DB_HOST']}:3306/{DB_NAME}?charset=utf8mb4"

SQLALCHEMY_TRACK_MODIFICATIONS = False
DATABASE_CONNECT_OPTIONS = {}
CSRF_ENABLED = True
CSRF_SESSION_KEY = ""
SQLALCHEMY_POOL_RECYCLE = 28750

AUTHORIZATION_HEADER = os.getenv('AUTHORIZATION_HEADER', None)
AUTHORIZATION_METHOD = os.getenv('AUTHORIZATION_METHOD', None)
SECRET_KEY = os.getenv('SECRET_KEY', None)
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', None)

SECURITY_PASSWORD_HASH = os.getenv('SECURITY_PASSWORD_HASH', None)
SECURITY_PASSWORD_SALT = os.getenv('SECURITY_PASSWORD_HASH', None)
