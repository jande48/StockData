import React, { useEffect, useState, createRef } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Input, Grid, Image, Button } from 'semantic-ui-react'
import { fetchUpdateAccount } from '../redux'
import { Redirect } from "react-router-dom";
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'



function AccountContainer (props) {
    const [email, setEmail] = useState('')
    const [file, setFile] = useState('')
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    //const handleEmailChange = (e, data) => setEmail(data.value)
    const fileInputRef = createRef()

    useEffect(() => {
      checkEmail()
    },[email])

    function handleEmailChange (e, data) {
      if (typeof(data) != 'undefined') {
        setEmail(data.value)
      }
    }

    function handleFileChange (e, data) {
      if (typeof(e) != 'undefined') {
        setFile(e.target.files[0])
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
      
      if (!showEmailWarning){
        
        const payload = {}
        if (file != '') {
          const formPic = new FormData()
          formPic.append("file", file)
          console.log(formPic)
          Object.assign(payload,{"file": formPic})
          console.log(payload)
          //payload.append("file", file)
        }
        if (email != '') {
          Object.assign(payload,{"email": email})
        }
        props.fetchUpdateAccount(payload) 
      }
  }
  console.log(file)
return (
  
  <div>
    { !props.isAuthenticated ? <Redirect to="/" /> : 
      <Grid columns='equal'>
      <Grid.Column></Grid.Column>
      
      <Grid.Column width={8} className='lightGrayBackground'>
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
      

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUpdateAccount: (x) => dispatch(fetchUpdateAccount(x)),

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountContainer)
  