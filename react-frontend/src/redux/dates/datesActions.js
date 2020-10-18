  
import { ADD_START_DATE, ADD_END_DATE } from './datesTypes'

export const addStartDate = (date) => {

  return {
    type: ADD_START_DATE,
    payload: date
  }
}

export const addEndDate = (date) => {

  return {
    type: ADD_END_DATE,
    payload: date
  }
}