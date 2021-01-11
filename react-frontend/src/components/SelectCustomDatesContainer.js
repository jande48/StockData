import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addEndDate, addStartDate, addEndDateForPercentChange } from '../redux'
import { Header, Grid} from "semantic-ui-react"
import { fetchStockData } from '../redux'


function SelectCustomDatesContainer(props) {

  var currentDateInit = new Date()
  var newDate = currentDateInit.setTime(currentDateInit.getTime() - (24*60*60*1000) * 182);
  const [startDate, setStartDate] = useState(currentDateInit);
  const [endDate, setEndDate] = useState(new Date())
  function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}
  useEffect(() => {
    props.fetchStockData(String(props.tickers+"/"+convertDatesToString(startDate)+"/"+convertDatesToString(endDate)))
  },[props.tickers,startDate,endDate])

  function handleStartDateClick(date) {
		if (date !== startDate) {
      setStartDate(date)
      props.addStartDateDispatch(date)
		}
  }
  
  function handleEndDateClick(date) {
		if (date !== endDate) {
      setEndDate(date)
      props.addEndDateDispatch(date)
      props.addEndDateForPercentChange(date)
		}
	}

  return (
    <div class="fullWidth">
      <Grid columns='equal' inverted>
        <Grid.Row stretched color='black'>
          <Grid.Column width={4}>
            <Header as='h5' inverted textAlign='center'>Start:</Header>
          </Grid.Column>
          <Grid.Column>
            <DatePicker
            fluid 
            selected={props.startDateProps} 
            maxDate={new Date()} 
            onChange={date => handleStartDateClick(date)}
            placeholderText='MM/DD/YYYY'
            showYearDropdown
            scrollableMonthYearDropdown 
            inverted/>
          </Grid.Column>
        </Grid.Row>
          <Grid.Column width={4} color='black'>
            <Header as='h5' inverted textAlign='center'>End:</Header>
          </Grid.Column>
          <Grid.Column color='black'>
            <DatePicker 
            fluid
            selected={props.endDateProps} 
            maxDate={new Date()} 
            onChange={date => handleEndDateClick(date)}
            placeholderText='MM/DD/YYYY'
            //isClearable
            showYearDropdown
            scrollableMonthYearDropdown
            inverted />
          </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDateProps: state.datesFromRootReducer.startDate,
    endDateProps: state.datesFromRootReducer.endDate,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addStartDateDispatch: startDate => dispatch(addStartDate(startDate)),
    addEndDateDispatch: endDate => dispatch(addEndDate(endDate)),
    fetchStockData: (APIstring) => dispatch(fetchStockData(APIstring)),
    addEndDateForPercentChange: endDate => dispatch(addEndDateForPercentChange(endDate))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectCustomDatesContainer)



