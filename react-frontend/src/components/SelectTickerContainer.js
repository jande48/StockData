import React, {useState, useRef, useCallback} from 'react'
import { connect } from 'react-redux'
import { addTicker, fetchCompInfoData, fetchCompInfoDataRequest } from '../redux'
import { Input, Form, Icon, Button, Grid, Search, Label, Header} from "semantic-ui-react"
import _ from 'lodash'


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

  return (
    <div>
      <Form>
        <Grid columns='equal'>
          <Grid.Row stretched>
          <Grid.Column>
            {/* <Input 
              placeholder="Add ticker ex) APPL" 
              value={newTicker}
              name='newTicker'
              fluid
              onChange={(e) => setNewTicker(e.target.value)}
              isClearable
            /> */}
            <Search
              loading={props.loading}
              onResultSelect={(e, data) =>{
                console.log(data.result.symbol)
                props.addTickerDispatch(data.result.symbol)}
                //dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
              }
              onSearchChange={handleSearchChange}
              resultRenderer={resultRenderer}
              results={props.compInfo}
              //value={newTicker}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Button fluid color='green' animated onClick={(e) => props.addTickerDispatch(newTicker)}>
              <Button.Content visible>Go!</Button.Content>
              <Button.Content hidden>
                  <Icon name='arrow right' />
              </Button.Content>
            </Button>
          </Grid.Column>
          </Grid.Row>
        </Grid>
    </Form>
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTickerContainer)

