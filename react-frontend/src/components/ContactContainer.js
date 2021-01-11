import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message} from 'semantic-ui-react'
import { fetchContact } from '../redux'
import '../App.css'

function ContactContainer (props) {

    const [contactBody, setContactBody] = useState('')

    if (props.contactSuccess) {
      setContactBody('')
    }
    const handleContactBodyChange = (e, data) => setContactBody(data.value)

    function handleSubmit() {
        props.fetchContact(contactBody)        
    }

return (

<div>

  {props.contactSuccess ? 
  <Message success>
      Email Sent!  We'll get back to you shortly.
  </Message> : ''}
  {props.contactFailure ?
    <Message warning>
      Huh, we're having trouble sending that message.
  </Message>
  : ''}
  <br/>
  <Form inverted onSubmit={handleSubmit}>
    <Form.TextArea 
      value={contactBody}
      placeholder="What's on your mind?"
      onChange={handleContactBodyChange} />

    {props.contactLoading ? <Form.Button loading color='green' floated='right' content='Contact!' /> : <Form.Button color='green' floated='right' content='Contact!' />}<br/>
  </Form>
  <br/><br/>  
</div>

)
}

const mapStateToProps = state => {
    return {
      contactLoading: state.usersFromRootReducer.contactLoading,
      contactSuccess: state.usersFromRootReducer.contactSuccess,
      contactFailure: state.usersFromRootReducer.contactFailure,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchContact: (x) => dispatch(fetchContact(x)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ContactContainer)
  