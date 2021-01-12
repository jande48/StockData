
from flask import render_template, request, Blueprint
from algoPlatform1_project.models import Post

main = Blueprint('main', __name__)


@main.route("/")
def my_index():
    return render_template("index.html",token="Stock Data Analysis", active="home")

@main.route("/home")
def home():
    return render_template("index.html",token="Stock Data Analysis", active="home")

@main.route("/charts")
def charts():
    return render_template("index.html",token="Stock Data Analysis", active="charts")

@main.route("/posts")
def posts():
    return render_template("index.html",token="Stock Data Analysis", active="posts")

@main.route("/login")
def login():
    return render_template("index.html",token="Stock Data Analysis", active="login")

@main.route("/logout")
def logout():
    return render_template("index.html",token="Stock Data Analysis", active="logout")

@main.route("/register")
def register():
    return render_template("index.html",token="Stock Data Analysis", active="register")

@main.route("/account")
def account():
    return render_template("index.html",token="Stock Data Analysis", active="account")

@main.route("/resetPassword")
def resetPassword():
    return render_template("index.html",token="Stock Data Analysis", active="resetPassword")

