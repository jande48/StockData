import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { addEndDate, addStartDate } from '../redux'
import {  Menu, Grid} from "semantic-ui-react"
import { fetchStockData } from '../redux'



function SelectDatesFromMenuContainer(props) {
  const [activeItemDateMenu, setActiveItemDateMenu] = useState('6m');
  var currentDateInit = new Date()
  var newDate = currentDateInit.setTime(currentDateInit.getTime() - (24*60*60*1000) * 182);
  const [startDate, setStartDate] = useState(currentDateInit);
  const [endDate, setEndDate] = useState(new Date())

  function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}

  useEffect(() => {

      const d = startDate.getTime();

      if (props.stockData.length != 'undefined') {
        if(props.stockData.length > 0) {
          var dateSplit = props.stockData[0]['date'].split("-")
          var stockDataDateOne = new Date(String(parseInt(dateSplit[0])),String(parseInt(dateSplit[1])),String(parseInt(dateSplit[2])))
          if (d < stockDataDateOne.getTime()) {
            props.fetchStockData(String(props.tickers+"/"+convertDatesToString(startDate)+"/"+convertDatesToString(endDate)))
          }
        }
      }
    
     
      
  },[props.tickers,startDate,endDate])

  function handleDateClick(minusDays, name) {
      setActiveItemDateMenu(name)
      var currentDate = new Date() //theRealCurrentDate2;

      var dateOffset = (24*60*60*1000) * minusDays; 
      var newDate = currentDate.setTime(currentDate.getTime() - ((24*60*60*1000) * minusDays));

      setStartDate(currentDate);
      props.addStartDateDispatch(currentDate)
      props.addEndDateDispatch(endDate)
      //props.addStartDateDispatch(currentDate)
      //props.addEndDateDispatch(endDate)
      // getAndSetStockData(ticker,currentDate,endDate) 
      // getAndSetFinancials(ticker);
      // getAndSetEarnings(ticker);
      }

  return (
    <div>
        <Menu widths={4} inverted>
            <Menu.Item
            name='5d'
            active={activeItemDateMenu === '5d'}
            onClick={() => handleDateClick(8, '5d')}
            >
            5 d
            </Menu.Item>
            <Menu.Item
            name='1m'
            active={activeItemDateMenu === '1m'}
            onClick={() => handleDateClick(30, '1m')}
            >
            1 m
            </Menu.Item>
            
            <Menu.Item
            name='6m'
            active={activeItemDateMenu === '6m'}
            onClick={() => handleDateClick(180, '6m')}
            >
            6 m
            </Menu.Item>
            
            <Menu.Item
            name='1y'
            active={activeItemDateMenu === '1y'}
            onClick={() => handleDateClick(365, '1y')}
            >
            1 y
            </Menu.Item>
            
        </Menu>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDateProps: state.datesFromRootReducer.startDate,
    endDateProps: state.datesFromRootReducer.endDate,
    stockData: state.stockDataFromRootReducer.stockData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addStartDateDispatch: startDate => dispatch(addStartDate(startDate)),
    addEndDateDispatch: endDate => dispatch(addEndDate(endDate)),
    fetchStockData: (APIstring) => dispatch(fetchStockData(APIstring)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDatesFromMenuContainer)