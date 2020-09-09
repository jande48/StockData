from flask import render_template, url_for, jsonify
from algoPlatform1_project import app
import os, json
from datetime import datetime
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock


IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key =  os.environ.get('IEX_CLOUD_API_KEY') 


@app.route("/")
def my_index():
    return render_template("index.html",token="Hello Flask React")

# @app.route("/")
# @app.route("/home", methods=['GET','POST'])
# def home():
#     return render_template('index.html')

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
    print(IEX_data)
    IEX_data_head = IEX_data.tail()
    #df_temp = pd.read_json('https://cloud.iexapis.com/stable/stock/aapl/batch?types=quote,news,chart&range=1m&last=10?token='+IEX_api_key+'')
    #df_temp = pd.read_json('https://cloud.iexapis.com/stable/stock/'+sym+'/chart/1d?token='+IEX_api_key+'')
    #df_temp_head = df_temp.head()
    return render_template('create_algo.html',head=IEX_data_head)


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
    Historical_Data2 = get_historical_data(ticker,start=start, end=end, token=IEX_api_key)
    # Historical_Data3 = pd.DataFrame(Historical_Data2)
    # print(Historical_Data3)
    # HTTP_request = f'https://cloud.iexapis.com/stable/stock/market/batch?symbols={tickers}&types={endpoints}&range={data_range}&token={IEX_api_key}'
    # IEX_data = pd.read_jso
    # n(HTTP_request)
    # print(Historical_Data2)
    return (Historical_Data2) #Historical_Data3.to_json(orient="split")