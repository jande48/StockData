import {
  FETCH_STOCK_DATA_REQUEST,
  FETCH_STOCK_DATA_SUCCESS,
  FETCH_STOCK_DATA_FAILURE,
  REQUEST_API_CALL_INFO,
  FETCH_FINANCIALS_DATA_REQUEST,
  FETCH_FINANCIALS_DATA_SUCCESS,
  FETCH_FINANCIALS_DATA_FAILURE,
} from './stockDataTypes'

const initialState = {
  loading: false,
  stockData: [],
  error: '',
  financialsLoading: false,
  financialsData: [],
  financialsError: '',
  apiString: 'AAPL/2020-4-21/2020-10-20',
  loads: 0
}

// function selectedAPIstring(state = 'AAPL/2020-4-21/2020-10-20', action) {
//   switch (action.type) {
//     case SELECT_API_STRING:
//       return action.apiString
//     default:
//       return state
//   }
// }

const StockDataReducer = (state = initialState, action) => {
  const oldLoads = state.loads
  switch (action.type) {
    
    case FETCH_STOCK_DATA_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_STOCK_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        stockData: action.payload,
        error: '',
        loads: (oldLoads+1)
      }
    case FETCH_STOCK_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        stockData: [],
        error: action.payload
      }
    case FETCH_FINANCIALS_DATA_REQUEST:
      return {
        ...state,
        financialsLoading: true
      }
    case FETCH_FINANCIALS_DATA_SUCCESS:
      return {
        ...state,
        financialsLoading: false,
        financialsData: action.payload,
        financialsError: '',
        financialsLoads: (oldLoads+1)
      }
    case FETCH_FINANCIALS_DATA_FAILURE:
      return {
        ...state,
        financialsLoading: false,
        financialsData: [],
        financialsError: action.payload
      }
    case REQUEST_API_CALL_INFO:
      return {
        ...state,
        apiString: action.payload
      }
    default: return state
  }
}

export default StockDataReducer