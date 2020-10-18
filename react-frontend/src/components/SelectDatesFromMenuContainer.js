import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { addEndDate, addStartDate } from '../redux'
import {  Menu} from "semantic-ui-react"
 



function SelectDatesFromMenuContainer(props) {
  const [activeItemDateMenu, setActiveItemDateMenu] = useState('6m');
  var currentDateInit = new Date()
  var newDate = currentDateInit.setTime(currentDateInit.getTime() - (24*60*60*1000) * 182);
  const [startDate, setStartDate] = useState(currentDateInit);
  const [endDate, setEndDate] = useState(new Date())


  function handleDateClick(minusDays, name) {
      setActiveItemDateMenu(name)
      var currentDate = new Date() //theRealCurrentDate2;
      var dateOffset = (24*60*60*1000) * minusDays; 
      var newDate = currentDate.setTime(currentDate.getTime() - ((24*60*60*1000) * minusDays));
      setStartDate( currentDate);
      props.addStartDateDispatch(currentDate)
      props.addEndDateDispatch(endDate)
      // getAndSetStockData(ticker,currentDate,endDate) 
      // getAndSetFinancials(ticker);
      // getAndSetEarnings(ticker);
      }

  return (
    <div>
        <Menu widths={4}>
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
  //mapStateToProps,
  null,
  mapDispatchToProps
)(SelectDatesFromMenuContainer)