from flask import render_template, url_for, jsonify, flash, redirect, request
from algoPlatform1_project import app, db
import os, json
from datetime import datetime
import pyEX as p
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
import ta
from ta.volatility import BollingerBands
from ta.momentum import RSIIndicator, TSIIndicator, uo, stoch, stoch_signal, wr, ao, kama, roc
from ta.trend import sma_indicator, ema_indicator, macd, macd_signal, macd_diff, adx, adx_pos, adx_neg, vortex_indicator_pos, vortex_indicator_neg, trix, mass_index, cci, dpo, kst, kst_sig, ichimoku_conversion_line, ichimoku_base_line, aroon_down, aroon_up, psar_up, psar_down
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


@algo.route("/get_stock_data/<ticker>/<startDate>/<endDate>", methods=['GET'])
def get_stock_data(ticker,startDate,endDate):

    startDateForAPItemp = startDate.split('-')
    startDateForAPI = datetime(int(startDateForAPItemp[0]),int(startDateForAPItemp[1]),int(startDateForAPItemp[2]))

    endDateForAPItemp = endDate.split('-')
    endDateForAPI = datetime(int(endDateForAPItemp[0]),int(endDateForAPItemp[1]),int(endDateForAPItemp[2]))
    # print(start.date())
    # end = datetime.fromtimestamp(endDate)
    # print(end.date())

    # start = datetime(StartYear,StartMonth,StartDay)
    # end = datetime(EndYear,EndMonth,EndDay)

    def getDBdata(start,end):
        queriedData = OHLC_JSONdata.query.all()
        out = []
        trigger = False
        for i in range(len(queriedData)):
            startDateForDBobjectTemp = queriedData[i].AAPL['date'].split('-')
            startDateForDBobject = datetime(int(startDateForDBobjectTemp[0]),int(startDateForDBobjectTemp[1]),int(startDateForDBobjectTemp[2]))
            #if (queriedData[i].AAPL['date'] == startDate) or (startDateForAPI <= startDateForDBobject):
            if startDateForAPI <= startDateForDBobject:
                trigger = True
            if queriedData[i].AAPL['date'] == endDate:
                trigger = False   
            # if (int(queriedData[i].AAPL['date'][0:4]) == StartYear) and (int(queriedData[i].AAPL['date'][5:7]) == StartMonth) and (int(queriedData[i].AAPL['date'][8:]) == StartDay):
            #     trigger = True
            # if (int(queriedData[i].AAPL['date'][0:4]) == EndYear) and (int(queriedData[i].AAPL['date'][5:7]) == EndMonth) and (int(queriedData[i].AAPL['date'][8:]) == EndDay):
            #     trigger = False
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
        Historical_Data = getDBdata(startDate,endDate)
    else:
        historicalData = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
        Historical_Data = flatten_json(historicalData)

    #historicalData = get_historical_data(ticker, start=start.date(), end=end.date(), token=IEX_api_key)
    #Historical_Data = flatten_json(historicalData)
    #print(ticker)
    #print(Historical_Data)
    # historicalData = get_historical_data(ticker, start=startDateForAPI.date(), end=endDateForAPI.date(), token=IEX_api_key)
    # Historical_Data = flatten_json(historicalData)
    #initiallyCommitData(Historical_Data)
    df = pd.DataFrame(Historical_Data)
    df = ta.utils.dropna(df)
    # print('This is historical data')
    # print(Historical_Data)
    # indicator_bb = BollingerBands(close=df["close"], n=20, ndev=2)
    # #df = ta.add_all_ta_features(df, open="open", high="high", low="low", close="close", volume="volume")

    # # Add Bollinger Bands features
    # df['bb_bbm'] = indicator_bb.bollinger_mavg()
    # df['bb_bbh'] = indicator_bb.bollinger_hband()
    # df['bb_bbl'] = indicator_bb.bollinger_lband()

    # # Add Bollinger Band high indicator
    # df['bb_bbhi'] = indicator_bb.bollinger_hband_indicator()

    # # Add Bollinger Band low indicator
    # df['bb_bbli'] = indicator_bb.bollinger_lband_indicator()

    # # Add Width Size Bollinger Bands
    # df['bb_bbw'] = indicator_bb.bollinger_wband()

    # # Add Percentage Bollinger Bands
    # df['bb_bbp'] = indicator_bb.bollinger_pband()

    # # Add RSI Indicator
    indicator_RSI = RSIIndicator(close=df["close"],n=10)
    df['rsi'] = indicator_RSI.rsi()


    df.fillna(0, inplace=True)
    
    # return (json.dumps(Historical_Data)) 
    return (json.dumps(df.to_dict('records')))

def initiallyCommitData(data):
    for i in range(len(data)):
        dateTemp =  data[i]['date'].split('-')
        data[i]['date'] = str(int(dateTemp[0]))+'-'+str(int(dateTemp[1]))+'-'+str(int(dateTemp[2]))
        # data[i]['date'] = datetime.fromisoformat(data[i]['date']).timestamp() 
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
    return(json.dumps(earnings))


@algo.route("/calculate_Trend_Indicators/", methods=['GET','POST'])
def calculate_Trend_Indicators():
    JSON_sent = request.get_json()
    df = pd.DataFrame(JSON_sent[0])


    # Simple Moving Average 
    SMAchecked = JSON_sent[1]['displaySMA']
    nForSMA = JSON_sent[1]['nForSMA']

    # MACD
    MACDchecked = JSON_sent[2]['displayMACD']
    nslowForMACD = JSON_sent[2]['nSlow']
    nfastForMACD = JSON_sent[2]['nFast']

    # MACD Signal 
    MACDsignalChecked = JSON_sent[3]['displayMACDsignal']
    nslowForMACDsignal = JSON_sent[3]['nSlow']
    nfastForMACDsignal = JSON_sent[3]['nFast']
    nsignForMACDsignal = JSON_sent[3]['nSign']

    # Exponential Moving Average (EMA)
    EMAchecked = JSON_sent[4]['displayEMA']
    nForEMA = JSON_sent[4]['nForEMA']

    # Average Directional Movement Index
    ADXchecked = JSON_sent[5]['displayADX']
    nForADX = JSON_sent[5]['nForADX']

    # Average Directional Movement Index Positive (ADX)
    ADXpositiveChecked = JSON_sent[6]['displayADXpositive']
    nForADXpositive = JSON_sent[6]['nForADXpositive']

    # Average Directional Movement Index Negative 
    ADXnegativeChecked = JSON_sent[7]['displayADXnegative']
    nForADXnegative = JSON_sent[7]['nForADXnegative']

    # Vortex Indicator Positive
    VIpositiveChecked = JSON_sent[8]['displayVIpositive']
    nForVIpositive = JSON_sent[8]['nForVIpositive']

    # Vortex Indicator Negative
    VInegativeChecked = JSON_sent[9]['displayVInegative']
    nForVInegative = JSON_sent[9]['nForVInegative']

    # TRIX
    TRIXchecked = JSON_sent[10]['displayTRIX']
    nForTRIX = JSON_sent[10]['nForTRIX']

    # Mass Index
    MassIndexchecked = JSON_sent[11]['displayMassIndex']
    nForMassIndex = JSON_sent[11]['nForMassIndex']
    n2ForMassIndex = JSON_sent[11]['n2ForMassIndex']

    # Commodity Channel Index 
    CCIchecked = JSON_sent[12]['displayCCIcheck']
    nForCCI = JSON_sent[12]['nForCCI']
    cForCCI = JSON_sent[12]['cForCCI']

    # Detrended Price Oscillator (DPO)
    DPOchecked = JSON_sent[13]['displayDPO']
    nForDPO = JSON_sent[13]['nForDPO']

    # Tenkan-sen (Conversion Line)
    IchimokuChecked = JSON_sent[14]['displayIchimoku']
    n1ForIchimoku = JSON_sent[14]['n1ForIchimoku']
    n2ForIchimoku = JSON_sent[14]['n2ForIchimoku']
    visualForIchimoku = JSON_sent[14]['visualForIchimoku']

    # Aroon up Indicator
    AIupChecked = JSON_sent[15]['AIupChecked']
    nForAIup = JSON_sent[15]['nForAIup']

    # Aroon down Indicator
    AIdownChecked = JSON_sent[16]['AIdownChecked']
    nForAIdown = JSON_sent[16]['nForAIdown']

    print('MACD array', JSON_sent[2])

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
        df['macdSignal'] = indicator_macdSignal
    
    if ADXchecked:
        indicator_ADX = adx(high=df['high'],low=df['low'],close=df['close'],n=nForADX)
        df['adx'] = indicator_ADX

    if ADXpositiveChecked:
        indicator_ADXpositive = adx_pos(high=df['high'],low=df['low'],close=df['close'],n=nForADXpositive)
        df['adxPositive'] = indicator_ADXpositive
    
    if ADXnegativeChecked:
        indicator_ADXnegative = adx_neg(high=df['high'],low=df['low'],close=df['close'],n=nForADXnegative)
        df['adxNegative'] = indicator_ADXnegative

    if VIpositiveChecked:
        indicator_VIpositive = vortex_indicator_pos(high=df['high'],low=df['low'],close=df['close'],n=nForVIpositive)
        df['VIpositive'] = indicator_VIpositive

    if VInegativeChecked:
        indicator_VInegative = vortex_indicator_neg(high=df['high'],low=df['low'],close=df['close'],n=nForVInegative)
        df['VInegative'] = indicator_VInegative

    if TRIXchecked:
        indicator_TRIX = trix(close=df['close'],n=nForTRIX)
        df['trix'] = indicator_TRIX

    if MassIndexchecked:
        indicator_MassIndex = mass_index(high=df['high'],low=df['low'],n=nForMassIndex,n2=n2ForMassIndex)
        df['massIndex'] = indicator_MassIndex

    if CCIchecked:
        indicator_cci = cci(high=df['high'],low=df['low'],close=['close'],n=nForCCI,c=cForCCI)
        df['cci'] = indicator_cci

    if DPOchecked:
        indicator_dpo = dpo(close=df['close'],n=nForDPO)
        df['dpo'] = indicator_dpo

    if IchimokuChecked:
        indicator_ichimoku = ichimoku_conversion_line(high=df['high'],low=df['low'],n1=n1ForIchimoku,n2=n2ForIchimoku,visual=visualForIchimoku)
        df['ichimoku'] = indicator_ichimoku

    if AIupChecked:
        indicator_AIup = aroon_up(close=df['close'],n=nForAIup)
        df['AIup'] = indicator_AIup

    if AIdownChecked:
        indicator_AIdown = aroon_down(close=df['close'],n=nForAIdown)    
        df['AIdown'] = indicator_AIdown

    df.fillna(0, inplace=True)
    #export_df = df.drop(columns=['open', 'high', 'low', 'close', 'volume'])
    print('The printed df in Trend', df)
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

    # Ultimate Ossilator
    UOchecked = JSON_sent[3]['displayUO']
    sForUO = int(JSON_sent[3]['sForUO'])
    mForUO = int(JSON_sent[3]['mForUO'])
    lenForUO = int(JSON_sent[3]['lenForUO'])
    wsForUO = float(JSON_sent[3]['wsForUO'])
    wmForUO = float(JSON_sent[3]['wmForUO'])
    wlForUO = float(JSON_sent[3]['wlForUO'])

    # Stochastic Oscillator
    StochChecked = JSON_sent[4]['displayStoch']
    nForStoch = int(JSON_sent[4]['nForStoch'])
    d_nForStoch = int(JSON_sent[4]['d_nForStoch'])

    # Stochastic Signal
    StochSignalChecked = JSON_sent[5]['displayStochSignal']
    nForStochSignal = int(JSON_sent[5]['nForStochSignal'])
    d_nForStochSignal = int(JSON_sent[5]['d_nForStochSignal'])

    # Williams %R
    wrChecked = JSON_sent[6]['displayWR']
    lbpForWR = int(JSON_sent[6]['lbpForWR'])

    # Awesome Oscillator
    aoChecked = JSON_sent[7]['displayAO']
    sForAO = JSON_sent[7]['sForAO']
    lenForAO = JSON_sent[7]['lenForAO']

    # Kaufman's Adaptive Moving Average (KAMA)
    kamaChecked = JSON_sent[8]['displayKama']
    nForKama = JSON_sent[8]['nForKama']
    pow1ForKama = JSON_sent[8]['pow1ForKama']
    pow2ForKama = JSON_sent[8]['pow2ForKama']

    # Rate of Change (ROC)
    ROCChecked = JSON_sent[9]['displayROC']
    nForROC = JSON_sent[9]['nForROC']
    print(ROCChecked)
    


    indicator_RSI = RSIIndicator(close=df["close"], n=nForRSI)
    df['rsi'] = indicator_RSI.rsi()
    

    if TSIchecked:
        indicator_TSI = TSIIndicator(close=df["close"], r=TSIr, s=TSIs)
        df['tsi'] = indicator_TSI.tsi()
    
    if UOchecked:
        indicator_UO = uo(high=df['high'],low=df['low'],close=df['close'],s=sForUO,m=mForUO,len=lenForUO,ws=wsForUO,wm=wmForUO,wl=wlForUO)
        df['UO'] = indicator_UO
    
    if StochChecked:
        indicator_Stoch = stoch(high=df['high'],low=df['low'],close=df['close'],n=nForStoch,d_n=d_nForStoch)
        df['stoch'] = indicator_Stoch
    
    if StochSignalChecked:
        indicator_StochSignal = stoch_signal(high=df['high'],low=df['low'],close=df['close'],n=nForStochSignal,d_n=d_nForStochSignal)
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
        indicator_roc = roc(close=df['close'],n=nForRSI)
        df['roc'] = indicator_roc
    
    df.fillna(0, inplace=True)
    export_df = df.drop(columns=['open', 'high', 'low', 'close', 'volume'])
    print(export_df)
    return (json.dumps(export_df.to_dict('records')))



