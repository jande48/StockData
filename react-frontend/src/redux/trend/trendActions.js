  
import { DISPLAY_SMA, N_FOR_SMA, DISPLAY_EMA, N_FOR_EMA, DISPLAY_MACD, N_SLOW_FOR_MACD, N_FAST_FOR_MACD, FETCH_TREND_DATA_REQUEST,
  FETCH_TREND_DATA_SUCCESS,
  FETCH_TREND_DATA_FAILURE } from './trendTypes'
import axios from 'axios'


export const displaySMA = (n) => {
  return {
    type: DISPLAY_SMA,
    payload: n
  }
}
export const nForSMA = (n) => {
  return {
    type: N_FOR_SMA,
    payload: n
  }
}
export const displayEMA = (n) => {
  return {
    type: DISPLAY_EMA,
    payload: n
  }
}
export const nForEMA = (n) => {
  return {
    type: N_FOR_EMA,
    payload: n
  }
}
export const displayMACD = (n) => {
  return {
    type: DISPLAY_MACD,
    payload: n
  }
}
export const nSlowForMACD = (n) => {
  return {
    type: N_SLOW_FOR_MACD,
    payload: n
  }
}
export const nFastForMACD = (n) => {
  return {
    type: N_FAST_FOR_MACD,
    payload: n
  }
}



export const fetchTrendDataRequest = () => {
  return {
    type: FETCH_TREND_DATA_REQUEST,
  }
}

export const fetchTrendDataSuccess = data => {
  return {
    type: FETCH_TREND_DATA_SUCCESS,
    payload: data
  }
}

export const fetchTrendDataFailure = error => {
  return {
    type: FETCH_TREND_DATA_FAILURE,
    payload: error
  }
}

export function fetchTrendData(apiString) {
  return function (dispatch) {

    fetch('/calculate_Trend_Indicators/', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: apiString,
      })
      .then(response => response.json())
      .then(trendData => {
        dispatch(fetchTrendDataSuccess(trendData))
      })
      .catch((error) => {
        dispatch(fetchTrendDataFailure(error.message))
      });
    
//     // axios({
//     //   method: 'post',
//     //   url: "/calculate_Momentum_Indicators/",
//     //   data: apiString
//     // })
//     //   .then(response => {
//     //     const momentumData = response.data 
//     //     dispatch(fetchMomentumDataSuccess(momentumData))
//     //   })
//     //   .catch(error => {
//     //     dispatch(fetchMomentumDataFailure(error.message))
//     //   })
//   }
// }

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

