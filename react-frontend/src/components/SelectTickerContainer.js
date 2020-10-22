import React, {useState} from 'react'
import { connect } from 'react-redux'
import { addTicker } from '../redux'
import { Input, Form, Icon, Button, Grid} from "semantic-ui-react"


function SelectTickerContainer(props) {
  const [newTicker, setNewTicker] = useState('')

  return (
    <div>
      <Form>
        <Grid columns='equal'>
          <Grid.Row stretched>
          <Grid.Column>
            <Input 
              placeholder="Add ticker ex) APPL" 
              value={newTicker}
              name='newTicker'
              fluid
              onChange={(e) => setNewTicker(e.target.value)}
              isClearable
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
    tickers: state.tickersFromRootReducer.tickers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTickerDispatch: newTicker => dispatch(addTicker(newTicker))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTickerContainer)