import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Input, Grid, Checkbox, Icon } from 'semantic-ui-react'
import { fetchLogin } from '../redux'
import { Redirect, Link } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'



function LoginContainer (props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    const handleEmailChange = (e, data) => setEmail(data.value)
    const handlePasswordChange = (e, data) => setPassword(data.value)
    const handleRememberMeChange = (e, data) => setRememberMe(!rememberMe) 
    
    useEffect(() => {
      checkEmail()
    },[email])



    function checkEmail() {
        if ((email.length > 3 && !email.includes('@')) || (email.length > 3 && !email.includes('.'))) {
            setShowEmailWarning(true)
        }else{
            setShowEmailWarning(false)
        }
    }

    function handleSubmit() {

        const payload = {
            'email': email,
            'password': password,
            'rememberMe': rememberMe,
            }
        props.fetchLogin(payload)
    }

return (

<div>
  { props.isAuthenticated ? <Redirect to="/" /> : ''}
  <Grid columns='equal'>
    <Grid.Column></Grid.Column>
    <Grid.Column width={8} className='lightGrayBackground'>
    {/* <Header inverted as='h3'>Please enter your email and password: </Header> */}
    <Message
      attached
      color='green'
      header='Welcome'
      content='Please enter your email and password to login:'
    /><br/>
    <Form inverted onSubmit={handleSubmit}>
      { showEmailWarning ? 
      <Message negative>
        <Message.Header>That doesn't seem like a vaild email.</Message.Header>
      </Message> : ''}
      <Form.Field
        id='form-input-control-email'
        control={Input}
        label='Email'
        placeholder='joe@schmoe.com'
        onChange={handleEmailChange}
      />
      <Form.Input 
        label='Password' 
        type='password'
        value={password}
        onChange={handlePasswordChange} />
      <Form.Field>
      <Checkbox label='Remember me' onChange={handleRememberMeChange}/>
      </Form.Field>
      <Link to="/resetPassword"><a href="#">Reset Password</a></Link>
      <Form.Button inverted color='green' floated='right' content='Login' />
      { props.loginFailed ? 
      <Message negative>
        <Message.Header>Incorrect email or password. Would you like to <Link to="/resetPassword"><a href="#">Reset Password?</a></Link></Message.Header>
      </Message> : ''}
      <br/>
      

    </Form><br/>
    </Grid.Column>
    <Grid.Column></Grid.Column>
  </Grid>
  
</div>

)
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
      loginFailed: state.usersFromRootReducer.loginFailed,
      

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchLogin: (x) => dispatch(fetchLogin(x)),
      //createNewPost: (data) => dispatch(createNewPost(data)),

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginContainer)
  