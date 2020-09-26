from flask import render_template, url_for, jsonify, flash, redirect, request
from algoPlatform1_project import app, db
import os, json
from datetime import datetime
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
from algoPlatform1_project.models import User, Post, Watchlist
from flask_login import login_user, current_user, logout_user, login_required

IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key =  os.environ.get('IEX_CLOUD_API_KEY') 


from flask import Blueprint

algo = Blueprint('algo',__name__)



@algo.route("/create_algo", methods=['GET'])
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


@algo.route("/get_stock_data/<ticker>/<int:StartYear>/<int:StartMonth>/<int:StartDay>/<int:EndYear>/<int:EndMonth>/<int:EndDay>", methods=['GET'])
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



@algo.route("/get_financial_data/<ticker>", methods=['GET'])
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



@algo.route("/get_earnings_data/<ticker>", methods=['GET'])
def get_earnings_data(ticker):
    stock = Stock(ticker, token=IEX_api_key)
    earnings = stock.get_earnings(last=4)
    # print(earnings)
    company = stock.get_company()
    print(earnings)
    return(json.dumps(earnings))