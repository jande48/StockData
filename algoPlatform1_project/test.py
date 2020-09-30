# import numpy as py

# f = open('NASDAQ.txt','r')
# for line in f:
#     print(repr(line))

from algoPlatform1_project import db
from algoPlatform1_project.models import OHLC_JSONdata

myData = OHLC_JSONdata.query.all()

print(myData)

# def addition(n): 
#     return n + n 
  
# # We double all numbers using map() 
# numbers = [1, 2, 3, 4] 
# result = map(addition, numbers) 
# print(list(result)) 