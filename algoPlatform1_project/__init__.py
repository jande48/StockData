from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
import os
from flask_talisman import Talisman


application = app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')

ENV = 'dev'

# This content security policy allows access to these scripts through talisman
csp = {
    'default-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        'ajax.googleapis.com',
        'stackpath.bootstrapcdn.com',
        'fonts.googleapis.com',
        'code.jquery.com',
        'cdnjs.cloudflare.com',
        'fonts.googleapis.com',

    ]
}
if ENV == 'dev':
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('LOCAL_SQL_DB')
else:
    # Talisman is used to for https and SSL for the production environment
    Talisman(app, content_security_policy=csp)
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('HEROKU_POSTGRES')

# Avoid the SQLAlchemy tracking modification to minimize text and time
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

db = SQLAlchemy(app)

# us Bcrypt to hash password before committing them to the db
bcrypt = Bcrypt(app)

# Flask's login manager tool to facilitate user signin for user auth
login_manager = LoginManager(app)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'

# Using a free gmail smtp server for contact and password reset
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_HOST_STONKTA')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD_STONKTA')

mail = Mail(app)

# Flask Blueprints are used to import views/routes from separate modules
from algoPlatform1_project.users.routes import users
from algoPlatform1_project.posts.routes import posts
from algoPlatform1_project.main.routes import main
from algoPlatform1_project.algo.routes import algo
from algoPlatform1_project.errors.handlers import errors

app.register_blueprint(users)
app.register_blueprint(posts)
app.register_blueprint(main)
app.register_blueprint(algo)
app.register_blueprint(errors)
