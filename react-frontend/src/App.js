import React, {useState} from 'react'
import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AppComponent from './components/AppComponent'
import NavComponent from './components/NavComponent'
import ForumComponent from './components/ForumComponent'
import LoginContainer from './components/LoginContainer'
import LogoutContainer from './components/LogoutContainer'
import RegisterContainer from './components/RegisterContainer'
import AccountContainer from './components/AccountContainer'
import ResetPasswordContainer from './components/ResetPasswordContainer'
import HomeComponent from './components/HomeComponent'


function App () {

  return (
    <Provider store={store}>
      <Router>
        <NavComponent/>
        <Switch>
          <Route path="/charts" component={AppComponent} /> 
          <Route path="/posts" component={ForumComponent} /> 
          <Route path="/login" component={LoginContainer} /> 
          <Route path="/logout" component={LogoutContainer} /> 
          <Route path="/register" component={RegisterContainer} /> 
          <Route path="/account" component={AccountContainer} /> 
          <Route path="/resetPassword" component={ResetPasswordContainer} /> 
          <Route path="/" component={HomeComponent} />
        </Switch>
        
      </Router>
    </Provider>
  )
}

export default App