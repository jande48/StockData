import React, {useState, useEffect, useRef} from 'react';
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu } from "semantic-ui-react"
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

export const StockDataDateForm = () => {

	const [startDate, setStartDate] = useState(new Date(2020,7,1,0,0,0,0));
	const [endDate, setEndDate] = useState(new Date());
	const [stockData, setStockData] = useState([]);
	const [ticker, setTicker] = useState('AAPL');
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
	const [fakeStockData, setFakeStockDate] = useState([5,10,1,3])
	const [fakeSize, setFakeSize] = useState([500,500])
	const chartNode = useRef(null);

	function handleStartDateClick(date) {
		if (date !== startDate) {
			setStartDate(date)
		}

		fetch("/get_stock_data/"+ticker+"/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
		createBarChart();
	  }
	
	function handleDateClick(minusDays, name) {
		setActiveItemDateMenu(name)
		
		var currentDate = new Date();
		var dateOffset = (24*60*60*1000) * minusDays; //5 days
		var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
		setStartDate(currentDate);
		fetch("/get_stock_data/"+ticker+"/"+currentDate.getFullYear()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			); 
		createBarChart();
	}

	function handleEndDateClick(date) {
		setEndDate(date)
		fetch("/get_stock_data/"+ticker+"/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()).then(response => 
			response.json().then(data => {
				// var newJSON = (data) => {
				// 	Object.keys(data).map(function(key,index) {
				// 			newJSON["date"]=key;
				// 			newJSON["open"]=data[key].open;
				// 			newJSON["high"]=data[key].high;
				// 			newJSON["low"]=data[key].low;
				// 			newJSON["close"].data[key].close;
				// 		};
				
				// console.log(newJSON);
				setStockData(data);
			})
			)
		createBarChart();
	}


	function handleTickerFormSubmit() {
		fetch("/get_stock_data/"+ticker+"/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
		createBarChart();
	}


	function createBarChart() {
		const node = chartNode.current
		const dataMax = max(fakeStockData)
		const yScale = scaleLinear()
		   .domain([0, dataMax])
		   .range([0, fakeSize[1]])

		select(node)
			.selectAll('rect')
			.data(fakeStockData)
			.enter()
			.append('rect')
		
		select(node)
			.selectAll('rect')
			.data(fakeStockData)
			.exit()
			.remove()
		
		select(node)
			.selectAll('rect')
			.data(fakeStockData)
			.style('fill', '#fe9922')
			.attr('x', (d,i) => i * 25)
			.attr('y', d => fakeSize[1] - yScale(d))
			.attr('height', d => yScale(d))
			.attr('width', 25)
	 }

	return (
		<div>
			<Menu>
				<Form>
					<Input 
						placeholder="Add ticker ex) APPL" 
						value={ticker}
						name='ticker'
						onChange={(e) => setTicker(e.target.value)}
						isClearable
					/>
					<Button animated primary onClick={handleTickerFormSubmit}>
						<Button.Content visible>Add</Button.Content>
						<Button.Content hidden>
							<Icon name='arrow right' />
						</Button.Content>
					</Button>
				</Form>
			
				<Menu.Item
				name='5d'
				active={activeItemDateMenu === '5d'}
				onClick={() => handleDateClick(5, '5d')}
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
				<Menu.Item
				name='StartDate'
				position='right'
				>
				Custom:
				<DatePicker 
				selected={startDate} 
				maxDate={new Date()} 
				onChange={date => handleStartDateClick(date)}
				placeholderText='MM/DD/YYYY'
				isClearable
				showYearDropdown
				scrollableMonthYearDropdown />
				To: 
				<DatePicker 
				selected={endDate} 
				maxDate={new Date()}
				onChange={date => handleEndDateClick(date)}
				placeholderText='MM/DD/YYYY'
				isClearable
				showYearDropdown
				scrollableMonthYearDropdown />
				</Menu.Item>
			</Menu>
			<List>
				{Object.keys(stockData).map(function(key,index) {
					return(
						<List.Item key={stockData[key].close}>
							<Header>Date: {key}</Header>
							<p>Open: {stockData[key].open}</p>
							<p>High: {stockData[key].high}</p>
							<p>Low: {stockData[key].low}</p>
							<p>Close: {stockData[key].close}</p>
						</List.Item>
					)
				})}
        	</List>
			<div>
			<svg ref={chartNode}
      			width={500} height={500}>
      		</svg>
			</div>
		</div>
		
	);
} 
   


{/* <p> Start Date: </p>
			<DatePicker 
				selected={startDate} 
				maxDate={new Date()} 
				onChange={date => handleStartDateClick(date)}
				placeholderText='MM/DD/YYYY'
				isClearable
				showYearDropdown
				scrollableMonthYearDropdown />
			<p> End Date: </p>
			
			<DatePicker 
				selected={endDate} 
				maxDate={new Date()}
				onChange={date => handleEndDateClick(date)}
				placeholderText='MM/DD/YYYY'
				isClearable
				showYearDropdown
				scrollableMonthYearDropdown />

			<List>
				{Object.keys(stockData).map(function(key,index) {
					return(
						<List.Item key={stockData[key].close}>
							<Header>Date: {key}</Header>
							<p>Open: {stockData[key].open}</p>
							<p>High: {stockData[key].high}</p>
							<p>Low: {stockData[key].low}</p>
							<p>Close: {stockData[key].close}</p>
						</List.Item>
					)
				})}
        	</List>

		</div> */}


		
			{/*
				 <Form.Group>
					<Form.Input
						placeholder="Add ticker ex) APPL"
						// name='InputtedTicker' 
						value={ticker}
						onChange={e => setTicker(e.target.value)}
						isClearable>
					</Form.Input>
					<Form.Button 
						animated 
						primary
						onClick={
							handleTickerFormSubmit()
						}>
						<Form.Button.Content visible>Add</Form.Button.Content>
						<Form.Button.Content hidden>
							<Icon name='arrow right' />
						</Form.Button.Content>
					</Form.Button>
				</Form.Group> */}

