import React from 'react'
import { connect } from 'react-redux'
import { nForDPO } from '../../../redux'
import { Grid, Form, Select} from "semantic-ui-react"

function DPOcontentPanel(props) {

    const momentumNtradingDayOptions = [
        { key: 'one', text: '1', value: 1 },
        { key: 'two', text: '2', value: 2 },
        { key: 'three', text: '3', value: 3 },
        { key: 'four', text: '4', value: 4 },
        { key: 'five', text: '5', value: 5 },
        { key: 'six', text: '6', value: 6 },
        { key: 'seven', text: '7', value: 7 },
        { key: 'eight', text: '8', value: 8 },
        { key: 'nine', text: '9', value: 9 },
        { key: 'ten', text: '10', value: 10 },
        { key: 'eleven', text: '11', value: 11 },
        { key: 'twelve', text: '12', value: 12 },
        { key: 'thirteen', text: '13', value: 13 },
        { key: 'fourteen', text: '14', value: 14 },
        { key: 'fifteen', text: '15', value: 15 },
        { key: 'sixteen', text: '16', value: 16 },
        { key: 'seventeen', text: '17', value: 17 },
        { key: 'eighteen', text: '18', value: 18 },
        { key: 'ninteen', text: '19', value: 19 },
        { key: 'twenty', text: '20', value: 20 },
        { key: 'twentyone', text: '21', value: 21 },
        { key: 'twentytwo', text: '22', value: 22 },
        { key: 'twentythree', text: '23', value: 23 },
        { key: 'twentyfour', text: '24', value: 24 },
        { key: 'twentyfive', text: '25', value: 25 },
        { key: 'twentysix', text: '26', value: 26 },
        { key: 'twentyseven', text: '27', value: 27 },
        { key: 'twentyeight', text: '28', value: 28 },
        { key: 'twentynine', text: '29', value: 29 },
        { key: 'thirty', text: '30', value: 30 },
        { key: 'thirtyone', text: '31', value: 31 },
        { key: 'thirtytwo', text: '32', value: 32 },
        { key: 'thirtythree', text: '33', value: 33 },
        { key: 'thirtyfour', text: '34', value: 34 },
        { key: 'thirtyfive', text: '35', value: 35 }
    ]
    return (
    <Grid columns='equal'>
        <Grid.Row>
            <Grid.Column>
                <br/>'Period (n): '
            </Grid.Column>
            <Grid.Column width={4}>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    placeholder='20'
                    compact
                    onChange ={(e,selectedOption) => {
                        props.nForDPOdispatch(selectedOption.value)
                        }}
                />
            </Grid.Column>
        </Grid.Row>
        
        </Grid>
        )
}

const mapStateToProps = state => {
  return {
    nForDPO: state.trendFromRootReducer.nForDPO,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    nForDPOdispatch: x => dispatch(nForDPO(x)),

  }
}

  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DPOcontentPanel)
