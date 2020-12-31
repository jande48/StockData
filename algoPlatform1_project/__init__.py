from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
import os
from flask_talisman import Talisman
from algoPlatform1_project.config import Config


application = app = Flask(__name__)


app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')

ENV = 'prod'

if ENV == 'dev':
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('LOCAL_SQL_DB_STOCK_DATA')
else:
    Talisman(app)
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('HEROKU_POSTGRES')

app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465 #465
app.config['MAIL_USE_TLS'] = False #True
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_HOST_STONKTA')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD_STONKTA')

mail = Mail(app)


from algoPlatform1_project.users.routes import users
app.register_blueprint(users)
from algoPlatform1_project.posts.routes import posts
app.register_blueprint(posts)
from algoPlatform1_project.main.routes import main
app.register_blueprint(main)
from algoPlatform1_project.algo.routes import algo
app.register_blueprint(algo)
from algoPlatform1_project.errors.handlers import errors
app.register_blueprint(errors)


