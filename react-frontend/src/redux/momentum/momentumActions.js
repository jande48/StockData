  
import { DISPLAY_RSI, N_FOR_RSI, DISPLAY_TSI, R_FOR_TSI, S_FOR_TSI, S_FOR_UO, M_FOR_UO, LEN_FOR_UO, WS_FOR_UO, WM_FOR_UO, WL_FOR_UO, DISPLAY_UO,
  DISPLAY_STOCH, N_FOR_STOCH, D_N_FOR_STOCH, DISPLAY_STOCH_SIGNAL, N_FOR_STOCH_SIGNAL, D_N_FOR_STOCH_SIGNAL, DISPLAY_WR, LBP_FOR_WR,
  DISPLAY_AO, S_FOR_AO, LEN_FOR_AO,
  FETCH_MOMENTUM_DATA_REQUEST,
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
export const sForUO = (n) => {
  return {
    type: S_FOR_UO,
    payload: n
  }
}
export const mForUO = (n) => {
  return {
    type: M_FOR_UO,
    payload: n
  }
}
export const lenForUO = (n) => {
  return {
    type: LEN_FOR_UO,
    payload: n
  }
}
export const wsForUO = (n) => {
  return {
    type: WS_FOR_UO,
    payload: n
  }
}
export const wmForUO = (n) => {
  return {
    type: WM_FOR_UO,
    payload: n
  }
}
export const wlForUO = (n) => {
  return {
    type: WL_FOR_UO,
    payload: n
  }
}
export const displayUO = (n) => {
  return {
    type: DISPLAY_UO,
    payload: n
  }
}
export const displaySTOCH = (n) => {
  return {
    type: DISPLAY_STOCH,
    payload: n
  }
}
export const nForSTOCH = (n) => {
  return {
    type: N_FOR_STOCH,
    payload: n
  }
}
export const dnForSTOCH = (n) => {
  return {
    type: D_N_FOR_STOCH,
    payload: n
  }
}
export const displayStochSignal = (n) => {
  return {
    type: DISPLAY_STOCH_SIGNAL,
    payload: n
  }
}
export const nForStochSignal = (n) => {
  return {
    type: N_FOR_STOCH_SIGNAL,
    payload: n
  }
}
export const dnForStochSignal = (n) => {
  return {
    type: D_N_FOR_STOCH_SIGNAL,
    payload: n
  }
}
export const displayWR = (n) => {
  return {
    type: DISPLAY_WR,
    payload: n
  }
}
export const lbpForWR = (n) => {
  return {
    type: LBP_FOR_WR,
    payload: n
  }
}
export const displayAO = (n) => {
  return {
    type: DISPLAY_AO,
    payload: n
  }
}
export const sForAO = (n) => {
  return {
    type: S_FOR_AO,
    payload: n
  }
}
export const lenForAO = (n) => {
  return {
    type: LEN_FOR_AO,
    payload: n
  }
}
export function fetchMomentumData(apiString) {
  return function (dispatch) {
    dispatch(fetchMomentumDataRequest())
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