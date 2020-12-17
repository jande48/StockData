import React, { useEffect, useState, createRef } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Input, Grid, Image, Button } from 'semantic-ui-react'
import { fetchUpdateAccount, fetchUpdatePhoto, addPhotoUpdated, addEmailUpdated, addPasswordUpdated } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'



function AccountContainer (props) {
    const [email, setEmail] = useState('')
    //const [file, setFile] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [showPasswordInequal, setShowPasswordInequal] = useState(false)
    const [showPasswordLength, setShowPasswordLength] = useState(false)
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    //const handleEmailChange = (e, data) => setEmail(data.value)
    const fileInputRef = createRef()
    
    useEffect(() => {
      checkEmail()
      props.addEmailUpdated(false)
      props.addPhotoUpdated(false)
      props.addPasswordUpdated(false)
    },[email])

    function handleEmailChange (e, data) {
      if (typeof(data) != 'undefined') {
        setEmail(data.value)
      }
    }
    function handleOldPasswordChange (e, data) {
      if (typeof(data) != 'undefined') {
        setOldPassword(data.value)
      }
    }
    function handleNewPassword1Change (e, data) {
      if (typeof(data) != 'undefined') {
        setNewPassword1(data.value)
      }
    }
    function handleNewPassword2Change (e, data) {
      if (typeof(data) != 'undefined') {
        if (data.value != newPassword1) {
          setShowPasswordInequal(true)
        } else {
          setShowPasswordInequal(false)
          if (newPassword1.length < 5) {
            setShowPasswordLength(true)
          } else {
            setShowPasswordLength(false)
          }
        }
        setNewPassword2(data.value)
      }
    }
    function handleFileChange (e, data) {
      if (typeof(e) != 'undefined') {
        //setFile(e.target.files[0])
        var formData = new FormData();
        formData.append('file', e.target.files[0]);
        props.addEmailUpdated(false)
        props.addPasswordUpdated(false)
        props.addPhotoUpdated(false)
        props.fetchUpdatePhoto(formData)
      }
    }

    function checkEmail() {
        if ((email.length > 5 && !email.includes('@')) || (email.length > 5 && !email.includes('.'))) {
            setShowEmailWarning(true)
        }else{
            setShowEmailWarning(false)
        }
    }
    function handleSubmit() {
      var payload = {
        email: '',
        password: '',
      }
      if (!showEmailWarning){
        if (email != '') {
          payload['email'] = email
        }
      }
      if (!showPasswordInequal && !showPasswordLength) {
        payload['password'] = newPassword1
      }
      props.addEmailUpdated(false)
      props.addPasswordUpdated(false)
      props.addPhotoUpdated(false)
      props.fetchUpdateAccount(payload) 
  }

return (
  
  <div>
    { !props.isAuthenticated ? <Redirect to="/" /> : 
      <Grid columns='equal'>
      <Grid.Column></Grid.Column>
      
      <Grid.Column width={8} className='lightGrayBackground'>
      { props.photoUpdated ? 
            <Message positive>
              <Message.Header>Your photo has been updated!</Message.Header>
            </Message> : ''}
      { props.emailUpdated ? 
            <Message positive>
              <Message.Header>Your email has been updated!</Message.Header>
            </Message> : ''}
      { props.passwordUpdated ? 
            <Message positive>
              <Message.Header>Your password has been updated!</Message.Header>
            </Message> : ''}
      { props.userAuth['usernameTaken'] ? 
            <Message negative>
              <Message.Header>There's another user with that email!</Message.Header>
            </Message> : ''}
      <Form inverted onSubmit={handleSubmit}>
          <Grid>
              <Grid.Column width={3}><Image src={"../static/profile_pics/"+props.userAuth['image_file']} size='small' circular  /></Grid.Column>
              <Grid.Column>
                <Header inverted as='h3'>{props.userAuth['username']}</Header>
                <Header inverted as='h5'>{props.userAuth['email']}</Header>
                <Button
                  content="Update Photo"
                  labelPosition="left"
                  icon="file"
                  onClick={() => fileInputRef.current.click()}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Grid.Column>
          </Grid><br/><br/>
          
          <Form.Field
            id='form-input-control-email'
            control={Input}
            label='Update Email'
            placeholder={String(props.userAuth['email'])}
            onChange={handleEmailChange}
          />
          <Form.Input 
            label='Old Password' 
            type='password'
            value={oldPassword}
            onChange={handleOldPasswordChange} />
          <Form.Input 
            label='New Password' 
            type='password'
            value={newPassword1}
            onChange={handleNewPassword1Change} />
          
          <Form.Input 
            label='Confirm New Password' 
            type='password'
            value={newPassword2}
            onChange={handleNewPassword2Change} />
          { showPasswordInequal ? 
            <Message negative>
              <Message.Header>Those passwords don't seem to match</Message.Header>
            </Message> : ''}
          { showPasswordLength ? 
            <Message negative>
              <Message.Header>Password must be at least 6 characters</Message.Header>
            </Message> : ''}
          { showEmailWarning ? 
            <Message negative>
              <Message.Header>That doesn't seem like a vaild email.</Message.Header>
            </Message> : ''}
          <Form.Button inverted color='green' floated='right' content='Update' />
          </Form>
      </Grid.Column>
      
      <Grid.Column></Grid.Column>
      </Grid>
      }
  </div>
)}

  



  
  
  


// )


const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
      userAuth: state.usersFromRootReducer.userAuth,
      photoUpdated: state.usersFromRootReducer.photoUpdated,
      emailUpdated: state.usersFromRootReducer.emailUpdated,
      passwordUpdated: state.usersFromRootReducer.passwordUpdated,

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUpdateAccount: (x) => dispatch(fetchUpdateAccount(x)),
      fetchUpdatePhoto: (x) => dispatch(fetchUpdatePhoto(x)),
      addPhotoUpdated: (x) => dispatch(addPhotoUpdated(x)),
      addEmailUpdated: (x) => dispatch(addEmailUpdated(x)),
      addPasswordUpdated: (x) => dispatch(addPasswordUpdated(x)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountContainer)
  