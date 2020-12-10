import React, {useState} from 'react'
import { Provider,connect } from 'react-redux'

import '../App.css'
import store from '../redux/store'
import { Menu} from "semantic-ui-react"

function ForumComponent (props) {
  const [activeItem, setActiveItem] = useState('home')
  function handleItemClick (data){ 
    setActiveItem(data.name)
}

//    <Provider store={store}>
  return (


        <Menu inverted>
            <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Home
            </Menu.Item>
            <Menu.Item
            name='forum'
            active={activeItem === 'forum'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Forum
            </Menu.Item>
        {props.isAuthenticated ? 
            <Menu inverted floated="right">
            <Menu.Item
            name='account'
            active={activeItem === 'account'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Account
            </Menu.Item>
            <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Logout
            </Menu.Item>
            </Menu>
        :
            <Menu inverted floated="right">
            <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Log In
            </Menu.Item>
            <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={(e,data) => handleItemClick(data)}
            >
            Sign Up
            </Menu.Item>
            </Menu>
        }
            
        </Menu>
        
      

  )
}
const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
    }
  }
  
// const mapDispatchToProps = dispatch => {
// return {
//     //requestAPIstockData: (APIstring) => dispatch(requestAPIstockData(APIstring)),
    
// }
// }
  
  export default connect(
    mapStateToProps,
    null
  )(ForumComponent)
