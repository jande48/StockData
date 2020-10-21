import { nForRSI } from './momentumActions'
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI, S_FOR_TSI,
  FETCH_MOMENTUM_DATA_REQUEST,
  FETCH_MOMENTUM_DATA_SUCCESS,
  FETCH_MOMENTUM_DATA_FAILURE } from './momentumTypes'

const initialState = {
  displayRSI: true,
  nForRSI: 10,
  displayTSI: false,
  rForTSI: 25,
  sForTSI: 13,
  momentumLoads: 0 
}

const momentumReducer = (state = initialState, action) => {
  const oldLoads = state.momentumLoads
  switch (action.type) {
    case DISPLAY_RSI: return {
      ...state,
      displayRSI: action.payload
    }
    case N_FOR_RSI: return {
      ...state,
      nForRSI: action.payload
    }
    case DISPLAY_TSI: return {
      ...state,
      displayTSI: action.payload
    }
    case R_FOR_TSI: return {
      ...state,
      rForTSI: action.payload
    }
    case S_FOR_TSI: return {
      ...state,
      sForTSI: action.payload
    }
    case FETCH_MOMENTUM_DATA_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_MOMENTUM_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        momentumData: action.payload,
        error: '',
        momentumLoads: (oldLoads+1)
      }
    case FETCH_MOMENTUM_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        momentumData: [],
        error: action.payload
      }
    default: return state
  }
}

export default momentumReducer