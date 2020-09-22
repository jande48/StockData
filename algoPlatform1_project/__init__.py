from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os


app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
#app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')


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
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

if __name__ == '__main__':
    app.run(debug=True)

from algoPlatform1_project import routes
