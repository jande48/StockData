import { combineReducers } from 'redux'
import chartsReducer from './charts/chartsReducer'
import datesReducer from './dates/datesReducer'
import momentumReducer from './momentum/momentumReducer'
import trendReducer from './trend/trendReducer'
import tickerReducer from './tickers/tickerReducer'
import stockDataReducer from './stockDataRequest/stockDataReducer'

const rootReducer = combineReducers({
  tickersFromRootReducer: tickerReducer,
  datesFromRootReducer: datesReducer,
  chartsFromRootReducer: chartsReducer,
  momentumFromRootReducer: momentumReducer,
  trendFromRootReducer: trendReducer,
  stockDataFromRootReducer: stockDataReducer

})

export default rootReducer