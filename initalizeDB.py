
from datetime import datetime, timedelta
from algoPlatform1_project.models import User, Post, Watchlist, sp_OHLC_data, sp500List
from algoPlatform1_project import app, db

kwargs = {'date':str(datetime(2020,10,30).date())}
queriedData = sp_OHLC_data.query.filter_by(date=str(datetime(2020,10,30).date())).first()
ticker = 'AAPL'
# #print(str(datetime(2018,10,30).date()))
#print(type(getattr(queriedData,ticker)))

# if queriedData.AAPL == None:
#     print('this works')
index = 1
initialDate = datetime(2013,1,1)
for i in range(365*14):
    newDate = initialDate+timedelta(days=i)
    if newDate.weekday() < 5:
        dataRow = sp_OHLC_data.query.filter_by(id=int(index)).first()
        setattr(dataRow,'date',str(newDate.date()))
        index +=1
        #addedData = sp_OHLC_data(date=(str(newDate.date())))
        #db.session.add(addedData)
    #     # addedDatahigh = OHLC(date=(str(newDate.date())))
    #     # db.session.add(addedDatahigh)
    #     # addedDatalow = OHLC_low(date=(str(newDate.date())))
    #     # db.session.add(addedDatalow)
    #     # addedDataclose = OHLC_close(date=(str(newDate.date())))
    #     # db.session.add(addedDataclose)
    #     # addedDatavol = OHLC_volume(date=(str(newDate.date())))
    #     # db.session.add(addedDatavol)
        db.session.commit()


# oldDate = datetime(2020,9,30)
# newDate = oldDate + timedelta(days=1)
# print(newDate.date())