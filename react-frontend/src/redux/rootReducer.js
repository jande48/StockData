import { combineReducers } from 'redux'
import chartsReducer from './charts/chartsReducer'
import datesReducer from './dates/datesReducer'
import momentumReducer from './momentum/momentumReducer'
import tickerReducer from './tickers/tickerReducer'
import stockDataReducer from './stockDataRequest/stockDataReducer'

const rootReducer = combineReducers({
  tickersFromRootReducer: tickerReducer,
  datesFromRootReducer: datesReducer,
  chartsFromRootReducer: chartsReducer,
  momentumFromRootReducer: momentumReducer,
  stockDataFromRootReducer: stockDataReducer

})

export default rootReducer