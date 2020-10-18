  
import { ADD_TICKER } from './tickerTypes'

export const addTicker = (ticker = 'AAPL') => {

  return {
    type: ADD_TICKER,
    payload: ticker
  }
}