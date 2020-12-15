import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Input, Grid, Checkbox, Icon } from 'semantic-ui-react'
import { fetchPasswordReset } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'



function ResetPasswordContainer (props) {
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('')
    // const [rememberMe, setRememberMe] = useState(false)
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    const handleEmailChange = (e, data) => setEmail(data.value)
    // const handlePasswordChange = (e, data) => setPassword(data.value)
    // const handleRememberMeChange = (e, data) => setRememberMe(!rememberMe) 
    
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
            }
        props.fetchPasswordReset(payload)
    }

return (

<div>
  { props.isAuthenticated ? <Redirect to="/" /> : ''}
  <Grid columns='equal'>
    <Grid.Column></Grid.Column>
    <Grid.Column width={8} className='lightGrayBackground'>
    {/* <Header inverted as='h3'>Please enter your email and password: </Header> */}
    { props.passwordReset ? <Message
      attached
      color='green'
      header='Welcome'
      content='Please check your email to reset your password'
    /> : ''}
    
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
      {/* <Form.Input 
        label='Password' 
        type='password'
        value={password}
        onChange={handlePasswordChange} />
      <Form.Field>
      <Checkbox label='Remember me' onChange={handleRememberMeChange}/>
      </Form.Field> */}
      <Form.Button inverted color='green' floated='right' content='Email Password Reset' />
      {/* { props.loginFailed ? 
      <Message negative>
        <Message.Header>Incorrect email or password. Would you like to <a href="/reset_request.html">Reset Password</a></Message.Header>
      </Message> : ''} */}
      {/* <Message attached='bottom' warning>
      <Icon name='help' />
      Already signed up?<a href='#'>Login here</a>instead.
      </Message> */}
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
      passwordReset: state.usersFromRootReducer.passwordReset,
      

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchPasswordReset: (x) => dispatch(fetchPasswordReset(x)),
      //createNewPost: (data) => dispatch(createNewPost(data)),

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResetPasswordContainer)
  