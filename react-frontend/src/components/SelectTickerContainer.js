import React, {useState, useRef, useCallback} from 'react'
import { connect } from 'react-redux'
import { addCompanyName, addTicker, displayEMA, fetchCompInfoData, fetchCompInfoDataRequest, fetchCompanyNameFromTicker, fetchStockData } from '../redux'
import { Input, Form, Icon, Button, Grid, Search, Label, Header} from "semantic-ui-react"

import _ from 'lodash'
import './css/selectTickerCSS.css'

function SelectTickerContainer(props) {
  const [newTicker, setNewTicker] = useState('')
  //const timeoutRef = useRef()

  const handleSearchChange = useCallback((e, data) => {
    
    //clearTimeout(timeoutRef.current)
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


// color='black' stretched
  return (
    <div>
      <Grid columns='equal' centered>
        <Grid.Row verticalAlign='top'>
          <Grid.Column>
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
              //value={props.tickers}
            inverted/>
          </Grid.Column>
          <Grid.Column width={3}>
            <Button icon basic inverted color='green' onClick={(e) => {
                props.addTickerDispatch(newTicker)
                props.fetchCompanyNameFromTicker(newTicker)
              }}>
                <Icon name='arrow right' />
            </Button>
            {/* <Button color='green' animated onClick={(e) => {
                props.addTickerDispatch(newTicker)
                props.fetchCompanyNameFromTicker(newTicker)
              }}>
              <Button.Content visible>Go!</Button.Content>
              <Button.Content hidden>
                  <Icon name='arrow right' />
              </Button.Content>
            </Button> */}
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




{/* <Form> */}
        {/* <Grid container columns='equal' inverted centered> */}
        {/* <Grid.Row color='black' textAlign='center' stretched> */}
        // <Form inverted stretched>
        // <Form.Field inverted inline>
        // <Form.Search
        //       loading={props.loading}
        //       onResultSelect={(e, data) =>{
        //         props.addCompanyName(data.result.name)
        //         props.addTickerDispatch(data.result.symbol)
        //         }
        //       }
        //       placeholder='Search company or ticker'
        //       onSearchChange={handleSearchChange}
        //       resultRenderer={resultRenderer}
        //       results={props.compInfo}
        //       //value={newTicker}
        //     inverted/>
        //     <Form.Button color='green' animated onClick={(e) => {
        //       props.addTickerDispatch(newTicker)
        //       props.fetchCompanyNameFromTicker(newTicker)
        //     }}>
        //       <Form.Button.Content visible>Go!</Form.Button.Content>
        //       <Form.Button.Content hidden>
        //           <Icon name='arrow right' />
        //       </Form.Button.Content>
        //     </Form.Button>
        // </Form.Field>
        // </Form>
        {/* </Grid.Row> */}
          {/* <Grid.Row stretched color='black'> */}
          {/* <Grid.Column color='black' className='noPadding'>
            <Search
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
              //value={newTicker}
            inverted/>
          </Grid.Column>
          <Grid.Column color='black' width={4}>
            <Button floated='left' color='green' animated onClick={(e) => {
              props.addTickerDispatch(newTicker)
              props.fetchCompanyNameFromTicker(newTicker)
            }}>
              <Button.Content visible>Go!</Button.Content>
              <Button.Content hidden>
                  <Icon name='arrow right' />
              </Button.Content>
            </Button>
          </Grid.Column> */}
          {/* </Grid.Row> */}
        {/* </Grid> */}
    {/* </Form> */}