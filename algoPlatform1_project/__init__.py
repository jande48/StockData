from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
import os
from algoPlatform1_project.config import Config

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')

ENV = 'dev'

if ENV == 'dev':
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:goforit@localhost/stockData1'
else:
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://hgyhbtmcjbmsaw:5545399e3523f7caafd6e6ed10ede332eefd74369eba6e8bf62b502affcad569@ec2-3-231-16-122.compute-1.amazonaws.com:5432/dcf5v10tbuk6li'
    #db = SQLAlchemy(app)
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'noreply.chickenpoopbingo@gmail.com'#os.environ.get('EMAIL_HOST_USER')
app.config['MAIL_PASSWORD'] = 'znyhmywqpqtzwclk' #os.environ.get('znyhmywqpqtzwclk')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_HOST_PASSWORD')
mail = Mail(app)

# def create_app(config_class=Config):
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     db.init_app(app)
#     bcrypt.init_app(app)
#     login_manager.init_app(app)
#     mail.init_app(app)

#     from algoPlatform1_project.users.routes import users
#     from algoPlatform1_project.posts.routes import posts
#     from algoPlatform1_project.main.routes import main
#     app.register_blueprint(users)
#     app.register_blueprint(posts)
#     app.register_blueprint(main)

#     return app

# if __name__ == '__main__':
#     app.run(debug=True)

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

