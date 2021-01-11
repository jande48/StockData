import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchLogout } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'



function LogoutContainer (props) {


    useEffect(() => {
      props.fetchLogout(2)
    },[])



   

return (

<div>
  { props.isAuthenticated ? '' : <Redirect to="/" />}
</div>

)
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
    
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchLogout: (x) => dispatch(fetchLogout(x)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(LogoutContainer)
  