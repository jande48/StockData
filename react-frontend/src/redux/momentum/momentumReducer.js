import { nForRSI } from './momentumActions'
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI } from './momentumTypes'

const initialState = {
  displayRSI: true,
  nForRSI: 10,
  displayTSI: false,
  rForTSI: 25
}

const momentumReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISPLAY_RSI: return {
      displayRSI: action.payload
    }
    case N_FOR_RSI: return {
      nForRSI: action.payload
    }
    case DISPLAY_TSI: return {
      displayTSI: action.payload
    }
    case R_FOR_TSI: return {
      rForTSI: action.payload
    }

    default: return state
  }
}

export default momentumReducer