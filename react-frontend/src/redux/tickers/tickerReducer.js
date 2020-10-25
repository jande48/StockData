import { ADD_TICKER, FETCH_COMP_INFO_REQUEST, FETCH_COMP_INFO_SUCCESS, FETCH_COMP_INFO_FAILURE  } from './tickerTypes'

const initialState = {
  tickers: 'AAPL',
  loading: false,
  compInfo: [],
  compLoads: 0,
  query: ''
}

const tickerReducer = (state = initialState, action) => {
  const oldLoads = state.compLoads
  switch (action.type) {
    case ADD_TICKER: return {
      //...state,
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
    default: return state
  }
}

export default tickerReducer