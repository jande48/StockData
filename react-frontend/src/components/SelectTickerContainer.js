import React, {useState, useRef, useCallback} from 'react'
import { connect } from 'react-redux'
import { addCompanyName, addTicker, displayEMA, fetchCompInfoData, fetchCompInfoDataRequest, fetchCompanyNameFromTicker } from '../redux'
import { Input, Form, Icon, Button, Grid, Search, Label, Header} from "semantic-ui-react"
import _ from 'lodash'
import './css/selectTickerCSS.css'

function SelectTickerContainer(props) {
  const [newTicker, setNewTicker] = useState('')
  const timeoutRef = useRef()

  const handleSearchChange = useCallback((e, data) => {
    
    clearTimeout(timeoutRef.current)
    fetchCompInfoDataRequest(data.value)

    setNewTicker(e.target.value)
    props.fetchCompInfoData(String(data.value))
    // timeoutRef.current = setTimeout(() => {
    //   // const re = new RegExp(_.escapeRegExp(data.value), 'i')
    //   // const isMatch = (result) => re.test(result.name)

    //   console.log('We got Right before the api call')
    //   fetchCompInfoData(String(data.value))
    // }, 400)
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

  var columnStyle = {
    padding: "0 !important"
  };

  return (
    <div>
      <Grid inverted>
        <Grid.Row color='black' stretched>
          <Grid.Column color='black' width={12}>
          <Search
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
            <Button color='green' animated onClick={(e) => {
                props.addTickerDispatch(newTicker)
                props.fetchCompanyNameFromTicker(newTicker)
              }}>
              <Button.Content visible>Go!</Button.Content>
              <Button.Content hidden>
                  <Icon name='arrow right' />
              </Button.Content>
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