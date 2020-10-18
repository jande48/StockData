import { ADD_LINE_CANDLE } from './chartsTypes'

const initialState = {
  displayLine: true
}

const chartsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LINE_CANDLE: return {
      //...state,
      displayLine: action.payload
    }

    default: return state
  }
}

export default chartsReducer