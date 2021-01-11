import React, {useState} from 'react'
import { Provider,connect } from 'react-redux'
import {Link} from 'react-router-dom'
import '../App.css'
import store from '../redux/store'
import { Menu} from "semantic-ui-react"
import { addActiveNav } from '../redux'

function NavComponent (props) {
  function handleItemClick (data){ 
    props.addActiveNav(data.name)
}

  return (
        <Menu inverted pointing>
            <Link to="/">
            <Menu.Item
            name='home'
            active={props.activeNav === 'home'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Home
            </Menu.Item>
            </Link>
            <Link to="/charts">
            <Menu.Item
            name='charts'
            active={props.activeNav === 'charts'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Charts
            </Menu.Item>
            </Link>
            <Link to="/posts">
            <Menu.Item
            name='forum'
            active={props.activeNav === 'forum'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Posts
            </Menu.Item>
            </Link>
        {props.isAuthenticated ? 
            <Menu inverted pointing floated="right">
            <Link to="/account">
            <Menu.Item
            name='account'
            active={props.activeNav === 'account'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Account
            </Menu.Item>
            </Link>
            <Link to="/logout">
            <Menu.Item
            name='logout'
            active={props.activeNav === 'logout'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Logout
            </Menu.Item>
            </Link>
            </Menu>
        :
            <Menu inverted pointing floated="right">
            <Link to="/login">
            <Menu.Item
            name='login'
            active={props.activeNav === 'login'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Login
            </Menu.Item>
            </Link>
            <Link to="/register">
            <Menu.Item
            name='register'
            active={props.activeNav === 'register'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Sign Up
            </Menu.Item>
            </Link>
            </Menu>
        }
        </Menu>
  )
}
const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
      activeNav: state.usersFromRootReducer.activeNav,
    }
  }
  
const mapDispatchToProps = dispatch => {
return {
    addActiveNav: (x) => dispatch(addActiveNav(x)),
    
}
}
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavComponent)
