  
import { ADD_START_DATE } from './datesTypes'

export const addStartDate = (date) => {

  return {
    type: ADD_START_DATE,
    payload: date
  }
}