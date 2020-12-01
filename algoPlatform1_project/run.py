from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
import os
#from algoPlatform1_project.config import Config

class Config:
    SECRET_KEY = os.urandom(32)
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'noreply.chickenpoopbingo@gmail.com'
    MAIL_PASSWORD = 'znyhmywqpqtzwclk'

application = app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')

ENV = 'dev'

if ENV == 'dev':
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('LOCAL_SQL_DB_STOCK_DATA')
else:
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = ''

app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_HOST_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_HOST_PASSWORD_2')
mail = Mail(app)


from users.routes import users
app.register_blueprint(users)
from posts.routes import posts
app.register_blueprint(posts)
from main.routes import main
app.register_blueprint(main)
from algo.routes import algo
app.register_blueprint(algo)
from errors.handlers import errors
app.register_blueprint(errors)


if __name__ == '__main__':
    app.run(debug=True)
