import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header } from 'semantic-ui-react'
import { fetchUserAuth, createNewPost } from '../redux'
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'


function PostFormContainer (props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const handleTitleChange = (e, data) => setTitle(data.value)
    const handleContentChange = (e, data) => setContent(data.value)

    useEffect(() => {
      props.fetchUserAuth(2)
    },[])

    //setAuthorizationToken(localStorage.jwtToken)


    function handleSubmit() {
        if (props.userAuth['isAuthenticated']) {
          var chartData = {'hello': 1}
          const payload = {
            'title': title,
            'content': content,
            'user_id': props.userAuth['username'],
            'chartData': JSON.stringify({'charts':props.charts,'dates':props.dates,'momentum':props.momentum,'stockData':props.stockData,'trend':props.trend,'volatility':props.volatility})
          }
          props.createNewPost(payload)
        } else {
          setShowWarning(true)
        }
        
    }

return (

<div>
  { showWarning ? 
  <Message warning>
      <Message.Header>Please <a style={{color: "green"}} href="/login">login</a> or <a style={{color: "green"}} href="/register">sign up</a> to post content</Message.Header>
  </Message>
  : ''}
  { props.postResponse['type'] == 'success' ? 
  <Message success>
      <Message.Header>Your post has been shared! See it on the <a style={{color: "green"}} href="/fourm">Forum</a></Message.Header>
  </Message>
  : ''}
  <Header inverted as='h3'>Share these charts and your insight on the forum: </Header>
  <Form inverted onSubmit={handleSubmit}>

    <Form.Input
      placeholder='Title'
      name='title'
      value={title}
      onChange={handleTitleChange}
    />
    <Form.TextArea
      placeholder='Share you insights and get feedback from the community'
      name='content'
      value={content}
      onChange={handleContentChange}
    />
    <Form.Button inverted color='green' floated='right' content='Submit' /><br/>
    

  </Form><br/>
</div>

)
}

const mapStateToProps = state => {
    return {
      userAuth: state.usersFromRootReducer.userAuth,
      postResponse: state.usersFromRootReducer.postResponse,
      charts: state.chartsFromRootReducer,
      dates: state.datesFromRootReducer,
      momentum: state.momentumFromRootReducer,
      stockData: state.stockDataFromRootReducer,
      trend: state.trendFromRootReducer,
      volatility: state.volatilityFromRootReducer,

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUserAuth: (x) => dispatch(fetchUserAuth(x)),
      createNewPost: (data) => dispatch(createNewPost(data)),

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostFormContainer)
  