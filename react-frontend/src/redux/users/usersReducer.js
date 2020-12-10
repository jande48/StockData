import { USER_AUTHENTICATED, POST_RESPONSE, IS_AUTHENTICATED, ACTIVE_NAV, EMAIL_IN_USE} from './usersTypes'

const initialState = {
    isAuthenticated: false,
    userAuth: {},
    postResponse: {},
    activeNav: 'home',
    emailAlreadyUsed: false,
  }


const usersReducer = (state = initialState, action) => {

switch (action.type) {
    case USER_AUTHENTICATED: return {
    ...state,
    userAuth: action.payload
    }
    case IS_AUTHENTICATED: return {
    ...state,
    isAuthenticated: action.payload
    }
    case POST_RESPONSE: return {
    ...state,
    postResponse: action.payload
    }
    case ACTIVE_NAV: return {
      ...state,
      activeNav: action.payload
    }
    case EMAIL_IN_USE: return {
      ...state,
      emailAlreadyUsed: action.payload
    }
    default: return state
}

}

export default usersReducer