
  
from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from algoPlatform1_project import db, bcrypt, app
from algoPlatform1_project.models import User, Post
from algoPlatform1_project.users.forms import (RegistrationForm, LoginForm, UpdateAccountForm,
                                   RequestResetForm, ResetPasswordForm)
from algoPlatform1_project.users.utils import save_picture, send_reset_email
from flask import Blueprint
import jwt, os

app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')
users = Blueprint('users',__name__)


@users.route("/register", methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('users.login'))
    return render_template('register.html', title='Register', form=form, active="signup")


@users.route("/login", methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('main.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form, active="login")


@users.route("/users/auth/", methods=['GET','POST'])
def user_auth():
    if current_user.is_authenticated:
        payload = {'isAuthenticated': True,
                   'username': current_user.username,
                   'email': current_user.email,
                   'image_file': current_user.image_file}
        return jwt.encode(
            payload,
            app.config['SECRET_KEY']
        )
    else:
        payload = {'isAuthenticated': False}
        return jwt.encode(
            payload,
            app.config['SECRET_KEY']
        )

@users.route("/users/login/", methods=['GET','POST'])
def user_login():
    JSON_sent = request.get_json()
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    user = User.query.filter_by(email=JSON_sent['email']).first()
    if user and bcrypt.check_password_hash(user.password, JSON_sent['password']):
        login_user(user)
        payload = {'isAuthenticated': True,
                   'username': user.username,
                   'email': user.email,
                   'image_file': user.image_file}
        return jwt.encode(
            payload,
            app.config['SECRET_KEY']
        )
        
@users.route("/users/logout/", methods=['GET','POST'])
def user_logout():
    logout_user()
    payload = {'isAuthenticated': False}
    return jwt.encode(
        payload,
        app.config['SECRET_KEY']
    )
    
@users.route("/users/register/", methods=['GET','POST'])
def users_register():
    JSON_sent = request.get_json()
    userCheck = User.query.filter_by(email=JSON_sent['email']).first()
    if userCheck:
        payload = {
            'emailAlreadyUsed': True,
            'registerSuccess': False,
        }
        return jwt.encode(
        payload,
        app.config['SECRET_KEY']
        )
    hashed_password = bcrypt.generate_password_hash(JSON_sent['password']).decode('utf-8')
    user = User(username=JSON_sent['username'], email=JSON_sent['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    login_user(user)
    payload = {
            'emailAlreadyUsed': False,
            'registerSuccess': True,
            'user': {'isAuthenticated': True,
                   'username': user.username,
                   'email': user.email,
                   'image_file': user.image_file}
        }
    return jwt.encode(
    payload,
    app.config['SECRET_KEY']
    )
    
@users.route("/users/updateAccount/", methods=['POST'])
@login_required
def users_update_account():
    JSON_sent = request.get_json()
    print(JSON_sent)
    if 'file' in JSON_sent.keys():
        print(JSON_sent['file'])
        picture_file = save_picture(JSON_sent['file'])
        current_user.image_file = picture_file
    if 'email' in JSON_sent.keys():
        current_user.email = JSON_sent['email']
    db.session.commit()
    payload = {
        'isAuthenticated': True,
        'username': current_user.username,
        'email': current_user.email,
        'image_file': current_user.image_file
        }
    return jwt.encode(
    payload,
    app.config['SECRET_KEY']
    )


# @users.route("users/account", methods=['GET', 'POST'])
# @login_required
# def users_account():
#     form = UpdateAccountForm()
#     if form.validate_on_submit():
#         if form.picture.data:
#             picture_file = save_picture(form.picture.data)
#             current_user.image_file = picture_file
#         current_user.username = form.username.data
#         current_user.email = form.email.data
#         db.session.commit()
#         flash('Your account has been updated!', 'success')
#         return redirect(url_for('users.account'))
#     elif request.method == 'GET':
#         form.username.data = current_user.username
#         form.email.data = current_user.email
#     image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
#     return render_template('account.html', title='Account',
#                            image_file=image_file, form=form)

@users.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('main.home'))



@users.route("/account", methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('users.account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account',
                           image_file=image_file, form=form)

@users.route("/user/<string:username>")
def user_posts(username):
    page = request.args.get('page', 1, type=int)
    user = User.query.filter_by(username=username).first_or_404()
    posts = Post.query.filter_by(author=user)\
        .order_by(Post.date_posted.desc())\
        .paginate(page=page, per_page=5)
    return render_template('user_posts.html', posts=posts, user=user)



@users.route("/reset_password", methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = RequestResetForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('An email has been sent with instructions to reset your password.', 'info')
        return redirect(url_for('users.login'))
    return render_template('reset_request.html', title='Reset Password', form=form)


@users.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    user = User.verify_reset_token(token)
    if user is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('users.reset_request'))
    form = ResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        flash('Your password has been updated! You are now able to log in', 'success')
        return redirect(url_for('users.login'))
    return render_template('reset_token.html', title='Reset Password', form=form)
