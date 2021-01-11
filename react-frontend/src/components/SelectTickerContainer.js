import React, {useState, useCallback} from 'react'
import { connect } from 'react-redux'
import { addCompanyName, addTicker, fetchCompInfoData, fetchCompInfoDataRequest, fetchCompanyNameFromTicker } from '../redux'
import {Icon, Button, Grid, Search, Label, Header} from "semantic-ui-react"
import './css/selectTickerCSS.css'

function SelectTickerContainer(props) {
  const [newTicker, setNewTicker] = useState('')
  
  const handleSearchChange = useCallback((e, data) => {

    let re = new RegExp('^[a-z0-9]+$')
    var regex_user_input = data.value.replace(/\W/g, '_').toUpperCase();
    fetchCompInfoDataRequest(regex_user_input)

    setNewTicker(e.target.value)
    props.fetchCompInfoData(regex_user_input)

  }, [])

  const resultRenderer = ({ name, symbol }) => {
  return(
    <Grid columns='equal'>
      <Grid.Row stretched>
        <Grid.Column>
          <Header as='h5' content={name} />
        </Grid.Column>
        <Grid.Column>
          <Label content={symbol} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    )
  }

  return (
    <div class="fullWidth">
      <Grid stretched columns="equal">
        <Grid.Row verticalAlign='top' borderless stretched>
          <Grid.Column borderless className="fullWidthColumn"> 
          <Search
              input={{ fluid: true }}
              fluid
              loading={props.loading}
              onResultSelect={(e, data) =>{
                props.addCompanyName(data.result.name)
                props.addTickerDispatch(data.result.symbol)
                }
              }
              placeholder='Search company or ticker'
              onSearchChange={handleSearchChange}
              resultRenderer={resultRenderer}
              results={props.compInfo}
            inverted/>
          </Grid.Column>
          <Grid.Column borderless width={3} className="fullWidthColumn"> 
            <Button icon basic inverted color='green' floated='left'  onClick={(e) => {
                props.addTickerDispatch(newTicker)
                props.fetchCompanyNameFromTicker(newTicker)
              }}>
                <Icon name='arrow right' />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid> 
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    loading: state.tickersFromRootReducer.loading,
    compInfo: state.tickersFromRootReducer.compInfo,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTickerDispatch: newTicker => dispatch(addTicker(newTicker)),
    fetchCompInfoData: (APIstring) => dispatch(fetchCompInfoData(APIstring)),
    fetchCompInfoDataRequest: (userInput) => dispatch(fetchCompInfoDataRequest(userInput)),
    addCompanyName: (selectedName) => dispatch(addCompanyName(selectedName)),
    fetchCompanyNameFromTicker: (ticker) => (dispatch(fetchCompanyNameFromTicker(ticker)))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTickerContainer)

