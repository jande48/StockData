  
import { DISPLAY_SMA, N_FOR_SMA, DISPLAY_EMA, N_FOR_EMA, DISPLAY_MACD, N_SLOW_FOR_MACD, N_FAST_FOR_MACD, FETCH_TREND_DATA_REQUEST,
  DISPLAY_MACD_SIGNAL, N_FAST_FOR_MACD_SIGNAL, N_SLOW_FOR_MACD_SIGNAL, N_SIGN_FOR_MACD_SIGNAL, DISPLAY_ADX, N_FOR_ADX,
  DISPLAY_ADXP, N_FOR_ADXP, DISPLAY_ADXN, N_FOR_ADXN, DISPLAY_VIPOS, N_FOR_VIPOS, DISPLAY_VINEG, N_FOR_VINEG, DISPLAY_TRIX, N_FOR_TRIX,
  DISPLAY_MI, N_FOR_MI, N2_FOR_MI, DISPLAY_DPO, N_FOR_DPO, FETCH_TREND_DATA_SUCCESS,
  FETCH_TREND_DATA_FAILURE} from './trendTypes'
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
export const displayMACDsignal = (n) => {
  return {
    type: DISPLAY_MACD_SIGNAL,
    payload: n
  }
}
export const nSlowForMACDsignal = (n) => {
  return {
    type: N_SLOW_FOR_MACD_SIGNAL,
    payload: n
  }
}
export const nFastForMACDsignal = (n) => {
  return {
    type: N_FAST_FOR_MACD_SIGNAL,
    payload: n
  }
}
export const nSignForMACDsignal = (n) => {
  return {
    type: N_SIGN_FOR_MACD_SIGNAL,
    payload: n
  }
}
export const displayADX = (n) => {
  return {
    type: DISPLAY_ADX,
    payload: n
  }
}
export const nForADX = (n) => {
  return {
    type: N_FOR_ADX,
    payload: n
  }
}
export const displayADXP = (n) => {
  return {
    type: DISPLAY_ADXP,
    payload: n
  }
}
export const nForADXP = (n) => {
  return {
    type: N_FOR_ADXP,
    payload: n
  }
}
export const displayADXN = (n) => {
  return {
    type: DISPLAY_ADXN,
    payload: n
  }
}
export const nForADXN = (n) => {
  return {
    type: N_FOR_ADXN,
    payload: n
  }
}
export const displayVIPOS = (n) => {
  return {
    type: DISPLAY_VIPOS,
    payload: n
  }
}
export const nForVIPOS = (n) => {
  return {
    type: N_FOR_VIPOS,
    payload: n
  }
}
export const displayVINEG = (n) => {
  return {
    type: DISPLAY_VINEG,
    payload: n
  }
}
export const nForVINEG = (n) => {
  return {
    type: N_FOR_VINEG,
    payload: n
  }
}
export const displayTRIX = (n) => {
  return {
    type: DISPLAY_TRIX,
    payload: n
  }
}
export const nForTRIX = (n) => {
  return {
    type: N_FOR_TRIX,
    payload: n
  }
}
export const displayMI = (n) => {
  return {
    type: DISPLAY_MI,
    payload: n
  }
}
export const nForMI = (n) => {
  return {
    type: N_FOR_MI,
    payload: n
  }
}
export const n2ForMI = (n) => {
  return {
    type: N2_FOR_MI,
    payload: n
  }
}
export const displayDPO = (n) => {
  return {
    type: DISPLAY_DPO,
    payload: n
  }
}
export const nForDPO = (n) => {
  return {
    type: N_FOR_DPO,
    payload: n
  }
}
export function fetchTrendData(apiString) {
  //console.log(apiString)
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
  }}
  

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

