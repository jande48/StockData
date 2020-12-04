export { addTicker, fetchCompInfoData, fetchCompInfoDataRequest, fetchCompanyNameFromTicker, addCompanyName, addPercentChange,addStockPriceForPercentChange, 
    addEndDateForPercentChange, addSplicedStartDate, addSplicedIndexStockData, addUserAuthenticated } from './tickers/tickerActions'
export { addStartDate, addEndDate } from './dates/datesActions'
export { addLineChart } from './charts/chartsActions'
export { fetchMomentumData, displayRSI, nForRSI, displayTSI, rForTSI, sForTSI, sForUO, mForUO, lenForUO, wsForUO, wmForUO, wlForUO, displayUO, displaySTOCH, nForSTOCH, dnForSTOCH, 
    displayStochSignal, nForStochSignal, dnForStochSignal, displayWR, lbpForWR, displayAO, sForAO, lenForAO, displayKama, nForKama, pow1ForKama, pow2ForKama, displayROC, nForROC } from './momentum/momentumActions'
export { fetchTrendData,  displaySMA, nForSMA, displayEMA, nForEMA, displayMACD, nFastForMACD, nSlowForMACD, displayMACDsignal, nSignForMACDsignal ,nFastForMACDsignal, nSlowForMACDsignal,
    displayADX, nForADX, displayADXP, nForADXP, displayADXN, nForADXN, displayVIPOS, nForVIPOS, displayVINEG, nForVINEG,
    displayTRIX, nForTRIX, displayMI, nForMI, n2ForMI, displayDPO, nForDPO, } from './trend/trendActions'
export {fetchStockData, fetchFinancialsData, fetchEarningsData} from './stockDataRequest/stockDataActions'
export {displayATR,nForATR,displayBBSMA,nForBBSMA,displayBBUpper,nForBBUpper,ndevBBUpper,displayBBLower,nForBBLower,ndevBBLower,displayKeltnerC,nForKeltnerC, fetchVolatilityData} from './volatility/volatilityActions'
export {fetchUserAuth, createNewPost} from './users/usersActions'