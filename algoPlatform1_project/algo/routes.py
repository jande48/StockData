from flask import Blueprint
from flask import request
import os
import json
import re
from datetime import datetime, timedelta
from threading import Thread
import pandas as pd
from iexfinance.stocks import get_historical_data, Stock
import ta
import time
from ta.momentum import RSIIndicator, TSIIndicator, uo, stoch, \
    stoch_signal, wr, ao, kama, roc
from ta.trend import sma_indicator, ema_indicator, macd, macd_signal, \
    adx, adx_pos, adx_neg, vortex_indicator_pos, vortex_indicator_neg, \
    trix, mass_index, dpo
from ta.volatility import average_true_range, bollinger_mavg, \
    keltner_channel_mband, bollinger_hband, bollinger_lband
from urllib.request import urlopen, Request

# Use environmental variables for the IEX cloud and finanial modeling prep
IEX_secret_api_key = os.environ.get('IEX_CLOUD_SECRET_API_KEY')
IEX_api_key = os.environ.get('IEX_CLOUD_API_KEY')
Stock_Ticker_Lookup_key = os.environ.get('StockTickerCompanyNameAPIkey')

algo = Blueprint('algo', __name__)

# get stock data GET api to retrieve stock data based on a stock ticker
@algo.route("/get_stock_data/<ticker>/<startDate>/<endDate>", methods=['GET'])
def get_stock_data(ticker, startDate, endDate):

    # Managing the date format has been a challenge due to sending Javascript
    # and Python date objects via JSON I've chosen to send dates as MM-DD-YYY
    # string and then create date objects in python on the backend and JS
    # on the frontend
    startDateForAPItemp = startDate.split('-')
    startDateForAPI = datetime(int(startDateForAPItemp[0]),
                               int(startDateForAPItemp[1]),
                               int(startDateForAPItemp[2])) - timedelta(days=90)

    # the API call prefers to choose a date that aligns with a stock market
    # trading period (i.e. M-F), therefore Saturday and Sundays are changed
    # to the previous Friday
    if startDateForAPI.weekday() == 5:
        startDateForAPI += timedelta(days=2)
    elif startDateForAPI.weekday() == 6:
        startDateForAPI += timedelta(days=1)

    # The same logic applies to the end date.
    endDateForAPItemp = endDate.split('-')
    endDateForAPI = datetime(int(endDateForAPItemp[0]),
                             int(endDateForAPItemp[1]),
                             int(endDateForAPItemp[2]))

    currentTime = datetime.utcnow()
    if str(currentTime.date()) == str(endDateForAPI.date()):
        endDateForAPI -= timedelta(days=1)

    if endDateForAPI.weekday() == 5:
        endDateForAPI -= timedelta(days=1)
    elif endDateForAPI.weekday() == 6:
        endDateForAPI -= timedelta(days=2)

    # the data returned by IEXcloud api is nested where the outer dictionary has nested dictionary based on date
    # This flatten_json function creates a signal dictionary where date is a key/value pair along with the corresponding stock data
    # This flattened format is better for providing a flattened array to D3.js
    def flatten_json(stockData):
        out = []
        for i in stockData:
            out2 = {}
            out2['date'] = i
            for j in stockData[i]:
                out2[j] = stockData[i][j]
            out.append(out2)
        return out

    # make the API to IEXcloud, using Addison Lynch's IEXfinance python package
    historicalData = get_historical_data(ticker, start=startDateForAPI.date(),
                                         end=endDateForAPI.date(), token=IEX_api_key)
    Historical_Data = flatten_json(historicalData)

    # using pandas for clean data manipulation using dataframes
    df = pd.DataFrame(Historical_Data)
    df = ta.utils.dropna(df)

    # we add the RSI indicator, regardless, to show on the initial charts
    indicator_RSI = RSIIndicator(close=df["close"], n=10)
    df['rsi'] = indicator_RSI.rsi()
    df = ta.utils.dropna(df)
    return (json.dumps(df.to_dict('records')))


# The get_ticker_company_name api is designing for user-chosen search bar. It used multi-threading because
# financialmodelingprep requires api calls based on equites, mutual funds, indices, ect. and therefore,
# these apis calls are perform asynchoronous (synchonous calls takes about 10 secs which would be unacceptable for most users)
# Then this function uses RegEx to search and find the closest match to the user-input
@algo.route("/get_ticker_company_name/<user_input>", methods=['GET'])
def get_ticker_company_name(user_input):

    # process a single ID
    def process_id(id):
        url = Request("https://financialmodelingprep.com/api/v3/search?query=" +
                      user_input+"&limit=5&exchange="+id+"&apikey="+Stock_Ticker_Lookup_key)
        response = urlopen(url, data=None, timeout=0.5)
        data = response.read().decode("utf-8")
        return data

    # process a number of ids, storing the results in a dict
    def process_range(id_range, store=None):
        if store is None:
            store = {}
        for id in id_range:
            store[id] = json.loads(process_id(id))
        return store

    # process the id range in a specified number of threads
    def threaded_process_range(nthreads, id_range):
        store = {}
        threads = []
        # create the threads
        for i in range(nthreads):
            ids = id_range[i::nthreads]
            t = Thread(target=process_range, args=(ids, store))
            threads.append(t)

        # start the threads
        [t.start() for t in threads]
        # wait for the threads to finish
        [t.join() for t in threads]
        return store

    # These are the list of separate api calls classified by Financial Modeling Prep
    threaded_results = threaded_process_range(
        6, ['NASDAQ', 'NYSE', 'AMEX', 'INDEX', 'MUTUAL_FUND', 'ETF'])

    trigger = 0
    while trigger < 8 and len(threaded_results) == 0:
        time.sleep(0.1)
        trigger += 1

    if len(threaded_results) == 0:
        threaded_results = threaded_process_range(
            6, ['NASDAQ', 'NYSE', 'AMEX', 'INDEX', 'MUTUAL_FUND', 'ETF'])

    # Based on the results of the API calls create a flatten array based on matches with RegEx
    out = []

    dataset = []
    ids = ['NASDAQ', 'NYSE', 'AMEX', 'INDEX', 'MUTUAL_FUND', 'ETF']
    for i in range(len(ids)):
        if ids[i] in threaded_results:
            dataset.append(threaded_results[ids[i]])

    # if the user includes a space, it is replaced with an underscore, which is how Financial Modeling Prep addresses spaces
    user_input_matching = user_input.replace("_", "")

    for i in range(len(dataset)):
        for j in range(len(dataset[i])):

            if dataset[i][j]['name'] is not None:
                # compare upper case company name API results with user-input
                noSpacesAPI = re.sub(r'\W+', '', dataset[i][j]['name'])
                noSpacesAPI2 = noSpacesAPI.upper()
            try:
                noSpacesAPI2.index(user_input_matching.upper())
            except ValueError:
                print("Not found!")
            else:
                dataset[i][j]['startingStrIndex'] = noSpacesAPI2.index(
                    user_input_matching.upper())
                out.append(dataset[i][j])

            if dataset[i][j]['symbol'] is not None:
                # compare upper case ticker API results with user-input, because this allows the user to
                # enter either a company name or a ticker
                noSpacesAPIsym = re.sub(r'\W+', '', dataset[i][j]['symbol'])
                noSpacesAPIsym2 = noSpacesAPIsym.upper()
            try:
                noSpacesAPIsym2.index(user_input_matching.upper())
            except ValueError:
                print("Not found!")
            else:
                dataset[i][j]['startingStrIndex'] = noSpacesAPIsym2.index(
                    user_input_matching.upper())
                out.append(dataset[i][j])

    out.sort(key=lambda out: out['startingStrIndex'])
    return json.dumps(out)

# Once the ticker is chosen, company info is populated via a IEX cloud api call


@algo.route("/get_company_name_from_ticker/<ticker>", methods=['GET'])
def get_company_name_from_ticker(ticker):
    stock = Stock(ticker, token=IEX_api_key)
    company = stock.get_company()
    return company['companyName']

# The table of most relevant financial data (i.e. dividen, CEO) is called based on ticker. Some indicators are fetched from
# Financial Modeling Prep and some are retrieved from IEX cloud. These are combined into a single object


@algo.route("/get_financial_data/<ticker>", methods=['GET'])
def get_fianancial_data(ticker):

    # get financial data from IEX cloud
    stock = Stock(ticker, token=IEX_api_key)
    financials = stock.get_financials()
    companyIEX = stock.get_company()

    # get financial data from Financial Modeling Prep and append it to the IEX result
    url = Request("https://financialmodelingprep.com/api/v3/profile/" +
                  ticker+"?apikey="+Stock_Ticker_Lookup_key)
    response = urlopen(url, data=None, timeout=2)
    companyFinModPrep = json.loads(response.read().decode("utf-8"))
    financials.append(companyIEX)
    financials.append(companyFinModPrep[0])

    return (json.dumps(financials))

# API to get company quarterly earning over the past four quarters from Financial Modeling Prep, using urllib python package


@algo.route("/get_earnings_data/<ticker>", methods=['GET'])
def get_earnings_data(ticker):

    url = Request("https://financialmodelingprep.com/api/v3/earnings-surpises/" +
                  ticker+"?apikey="+Stock_Ticker_Lookup_key)
    response = urlopen(url, data=None, timeout=2)
    companyFinModPrep = json.loads(response.read().decode("utf-8"))
    earnings = []
    i = 0
    for x in companyFinModPrep:
        if i < 4:
            earnings.append({'fiscalPeriod': companyFinModPrep[i]['date'], 'consensusEPS': companyFinModPrep[i]
                             ['estimatedEarning'], 'actualEPS': companyFinModPrep[i]['actualEarningResult']})
            i += 1
    return(json.dumps(earnings))

# recieve JSON data from the frontend and if an indicator is checked, then calculate this indicator
# and create a resulting JSON to then graph


@algo.route("/calculate_Volatility_Indicators/", methods=['GET', 'POST'])
def calculate_Volitality_Indicators():
    JSON_sent = request.get_json()
    df = pd.DataFrame(JSON_sent[0])

    _, atr, bbsma, bbupper, bblower, keltnerC = JSON_sent

    # Average True Range
    if atr['displayATR']:
        indicator_ATR = average_true_range(
            high=df['high'], low=df['low'], close=df['close'], n=atr['nForATR'])
        df['atr'] = indicator_ATR

    # # Bollinger Band SMA
    if bbsma['displayBBSMA']:
        indicator_BBSMA = bollinger_mavg(close=df['close'], n=bbsma['nForBBSMA'])
        df['bbsma'] = indicator_BBSMA

    # # Bollinger Band Upper
    if bbupper['displayBBUpper']:
        indicator_BBUpper = bollinger_hband(
            close=df['close'], n=bbupper['nForBBUpper'], ndev=bbupper['ndevBBUpper'])
        df['BBupper'] = indicator_BBUpper
    
    # # Bollinger Band Lower
    if bblower['displayBBLower']:
        indicator_BBLower = bollinger_lband(
            close=df['close'], n=bblower['nForBBLower'], ndev=bblower['ndevBBLower'])
        df['BBlower'] = indicator_BBLower

    # # Keltner Channel Central
    if keltnerC['displayKeltnerC']:
        indicator_keltnerC = keltner_channel_mband(
            high=df['high'], low=df['low'], close=df['close'], n=keltnerC['nForKeltnerC'])
        df['keltnerC'] = indicator_keltnerC

    df.fillna(0, inplace=True)

    return (json.dumps(df.to_dict('records')))

# recieve JSON data from the frontend and if an indicator is checked, then calculate this indicator
# and create a resulting JSON to then graph


@algo.route("/calculate_Trend_Indicators/", methods=['GET', 'POST'])
def calculate_Trend_Indicators():
    JSON_sent = request.get_json()
    if len(JSON_sent[0]) > 0:
        df = pd.DataFrame(JSON_sent[0])

        _, sma, ema, macdDict, macdSignal, adxDict, adxPos, adxNeg, VIpos, VIneg, trixDict, mi, dpoDict = JSON_sent

        if sma['displaySMA']:
            indicator_sma = sma_indicator(close=df['close'], n=sma['nForSMA'])
            df['sma'] = indicator_sma

        if ema['displayEMA']:
            indicator_ema = ema_indicator(close=df['close'], n=ema['nForEMA'])
            df['ema'] = indicator_ema

        if macdDict['displayMACD']:
            indicator_macd = macd(
                close=df['close'], n_slow=macdDict['nSlowForMACD'], n_fast=macdDict['nFastForMACD'])
            df['macd'] = indicator_macd

        if macdSignal['displayMACDsignal']:
            indicator_macdSignal = macd_signal(
                close=df['close'], n_slow=macdSignal['nSlowForMACDsignal'], 
                n_fast=macdSignal['nFastForMACDsignal'], n_sign=macdSignal['nSignForMACDsignal'])
            df['macds'] = indicator_macdSignal

        if adxDict['displayADX']:
            indicator_ADX = adx(
                high=df['high'], low=df['low'], close=df['close'],
                n=adxDict['nForADX'])
            df['adx'] = indicator_ADX

        if adxPos['displayADXP']:
            indicator_ADXpositive = adx_pos(
                high=df['high'], low=df['low'], close=df['close'],
                n=adxPos['nForADXP'])
            df['adxp'] = indicator_ADXpositive

        if adxNeg['displayADXN']:
            indicator_ADXnegative = adx_neg(
                high=df['high'], low=df['low'], close=df['close'], 
                n=adxNeg['nForADXN'])
            df['adxn'] = indicator_ADXnegative

        if VIpos['displayVIPOS']:
            indicator_VIpositive = vortex_indicator_pos(
                high=df['high'], low=df['low'], close=df['close'], 
                n=VIpos['nForVIPOS'])
            df['vipos'] = indicator_VIpositive

        if VIneg['displayVINEG']:
            indicator_VInegative = vortex_indicator_neg(
                high=df['high'], low=df['low'], close=df['close'], n=VIneg['nForVINEG'])
            df['vineg'] = indicator_VInegative

        
        if trixDict['displayTRIX']:
            indicator_TRIX = trix(close=df['close'], n=trixDict['nForTRIX'])
            df['trix'] = indicator_TRIX

        if mi['displayMI']:
            indicator_MassIndex = mass_index(
                high=df['high'], low=df['low'], n=mi['nForMI'], n2=mi['n2ForMI'])
            df['mi'] = indicator_MassIndex

        if dpoDict['displayDPO']:
            indicator_dpo = dpo(close=df['close'], n=dpoDict['nForDPO'])
            df['dpo'] = indicator_dpo

        df.fillna(0, inplace=True)

        return (json.dumps(df.to_dict('records')))
    else:
        df = pd.DataFrame([])
        return (json.dumps(df.to_dict('records')))

# recieve JSON data from the frontend and if an indicator is checked, then calculate this indicator
# and create a resulting JSON to then graph


@algo.route("/calculate_Momentum_Indicators/", methods=['GET', 'POST'])
def calculate_Momentum_Indicators():

    JSON_sent = request.get_json()
    df = pd.DataFrame(JSON_sent[0])

    _, RSI, TSI, UO, STOCH, STOCH_SIGNAL, WR, AO, KAMA, ROC = JSON_sent
    
    indicator_RSI = RSIIndicator(close=df["close"], n=RSI['N'])
    df['rsi'] = indicator_RSI.rsi()

    if TSI['displayTSI']:
        indicator_TSI = TSIIndicator(close=df["close"], r=TSI['rTSI'], s=TSI['sTSI'])
        df['tsi'] = indicator_TSI.tsi()

    if UO['displayUO']:
        indicator_UO = uo(high=df['high'], low=df['low'], close=df['close'],
                          s=UO['sForUO'], m=UO['mForUO'], len=UO['lenForUO'], ws=UO['wsForUO'], wm=UO['wmForUO'], wl=UO['wlForUO'])
        df['uo'] = indicator_UO

    if STOCH['displaySTOCH']:
        indicator_Stoch = stoch(
            high=df['high'], low=df['low'], close=df['close'], n=STOCH['nForSTOCH'], d_n=STOCH['dnForSTOCH'])
        df['stoch'] = indicator_Stoch


    if STOCH_SIGNAL['displayStochSignal']:
        indicator_StochSignal = stoch_signal(
            high=df['high'], low=df['low'], close=df['close'], n=STOCH_SIGNAL['nForStochSignal'], d_n=STOCH_SIGNAL['dnForStochSignal'])
        df['stoch_signal'] = indicator_StochSignal

    if WR['displayWR']:
        indicator_wr = wr(high=df['high'], low=df['low'],
                          close=df['close'], lbp=WR['lbpForWR'])
        df['wr'] = indicator_wr

    if AO['displayAO']:
        indicator_ao = ao(
            high=df['high'], low=df['low'], s=AO['sForAO'], len=AO['lenForAO'])
        df['ao'] = indicator_ao

    if KAMA['displayKama']:
        indicator_kama = kama(
            close=df['close'], n=KAMA['nForKama'], pow1=KAMA['pow1ForKama'], pow2=KAMA['pow2ForKama'])
        df['kama'] = indicator_kama

    if ROC['displayROC']:
        indicator_roc = roc(close=df['close'], n=ROC['nForROC'])
        df['roc'] = indicator_roc

    df.fillna(0, inplace=True)
    export_df = df.drop(columns=['open', 'high', 'low', 'close', 'volume'])
    return (json.dumps(export_df.to_dict('records')))
