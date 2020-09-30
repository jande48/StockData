from flask import render_template, url_for, jsonify, flash, redirect, request
from algoPlatform1_project import app, db
import os, json
from datetime import datetime
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
from algoPlatform1_project.models import User, Post, Watchlist, OHLC_JSONdata
from flask_login import login_user, current_user, logout_user, login_required

IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key =  os.environ.get('IEX_CLOUD_API_KEY') 

from flask import Blueprint
algo = Blueprint('algo',__name__)

# @algo.route("/create_algo", methods=['GET'])
# def create_algo():
#     sym = "TSLA"  # This is not case-sensitive
#     tickers = ['MSFT',
#                'AAPL']
#     tickers = ','.join(tickers)
#     endpoints = 'chart'
#     data_range = '1d' 
#     HTTP_request = f'https://cloud.iexapis.com/stable/stock/market/batch?symbols={tickers}&types={endpoints}&range={data_range}&token={IEX_api_key}'
#     IEX_data = pd.read_json(HTTP_request)
#     IEX_data_head = IEX_data.tail()
#     return render_template('old_index.html',head=IEX_data_head)

@algo.route("/get_stock_data/<ticker>/<int:StartYear>/<int:StartMonth>/<int:StartDay>/<int:EndYear>/<int:EndMonth>/<int:EndDay>", methods=['GET'])
def get_stock_data(ticker,StartYear,StartMonth,StartDay,EndYear,EndMonth,EndDay):
    
    start = datetime(StartYear,StartMonth,StartDay)
    end = datetime(EndYear,EndMonth,EndDay)

    def getDBdata(start,end):
        queriedData = OHLC_JSONdata.query.all()
        out = []
        trigger = False
        for i in range(len(queriedData)):
            if (int(queriedData[i].AAPL['date'][0:4]) == StartYear) and (int(queriedData[i].AAPL['date'][5:7]) == StartMonth) and (int(queriedData[i].AAPL['date'][8:]) == StartDay):
                trigger = True
            if (int(queriedData[i].AAPL['date'][0:4]) == EndYear) and (int(queriedData[i].AAPL['date'][5:7]) == EndMonth) and (int(queriedData[i].AAPL['date'][8:]) == EndDay):
                trigger = False
            if trigger:
                out.append(queriedData[i].AAPL)
        return out

    def flatten_json(stockData):
        out = []
        for i in stockData:
            out2 = {}
            out2['date']=i
            for j in stockData[i]:
                out2[j] = stockData[i][j]
            out.append(out2) 
        return out
    
    if ticker == 'AAPL':
        Historical_Data = getDBdata(start,end)
    else:
        historicalData = get_historical_data(ticker,start=start, end=end, token=IEX_api_key)
        Historical_Data = flatten_json(historicalData)

    # This code initializes the database with 1 api call
    # historicalData = get_historical_data(ticker,start=start, end=end, token=IEX_api_key)
    # Historical_Data = flatten_json(historicalData)
    #addData = initiallyCommitData(Historical_Data)

    return (json.dumps(Historical_Data)) #Historical_Data3.to_json(orient="split")

def initiallyCommitData(data):
    for i in range(len(data)):
        addedData = OHLC_JSONdata(AAPL=data[i])
        db.session.add(addedData)
        db.session.commit()

    



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
    company = stock.get_company()
    #print(earnings)
    return(json.dumps(earnings))