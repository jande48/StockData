import { USER_AUTHENTICATED, POST_RESPONSE, IS_AUTHENTICATED, ACCOUNT_UPDATED, ACTIVE_NAV, EMAIL_IN_USE, PHOTO_UPDATED, EMAIL_UPDATED, 
  PASSWORD_UPDATED, LOGIN_FAILED, PASSWORD_RESET} from './usersTypes'
import axios from 'axios'
import _ from 'lodash'
import setAuthorizationToken from '../../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken'



export const addUserAuthenticated = (index = 0) => {
    return {
      type: USER_AUTHENTICATED,
      payload: index
    }
  }
export const addPostResponse = (index = 0) => {
    return {
      type: POST_RESPONSE,
      payload: index
    }
  }
export const addIsAuthenticated = (index = false) => {
    return {
      type: IS_AUTHENTICATED,
      payload: index
    }
  }
export const addActiveNav = (index = '') => {
    return {
      type: ACTIVE_NAV,
      payload: index
    }
  }
export const addEmailInUse = (index = false) => {
    return {
      type: EMAIL_IN_USE,
      payload: index
    }
  }
export const addPhotoUpdated = (index = false) => {
    return {
      type: PHOTO_UPDATED,
      payload: index
    }
  }
export const addEmailUpdated = (index = false) => {
    return {
      type: EMAIL_UPDATED,
      payload: index
    }
  }
export const addPasswordUpdated = (index = false) => {
    return {
      type: PASSWORD_UPDATED,
      payload: index
    }
  }
export const addLoginFailed = (index = false) => {
    return {
      type: LOGIN_FAILED,
      payload: index
    }
  }
export const addPasswordReset = (index = false) => {
    return {
      type: PASSWORD_RESET,
      payload: index
    }
  }
export function createNewPost(data) {
    return function (dispatch) {
        console.log('we got inside the create new post function')
        axios.post('/post/new/',data).then(res => {
            const response = res.data;
            dispatch(addPostResponse(response))
            
        })
    }
}

export function fetchUserAuth(data) {
    return function (dispatch)  {

        axios.post('/users/auth/',data).then(res => {
            const token = res.data;
            localStorage.setItem('jwtToken',token)
            setAuthorizationToken(token)
            dispatch(addUserAuthenticated(jwt.decode(token)))
            {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
        })
    }
}
export function fetchLogin(data) {
  return function (dispatch)  {

      axios.post('/users/login/',data).then(res => {
          const token = res.data;
          const checkAuth = jwt.decode(token)
          if (!checkAuth['isAuthenticated']) {
            dispatch(addLoginFailed(true))
          } else {
            localStorage.setItem('jwtToken',token)
            setAuthorizationToken(token)
            dispatch(addUserAuthenticated(jwt.decode(token)))
            {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
          }
      })
  }
}
export function fetchRegister(data) {
  return function (dispatch)  {
      axios.post('/users/register/',data).then(res => {
          const response = jwt.decode(res.data);
          if (response['emailAlreadyUsed']) {
            dispatch(addEmailInUse(true))
          }
          if (!response['emailAlreadyUsed'] && response['registerSuccess']){
            dispatch(addEmailInUse(false))
            localStorage.setItem('jwtToken',res.data)
            setAuthorizationToken(res.data)
            dispatch(addUserAuthenticated(response['user']))
            dispatch(addIsAuthenticated(true))
            
          }
      })
  }
}
export function fetchUpdatePhoto(data) {
  return function (dispatch)  {
      axios.post('/users/updatePhoto/',data,{ headers: { 'content-type': 'multipart/form-data' } }).then(res => {
        const token = res.data;
        localStorage.setItem('jwtToken',token)
        setAuthorizationToken(token)
        dispatch(addUserAuthenticated(jwt.decode(token)))
        {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
        dispatch(addPhotoUpdated(true))
      })
  }
}

export function fetchUpdateAccount(data) {
  return function (dispatch)  {
      axios.post('/users/updateAccount/',data).then(res => {
        const token = res.data;
        if (jwt.decode(token)['updateEmail']) {
          dispatch(addEmailUpdated(true))
        }
        if (jwt.decode(token)['updatePassword']) {
          dispatch(addPasswordUpdated(true))
        }
        localStorage.setItem('jwtToken',token)
        setAuthorizationToken(token)
        dispatch(addUserAuthenticated(jwt.decode(token)))
        {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
      })
  }
}
export function fetchPasswordReset(data) {
  return function (dispatch)  {
      axios.post('/users/reset_password/',data).then(res => {
        const response = jwt.decode(res.data)
        console.log(response)
        if (response == 'success') {
          dispatch(addPasswordReset(true))
        } else {
          dispatch(addPasswordReset(false))
        }
        // const token = res.data['data'];
        // localStorage.setItem('jwtToken',token)
        // setAuthorizationToken(token)
        // dispatch(addUserAuthenticated(jwt.decode(token)))
        // {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
      })
  }
}
export function fetchAccount(data) {
  return function (dispatch)  {
      axios.post('/users/account/',data).then(res => {
          const token = res.data;

          localStorage.setItem('jwtToken',token)
          setAuthorizationToken(token)
          dispatch(addUserAuthenticated(jwt.decode(token)))
          {jwt.decode(token)['isAuthenticated'] ? dispatch(addIsAuthenticated(true)) : dispatch(addIsAuthenticated(false))}
      })
  }
}

export function fetchLogout(data) {
  return function (dispatch)  {

      axios.post('/users/logout/',data).then(res => {
          const token = res.data;
          dispatch(addUserAuthenticated(jwt.decode(token)))
          dispatch(addIsAuthenticated(false))
          
      })
  }
}