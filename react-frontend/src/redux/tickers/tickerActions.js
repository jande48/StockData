  
import { ADD_TICKER, FETCH_COMP_INFO_REQUEST, FETCH_COMP_INFO_SUCCESS, FETCH_COMP_INFO_FAILURE, COMPANY_NAME, ADD_PERCENT_CHANGE } from './tickerTypes'
import axios from 'axios'
import _ from 'lodash'

export const addTicker = (ticker = 'AAPL') => {
  return {
    type: ADD_TICKER,
    payload: ticker.toUpperCase()
  }
}

export const addPercentChange = (percentChange = 0) => {
  return {
    type: ADD_PERCENT_CHANGE,
    payload: percentChange
  }
}

export const addCompanyName = (name = 'Apple, Inc') => {
  return {
    type: COMPANY_NAME,
    payload: name
  }
}

export function fetchCompanyNameFromTicker(APIstring) {
  return function (dispatch) {
    axios({
      method: 'get',
      url: "/get_company_name_from_ticker/"+APIstring,
    })
      .then(response => {
        const compData = response.data 
        const re = new RegExp(_.escapeRegExp(APIstring), 'i')
        const isMatch = (result) => re.test(result.name)

        dispatch(addCompanyName(_.filter(compData, isMatch)))
      })
      .catch(error => {
        dispatch(fetchCompInfoDataFailure(error.message))
      })
  }
}

export function fetchCompInfoData(APIstring) {
  return function (dispatch) {
    console.log(APIstring)
    axios({
      method: 'get',
      url: "/get_ticker_company_name/"+APIstring,
    })
      .then(response => {
        const compData = response.data 
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