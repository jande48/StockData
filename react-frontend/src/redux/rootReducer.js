import { combineReducers } from 'redux'
import chartsReducer from './charts/chartsReducer'
import datesReducer from './dates/datesReducer'
import tickerReducer from './tickers/tickerReducer'


const rootReducer = combineReducers({
  tickersFromRootReducer: tickerReducer,
  datesFromRootReducer: datesReducer,
  chartsFromRootReducer: chartsReducer

})

export default rootReducer