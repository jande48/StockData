  
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI } from './momentumTypes'

export const displayRSI = (n) => {
  return {
    type: DISPLAY_RSI,
    payload: n
  }
}
export const nForRSI = (n) => {
  return {
    type: N_FOR_RSI,
    payload: n
  }
}
export const displayTSI = (n) => {
  return {
    type: DISPLAY_TSI,
    payload: n
  }
}
export const rForTSI = (n) => {
  return {
    type: R_FOR_TSI,
    payload: n
  }
}
