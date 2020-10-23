  
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI, S_FOR_TSI, FETCH_MOMENTUM_DATA_REQUEST,
  FETCH_MOMENTUM_DATA_SUCCESS,
  FETCH_MOMENTUM_DATA_FAILURE } from './momentumTypes'
import axios from 'axios'




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
export const sForTSI = (n) => {
  return {
    type: S_FOR_TSI,
    payload: n
  }
}
export function fetchMomentumData(apiString) {
  return function (dispatch) {

    fetch('/calculate_Momentum_Indicators/', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: apiString,
      })
      .then(response => response.json())
      .then(momentumData => {
        dispatch(fetchMomentumDataSuccess(momentumData))
      })
      .catch((error) => {
        dispatch(fetchMomentumDataFailure(error.message))
      });
    

    // axios({
    //   method: 'post',
    //   url: "/calculate_Momentum_Indicators/",
    //   data: apiString
    // })
    //   .then(response => {
    //     const momentumData = response.data 
    //     dispatch(fetchMomentumDataSuccess(momentumData))
    //   })
    //   .catch(error => {
    //     dispatch(fetchMomentumDataFailure(error.message))
    //   })
  }
}

// export function fetchMomentumData(JSONmomentumString) {

//   return function (dispatch) {

//     axios({
//       method: 'post',
//       url: "/calculate_Momentum_Indicators/",
//       data: JSONmomentumString,
//     })
//       .then(response => {
//         const momentumData = response.data 
//         dispatch(fetchMomentumDataSuccess(momentumData))
//       })
//       .catch(error => {
//         dispatch(fetchMomentumDataFailure(error.message))
//       })
//   }
// }


export const fetchMomentumDataRequest = () => {
  return {
    type: FETCH_MOMENTUM_DATA_REQUEST,
  }
}

export const fetchMomentumDataSuccess = data => {
  return {
    type: FETCH_MOMENTUM_DATA_SUCCESS,
    payload: data
  }
}

export const fetchMomentumDataFailure = error => {
  return {
    type: FETCH_MOMENTUM_DATA_FAILURE,
    payload: error
  }
}