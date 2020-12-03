import React, { useState, Component, useCallback } from 'react'
import { connect } from 'react-redux'
import { Form, Message } from 'semantic-ui-react'

import '../App.css'


function PostFormContainer (props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')

    const handleTitleChange = (e, data) => setTitle(data.value)
    const handleContentChange = (e, data) => setContent(data.value)


    


    function handleSubmit() {
        
        console.log(title)
        console.log(content)
    }

return (

<div>
        <Form inverted onSubmit={handleSubmit}>

            <Form.Input
              placeholder='Title'
              name='title'
              value={title}
              onChange={handleTitleChange}
            />
            <Form.TextArea
              placeholder='Share you insights and Due Diligence with the community'
              name='content'
              value={content}
              onChange={handleContentChange}
            />
            <Form.Button content='Submit' />
            <Message warning>
                <Message.Header>Please login or sign up to post content</Message.Header>
            </Message>
)
        </Form>
      </div>

)
}

const mapStateToProps = state => {
    return {
      tickers: state.tickersFromRootReducer.tickers,
      startDate: state.datesFromRootReducer.startDate,
      endDate: state.datesFromRootReducer.endDate,
      stockData: state.stockDataFromRootReducer.stockData,
      loading: state.stockDataFromRootReducer.loading,
      trendLoading: state.trendFromRootReducer.trendLoading,
      momentumLoading: state.momentumFromRootReducer.momentumLoading,
      error: state.stockDataFromRootReducer.error,
      errorMessage: state.stockDataFromRootReducer.errorMessage,
      trendData: state.trendFromRootReducer.trendData,
      compName: state.tickersFromRootReducer.name,
      percentChange: state.tickersFromRootReducer.percentChange,
      stockPriceForPercentChange: state.tickersFromRootReducer.stockPriceForPercentChange,
      endDateForPercentChange: state.tickersFromRootReducer.endDateForPercentChange,
      splicedStartDate: state.tickersFromRootReducer.splicedStartDate,
      splicedIndexStockData: state.tickersFromRootReducer.splicedIndexStockData,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      //addPercentChange: (percentChange) => dispatch(addPercentChange(percentChange)),
      //addStockPriceForPercentChange: (stockPrice) => dispatch(addStockPriceForPercentChange(stockPrice))
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostFormContainer)
  