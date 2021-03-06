import { DISPLAY_ATR, N_FOR_ATR, DISPLAY_BBSMA, N_FOR_BBSMA, DISPLAY_BBUPPER, N_FOR_BBUPPER, NDEV_FOR_BBUPPER,
  DISPLAY_BBLOWER,N_FOR_BBLOWER,NDEV_FOR_BBLOWER,DISPLAY_KELTNERC,N_FOR_KLETNERC,
  FETCH_VOLATILITY_DATA_REQUEST,
  FETCH_VOLATILITY_DATA_SUCCESS,
  FETCH_VOLATILITY_DATA_FAILURE } from './volatilityTypes'

const initialState = {
  displayATR: false,
  nForATR: 14,
  displayBBSMA: false,
  nForBBSMA: 20,
  displayBBUpper: false,
  nForBBUpper: 20,
  ndevForBBUpper: 2,
  displayBBLower: false,
  nForBBLower: 20,
  ndevForBBLower: 2,
  volatilityLoads: 0,
  displayKeltnerC: false,
  nForKeltnerC: 20,
  volatilityLoading: false,
  volatilityError: false,
  volatilityData: []
}

const volatilityReducer = (state = initialState, action) => {
  const oldLoads = state.volatilityLoads
  switch (action.type) {
    case DISPLAY_ATR: return {
      ...state,
      displayATR: action.payload
    }
    case N_FOR_ATR: return {
      ...state,
      nForATR: action.payload
    }
    case DISPLAY_BBSMA: return {
      ...state,
      displayBBSMA: action.payload
    }
    case N_FOR_BBSMA: return {
      ...state,
      nForBBSMA: action.payload
    }
    case DISPLAY_BBUPPER: return {
      ...state,
      displayBBUpper: action.payload
    }
    case N_FOR_BBUPPER: return {
      ...state,
      nForBBUpper: action.payload
    }
    case NDEV_FOR_BBUPPER: return {
      ...state,
      ndevForBBUpper: action.payload
    }
    case DISPLAY_BBLOWER: return {
      ...state,
      displayBBLower: action.payload
    }
    case N_FOR_BBLOWER: return {
      ...state,
      nForBBUpper: action.payload
    }
    case NDEV_FOR_BBLOWER: return {
      ...state,
      ndevForBBUpper: action.payload
    }
    case DISPLAY_KELTNERC: return {
      ...state,
      displayKeltnerC: action.payload
    }
    case N_FOR_KLETNERC: return {
      ...state,
      nForKeltnerC: action.payload
    }
    case FETCH_VOLATILITY_DATA_REQUEST:
      return {
        ...state,
        volatilityLoading: true
      }
    case FETCH_VOLATILITY_DATA_SUCCESS:
      return {
        ...state,
        volatilityLoading: false,
        volatilityData: action.payload,
        volatilityError: '',
        volatilityLoads: (oldLoads+1)
      }
    case FETCH_VOLATILITY_DATA_FAILURE:
      return {
        ...state,
        volatilityLoading: false,
        volatilityData: [],
        volatilityError: action.payload
      }
    default: return state
  }
}

export default volatilityReducer