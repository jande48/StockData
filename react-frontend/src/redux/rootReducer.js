import { combineReducers } from 'redux'
import chartsReducer from './charts/chartsReducer'
import datesReducer from './dates/datesReducer'
import momentumReducer from './momentum/momentumReducer'
import trendReducer from './trend/trendReducer'
import tickerReducer from './tickers/tickerReducer'
import stockDataReducer from './stockDataRequest/stockDataReducer'
import volatilityReducer from './volatility/volatilityReducer'
import usersReducer from './users/usersReducer'

const rootReducer = combineReducers({
  tickersFromRootReducer: tickerReducer,
  datesFromRootReducer: datesReducer,
  chartsFromRootReducer: chartsReducer,
  momentumFromRootReducer: momentumReducer,
  trendFromRootReducer: trendReducer,
  stockDataFromRootReducer: stockDataReducer,
  volatilityFromtRootReducer: volatilityReducer,
  usersFromRootReducer: usersReducer,

})

export default rootReducer