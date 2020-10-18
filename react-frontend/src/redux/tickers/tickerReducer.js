import { ADD_TICKER } from './tickerTypes'

const initialState = {
  tickers: 'AAPL'
}

const tickerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TICKER: return {
      ...state,
      tickers: action.payload
    }

    default: return state
  }
}

export default tickerReducer