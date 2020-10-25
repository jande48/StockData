  
import { ADD_TICKER, FETCH_COMP_INFO_REQUEST, FETCH_COMP_INFO_SUCCESS, FETCH_COMP_INFO_FAILURE } from './tickerTypes'
import axios from 'axios'

export const addTicker = (ticker = 'AAPL') => {
  return {
    type: ADD_TICKER,
    payload: ticker
  }
}


export function fetchCompInfoData(APIstring) {
  return function (dispatch) {
    console.log('We really got Right inside the api call')
    // fetch("/get_ticker_company_name/"+APIstring)
    //   .then(response => response.json())
    //   .then(data => console.log(data));
    axios({
      method: 'get',
      url: "/get_ticker_company_name/"+APIstring,
    })
      .then(response => {
        const compData = response.data 
        console.log(compData)
        dispatch(fetchCompInfoDataSuccess(compData))
      })
      .catch(error => {
        dispatch(fetchCompInfoDataFailure(error.message))
      })
  }
}
    // fetch('/get_ticker_company_name/', {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: apiString,
    //   })
    //   .then(response => response.json())
    //   .then(CompInfoData => {
    //     dispatch(fetchCompInfoDataSuccess(CompInfoData))
    //   })
    //   .catch((error) => {
    //     dispatch(fetchCompInfoDataFailure(error.message))
    //   });
//   }
// }
    
export const fetchCompInfoDataRequest = userInput => {
  return {
    type: FETCH_COMP_INFO_REQUEST,
    payload: userInput
  }
}

export const fetchCompInfoDataSuccess = data => {
  return {
    type: FETCH_COMP_INFO_SUCCESS,
    payload: data
  }
}

export const fetchCompInfoDataFailure = error => {
  return {
    type: FETCH_COMP_INFO_FAILURE,
    payload: error
  }
}