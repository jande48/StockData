import { USER_AUTHENTICATED, POST_RESPONSE} from './usersTypes'
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
        })
    }
}
