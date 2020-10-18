import { combineReducers } from 'redux'
import datesReducer from './dates/datesReducer'
import tickerReducer from './tickers/tickerReducer'


const rootReducer = combineReducers({
  tickersFromRootReducer: tickerReducer,
  datesFromRootReducer: datesReducer

})

export default rootReducer