import { ADD_START_DATE } from './datesTypes'

const initialState = {
  tickers: 'AAPL'
}

const datesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_START_DATE: return {
      ...state,
      startDate: action.payload
    }

    default: return state
  }
}

export default datesReducer