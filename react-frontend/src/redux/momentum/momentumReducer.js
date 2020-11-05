import { nForRSI } from './momentumActions'
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI, S_FOR_TSI, S_FOR_UO, M_FOR_UO, LEN_FOR_UO, WS_FOR_UO, WM_FOR_UO, WL_FOR_UO, DISPLAY_UO,
  DISPLAY_STOCH, N_FOR_STOCH, D_N_FOR_STOCH, DISPLAY_STOCH_SIGNAL, N_FOR_STOCH_SIGNAL, D_N_FOR_STOCH_SIGNAL, DISPLAY_WR, LBP_FOR_WR,
  DISPLAY_AO, S_FOR_AO, LEN_FOR_AO,
  FETCH_MOMENTUM_DATA_REQUEST,
  FETCH_MOMENTUM_DATA_SUCCESS,
  FETCH_MOMENTUM_DATA_FAILURE, 
  } from './momentumTypes'

const initialState = {
  displayRSI: true,
  nForRSI: 10,
  displayTSI: false,
  rForTSI: 25,
  sForTSI: 13,
  displayUO: false,
  sForUO: 7,
  mForUO: 14,
  lenForUO: 28,
  wsForUO: 4,
  wmForUO: 2,
  wlForUO: 1,
  displaySTOCH: false,
  nForSTOCH: 14,
  dnForSTOCH: 3,
  displayStochSignal: false,
  nForStochSignal: 14,
  dnForStochSignal: 3,
  displayWR: false,
  lbpForWR: 14,
  displayAO: false,
  sForAO: 5,
  lenForAO: 34,
  momentumLoads: 0,
  loading: false
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
    case S_FOR_UO: return {
      ...state,
      sForUO: action.payload
    }
    case M_FOR_UO: return {
      ...state,
      mForUO: action.payload
    }
    case LEN_FOR_UO: return {
      ...state,
      lenForUO: action.payload
    }
    case WS_FOR_UO: return {
      ...state,
      wsForUO: action.payload
    }
    case WM_FOR_UO: return {
      ...state,
      wmForUO: action.payload
    }
    case WL_FOR_UO: return {
      ...state,
      wlForUO: action.payload
    }
    case DISPLAY_UO: return {
      ...state,
      displayUO: action.payload
    }
    case DISPLAY_STOCH: return {
      ...state,
      displaySTOCH: action.payload
    }
    case N_FOR_STOCH: return {
      ...state,
      nForSTOCH: action.payload
    }
    case D_N_FOR_STOCH: return {
      ...state,
      dnForSTOCH: action.payload
    }
    case DISPLAY_STOCH_SIGNAL: return {
      ...state,
      displayStochSignal: action.payload
    }
    case N_FOR_STOCH_SIGNAL: return {
      ...state,
      nForStochSignal: action.payload
    }
    case D_N_FOR_STOCH_SIGNAL: return {
      ...state,
      dnForStochSignal: action.payload
    }
    case DISPLAY_WR: return {
      ...state,
      displayWR: action.payload
    }
    case LBP_FOR_WR: return {
      ...state,
      lbpForWR: action.payload
    }
    case DISPLAY_AO: return {
      ...state,
      displayAO: action.payload
    }
    case S_FOR_AO: return {
      ...state,
      sForAO: action.payload
    }
    case LEN_FOR_AO: return {
      ...state,
      lenForAO: action.payload
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