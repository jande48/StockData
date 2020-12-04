import { USER_AUTHENTICATED, POST_RESPONSE} from './usersTypes'

const initialState = {
    userAuth: {},
    postResponse: {},
  }


const usersReducer = (state = initialState, action) => {

switch (action.type) {
    case USER_AUTHENTICATED: return {
    ...state,
    userAuth: action.payload
    }
    case POST_RESPONSE: return {
        ...state,
        postResponse: action.payload
        }
    default: return state
}

}

export default usersReducer