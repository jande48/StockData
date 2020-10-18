import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { addStartDate } from '../redux'
import { Input, Form, Icon, Button, Menu} from "semantic-ui-react"



function SelectDatesFromMenuContainer(props) {
    const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
    var currentDate = new Date();
	var dateOffset = (24*60*60*1000) * 182; 
	var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
	const [startDate, setStartDate] = useState(currentDate);

    function handleDateClick(minusDays, name) {
        setActiveItemDateMenu(name)
        
        var currentDate = new Date();
        var dateOffset = (24*60*60*1000) * minusDays; 
        var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
        setStartDate(currentDate);
        props.addStartDateDispatch(startDate)
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

const mapStateToProps = state => {
  return {
    startDate: state.datesFromRootReducer.startDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addStartDateDispatch: startDate => dispatch(addStartDate(startDate))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDatesFromMenuContainer)