  
import { ADD_LINE_CANDLE } from './chartsTypes'

export const addLineChart = (displayLine) => {

  return {
    type: ADD_LINE_CANDLE,
    payload: displayLine
  }
}

