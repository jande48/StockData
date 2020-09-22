from flask import render_template, url_for, jsonify, flash, redirect, request
from algoPlatform1_project import app, db, bcrypt
import secrets
from PIL import Image
import os, json
from datetime import datetime
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
from algoPlatform1_project.forms import RegistrationForm, LoginForm, UpdateAccountForm, PostForm
from algoPlatform1_project.models import User, Post, Watchlist
from flask_login import login_user, current_user, logout_user, login_required

IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key =  os.environ.get('IEX_CLOUD_API_KEY') 

@app.route("/")
def my_index():
    return render_template("index.html",token="Hello Flask React")

@app.route("/home")
def home():
    return render_template("create_algo.html")

@app.route("/register", methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn

@app.route("/account", methods=['GET', 'POST'])
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
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account',
                           image_file=image_file, form=form)


@app.route("/fourm")
def fourm():
    posts = Post.query.all()
    return render_template('fourm.html', posts=posts)

@app.route("/post/new", methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        flash('Your post has been created!', 'success')
        return redirect(url_for('fourm'))
    return render_template('create_post.html', title='New Post',
                           form=form, legend='New Post')


@app.route("/post/<int:post_id>")
def post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', title=post.title, post=post)


@app.route("/post/<int:post_id>/update", methods=['GET', 'POST'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    form = PostForm()
    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        db.session.commit()
        flash('Your post has been updated!', 'success')
        return redirect(url_for('post', post_id=post.id))
    elif request.method == 'GET':
        form.title.data = post.title
        form.content.data = post.content
    return render_template('create_post.html', title='Update Post',
                           form=form, legend='Update Post')


@app.route("/post/<int:post_id>/delete", methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    db.session.delete(post)
    db.session.commit()
    flash('Your post has been deleted!', 'success')
    return redirect(url_for('fourm'))


@app.route("/create_algo", methods=['GET'])
def create_algo():
    sym = "TSLA"  # This is not case-sensitive
    # tickers = [
    #         'MSFT',
    #         'AAPL',
    #         'AMZN',
    #         'GOOG',
    #         'FB'
    #         ]
    tickers = ['MSFT',
               'AAPL']
    tickers = ','.join(tickers)
    endpoints = 'chart'
    data_range = '1d'
    #pk_e698977b9d214b95b1465af95ba1fdb9 
    HTTP_request = f'https://cloud.iexapis.com/stable/stock/market/batch?symbols={tickers}&types={endpoints}&range={data_range}&token={IEX_api_key}'
    IEX_data = pd.read_json(HTTP_request)
    #print(IEX_data)
    IEX_data_head = IEX_data.tail()
    #df_temp = pd.read_json('https://cloud.iexapis.com/stable/stock/aapl/batch?types=quote,news,chart&range=1m&last=10?token='+IEX_api_key+'')
    #df_temp = pd.read_json('https://cloud.iexapis.com/stable/stock/'+sym+'/chart/1d?token='+IEX_api_key+'')
    #df_temp_head = df_temp.head()
    return render_template('old_index.html',head=IEX_data_head)


@app.route("/get_stock_data/<ticker>/<int:StartYear>/<int:StartMonth>/<int:StartDay>/<int:EndYear>/<int:EndMonth>/<int:EndDay>", methods=['GET'])
def get_stock_data(ticker,StartYear,StartMonth,StartDay,EndYear,EndMonth,EndDay):
    # tickers = ['MSFT',
    #            'AAPL']
    # tickers = ','.join(tickers)
    # endpoints = 'chart'
    # data_range = '1d'

    #Historical_Data = jsonify(get_historical_data("AAPL", "20190617", close_only=True))
    #a = Stock("AAPL", token=IEX_api_key)
    # Historical_Data = a.get_price()

    start = datetime(StartYear,StartMonth,StartDay)
    end = datetime(EndYear,EndMonth,EndDay)
    historicalData = get_historical_data(ticker,start=start, end=end, token=IEX_api_key)

    def flatten_json(stockData):
        out = []
        for i in stockData:
            out2 = {}
            out2['date']=i
            for j in stockData[i]:
                out2[j] = stockData[i][j]
            out.append(out2) 
        return out

    Historical_Data = flatten_json(historicalData)
    # print(Historical_Data)
    #print(Historical_Data3)
    #print(json.dumps(Historical_Data4))
    # Historical_Data3 = pd.DataFrame(Historical_Data2)
    # print(Historical_Data3)
    # HTTP_request = f'https://cloud.iexapis.com/stable/stock/market/batch?symbols={tickers}&types={endpoints}&range={data_range}&token={IEX_api_key}'
    # IEX_data = pd.read_jso
    # n(HTTP_request)
    # print(Historical_Data2)
    return (json.dumps(Historical_Data)) #Historical_Data3.to_json(orient="split")



@app.route("/get_financial_data/<ticker>", methods=['GET'])
def get_fianancial_data(ticker):

    stock = Stock(ticker, token=IEX_api_key)
    financials = stock.get_financials()
    # print(earnings)

    # def divideByMillion(financialParameter,newFinancials):
    #     newFinancials[0][financialParameter] = newFinancials[0][financialParameter]/1000000

    # financialParameters = ('grossProfit','operatingRevenue','totalRevenue','totalAssets','totalLiabilities','totalCash','netIncome','cashFlow','totalDebt','shortTermDebt','longTermDebt')

    financials[0]['grossProfit'] = financials[0]['grossProfit']/1000000
    financials[0]['operatingRevenue'] = financials[0]['operatingRevenue']/1000000
    financials[0]['totalRevenue'] = financials[0]['totalRevenue']/1000000
    financials[0]['totalAssets'] = financials[0]['totalAssets']/1000000
    financials[0]['totalLiabilities'] = financials[0]['totalLiabilities']/1000000
    financials[0]['totalCash'] = financials[0]['totalCash']/1000000
    financials[0]['netIncome'] = financials[0]['researchAndDevelopment']/1000000
    financials[0]['cashFlow'] = financials[0]['cashFlow']/1000000
    financials[0]['totalDebt'] = financials[0]['totalDebt']/1000000
    financials[0]['shortTermDebt'] = financials[0]['shortTermDebt']/1000000
    financials[0]['longTermDebt'] = financials[0]['longTermDebt']/1000000
    return (json.dumps(financials))



@app.route("/get_earnings_data/<ticker>", methods=['GET'])
def get_earnings_data(ticker):
    stock = Stock(ticker, token=IEX_api_key)
    earnings = stock.get_earnings(last=4)
    # print(earnings)
    company = stock.get_company()
    print(earnings)
    return(json.dumps(earnings))