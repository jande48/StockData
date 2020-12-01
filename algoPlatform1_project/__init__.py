from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
import os
from algoPlatform1_project.config import Config
from boto.s3.connection import S3Connection

application = app = Flask(__name__)

#app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')
app.config['SECRET_KEY'] =  S3Connection(os.environ['SECRET_KEY'])
ENV = 'prod'

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
#app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_HOST_USER')
app.config['MAIL_USERNAME'] =  S3Connection(os.environ['MAIL_USERNAME'])
#app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_HOST_PASSWORD_2')
app.config['MAIL_PASSWORD'] =  S3Connection(os.environ['MAIL_PASSWORD'])

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


