import React, {useState, useEffect, StockData} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu } from "semantic-ui-react"



export const StockDataDateForm = () => {

	const [startDate, setStartDate] = useState(new Date(2020,7,1,0,0,0,0));
	const [endDate, setEndDate] = useState(new Date());
	const [stockData, setStockData] = useState([]);
	const [ticker, setTicker] = useState('AAPL');
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
	// const currentDate = new Date();
	// useEffect(() => {
	// 	fetch("/get_stock_data/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()).then(response => 
	// 	response.json().then(data => {
	// 		//console.log(Object.keys(data));
	// 		setStockData(data);
	// 	})
	// 	)
	// }, [])

	function handleStartDateClick(date) {
		if (date != startDate) {
			setStartDate(date)
		}

		fetch("/get_stock_data/"+ticker+"/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
	  }
	
	function handleDateClick(minusDays, name) {
		setActiveItemDateMenu(name)
		
		var currentDate = new Date();
		var dateOffset = (24*60*60*1000) * minusDays; //5 days
		var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
		//currentDate.setTime(currentDate.getTime() - dateOffset);
		console.log(minusDays);
		console.log("The old month is: "+(currentDate.getMonth()+1)+" the old day is: "+currentDate.getDate() );
		//console.log("The new month is: "+(newDate.getMonth()+1)+" the new day is: "+newDate.getDate() );
		setStartDate(currentDate);
		console.log("the start month is "+(currentDate.getMonth()+1)+" The start day is: "+currentDate.getDate())
		fetch("/get_stock_data/"+ticker+"/"+currentDate.getFullYear()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			); 
	}

	function handleEndDateClick(date) {
		setEndDate(date)
		fetch("/get_stock_data/"+ticker+"/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
	}


	function handleTickerFormSubmit() {
		fetch("/get_stock_data/"+ticker+"/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
	}


	console.log(startDate)
	return (
		<div>
			{/* <Form>
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



				{/* <Form.Field>
					<Container>
						<div class="equal width row">
							<div class="column">
								<Form.Input 
									placeholder="Add ticker ex) APPL" 
									value={ticker}
									onClick={e => setTicker(e.target.value)}
									isClearable
								
								/>
								<Form.Button animated primary onClick={handleTickerFormSubmit()}>
									<Form.Button.Content visible>Add</Form.Button.Content>
									<Form.Button.Content hidden>
										<Icon name='arrow right' />
									</Form.Button.Content>
								</Form.Button>
							</div>

						</div>
					</Container>
				</Form.Field> 		

			</Form> */}
			<Menu>
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
			<p> Start Date: </p>
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

		</div>
		
		
	);



} 
   


