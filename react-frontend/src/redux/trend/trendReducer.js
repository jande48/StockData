//import { nForRSI } from './momentumActions'
import { DISPLAY_SMA, N_FOR_SMA, DISPLAY_EMA, N_FOR_EMA, DISPLAY_MACD, N_SLOW_FOR_MACD, N_FAST_FOR_MACD, FETCH_TREND_DATA_REQUEST,
  DISPLAY_MACD_SIGNAL, N_FAST_FOR_MACD_SIGNAL, N_SLOW_FOR_MACD_SIGNAL, N_SIGN_FOR_MACD_SIGNAL, DISPLAY_ADX, N_FOR_ADX,
  DISPLAY_ADXP, N_FOR_ADXP, DISPLAY_ADXN, N_FOR_ADXN, DISPLAY_VIPOS, N_FOR_VIPOS, DISPLAY_VINEG, N_FOR_VINEG, DISPLAY_TRIX, N_FOR_TRIX,
  DISPLAY_MI, N_FOR_MI, N2_FOR_MI, DISPLAY_DPO, N_FOR_DPO,  FETCH_TREND_DATA_SUCCESS,
  FETCH_TREND_DATA_FAILURE} from './trendTypes'

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
  displayADXN: false,
  nForADXN: 14,
  displayVIPOS: false,
  nForVIPOS: 14,
  displayVINEG: false,
  nForVINEG: 14,
  displayTRIX: false,
  nForTRIX: 15,
  displayMI: false,
  nForMI: 9,
  n2ForMI: 25,
  displayDPO: false,
  nForDPO: 20,
  trendLoads: 0,
  trendLoading: false,
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
    case DISPLAY_ADXN: return {
      ...state,
      displayADXN: action.payload
    }
    case N_FOR_ADXN: return {
      ...state,
      nForADXN: action.payload
    }
    case DISPLAY_VIPOS: return {
      ...state,
      displayVIPOS: action.payload
    }
    case N_FOR_VIPOS: return {
      ...state,
      nForVIPOS: action.payload
    }
    case DISPLAY_VINEG: return {
      ...state,
      displayVINEG: action.payload
    }
    case N_FOR_VINEG: return {
      ...state,
      nForVINEG: action.payload
    }
    case DISPLAY_TRIX: return {
      ...state,
      displayTRIX: action.payload
    }
    case N_FOR_TRIX: return {
      ...state,
      nForTRIX: action.payload
    }
    case DISPLAY_MI: return {
      ...state,
      displayMI: action.payload
    }
    case N_FOR_MI: return {
      ...state,
      nForMI: action.payload
    }
    case N2_FOR_MI: return {
      ...state,
      n2ForMI: action.payload
    }
    case DISPLAY_DPO: return {
      ...state,
      displayDPO: action.payload
    }
    case N_FOR_DPO: return {
      ...state,
      nForDPO: action.payload
    }
    case FETCH_TREND_DATA_REQUEST:
      return {
        ...state,
        trendLoading: true
      }
    case FETCH_TREND_DATA_SUCCESS:
      return {
        ...state,
        trendLoading: false,
        trendData: action.payload,
        error: '',
        trendLoads: (oldLoads+1)
      }
    case FETCH_TREND_DATA_FAILURE:
      return {
        ...state,
        trendLoading: false,
        trendData: [],
        error: action.payload
      }
    default: return state
  }
}

export default trendReducer