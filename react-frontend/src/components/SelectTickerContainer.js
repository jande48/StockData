import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { addTicker } from '../redux'
import { Input, Form, Icon, Button} from "semantic-ui-react"


function SelectTickerContainer(props) {
  const [newTicker, setNewTicker] = useState('')

  return (
    <div>
      <Form>
        <Input 
            placeholder="Add ticker ex) APPL" 
            value={newTicker}
            name='newTicker'
            onChange={(e) => setNewTicker(e.target.value)}
            isClearable
        />
        <Button animated primary onClick={(e) => props.addTickerDispatch(newTicker)}>
            <Button.Content visible>Go!</Button.Content>
            <Button.Content hidden>
                <Icon name='arrow right' />
            </Button.Content>
        </Button>
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