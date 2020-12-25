import { USER_AUTHENTICATED, POST_RESPONSE, IS_AUTHENTICATED, ACTIVE_NAV, EMAIL_IN_USE, PHOTO_UPDATED, EMAIL_UPDATED, PASSWORD_UPDATED,
  LOGIN_FAILED, PASSWORD_RESET, PAGE_NUMBER, FORM_DATA_DISPLAY, SUBMIT_POST_SUCCESS, SUBMIT_POST_LOADING, SUBMIT_POST_FAILURE,
  INCLUDE_VOLUME_CHART, REPLY, REPLY_FAILURE, REPLY_LOADING, REPLY_SUCCESS, FETCH_POST_SUCCESS} from './usersTypes'

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
    pageNumber: 1,
    formDataDisplay: {},
    submitPostLoading: false,
    submitPostSuccess: false,
    submitPostFailure: false,
    includeVolumeChart: false,
    reply: '',
    replyLoading: false,
    replySuccess: false,
    replyFailure: false,
    fetchPostSuccess: false,
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
    case PAGE_NUMBER: return {
      ...state,
      pageNumber: action.payload
    }
    case FORM_DATA_DISPLAY: return {
      ...state,
      formDataDisplay: action.payload
    }
    case SUBMIT_POST_FAILURE: return {
      ...state,
      submitPostFailure: action.payload
    }
    case SUBMIT_POST_SUCCESS: return {
      ...state,
      submitPostSuccess: action.payload
    }
    case SUBMIT_POST_LOADING: return {
      ...state,
      submitPostLoading: action.payload
    }
    case INCLUDE_VOLUME_CHART: return {
      ...state,
      includeVolumeChart: action.payload
    }
    case REPLY: return {
      ...state,
      reply: action.payload
    }
    case REPLY_LOADING: return {
      ...state,
      replyLoading: action.payload
    }
    case REPLY_SUCCESS: return {
      ...state,
      replySuccess: action.payload
    }
    case REPLY_FAILURE: return {
      ...state,
      replyFailure: action.payload
    }
    case FETCH_POST_SUCCESS: return {
      ...state,
      fetchPostSuccess: action.payload
    }
    default: return state
}

}

export default usersReducer