import React, {useState} from 'react'
import { connect } from 'react-redux'
import { addLineChart} from '../redux'
import { Form, Button, Grid} from "semantic-ui-react"

function SelectLineOrCandle(props) {
  const [displayPriceChart, setDisplayPriceChart] = useState(true)
  const handlePriceClickLine = (event, {value}) => {
      if (displayPriceChart != true) {
        setDisplayPriceChart(true)
        props.addLineCandleDispatch(true)
      }
  }
  const handlePriceClickCandle = (event, {value}) => {
      if (displayPriceChart != false) {
        setDisplayPriceChart(false)
        props.addLineCandleDispatch(false)
      }
  }

  return (
    <div background-color='black'>
    <Grid columns='equal' inverted centered>
        <Grid.Row color='black' textAlign='center' stretched>
      <Form inverted stretched>
        <Form.Field inverted>
            <Button toggle active={displayPriceChart} color={displayPriceChart ? 'blue' : null} onClick={handlePriceClickLine}>
                Line Chart
            </Button>
            <Button toggle active={!displayPriceChart} color={!displayPriceChart ? 'blue' : null} onClick={handlePriceClickCandle}>
                Candle Stick
            </Button>
        </Form.Field>
      </Form>
      </Grid.Row>
    </Grid>
    </div>
  )
}

// const mapStateToProps = state => {
//   return {
//     startDate: state.datesFromRootReducer.startDate,
//     endDate: state.datesFromRootReducer.endDate
//   }
// }

const mapDispatchToProps = dispatch => {
  return {
    addLineCandleDispatch: display => dispatch(addLineChart(display))
  }
}

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(SelectLineOrCandle)












