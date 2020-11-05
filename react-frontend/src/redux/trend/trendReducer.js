//import { nForRSI } from './momentumActions'
import { DISPLAY_SMA, N_FOR_SMA, DISPLAY_EMA, N_FOR_EMA, DISPLAY_MACD, N_SLOW_FOR_MACD, N_FAST_FOR_MACD, FETCH_TREND_DATA_REQUEST,
  DISPLAY_MACD_SIGNAL, N_FAST_FOR_MACD_SIGNAL, N_SLOW_FOR_MACD_SIGNAL, N_SIGN_FOR_MACD_SIGNAL, DISPLAY_ADX, N_FOR_ADX,
  DISPLAY_ADXP, N_FOR_ADXP,
  FETCH_TREND_DATA_SUCCESS,
  FETCH_TREND_DATA_FAILURE } from './trendTypes'

const initialState = {
  displaySMA: false,
  nForSMA: 20,
  displayEMA: false,
  nForEMA: 20,
  displayMACD: false,
  nFastForMACD: 26,
  nSlowForMACD: 12,
  displayMACDsignal: false,
  nFastForMACDsignal: 12,
  nSlowForMACDsignal: 26,
  nSignForMACDsignal: 9,
  displayADX: false,
  nForADX: 14,
  displayADXP: false,
  nForADXP: 14,
  trendLoads: 0,
  trendData: []
}

const trendReducer = (state = initialState, action) => {
  const oldLoads = state.trendLoads
  switch (action.type) {
    case DISPLAY_SMA: return {
      ...state,
      displaySMA: action.payload
    }
    case N_FOR_SMA: return {
      ...state,
      nForSMA: action.payload
    }
    case DISPLAY_EMA: return {
      ...state,
      displayEMA: action.payload
    }
    case N_FOR_EMA: return {
      ...state,
      nForEMA: action.payload
    }
    case DISPLAY_MACD: return {
      ...state,
      displayMACD: action.payload
    }
    case N_FAST_FOR_MACD: return {
      ...state,
      nFastForMACD: action.payload
    }
    case N_SLOW_FOR_MACD: return {
      ...state,
      nSlowForMACD: action.payload
    }
    case DISPLAY_MACD_SIGNAL: return {
      ...state,
      displayMACDsignal: action.payload
    }
    case N_FAST_FOR_MACD_SIGNAL: return {
      ...state,
      nFastForMACDsignal: action.payload
    }
    case N_SLOW_FOR_MACD_SIGNAL: return {
      ...state,
      nSlowForMACDsignal: action.payload
    }
    case N_SIGN_FOR_MACD_SIGNAL: return {
      ...state,
      nSignForMACDsignal: action.payload
    }
    case DISPLAY_ADX: return {
      ...state,
      displayADX: action.payload
    }
    case N_FOR_ADX: return {
      ...state,
      nForADX: action.payload
    }
    case DISPLAY_ADXP: return {
      ...state,
      displayADXP: action.payload
    }
    case N_FOR_ADXP: return {
      ...state,
      nForADXP: action.payload
    }
    case FETCH_TREND_DATA_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_TREND_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        trendData: action.payload,
        error: '',
        trendLoads: (oldLoads+1)
      }
    case FETCH_TREND_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        trendData: [],
        error: action.payload
      }
    default: return state
  }
}

export default trendReducer