import {
  FETCH_STOCK_DATA_REQUEST,
  FETCH_STOCK_DATA_SUCCESS,
  FETCH_STOCK_DATA_FAILURE,
  REQUEST_API_CALL_INFO
} from './stockDataTypes'

const initialState = {
  loading: false,
  stockData: [],
  error: '',
  apiString: 'AAPL/2020-4-21/2020-10-20'
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
  switch (action.type) {
    case FETCH_STOCK_DATA_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_STOCK_DATA_SUCCESS:
      return {
        loading: false,
        stockData: action.payload,
        error: ''
      }
    case FETCH_STOCK_DATA_FAILURE:
      return {
        loading: false,
        stockData: [],
        error: action.payload
      }
    case REQUEST_API_CALL_INFO:
      return {
        apiString: action.payload
      }
    default: return state
  }
}

export default StockDataReducer