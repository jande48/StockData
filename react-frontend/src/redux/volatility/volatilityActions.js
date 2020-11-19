  
import { DISPLAY_ATR, N_FOR_ATR, DISPLAY_BBSMA, N_FOR_BBSMA,DISPLAY_BBUPPER,N_FOR_BBUPPER,NDEV_FOR_BBUPPER,
  FETCH_VOLATILITY_DATA_REQUEST,
  FETCH_VOLATILITY_DATA_SUCCESS,
  FETCH_VOLATILITY_DATA_FAILURE } from './volatilityTypes'
import axios from 'axios'




export const displayATR = (n) => {
  return {
    type: DISPLAY_ATR,
    payload: n
  }
}
export const nForATR = (n) => {
  return {
    type: N_FOR_ATR,
    payload: n
  }
}
export const displayBBSMA = (n) => {
  return {
    type: DISPLAY_BBSMA,
    payload: n
  }
}
export const nForBBSMA = (n) => {
  return {
    type: N_FOR_BBSMA,
    payload: n
  }
}
export const displayBBUpper = (n) => {
  return {
    type: DISPLAY_BBUPPER,
    payload: n
  }
}
export const nForBBUpper = (n) => {
  return {
    type: N_FOR_BBUPPER,
    payload: n
  }
}
export const ndevBBUpper = (n) => {
  return {
    type: NDEV_FOR_BBUPPER,
    payload: n
  }
}
export function fetchVolatilityData(apiString) {
  return function (dispatch) {
    dispatch(fetchVolatilityDataRequest())
    fetch('/calculate_Volatility_Indicators/', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: apiString,
      })
      .then(response => response.json())
      .then(volatilityData => {
        dispatch(fetchVolatilityDataSuccess(volatilityData))
      })
      .catch((error) => {
        dispatch(fetchVolatilityDataFailure(error.message))
      });
    
  }
}

export const fetchVolatilityDataRequest = () => {
  return {
    type: FETCH_VOLATILITY_DATA_REQUEST,
  }
}

export const fetchVolatilityDataSuccess = data => {
  return {
    type: FETCH_VOLATILITY_DATA_SUCCESS,
    payload: data
  }
}

export const fetchVolatilityDataFailure = error => {
  return {
    type: FETCH_VOLATILITY_DATA_FAILURE,
    payload: error
  }
}