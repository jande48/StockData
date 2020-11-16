from flask import render_template, url_for, jsonify, flash, redirect, request
from algoPlatform1_project import app, db
import os, json, ast, re
from datetime import datetime, timedelta
from threading import Thread
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
import ta, time
from ta.volatility import BollingerBands
from ta.momentum import RSIIndicator, TSIIndicator, uo, stoch, stoch_signal, wr, ao, kama, roc
from ta.trend import sma_indicator, ema_indicator, macd, macd_signal, macd_diff, adx, adx_pos, adx_neg, vortex_indicator_pos, vortex_indicator_neg, trix, mass_index, cci, dpo, kst, kst_sig, ichimoku_conversion_line, ichimoku_base_line, aroon_down, aroon_up, psar_up, psar_down
from ta.volatility import average_true_range, bollinger_mavg, bollinger_hband, bollinger_lband, bollinger_wband, bollinger_pband, bollinger_hband_indicator, bollinger_lband_indicator, keltner_channel_mband, keltner_channel_hband, keltner_channel_lband, keltner_channel_wband, keltner_channel_pband, keltner_channel_hband_indicator, keltner_channel_lband_indicator, donchian_channel_hband, donchian_channel_lband, donchian_channel_mband, donchian_channel_wband, donchian_channel_pband 
from algoPlatform1_project.models import User, Post, Watchlist, sp_OHLC_data, sp500List
from flask_login import login_user, current_user, logout_user, login_required
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key =  os.environ.get('IEX_CLOUD_API_KEY') 
Stock_Ticker_Lookup_key = os.environ.get('StockTickerCompanyNameAPIkey')

from flask import Blueprint
algo = Blueprint('algo',__name__)

@algo.route("/get_stock_data/<ticker>/<startDate>/<endDate>", methods=['GET'])
def get_stock_data(ticker,startDate,endDate):

    startDateForAPItemp = startDate.split('-')
    startDateForAPI = datetime(int(startDateForAPItemp[0]),int(startDateForAPItemp[1]),int(startDateForAPItemp[2])) - timedelta(days=90)
    
    if startDateForAPI.weekday() == 5:
        startDateForAPI += timedelta(days=2)
    elif startDateForAPI.weekday() == 6:
        startDateForAPI += timedelta(days=1)

    endDateForAPItemp = endDate.split('-')
    endDateForAPI = datetime(int(endDateForAPItemp[0]),int(endDateForAPItemp[1]),int(endDateForAPItemp[2]))

    currentTime = datetime.utcnow()
    if str(currentTime.date()) == str(endDateForAPI.date()):
        endDateForAPI -= timedelta(days=1)

    if endDateForAPI.weekday() == 5:
        endDateForAPI -= timedelta(days=1)
    elif endDateForAPI.weekday() == 6:
        endDateForAPI -= timedelta(days=2)

    def flatten_json(stockData):
        out = []
        for i in stockData:
            out2 = {}
            out2['date']=i
            for j in stockData[i]:
                out2[j] = stockData[i][j]
            out.append(out2) 
        return out

    if ticker in sp500List:
        # start by seeing if there's data in the database for the start and end date
        queriedStartDate = sp_OHLC_data.query.filter_by(date=str(startDateForAPI.date())).first()
        queriedEndDate = sp_OHLC_data.query.filter_by(date=str(endDateForAPI.date())).first()

        # First we'll see if neither the start and end date have data, ie we need a full api call and commit it to the db
        if (getattr(queriedStartDate,ticker)) is None and (getattr(queriedEndDate,ticker)) is None:
            print('This API thinking that there is no data at the starting or ending date.  Change line 62')
            dataFromAPI = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
            flattendDataFromAPI = flatten_json(dataFromAPI)

            initialIndex = int(queriedStartDate.id)
            for i in range(len(flattendDataFromAPI)):
                #dateHyphenSplit =  flattendDataFromAPI[i]['date'].split('-')
                #flattendDataFromAPI[i]['date'] = str(int(dateHyphenSplit[0]))+'-'+str(int(dateHyphenSplit[1]))+'-'+str(int(dateHyphenSplit[2]))
                dataRow = sp_OHLC_data.query.filter_by(date=flattendDataFromAPI[i]['date']).first()
                setattr(dataRow,str(ticker),str(flattendDataFromAPI[i]))
                db.session.commit()
                initialIndex += 1

        # next we'll see if just the start date doesn't have data, ie we need to partially fill out the db on the earlier dates
        if (getattr(queriedStartDate,ticker)) is None and (getattr(queriedEndDate,ticker)) is not None:
            print('This API thinking that there is no data at the starting date.')
            index = getattr(queriedStartDate,'id')
            endingIndex = getattr(queriedEndDate,'id')
            trigger = True
            while trigger and index < endingIndex:
                dataRow = sp_OHLC_data.query.filter_by(id=index).first()
                if (getattr(dataRow,ticker)) is not None:
                    endingIndex = index - 1
                    trigger = False
                index += 1

            endingDateTemp = sp_OHLC_data.query.filter_by(id=endingIndex).first()
            endingDate = getattr(endingDateTemp,'date')

            dataFromAPI = get_historical_data(ticker, start=startDateForAPI.date(), end=endingDate, token=IEX_api_key)
            flattendDataFromAPI = flatten_json(dataFromAPI)
            
            for i in range(len(flattendDataFromAPI)):
                #dateHyphenSplit =  flattendDataFromAPI[i]['date'].split('-')
                #flattendDataFromAPI[i]['date'] = str(int(dateHyphenSplit[0]))+'-'+str(int(dateHyphenSplit[1]))+'-'+str(int(dateHyphenSplit[2]))
                dataRow = sp_OHLC_data.query.filter_by(date=flattendDataFromAPI[i]['date']).first()
                setattr(dataRow,str(ticker),str(flattendDataFromAPI[i]))
                db.session.commit()
                #initialIndex += 1

        # next we'll see if just the end date doesn't have data, ie we need to partially fill out the db on the later dates
        if (getattr(queriedStartDate,ticker)) is not None and (getattr(queriedEndDate,ticker)) is None:
            print('This API thinking that there is no data at the ending date.')
            index = getattr(queriedStartDate,'id')
            endingIndex = getattr(queriedEndDate,'id')
            trigger = True
            while trigger and index < endingIndex:
                index += 1
                dataRow = sp_OHLC_data.query.filter_by(id=index).first()
                if (getattr(dataRow,ticker)) is None:
                    trigger = False

            startingDateTemp = sp_OHLC_data.query.filter_by(id=index).first()
            startingDate = getattr(startingDateTemp,'date')
            dataFromAPI = get_historical_data(ticker, start=startingDate, end=endDateForAPI.date(), token=IEX_api_key)
            flattendDataFromAPI = flatten_json(dataFromAPI)

            for i in range(len(flattendDataFromAPI)):
                #dateHyphenSplit =  flattendDataFromAPI[i]['date'].split('-')
                #flattendDataFromAPI[i]['date'] = str(int(dateHyphenSplit[0]))+'-'+str(int(dateHyphenSplit[1]))+'-'+str(int(dateHyphenSplit[2]))
                dataRow = sp_OHLC_data.query.filter_by(date=flattendDataFromAPI[i]['date']).first()
                setattr(dataRow,str(ticker),str(flattendDataFromAPI[i]))
                db.session.commit()
                #initialIndex += 1

        
        # now that all of the requested data is in the database, we simply query it back out. 
        out = []
        startingIndexOutput = getattr(queriedStartDate,'id')
        endingIndexOutput = getattr(queriedEndDate,'id')
        i = startingIndexOutput
        while i < (endingIndexOutput + 1):
            dataRow = sp_OHLC_data.query.filter_by(id=i).first()
            if isinstance(getattr(dataRow,ticker), str):
                dataRowJSON = ast.literal_eval(getattr(dataRow,ticker))
                out.append(dataRowJSON)
            i += 1
        
    # or if the ticker is not in the SP 500 we query the api for this full data
    else:
        out2 = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
        out = flatten_json(out2)

    # Now we make the pandas dataframe with the database data
    df = pd.DataFrame(out)
    
    # we add the RSI indicator to show it on the initial momentum chart
    indicator_RSI = RSIIndicator(close=df["close"],n=10)
    df['rsi'] = indicator_RSI.rsi()
    df = ta.utils.dropna(df)
    return (json.dumps(df.to_dict('records')))

    
    # def getDBdata(start,end):
    #     queriedData = OHLC_JSONdata.query.all()
    #     out = []
    #     trigger = False
    #     for i in range(len(queriedData)):
    #         startDateForDBobjectTemp = queriedData[i].AAPL['date'].split('-')
    #         startDateForDBobject = datetime(int(startDateForDBobjectTemp[0]),int(startDateForDBobjectTemp[1]),int(startDateForDBobjectTemp[2]))
    #         #if (queriedData[i].AAPL['date'] == startDate) or (startDateForAPI <= startDateForDBobject):
    #         if startDateForAPI <= startDateForDBobject:
    #             trigger = True
    #         if queriedData[i].AAPL['date'] == endDate:
    #             trigger = False   
    #         # if (int(queriedData[i].AAPL['date'][0:4]) == StartYear) and (int(queriedData[i].AAPL['date'][5:7]) == StartMonth) and (int(queriedData[i].AAPL['date'][8:]) == StartDay):
    #         #     trigger = True
    #         # if (int(queriedData[i].AAPL['date'][0:4]) == EndYear) and (int(queriedData[i].AAPL['date'][5:7]) == EndMonth) and (int(queriedData[i].AAPL['date'][8:]) == EndDay):
    #         #     trigger = False
    #         if trigger:
    #             out.append(queriedData[i].AAPL)
    #     return out

    # def flatten_json(stockData):
    #     out = []
    #     for i in stockData:
    #         out2 = {}
    #         out2['date']=i
    #         for j in stockData[i]:
    #             out2[j] = stockData[i][j]
    #         out.append(out2) 
    #     return out
    
    # if ticker == 'AAPL':
    #     Historical_Data = getDBdata(startDate,endDate)
    # else:
    #     historicalData = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
    #     Historical_Data = flatten_json(historicalData)

    # #historicalData = get_historical_data(ticker, start=start.date(), end=end.date(), token=IEX_api_key)
    # #Historical_Data = flatten_json(historicalData)
    # #print(ticker)
    # #print(Historical_Data)
    # # historicalData = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
    # # Historical_Data = flatten_json(historicalData)
    # #initiallyCommitData(Historical_Data)
    # df = pd.DataFrame(Historical_Data)
    # df = ta.utils.dropna(df)
    # # print('This is historical data')
    # # print(Historical_Data)
    # # indicator_bb = BollingerBands(close=df["close"], n=20, ndev=2)
    # # #df = ta.add_all_ta_features(df, open="open", high="high", low="low", close="close", volume="volume")

    # # # Add Bollinger Bands features
    # # df['bb_bbm'] = indicator_bb.bollinger_mavg()
    # # df['bb_bbh'] = indicator_bb.bollinger_hband()
    # # df['bb_bbl'] = indicator_bb.bollinger_lband()

    # # # Add Bollinger Band high indicator
    # # df['bb_bbhi'] = indicator_bb.bollinger_hband_indicator()

    # # # Add Bollinger Band low indicator
    # # df['bb_bbli'] = indicator_bb.bollinger_lband_indicator()

    # # # Add Width Size Bollinger Bands
    # # df['bb_bbw'] = indicator_bb.bollinger_wband()

    # # # Add Percentage Bollinger Bands
    # # df['bb_bbp'] = indicator_bb.bollinger_pband()

    # # # Add RSI Indicator
    # indicator_RSI = RSIIndicator(close=df["close"],n=10)
    # df['rsi'] = indicator_RSI.rsi()


    # df.fillna(0, inplace=True)
    # # return (json.dumps(Historical_Data)) 
    # return (json.dumps(df.to_dict('records')))

# def initiallyCommitData(data,tickerName):
    
        
#     for i in range(len(data)):
#         dateTemp =  data[i]['date'].split('-')
#         data[i]['date'] = str(int(dateTemp[0]))+'-'+str(int(dateTemp[1]))+'-'+str(int(dateTemp[2]))
#         # data[i]['date'] = datetime.fromisoformat(data[i]['date']).timestamp() 
#         addedData = OHLC_JSONdata(AAPL=data[i])
#         db.session.add(addedData)
#         db.session.commit()


@algo.route("/get_ticker_company_name/<user_input>", methods=['GET'])
def get_ticker_company_name(user_input):


    def process_id(id):
        """process a single ID"""
        url = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange="+id+"&apikey="+Stock_Ticker_Lookup_key)
        response = urlopen(url,data=None,timeout=0.5)
        data = response.read().decode("utf-8")
        
        return data
    def process_range(id_range, store=None):
        """process a number of ids, storing the results in a dict"""
        if store is None:
            store = {}
        for id in id_range:
            store[id] = json.loads(process_id(id))
        return store
    
    def threaded_process_range(nthreads, id_range):
        """process the id range in a specified number of threads"""
        store = {}
        threads = []
        # create the threads
        for i in range(nthreads):
            ids = id_range[i::nthreads]
            t = Thread(target=process_range, args=(ids,store))
            threads.append(t)

        # start the threads
        [ t.start() for t in threads ]
        # wait for the threads to finish
        [ t.join() for t in threads ]
        return store

    threaded_results = threaded_process_range(6,['NASDAQ','NYSE','AMEX','INDEX','MUTUAL_FUND','ETF'])

    trigger = 0
    while trigger < 8 and len(threaded_results) == 0:
        time.sleep(0.1)
        trigger += 1
    
    if len(threaded_results) == 0:
        threaded_results = threaded_process_range(6,['NASDAQ','NYSE','AMEX','INDEX','MUTUAL_FUND','ETF'])

    #https://stackoverflow.com/questions/3640359/regular-expressions-search-in-list
    
    # urlNASDAQ = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=NASDAQ&apikey="+Stock_Ticker_Lookup_key)
    # responseNASDAQ = urlopen(urlNASDAQ)
    # dataNASDAQ = responseNASDAQ.read().decode("utf-8")
    # urlNYSE = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=NYSE&apikey="+Stock_Ticker_Lookup_key)
    # responseNYSE = urlopen(urlNYSE)
    # dataNYSE = responseNYSE.read().decode("utf-8")
    # urlAMEX = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=AMEX&apikey="+Stock_Ticker_Lookup_key)
    # responseAMEX = urlopen(urlAMEX)
    # dataAMEX = responseAMEX.read().decode("utf-8")
    # urlINDEX = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=INDEX&apikey="+Stock_Ticker_Lookup_key)
    # responseINDEX = urlopen(urlINDEX)
    # dataINDEX = responseINDEX.read().decode("utf-8")
    # urlMUTUAL_FUND = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=MUTUAL_FUND&apikey="+Stock_Ticker_Lookup_key)
    # responseMUTUAL_FUND = urlopen(urlMUTUAL_FUND)
    # dataMUTUAL_FUND = responseMUTUAL_FUND.read().decode("utf-8")
    # urlETF = Request("https://financialmodelingprep.com/api/v3/search?query="+user_input+"&limit=5&exchange=ETF&apikey="+Stock_Ticker_Lookup_key)
    # responseETF = urlopen(urlETF)
    # dataETF = responseETF.read().decode("utf-8")
    # dataset = [json.loads(dataNASDAQ),json.loads(dataNYSE),json.loads(dataAMEX),json.loads(dataINDEX),json.loads(dataMUTUAL_FUND),json.loads(dataETF)]
    # #print(dataset)
    #time.sleep(1)
    out = []
    
    dataset = []
    ids = ['NASDAQ','NYSE','AMEX','INDEX','MUTUAL_FUND','ETF']
    for i in range(len(ids)):
        if ids[i] in threaded_results:
            dataset.append(threaded_results[ids[i]])

    user_input_matching = user_input.replace("_","")
    for i in range(len(dataset)):
        for j in range(len(dataset[i])):

            if dataset[i][j]['name'] is not None:
                noSpacesAPI =re.sub(r'\W+', '',dataset[i][j]['name'] )
                noSpacesAPI2 = noSpacesAPI.upper()
            try:
                noSpacesAPI2.index(user_input_matching.upper())
            except ValueError:
                print("Not found!")
            else:
                dataset[i][j]['startingStrIndex'] = noSpacesAPI2.index(user_input_matching.upper()) 
                out.append(dataset[i][j])

    out.sort(key = lambda out: out['startingStrIndex']) 
    return json.dumps(out)

@algo.route("/get_company_name_from_ticker/<ticker>", methods=['GET'])
def get_company_name_from_ticker(ticker):
    stock = Stock(ticker, token=IEX_api_key)
    company = stock.get_company()
    return company['companyName']

@algo.route("/get_financial_data/<ticker>", methods=['GET'])
def get_fianancial_data(ticker):

    stock = Stock(ticker, token=IEX_api_key)
    financials = stock.get_financials()
    companyIEX = stock.get_company()
    url = Request("https://financialmodelingprep.com/api/v3/profile/"+ticker+"?apikey="+Stock_Ticker_Lookup_key)
    response = urlopen(url,data=None,timeout=0.5)
    companyFinModPrep = json.loads(response.read().decode("utf-8"))
    # def divideByMillion(financialParameter,newFinancials):
    #     newFinancials[0][financialParameter] = newFinancials[0][financialParameter]/1000000

    # financialParameters = ('grossProfit','operatingRevenue','totalRevenue','totalAssets','totalLiabilities','totalCash','netIncome','cashFlow','totalDebt','shortTermDebt','longTermDebt')
    financials.append(companyIEX)
    financials.append(companyFinModPrep[0])
    # print(financials)
    # financials[0]['grossProfit'] = financials[0]['grossProfit']/1000000
    # financials[0]['operatingRevenue'] = financials[0]['operatingRevenue']/1000000
    # financials[0]['totalRevenue'] = financials[0]['totalRevenue']/1000000
    # financials[0]['totalAssets'] = financials[0]['totalAssets']/1000000
    # financials[0]['totalLiabilities'] = financials[0]['totalLiabilities']/1000000
    # financials[0]['totalCash'] = financials[0]['totalCash']/1000000
    # financials[0]['netIncome'] = financials[0]['researchAndDevelopment']/1000000
    # financials[0]['cashFlow'] = financials[0]['cashFlow']/1000000
    # financials[0]['totalDebt'] = financials[0]['totalDebt']/1000000
    # financials[0]['shortTermDebt'] = financials[0]['shortTermDebt']/1000000
    # financials[0]['longTermDebt'] = financials[0]['longTermDebt']/1000000
    return (json.dumps(financials))

@algo.route("/get_earnings_data/<ticker>", methods=['GET'])
def get_earnings_data(ticker):
    stock = Stock(ticker, token=IEX_api_key)
    earnings = stock.get_earnings(last=4)
    #company = stock.get_company()
    return(json.dumps(earnings))

@algo.route("/calculate_Volitility_Indicators/", methods=['GET','POST'])
def calculate_Volitility_Indicators():
    JSON_sent = request.get_json()
    df = pd.DataFrame(JSON_sent[0])

    # Average True Range
    ATRchecked = JSON_sent[1]['displayATR']
    nForATR = JSON_sent[1]['nForATR']

    if ATRchecked:
        indicator_ATR = average_true_range(high=df['high'],low=df['low'],close=df['close'],n=nForATR)
        df['atr'] = indicator_ATR

    # Bollinger Band SMA
    BBSMAchecked = JSON_sent[2]['displayBBSMA']
    nForBBSMA = JSON_sent[2]['nForBBSMA']
    nDev = JSON_sent[2]['ndevBBSMA']

    if BBSMAchecked:
        indicator_BBSMA = bollinger_mavg(close=df['close'],n=nForBBSMA)
        df['bbsma'] = indicator_BBSMA

    # Bollinger Band Upper
    BBUpperChecked = JSON_sent[3]['displayBBUpper']
    nForBBUpper = JSON_sent[3]['nForBBUpper']
    ndevBBUpper = JSON_sent[3]['ndevBBUpper']

    if BBUpperChecked:
        indicator_BBUpper = bollinger_hband(close=df['close'],n=nForBBUpper,ndev=ndevBBUpper)
        df['BBupper'] = indicator_BBUpper

    # Bollinger Band Lower
    BBLowerChecked = JSON_sent[4]['displayBBLower']
    nForBBLower = JSON_sent[4]['nForBBLower']
    ndevBBLower = JSON_sent[4]['ndevBBLower']

    if BBLowerChecked:
        indicator_BBLower = bollinger_lband(close=df['close'],n=nForBBLower,ndev=ndevBBLower)
        df['BBlower'] = indicator_BBLower 

    # Bollinger Channal Band Width
    BBCBWchecked = JSON_sent[5]['displayBBCBW']
    nForBBCBW = JSON_sent[5]['nForBBCBW']
    ndevBBCBW = JSON_sent[5]['ndevBBCBW']

    if BBCBWchecked:
        indicator_BBCBW = bollinger_wband(close=df['close'],n=nForBBCBW,ndev=ndevBBCBW)
        df['BBCBW'] = indicator_BBCBW 

    # Bollinger Channal Percentage Band
    BBCPBchecked = JSON_sent[6]['displayBBCPB']
    nForBBCPB = JSON_sent[6]['nForBBCPB']
    ndevBBCPB = JSON_sent[6]['ndevBBCPB']

    if BBCPBchecked:
        indicator_BBCPB = bollinger_pband(close=df['close'],n=nForBBCPB,ndev=ndevBBCPB)
        df['BBCPB'] = indicator_BBCPB 

    # Bollinger High Band Indicator
    BBHBIchecked = JSON_sent[7]['displayBBHBI']
    nForBBHBI = JSON_sent[7]['nForBBHBI']
    ndevBBHBI = JSON_sent[7]['ndevBBHBI']

    if BBHBIchecked:
        indicator_BBHBI = bollinger_hband_indicator(close=df['close'],n=nForBBHBI,ndev=ndevBBHBI)
        df['BBHBI'] = indicator_BBHBI 

    # Bollinger Low Band Indicator
    BBLBIchecked = JSON_sent[8]['displayBBLBI']
    nForBBLBI = JSON_sent[8]['nForBBLBI']
    ndevBBLBI = JSON_sent[8]['ndevBBLBI']

    if BBLBIchecked:
        indicator_BBLBI = bollinger_lband_indicator(close=df['close'],n=nForBBLBI,ndev=ndevBBLBI)
        df['BBLBI'] = indicator_BBLBI 

    # Keltner Channel Central
    KeltnerCchecked = JSON_sent[9]['displayKeltnerC']
    nForKeltnerC = JSON_sent[9]['nForKeltnerC']

    if KeltnerCchecked:
        indicator_keltnerC = keltner_channel_mband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerC)
        df['keltnerC'] = indicator_keltnerC

    # Keltner Channel High
    KeltnerHchecked = JSON_sent[10]['displayKeltnerH']
    nForKeltnerH = JSON_sent[10]['nForKeltnerH']

    if KeltnerHchecked:
        indicator_keltnerH = keltner_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerH)
        df['keltnerH'] = indicator_keltnerH

    # Keltner Channel Low
    KeltnerLchecked = JSON_sent[11]['displayKeltnerL']
    nForKeltnerL = JSON_sent[11]['nForKeltnerL']

    if KeltnerLchecked:
        indicator_keltnerL = keltner_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerL)
        df['keltnerL'] = indicator_keltnerL

    # Keltner Channel Band Width
    KeltnerBWchecked = JSON_sent[12]['displayKeltnerBW']
    nForKeltnerBW = JSON_sent[12]['nForKeltnerBW']

    if KeltnerBWchecked:
        indicator_keltnerBW = keltner_channel_wband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerBW)
        df['keltnerBW'] = indicator_keltnerBW

    # Keltner Channel Percentage Band
    KeltnerPBchecked = JSON_sent[13]['displayKeltnerPB']
    nForKeltnerPB = JSON_sent[13]['nForKeltnerPB']

    if KeltnerPBchecked:
        indicator_keltnerPB = keltner_channel_pband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerPB)
        df['keltnerPB'] = indicator_keltnerPB

    # Keltner Channel High Band
    KeltnerHBchecked = JSON_sent[14]['displayKeltnerHB']
    nForKeltnerHB = JSON_sent[14]['nForKeltnerHB']

    if KeltnerHBchecked:
        indicator_keltnerHB = keltner_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerHB)
        df['keltnerHB'] = indicator_keltnerHB

    # Keltner Channel Low Band
    KeltnerLBchecked = JSON_sent[15]['displayKeltnerLB']
    nForKeltnerLB = JSON_sent[15]['nForKeltnerLB']

    if KeltnerLBchecked:
        indicator_keltnerLB = keltner_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerLB)
        df['keltnerLB'] = indicator_keltnerLB

    # Donchian Channel High Band
    DonchianHBchecked = JSON_sent[16]['displayDonchianHB']
    nForDonchianHB = JSON_sent[16]['nForDonchianHB']

    if DonchianHBchecked:
        indicator_donchianHB = donchian_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianHB)
        df['donchianHB'] = indicator_donchianHB

    # Donchian Channel Low Band
    DonchianHBchecked = JSON_sent[17]['displayDonchianHB']
    nForDonchianHB = JSON_sent[17]['nForDonchianHB']

    if DonchianLBchecked:
        indicator_donchianLB = donchian_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianLB)
        df['donchianLB'] = indicator_donchianLB

    # Donchian Channel Mid Band
    DonchianMBchecked = JSON_sent[18]['displayDonchianMB']
    nForDonchianMB = JSON_sent[18]['nForDonchianMB']

    if DonchianMBchecked:
        indicator_donchianMB = donchian_channel_mband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianMB)
        df['donchianMB'] = indicator_donchianMB

    # Donchian Channel Band Width
    DonchianBWchecked = JSON_sent[19]['displayDonchianBW']
    nForDonchianBW = JSON_sent[19]['nForDonchianBW']

    if DonchianBWchecked:
        indicator_donchianBW = donchian_channel_wband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianBW)
        df['donchianBW'] = indicator_donchianBW

    # Donchian Channel Percentage Band
    DonchianPBchecked = JSON_sent[20]['displayDonchianPB']
    nForDonchianPB = JSON_sent[20]['nForDonchianPB']

    if DonchianPBchecked:
        indicator_donchianPB = donchian_channel_pband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianPB)
        df['donchianPB'] = indicator_donchianPB

    df.fillna(0, inplace=True)
    return (json.dumps(df.to_dict('records')))

@algo.route("/calculate_Trend_Indicators/", methods=['GET','POST'])
def calculate_Trend_Indicators():
    JSON_sent = request.get_json()
    if len(JSON_sent[0])>0:
        df = pd.DataFrame(JSON_sent[0])

        # Simple Moving Average 
        SMAchecked = JSON_sent[1]['displaySMA']
        nForSMA = JSON_sent[1]['nForSMA']

        # Exponential Moving Average (EMA)
        EMAchecked = JSON_sent[2]['displayEMA']
        nForEMA = JSON_sent[2]['nForEMA']

        # MACD
        MACDchecked = JSON_sent[3]['displayMACD']
        nslowForMACD = JSON_sent[3]['nSlowForMACD']
        nfastForMACD = JSON_sent[3]['nFastForMACD']

        # # MACD Signal 
        MACDsignalChecked = JSON_sent[4]['displayMACDsignal']
        nslowForMACDsignal = JSON_sent[4]['nSlowForMACDsignal']
        nfastForMACDsignal = JSON_sent[4]['nFastForMACDsignal']
        nsignForMACDsignal = JSON_sent[4]['nSignForMACDsignal']

        # Average Directional Movement Index
        ADXchecked = JSON_sent[5]['displayADX']
        nForADX = JSON_sent[5]['nForADX']
        
        # # Average Directional Movement Index Positive (ADX)
        ADXpositiveChecked = JSON_sent[6]['displayADXP']
        nForADXpositive = JSON_sent[6]['nForADXP']

        # # Average Directional Movement Index Negative 
        ADXnegativeChecked = JSON_sent[7]['displayADXN']
        nForADXnegative = JSON_sent[7]['nForADXN']

        # # Bollinger Band SMA
        # BBSMAchecked = JSON_sent[8]['displayBBSMA']
        # nForBBSMA = JSON_sent[8]['nForBBSMA']
        # nDev = JSON_sent[8]['ndevBBSMA']

        # # Vortex Indicator Positive
        VIpositiveChecked = JSON_sent[8]['displayVIPOS']
        nForVIpositive = JSON_sent[8]['nForVIPOS']

        # # Vortex Indicator Negative
        VInegativeChecked = JSON_sent[9]['displayVINEG']
        nForVInegative = JSON_sent[9]['nForVINEG']

        # # TRIX
        TRIXchecked = JSON_sent[10]['displayTRIX']
        nForTRIX = JSON_sent[10]['nForTRIX']

        # # Mass Index
        MassIndexchecked = JSON_sent[11]['displayMI']
        nForMassIndex = JSON_sent[11]['nForMI']
        n2ForMassIndex = JSON_sent[11]['n2ForMI']

        # # Commodity Channel Index 
        # CCIchecked = JSON_sent[12]['displayCCI']
        # nForCCI = JSON_sent[12]['nForCCI']
        # cForCCI = float(JSON_sent[12]['cForCCI'])
        #print('The N for CCI', nForCCI)
        #print('The C for CCI', cForCCI)

        # # Detrended Price Oscillator (DPO)
        DPOchecked = JSON_sent[12]['displayDPO']
        nForDPO = JSON_sent[12]['nForDPO']

    # # Tenkan-sen (Conversion Line)
    # IchimokuChecked = JSON_sent[14]['displayIchimoku']
    # n1ForIchimoku = JSON_sent[14]['n1ForIchimoku']
    # n2ForIchimoku = JSON_sent[14]['n2ForIchimoku']
    # visualForIchimoku = JSON_sent[14]['visualForIchimoku']

    # # Aroon up Indicator
    # AIupChecked = JSON_sent[15]['AIupChecked']
    # nForAIup = JSON_sent[15]['nForAIup']

    # # Aroon down Indicator
    # AIdownChecked = JSON_sent[16]['AIdownChecked']
    # nForAIdown = JSON_sent[16]['nForAIdown']

        if SMAchecked:
            indicator_sma = sma_indicator(close=df['close'],n=nForSMA)
            df['sma'] = indicator_sma

        if EMAchecked:
            indicator_ema = ema_indicator(close=df['close'],n=nForEMA)
            df['ema'] = indicator_ema
        
        if MACDchecked:
            indicator_macd = macd(close=df['close'],n_slow=nslowForMACD,n_fast=nfastForMACD)
            df['macd'] = indicator_macd

        if MACDsignalChecked:
            indicator_macdSignal = macd_signal(close=df['close'],n_slow=nslowForMACDsignal,n_fast=nfastForMACDsignal,n_sign=nsignForMACDsignal)
            df['macds'] = indicator_macdSignal
    
        if ADXchecked:
            indicator_ADX = adx(high=df['high'],low=df['low'],close=df['close'],n=nForADX)
            df['adx'] = indicator_ADX

        if ADXpositiveChecked:
            indicator_ADXpositive = adx_pos(high=df['high'],low=df['low'],close=df['close'],n=nForADXpositive)
            df['adxp'] = indicator_ADXpositive
    
        if ADXnegativeChecked:
            indicator_ADXnegative = adx_neg(high=df['high'],low=df['low'],close=df['close'],n=nForADXnegative)
            df['adxn'] = indicator_ADXnegative

        # if BBSMAchecked:
        #     indicator_BBSMA = bollinger_mavg(close=df['close'],n=nForBBSMA)
        #     df['bbsma'] = indicator_BBSMA

        if VIpositiveChecked:
            indicator_VIpositive = vortex_indicator_pos(high=df['high'],low=df['low'],close=df['close'],n=nForVIpositive)
            df['vipos'] = indicator_VIpositive

        if VInegativeChecked:
            indicator_VInegative = vortex_indicator_neg(high=df['high'],low=df['low'],close=df['close'],n=nForVInegative)
            df['vineg'] = indicator_VInegative

        if TRIXchecked:
            indicator_TRIX = trix(close=df['close'],n=nForTRIX)
            df['trix'] = indicator_TRIX

        if MassIndexchecked:
            indicator_MassIndex = mass_index(high=df['high'],low=df['low'],n=nForMassIndex,n2=n2ForMassIndex)
            df['mi'] = indicator_MassIndex

        # if CCIchecked:
        #     indicator_cci = cci(high=df['high'],low=df['low'],close=['close'],n=nForCCI,c=cForCCI)
        #     df['cci'] = indicator_cci

        if DPOchecked:
            indicator_dpo = dpo(close=df['close'],n=nForDPO)
            df['dpo'] = indicator_dpo

    # if IchimokuChecked:
    #     indicator_ichimoku = ichimoku_conversion_line(high=df['high'],low=df['low'],n1=n1ForIchimoku,n2=n2ForIchimoku,visual=visualForIchimoku)
    #     df['ichimoku'] = indicator_ichimoku

    # if AIupChecked:
    #     indicator_AIup = aroon_up(close=df['close'],n=nForAIup)
    #     df['AIup'] = indicator_AIup

    # if AIdownChecked:
    #     indicator_AIdown = aroon_down(close=df['close'],n=nForAIdown)    
    #     df['AIdown'] = indicator_AIdown

    
    # # Average True Range
    # ATRchecked = JSON_sent[17]['displayATR']
    # nForATR = JSON_sent[17]['nForATR']

    # if ATRchecked:
    #     indicator_ATR = average_true_range(high=df['high'],low=df['low'],close=df['close'],n=nForATR)
    #     df['atr'] = indicator_ATR

    # # Bollinger Band SMA
    # BBSMAchecked = JSON_sent[18]['displayBBSMA']
    # nForBBSMA = JSON_sent[18]['nForBBSMA']
    # nDev = JSON_sent[18]['ndevBBSMA']



    # # Bollinger Band Upper
    # BBUpperChecked = JSON_sent[19]['displayBBUpper']
    # nForBBUpper = JSON_sent[19]['nForBBUpper']
    # ndevBBUpper = JSON_sent[19]['ndevBBUpper']

    # if BBUpperChecked:
    #     indicator_BBUpper = bollinger_hband(close=df['close'],n=nForBBUpper,ndev=ndevBBUpper)
    #     df['BBupper'] = indicator_BBUpper

    # # Bollinger Band Lower
    # BBLowerChecked = JSON_sent[20]['displayBBLower']
    # nForBBLower = JSON_sent[20]['nForBBLower']
    # ndevBBLower = JSON_sent[20]['ndevBBLower']

    # if BBLowerChecked:
    #     indicator_BBLower = bollinger_lband(close=df['close'],n=nForBBLower,ndev=ndevBBLower)
    #     df['BBlower'] = indicator_BBLower 

    # # Bollinger Channal Band Width
    # BBCBWchecked = JSON_sent[21]['displayBBCBW']
    # nForBBCBW = JSON_sent[21]['nForBBCBW']
    # ndevBBCBW = JSON_sent[21]['ndevBBCBW']

    # if BBCBWchecked:
    #     indicator_BBCBW = bollinger_wband(close=df['close'],n=nForBBCBW,ndev=ndevBBCBW)
    #     df['BBCBW'] = indicator_BBCBW 

    # # Bollinger Channal Percentage Band
    # BBCPBchecked = JSON_sent[22]['displayBBCPB']
    # nForBBCPB = JSON_sent[22]['nForBBCPB']
    # ndevBBCPB = JSON_sent[22]['ndevBBCPB']

    # if BBCPBchecked:
    #     indicator_BBCPB = bollinger_pband(close=df['close'],n=nForBBCPB,ndev=ndevBBCPB)
    #     df['BBCPB'] = indicator_BBCPB 

    # # Bollinger High Band Indicator
    # BBHBIchecked = JSON_sent[23]['displayBBHBI']
    # nForBBHBI = JSON_sent[23]['nForBBHBI']
    # ndevBBHBI = JSON_sent[23]['ndevBBHBI']

    # if BBHBIchecked:
    #     indicator_BBHBI = bollinger_hband_indicator(close=df['close'],n=nForBBHBI,ndev=ndevBBHBI)
    #     df['BBHBI'] = indicator_BBHBI 

    # # Bollinger Low Band Indicator
    # BBLBIchecked = JSON_sent[24]['displayBBLBI']
    # nForBBLBI = JSON_sent[24]['nForBBLBI']
    # ndevBBLBI = JSON_sent[24]['ndevBBLBI']

    # if BBLBIchecked:
    #     indicator_BBLBI = bollinger_lband_indicator(close=df['close'],n=nForBBLBI,ndev=ndevBBLBI)
    #     df['BBLBI'] = indicator_BBLBI 

    # # Keltner Channel Central
    # KeltnerCchecked = JSON_sent[25]['displayKeltnerC']
    # nForKeltnerC = JSON_sent[25]['nForKeltnerC']

    # if KeltnerCchecked:
    #     indicator_keltnerC = keltner_channel_mband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerC)
    #     df['keltnerC'] = indicator_keltnerC

    # # Keltner Channel High
    # KeltnerHchecked = JSON_sent[26]['displayKeltnerH']
    # nForKeltnerH = JSON_sent[26]['nForKeltnerH']

    # if KeltnerHchecked:
    #     indicator_keltnerH = keltner_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerH)
    #     df['keltnerH'] = indicator_keltnerH

    # # Keltner Channel Low
    # KeltnerLchecked = JSON_sent[27]['displayKeltnerL']
    # nForKeltnerL = JSON_sent[27]['nForKeltnerL']

    # if KeltnerLchecked:
    #     indicator_keltnerL = keltner_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerL)
    #     df['keltnerL'] = indicator_keltnerL

    # # Keltner Channel Band Width
    # KeltnerBWchecked = JSON_sent[28]['displayKeltnerBW']
    # nForKeltnerBW = JSON_sent[28]['nForKeltnerBW']

    # if KeltnerBWchecked:
    #     indicator_keltnerBW = keltner_channel_wband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerBW)
    #     df['keltnerBW'] = indicator_keltnerBW

    # # Keltner Channel Percentage Band
    # KeltnerPBchecked = JSON_sent[29]['displayKeltnerPB']
    # nForKeltnerPB = JSON_sent[29]['nForKeltnerPB']

    # if KeltnerPBchecked:
    #     indicator_keltnerPB = keltner_channel_pband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerPB)
    #     df['keltnerPB'] = indicator_keltnerPB

    # # Keltner Channel High Band
    # KeltnerHBchecked = JSON_sent[30]['displayKeltnerHB']
    # nForKeltnerHB = JSON_sent[30]['nForKeltnerHB']

    # if KeltnerHBchecked:
    #     indicator_keltnerHB = keltner_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerHB)
    #     df['keltnerHB'] = indicator_keltnerHB

    # # Keltner Channel Low Band
    # KeltnerLBchecked = JSON_sent[31]['displayKeltnerLB']
    # nForKeltnerLB = JSON_sent[31]['nForKeltnerLB']

    # if KeltnerLBchecked:
    #     indicator_keltnerLB = keltner_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForKeltnerLB)
    #     df['keltnerLB'] = indicator_keltnerLB

    # # Donchian Channel High Band
    # DonchianHBchecked = JSON_sent[32]['displayDonchianHB']
    # nForDonchianHB = JSON_sent[32]['nForDonchianHB']

    # if DonchianHBchecked:
    #     indicator_donchianHB = donchian_channel_hband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianHB)
    #     df['donchianHB'] = indicator_donchianHB

    # # Donchian Channel Low Band
    # DonchianLBchecked = JSON_sent[33]['displayDonchianLB']
    # nForDonchianLB = JSON_sent[33]['nForDonchianLB']

    # if DonchianLBchecked:
    #     indicator_donchianLB = donchian_channel_lband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianLB)
    #     df['donchianLB'] = indicator_donchianLB

    # # Donchian Channel Mid Band
    # DonchianMBchecked = JSON_sent[34]['displayDonchianMB']
    # nForDonchianMB = JSON_sent[34]['nForDonchianMB']

    # if DonchianMBchecked:
    #     indicator_donchianMB = donchian_channel_mband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianMB)
    #     df['donchianMB'] = indicator_donchianMB

    # # Donchian Channel Band Width
    # DonchianBWchecked = JSON_sent[35]['displayDonchianBW']
    # nForDonchianBW = JSON_sent[35]['nForDonchianBW']

    # if DonchianBWchecked:
    #     indicator_donchianBW = donchian_channel_wband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianBW)
    #     df['donchianBW'] = indicator_donchianBW

    # # Donchian Channel Percentage Band
    # DonchianPBchecked = JSON_sent[36]['displayDonchianPB']
    # nForDonchianPB = JSON_sent[36]['nForDonchianPB']

    # if DonchianPBchecked:
    #     indicator_donchianPB = donchian_channel_pband(high=df['high'],low=df['low'],close=df['close'],n=nForDonchianPB)
    #     df['donchianPB'] = indicator_donchianPB

        df.fillna(0, inplace=True)
        #export_df = df.drop(columns=['open', 'high', 'low', 'close', 'volume'])
        #print('The printed df in Trend', df)
        return (json.dumps(df.to_dict('records')))
    else:
        df = pd.DataFrame([])
        return (json.dumps(df.to_dict('records')))

@algo.route("/calculate_Momentum_Indicators/", methods=['GET','POST'])
def calculate_Momentum_Indicators():
    
    JSON_sent = request.get_json() 
    df = pd.DataFrame(JSON_sent[0])
    
    # RSI
    nForRSI = JSON_sent[1]['N']
    
    # TSI
    TSIchecked = JSON_sent[2]['displayTSI']
    TSIr = int(JSON_sent[2]['rTSI'])
    TSIs = int(JSON_sent[2]['sTSI'])

    # # Ultimate Ossilator
    UOchecked = JSON_sent[3]['displayUO']
    sForUO = int(JSON_sent[3]['sForUO'])
    mForUO = int(JSON_sent[3]['mForUO'])
    lenForUO = int(JSON_sent[3]['lenForUO'])
    wsForUO = float(JSON_sent[3]['wsForUO'])
    wmForUO = float(JSON_sent[3]['wmForUO'])
    wlForUO = float(JSON_sent[3]['wlForUO'])

    # # Stochastic Oscillator
    StochChecked = JSON_sent[4]['displaySTOCH']
    nForStoch = int(JSON_sent[4]['nForSTOCH'])
    dnForStoch = int(JSON_sent[4]['dnForSTOCH'])

    # # Stochastic Signal
    StochSignalChecked = JSON_sent[5]['displayStochSignal']
    nForStochSignal = int(JSON_sent[5]['nForStochSignal'])
    dnForStochSignal = int(JSON_sent[5]['dnForStochSignal'])

    # # Williams %R
    wrChecked = JSON_sent[6]['displayWR']
    lbpForWR = int(JSON_sent[6]['lbpForWR'])

    # # Awesome Oscillator
    aoChecked = JSON_sent[7]['displayAO']
    sForAO = JSON_sent[7]['sForAO']
    lenForAO = JSON_sent[7]['lenForAO']

    # # Kaufman's Adaptive Moving Average (KAMA)
    kamaChecked = JSON_sent[8]['displayKama']
    nForKama = JSON_sent[8]['nForKama']
    pow1ForKama = JSON_sent[8]['pow1ForKama']
    pow2ForKama = JSON_sent[8]['pow2ForKama']

    # # Rate of Change (ROC)
    ROCChecked = JSON_sent[9]['displayROC']
    nForROC = JSON_sent[9]['nForROC']

    indicator_RSI = RSIIndicator(close=df["close"], n=nForRSI)
    df['rsi'] = indicator_RSI.rsi()
    
    if TSIchecked:
        indicator_TSI = TSIIndicator(close=df["close"], r=TSIr, s=TSIs)
        df['tsi'] = indicator_TSI.tsi()
    
    if UOchecked:
        indicator_UO = uo(high=df['high'],low=df['low'],close=df['close'],s=sForUO,m=mForUO,len=lenForUO,ws=wsForUO,wm=wmForUO,wl=wlForUO)
        df['uo'] = indicator_UO
    
    if StochChecked:
        indicator_Stoch = stoch(high=df['high'],low=df['low'],close=df['close'],n=nForStoch,d_n=dnForStoch)
        df['stoch'] = indicator_Stoch
    
    if StochSignalChecked:
        indicator_StochSignal = stoch_signal(high=df['high'],low=df['low'],close=df['close'],n=nForStochSignal,d_n=dnForStochSignal)
        df['stoch_signal'] = indicator_StochSignal

    if wrChecked:
        indicator_wr = wr(high=df['high'],low=df['low'],close=df['close'],lbp=lbpForWR)
        df['wr'] = indicator_wr
    
    if aoChecked:
        indicator_ao = ao(high=df['high'],low=df['low'],s=sForUO,len=lenForUO)
        df['ao'] = indicator_ao

    if kamaChecked:
        indicator_kama = kama(close=df['close'],n=nForKama,pow1=pow1ForKama,pow2=pow2ForKama)
        df['kama'] = indicator_kama

    if ROCChecked:
        indicator_roc = roc(close=df['close'],n=nForROC)
        df['roc'] = indicator_roc
    
    df.fillna(0, inplace=True)
    export_df = df.drop(columns=['open', 'high', 'low', 'close', 'volume'])
    return (json.dumps(export_df.to_dict('records')))



