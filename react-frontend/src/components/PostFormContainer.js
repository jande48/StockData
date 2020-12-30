import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Header, Checkbox, Grid } from 'semantic-ui-react'
import { addIncludeVolumeChart } from '../redux'
import {Link} from 'react-router-dom'
import { fetchUserAuth, createNewPost, addSubmitPostFailure, addSubmitPostSuccess } from '../redux'
import '../App.css'
import setAuthorizationToken from '../utils/setAuthorizationToken'
import { addIsAuthenticated } from '../redux/users/usersActions'

function PostFormContainer (props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const handleTitleChange = (e, data) => setTitle(data.value)
    const handleContentChange = (e, data) => setContent(data.value)
    

    useEffect(() => {
      props.fetchUserAuth(2)
      props.addSubmitPostFailure(false)
      props.addSubmitPostSuccess(false)
    },[])

    //setAuthorizationToken(localStorage.jwtToken)
    function handleIncludeVolume() {
      props.addIncludeVolumeChart(!props.includeVolumeChart)
    }

    function handleSubmit() {
        if (props.userAuth['isAuthenticated']) {
          
          var chartData = {'ticker':props.tickers,'stock':{}}
          const payload = {
            'title': title,
            'content': content,
            'user_id': props.userAuth['username'],
            'chartData': JSON.stringify({'charts':props.charts,'dates':props.dates,'volatility':props.volatility,'momentum':props.momentum,'stockData':props.stockData,'trend':props.trend,'tickers':props.tickers,'includeVolume':props.includeVolumeChart}),
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
      <Message.Header>Please <Link to="/login"><a style={{color: "green"}} href="#">login</a></Link> or <Link to="/register"><a style={{color: "green"}} href="#">sign up</a></Link> to post content</Message.Header>
  </Message>
  : ''}
  { props.submitPostSuccess ? 
  <Message success>
      <Message.Header>Your post has been shared! See it under <Link to="/posts"><a style={{color: "green"}} href="#">Posts</a></Link></Message.Header>
  </Message>
  : ''}
  { props.submitPostFailure ? 
  <Message warning>
      <Message.Header>Huh! We can't post that now. Please try later!</Message.Header>
  </Message>
  : ''}
  <Header inverted as='h3'>Share this chart and your insights: </Header>
  <Form inverted onSubmit={handleSubmit}>

    {/* <Form.Input
      placeholder='Title'
      name='title'
      value={title}
      onChange={handleTitleChange}
    /> */}
    <Form.TextArea
      placeholder="What's your opinion of this chart?"
      name='content'
      value={content}
      onChange={handleContentChange}
    />
    <Form.Group widths='equal'>
      <Form.Checkbox label='Include Volume Chart?' onClick={handleIncludeVolume} />
      {props.submitPostLoading ? <Form.Button loading secondary color='green' floated='right'/> : <Form.Button inverted color='green' floated='right' content='Submit' />}
    </Form.Group>
    
    <br/>
    

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
      volatility: state.volatilityFromtRootReducer,
      tickers: state.tickersFromRootReducer.tickers,
      startDate: state.datesFromRootReducer.startDate,
      endDate: state.datesFromRootReducer.endDate,
      dateMouseOverTicker: state.tickersFromRootReducer.dateMouseOverTicker,
      stockData: state.stockDataFromRootReducer.stockData,
      loading: state.stockDataFromRootReducer.loading,
      trendLoading: state.trendFromRootReducer.trendLoading,
      momentumLoading: state.momentumFromRootReducer.momentumLoading,
      error: state.stockDataFromRootReducer.error,
      errorMessage: state.stockDataFromRootReducer.errorMessage,
      fetchStockData: state.stockDataFromRootReducer.fetchStockData,
      displayLine: state.chartsFromRootReducer.displayLine,
      displaySMA: state.trendFromRootReducer.displaySMA,
      nForSMA: state.trendFromRootReducer.nForSMA,
      displayEMA: state.trendFromRootReducer.displayEMA,
      nForEMA: state.trendFromRootReducer.nForEMA,
      displayMACD: state.trendFromRootReducer.displayMACD,
      nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
      nFastForMACD: state.trendFromRootReducer.nFastForMACD,
      trendData: state.trendFromRootReducer.trendData,
      compName: state.tickersFromRootReducer.name,
      percentChange: state.tickersFromRootReducer.percentChange,
      displayMACDsignal: state.trendFromRootReducer.displayMACDsignal,
      nSlowForMACDsignal: state.trendFromRootReducer.nSlowForMACDsignal,
      nFastForMACDsignal: state.trendFromRootReducer.nFastForMACDsignal,
      nSignForMACDsignal: state.trendFromRootReducer.nSignForMACDsignal,
      displayADX: state.trendFromRootReducer.displayADX,
      nForADX: state.trendFromRootReducer.nForADX,
      displayADXP: state.trendFromRootReducer.displayADXP,
      nForADXP: state.trendFromRootReducer.nForADXP,
      displayADXN: state.trendFromRootReducer.displayADXN,
      nForADXN: state.trendFromRootReducer.nForADXN,
      displayVIPOS: state.trendFromRootReducer.displayVIPOS,
      nForVIPOS: state.trendFromRootReducer.nForVIPOS,
      displayVINEG: state.trendFromRootReducer.displayVINEG,
      nForVINEG: state.trendFromRootReducer.nForVINEG,
      displayTRIX: state.trendFromRootReducer.displayTRIX,
      nForTRIX: state.trendFromRootReducer.nForTRIX,
      displayMI: state.trendFromRootReducer.displayMI,
      nForMI: state.trendFromRootReducer.nForMI,
      n2ForMI: state.trendFromRootReducer.n2ForMI,
      displayDPO: state.trendFromRootReducer.displayDPO,
      nForDPO: state.trendFromRootReducer.nForDPO,
      financials: state.stockDataFromRootReducer.financialsData,
      displayATR: state.volatilityFromtRootReducer.displayATR,
      nForATR: state.volatilityFromtRootReducer.nForATR,
      displayBBSMA: state.volatilityFromtRootReducer.displayBBSMA,
      nForBBSMA: state.volatilityFromtRootReducer.nForBBSMA,
      displayBBUpper: state.volatilityFromtRootReducer.displayBBUpper,
      nForBBUpper: state.volatilityFromtRootReducer.nForBBUpper,
      ndevBBUpper: state.volatilityFromtRootReducer.ndevForBBUpper,
      displayBBLower: state.volatilityFromtRootReducer.displayBBLower,
      nForBBLower: state.volatilityFromtRootReducer.nForBBLower,
      ndevBBLower: state.volatilityFromtRootReducer.ndevForBBLower,
      displayKeltnerC: state.volatilityFromtRootReducer.displayKeltnerC,
      nForKeltnerC: state.volatilityFromtRootReducer.nForKeltnerC,
      volatilityData: state.volatilityFromtRootReducer.volatilityData,
      onMouseOverTicker: state.tickersFromRootReducer.onMouseOverTicker,
      dateMouseOverTicker: state.tickersFromRootReducer.dateMouseOverTicker,
      submitPostFailure: state.usersFromRootReducer.submitPostFailure,
      submitPostLoading: state.usersFromRootReducer.submitPostLoading,
      submitPostSuccess: state.usersFromRootReducer.submitPostSuccess,
      includeVolumeChart: state.usersFromRootReducer.includeVolumeChart,
      

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUserAuth: (x) => dispatch(fetchUserAuth(x)),
      createNewPost: (data) => dispatch(createNewPost(data)),
      addSubmitPostSuccess: (data) => dispatch(addSubmitPostSuccess(data)),
      addSubmitPostFailure: (data) => dispatch(addSubmitPostFailure(data)),
      addIncludeVolumeChart: (data) => dispatch(addIncludeVolumeChart(data))

    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostFormContainer)
  