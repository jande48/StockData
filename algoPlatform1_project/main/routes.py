
from flask import render_template, request, Blueprint
from algoPlatform1_project.models import Post

main = Blueprint('main', __name__)


@main.route("/")
def my_index():
    return render_template("index.html",token="Hello Flask React", active="home")

@main.route("/home")
def home():
    return render_template("create_algo.html")

