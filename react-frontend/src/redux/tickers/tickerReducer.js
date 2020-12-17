import { ADD_TICKER, FETCH_COMP_INFO_REQUEST, FETCH_COMP_INFO_SUCCESS,
   FETCH_COMP_INFO_FAILURE, COMPANY_NAME, ADD_PERCENT_CHANGE, STOCK_PRICE_FOR_PERCENT_CHANGE,
   END_DATE_FOR_PERCENT_CHANGE, SPLICED_START_DATE, SPLICED_INDEX_STOCK_DATA, USER_AUTHENTICATED,
   ON_MOUSE_OVER_TICKER, DATE_MOUSE_OVER_TICKER } from './tickerTypes'

const initialState = {
  tickers: 'AAPL',
  loading: false,
  compInfo: [],
  compLoads: 0,
  query: '',
  name: 'Apple, Inc',
  percentChange: 0,
  stockPriceForPercentChange: 0,
  endDateForPercentChange: (new Date()),
  splicedStartDate: (new Date()),
  splicedIndexStockData: 0,
  userAuthenticated: false,
  onMouseOverTicker: false,
  dateMouseOverTicker: '',
}

const tickerReducer = (state = initialState, action) => {
  const oldLoads = state.compLoads
  switch (action.type) {
    case ADD_TICKER: return {
      ...state,
      tickers: action.payload
    }
    case FETCH_COMP_INFO_REQUEST:
      return {
        ...state,
        loading: true,
        query: action.payload
      }
    case FETCH_COMP_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        compInfo: action.payload,
        error: '',
        compLoads: (oldLoads+1)
      }
    case FETCH_COMP_INFO_FAILURE:
      return {
        ...state,
        loading: false,
        comp_info: [],
        error: action.payload
      }
    case COMPANY_NAME:
      return {
        ...state,
        name: action.payload
      }
    case ADD_PERCENT_CHANGE:
      return {
        ...state,
        percentChange: action.payload
      }
    case STOCK_PRICE_FOR_PERCENT_CHANGE:
      return {
        ...state,
        stockPriceForPercentChange: action.payload
      }

    case END_DATE_FOR_PERCENT_CHANGE: return {
        ...state,
        endDateForPercentChange: action.payload
      }
    case SPLICED_START_DATE: return {
        ...state,
        splicedStartDate: action.payload
      }
    case SPLICED_INDEX_STOCK_DATA: return {
        ...state,
        splicedIndexStockData: action.payload
      }
    case USER_AUTHENTICATED: return {
        ...state,
        userAuthenticated: action.payload
      }  
    case ON_MOUSE_OVER_TICKER: return {
        ...state,
        onMouseOverTicker: action.payload
      }  
    case DATE_MOUSE_OVER_TICKER: return {
        ...state,
        dateMouseOverTicker: action.payload
      }  
    default: return state
  }
}

export default tickerReducer