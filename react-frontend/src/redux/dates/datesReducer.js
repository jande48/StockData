import { ADD_START_DATE, ADD_END_DATE } from './datesTypes'

var currentDateInit = new Date()
var newDate = currentDateInit.setTime(currentDateInit.getTime() - (24*60*60*1000) * 182);
const initialState = {
  startDate: currentDateInit,
  endDate: (new Date())
}

const datesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_START_DATE: return {
      ...state,
      startDate: action.payload
    }
    case ADD_END_DATE: return {
      ...state,
      endDate: action.payload
    }

    default: return state
  }
}

export default datesReducer