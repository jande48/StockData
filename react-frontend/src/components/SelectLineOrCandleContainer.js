import React, {useState} from 'react'
import { connect } from 'react-redux'
import { addLineChart} from '../redux'
import { Form, Button} from "semantic-ui-react"



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
    <div>
      <Form>
        <Form.Field>
            <Button toggle active={displayPriceChart} onClick={handlePriceClickLine}>
                Line Chart
            </Button>
            <Button toggle active={!displayPriceChart} onClick={handlePriceClickCandle}>
                Candle Stick
            </Button>
        </Form.Field>
    </Form>
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












