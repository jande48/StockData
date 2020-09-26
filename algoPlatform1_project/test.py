import numpy as py

f = open('NASDAQ.txt','r')
for line in f:
    print(repr(line))