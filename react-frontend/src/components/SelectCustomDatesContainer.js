import React, {useState} from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addEndDate, addStartDate } from '../redux'
import { Header, Grid} from "semantic-ui-react"



function SelectCustomDatesContainer(props) {

  var currentDateInit = new Date()
  var newDate = currentDateInit.setTime(currentDateInit.getTime() - (24*60*60*1000) * 182);
  const [startDate, setStartDate] = useState(currentDateInit);
  const [endDate, setEndDate] = useState(new Date())
  // var currentDate = new Date();
	// var dateOffset = (24*60*60*1000) * 182; 
	// var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
  // const [startDate, setStartDate] = useState(currentDate);
  // const [endDate, setEndDate] = useState(new Date())
  // var currentDate2 = new Date();
  // const maxDateAllowed = currentDate2.setTime(currentDate.getTime() - (24*60*60*1000) * 365);

  function handleStartDateClick(date) {
		if (date !== startDate) {
      setStartDate(date)
      props.addStartDateDispatch(date)
		}
		// getAndSetStockData(ticker,date,endDate)
		// getAndSetFinancials(ticker);
		// getAndSetEarnings(ticker);
  }
  
  function handleEndDateClick(date) {
		if (date !== endDate) {
      setEndDate(date)
      props.addEndDateDispatch(date)
		}
		// getAndSetStockData(ticker,date,endDate)
		// getAndSetFinancials(ticker);
		// getAndSetEarnings(ticker);
	}

  return (
    <div>
      <Header as='h3' textAlign='center'>
            Custom Dates
            {/* <Header.Content textAlign='center'></Header.Content> */}
      </Header>
      <Grid columns='equal'>
        {/* <Grid.Row>
          <Header as='h3' textAlign='center'>
            Custom Dates
            {/* <Header.Content textAlign='center'></Header.Content>
          </Header>
        </Grid.Row> */}
        <Grid.Row stretched>
          <Grid.Column width={4}>
            <Header as='h5'>Start:</Header>
          </Grid.Column>
          <Grid.Column>
            <DatePicker
            fluid 
            selected={startDate} 
            maxDate={new Date()} 
            onChange={date => handleStartDateClick(date)}
            placeholderText='MM/DD/YYYY'
            //isClearable
            showYearDropdown
            scrollableMonthYearDropdown />
          </Grid.Column>
        </Grid.Row>
          <Grid.Column width={4}>
            <Header as='h5'>End:</Header>
          </Grid.Column>
          <Grid.Column>
            <DatePicker 
            fluid
            selected={endDate} 
            maxDate={new Date()} 
            onChange={date => handleEndDateClick(date)}
            placeholderText='MM/DD/YYYY'
            //isClearable
            showYearDropdown
            scrollableMonthYearDropdown />
          </Grid.Column>
      </Grid>
      
      {/* <br/>Start:
      <DatePicker 
          selected={startDate} 
          maxDate={new Date()} 
          onChange={date => handleStartDateClick(date)}
          placeholderText='MM/DD/YYYY'
          isClearable
          showYearDropdown
          scrollableMonthYearDropdown />
      <br/>End:
      <DatePicker 
          selected={endDate} 
          maxDate={new Date()} 
          onChange={date => handleEndDateClick(date)}
          placeholderText='MM/DD/YYYY'
          isClearable
          showYearDropdown
          scrollableMonthYearDropdown /> */}
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
    addStartDateDispatch: startDate => dispatch(addStartDate(startDate)),
    addEndDateDispatch: endDate => dispatch(addEndDate(endDate))
  }
}

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(SelectCustomDatesContainer)



