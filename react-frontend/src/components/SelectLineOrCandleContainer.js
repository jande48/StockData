import React, {useState} from 'react'
import { connect } from 'react-redux'
import { addLineChart} from '../redux'
import { Form, Button, Grid, Icon} from "semantic-ui-react"

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
//color={displayPriceChart ? 'blue' : null}
  return (
    <div background-color='black'>
    <Grid columns='equal' inverted centered>
        <Grid.Row color='black' textAlign='center' stretched>
      <Form inverted stretched>
        <Form.Field inverted>
            <Button icon basic inverted color={displayPriceChart ? 'green' : ''} active={displayPriceChart} onClick={handlePriceClickLine}>
                <Icon name='chart line' />
            </Button>
            <Button icon basic inverted color={!displayPriceChart ? 'green' : ''} active={!displayPriceChart} onClick={handlePriceClickCandle}>
                <Icon name='chart bar' />
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












