import { combineReducers } from 'redux'
import cakeReducer from './cake/cakeReducer'


const rootReducer = combineReducers({
  cake: cakeReducer,

})

export default rootReducer