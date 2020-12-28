import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import { Form, Message, Header, Input, Grid, Icon } from 'semantic-ui-react'
import { fetchRegister, addEmailInUse, addActiveNav } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import { add } from 'lodash'


function RegisterContainer (props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [username, setUsername] = useState('')

    const [showEmailWarning, setShowEmailWarning] = useState(false)
    const [showPasswordWarning, setShowPasswordWarning] = useState(false)
    const [showPasswordWarning2, setShowPasswordWarning2] = useState(false)
    const handleUsernameChange = (e, data) => setUsername(data.value)
    const handleEmailChange = (e, data) => setEmail(data.value)
    const handlePasswordChange = (e, data) => setPassword(data.value)
    const handlePassword2Change = (e, data) => setPassword2(data.value)

    useEffect(() => {
        addEmailInUse(false)
        checkEmail()
        checkPasswords()
        props.addActiveNav('register')
    },[email,password,password2])

    function checkPasswords() {
        if (password2.length > 1 && (password2.length == password.length) && password2 != password) {
            setShowPasswordWarning(true)
        }else{
            setShowPasswordWarning(false)
        }
    }

    function checkEmail() {
        if ((email.length > 3 && !email.includes('@')) || (email.length > 3 && !email.includes('.'))) {
            setShowEmailWarning(true)
        }else{
            setShowEmailWarning(false)
        }
    }

    function handleSubmit() {
        if (password.length < 7){
            setShowPasswordWarning2(true)
        }else{
            const payload = {
                'username': username,
                'email': email,
                'password': password,
                }
            props.fetchRegister(payload)
        }
        
    }

return (

<div>
  { props.isAuthenticated ? <Redirect to="/" /> : ''}
  <Grid columns='equal'>
    <Grid.Column></Grid.Column>
    <Grid.Column width={8} className='lightGrayBackground'>
    <Message
      attached
      header='Welcome!'
      content='Please enter your info to sign up!'
      color='green'
    /><br/>
    <Form inverted onSubmit={handleSubmit}>
      <Form.Input 
        label='Username' 
        value={username}
        placeholder='joe'
        onChange={handleUsernameChange} />
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
      { showPasswordWarning ? 
      <Message negative>
        <Message.Header>Those passwords don't seem to match</Message.Header>
      </Message> : ''}
      { showPasswordWarning2 ? 
      <Message negative>
        <Message.Header>Password has to be at least 6 characters</Message.Header>
      </Message> : ''}
      <Form.Input 
        label='Password' 
        type='password'
        value={password}
        onChange={handlePasswordChange} />
      <Form.Input 
        label='Confirm Password' 
        type='password'
        value={password2}
        onChange={handlePassword2Change} />
      <Form.Button inverted color='green' floated='right' content='Sign Up' /><br/>
    </Form>
    <br/><br/>
    <Message attached='bottom' warning>
      <Icon name='help' />
      Already signed up? <Link to="/login"><a href='#' color='green'>Login here</a></Link> instead.
    </Message>
    </Grid.Column>
    <Grid.Column></Grid.Column>
  </Grid>
  
</div>

)
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
      emailInUse: state.usersFromRootReducer.emailInUse,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchRegister: (x) => dispatch(fetchRegister(x)),
      addEmailInUse: (x) => dispatch(addEmailInUse(x)),
      addActiveNav: (x) => dispatch(addActiveNav(x)),
      //createNewPost: (data) => dispatch(createNewPost(data)),

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegisterContainer)
  