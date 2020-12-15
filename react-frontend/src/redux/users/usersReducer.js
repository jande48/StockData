import { USER_AUTHENTICATED, POST_RESPONSE, IS_AUTHENTICATED, ACTIVE_NAV, EMAIL_IN_USE, PHOTO_UPDATED, EMAIL_UPDATED, PASSWORD_UPDATED,
  LOGIN_FAILED, PASSWORD_RESET} from './usersTypes'

const initialState = {
    isAuthenticated: false,
    userAuth: {},
    postResponse: {},
    activeNav: 'home',
    emailAlreadyUsed: false,
    photoUpdated: false,
    emailUpdated: false,
    passwordUpdated: false,
    loginFailed: false,
    passwordReset: false,
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
    case PHOTO_UPDATED: return {
      ...state,
      photoUpdated: action.payload
    }
    case EMAIL_UPDATED: return {
      ...state,
      emailUpdated: action.payload
    }
    case PASSWORD_UPDATED: return {
      ...state,
      passwordUpdated: action.payload
    }
    case LOGIN_FAILED: return {
      ...state,
      loginFailed: action.payload
    }
    case PASSWORD_RESET: return {
      ...state,
      passwordReset: action.payload
    }
    default: return state
}

}

export default usersReducer