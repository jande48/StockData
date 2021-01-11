import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Input, Grid, Checkbox, Icon } from 'semantic-ui-react'
import { fetchPasswordReset, addPasswordResetLoading, addPasswordResetSuccess, addPasswordResetFailure } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'
import { dispatch } from 'd3';



function ResetPasswordContainer (props) {
    const [email, setEmail] = useState('');
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    const handleEmailChange = (e, data) => setEmail(data.value)

    useEffect(() => {
      checkEmail()
      props.addPasswordResetFailure(false)
      props.addPasswordResetLoading(false)
      props.addPasswordResetSuccess(false)
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
      { props.passwordResetSuccess ? 
      <Message success>
        <Message.Header>Email sent! Please check your email or spam folder. (We're not SPAM!)</Message.Header>
      </Message> : ''}
      { props.passwordResetFailure ? 
      <Message warning>
        <Message.Header>Huh! We're having trouble sending a reset email right now.</Message.Header>
      </Message> : ''}
      <Form.Field
        id='form-input-control-email'
        control={Input}
        label='Email'
        placeholder='joe@schmoe.com'
        onChange={handleEmailChange}
      />
      {props.passwordResetLoading ? <Form.Button loading inverted color='green' floated='right' content='Email Password Reset' /> : <Form.Button inverted color='green' floated='right' content='Email Password Reset' />}
      
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
      passwordResetFailure: state.usersFromRootReducer.passwordResetFailure,
      passwordResetLoading: state.usersFromRootReducer.passwordResetLoading,
      passwordResetSuccess: state.usersFromRootReducer.passwordResetSuccess,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchPasswordReset: (x) => dispatch(fetchPasswordReset(x)),
      addPasswordResetFailure: (x) => dispatch(addPasswordResetFailure(x)),
      addPasswordResetLoading: (x) => dispatch(addPasswordResetLoading(x)),
      addPasswordResetSuccess: (x) => dispatch(addPasswordResetSuccess(x)),
      
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResetPasswordContainer)
  