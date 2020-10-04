import React, {useState, useEffect, useRef} from 'react';
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu, Segment, Accordion, Checkbox, Select } from "semantic-ui-react"
import { createCandleStickChart } from './charts/candleStickChart.js'
import { createVolumeBarChart } from './charts/volumeBarChart.js'
import { createEarningsChart } from './charts/earningChart.js'
import { createStockPriceLineChart } from './charts/stockPriceLineChart';
import { createMomentumIndicatorsChart } from './charts/momentumIndicatorsChart'

export const StockData = () => {
	var currentDate = new Date();
	var dateOffset = (24*60*60*1000) * 182; 
	var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
	
	const [startDate, setStartDate] = useState(currentDate);
	const [endDate, setEndDate] = useState(new Date());
	const [ticker, setTicker] = useState('AAPL');
	const [financials, setFinancials] = useState([])
	const [earnings, setEarnings] = useState([])
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
	const [activeFinancialsMenuItem, setActiveFinancialsMenuItem] = useState()
	const [activeEarningsMenuItem, setActiveEarningsMenuItem] = useState()
	const [activeMomentumMenuItem, setActiveMomentumMenuItem] = useState()
	const [stockData, setStockData] = useState([]);
	//getAndSetStockData(ticker,currentDate,endDate);
	
	const [displayRSIcheckbox, setDisplayRSIcheckbox] = useState(true)
	const [NforRSI, setNforRSI] = useState(10)
	// const [dataForRSI, setDataForRSI] = useState([])
	// if (stockData.length > 0) {
	// 	getAndSetRSIdata(stockData);
	// 	console.log(dataForRSI)
	// }
	
	const candleChartNode = useRef(null);
	const earningsChartNode = useRef(null);
	const showVolumeNode = useRef(null);
	const stockPriceLineChartNode = useRef(null);
	const momentumIndicatorsChartNode = useRef(null);

	if (stockData.length < 1 && earnings.length < 1){
		getAndSetStockData(ticker,startDate,endDate)
		getAndSetEarnings(ticker)
	}


	useEffect(() => {
		if (stockData.length > 0) {
			createStockPriceLineChart(stockData,stockPriceLineChartNode);
			createVolumeBarChart(stockData,showVolumeNode);
			createMomentumIndicatorsChartFunction(NforRSI)
		}
		// if (dataForRSI.length > 0) {
		// 	createMomentumIndicatorsChartFunction(momentumIndicatorsChartNode,displayRSIcheckbox,NforRSI)
		// }
		if (earnings.length > 0) {
			//console.log(earnings)
			createEarningsChart(earnings,earningsChartNode)
		}
	},[stockData,displayRSIcheckbox,NforRSI])

	// function getAndSetStockData(stockTicker,theStartDate,theEndDate) {
	// 	fetch("/get_stock_data/"+stockTicker+"/"+theStartDate.getFullYear()+"/"+(theStartDate.getMonth()+1)+"/"+theStartDate.getDate()+"/"+theEndDate.getFullYear()+"/"+(theEndDate.getMonth()+1)+"/"+theEndDate.getDate()).then(response => 
	// 		response.json().then(data => {
	// 			setStockData(data);
	// 		})
	// 	)
	// }
	function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}

	function getAndSetStockData(stockTicker,theStartDate,theEndDate) {
		// const startDateConvertedSecs = parseInt(theStartDate.getTime() / 1000);
		// const endDateConvertedSecs = parseInt(theEndDate.getTime() / 1000);
		const startDateConverted = convertDatesToString(theStartDate) // String(theStartDate.getFullYear())+"-"+String(theStartDate.getMonth() + 1)+"-"+String(theStartDate.getDate())
		const endDateConverted = convertDatesToString(theEndDate) //String(theEndDate.getFullYear())+"-"+String(theEndDate.getMonth() + 1)+"-"+String(theEndDate.getDate())
		fetch("/get_stock_data/"+stockTicker+"/"+startDateConverted+"/"+endDateConverted).then(response => 
			response.json().then(data => {
				if (stockData.length < 1) {
					createStockPriceLineChart(data,stockPriceLineChartNode);
					createVolumeBarChart(data,showVolumeNode);
					createMomentumIndicatorsChartFunction();
				}
				setStockData(data);

			})
		)
	}

	function getAndSetFinancials(stockTicker) {
		fetch("/get_financial_data/"+stockTicker).then(response => 
			response.json().then(data => {
				setFinancials(data)
			}))
	}

	function getAndSetEarnings(stockTicker) {
		fetch("/get_earnings_data/"+stockTicker).then(response => 
			response.json().then(data => {
				if (earnings.length < 1) {
					createEarningsChart(data,earningsChartNode)
				}
				setEarnings(data)
			}))
	}

	function handleStartDateClick(date) {
		if (date !== startDate) {
			setStartDate(date)
			
		}
		getAndSetStockData(ticker,date,endDate)
		getAndSetFinancials(ticker);
		getAndSetEarnings(ticker);
	}
	
	function handleDateClick(minusDays, name) {
		setActiveItemDateMenu(name)
		
		var currentDate = new Date();
		var dateOffset = (24*60*60*1000) * minusDays; 
		var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
		setStartDate(currentDate);
		getAndSetStockData(ticker,currentDate,endDate) 
		getAndSetFinancials(ticker);
		getAndSetEarnings(ticker);
	}

	function handleEndDateClick(date) {
		setEndDate(date)
		getAndSetStockData(ticker,startDate,date) 
		getAndSetFinancials(ticker);
		getAndSetEarnings(ticker);

	}

	function handleTickerFormSubmit() {
		getAndSetStockData(ticker,startDate,endDate) 
		getAndSetFinancials(ticker);
		getAndSetEarnings(ticker);
	}

	function createMomentumIndicatorsChartFunction(NforRSI) {
		
		const dataWithN = [...stockData,{'N':NforRSI}]
		if (dataWithN.length > 1) {
			
			fetch('/calculate_RSI/', {
				method: 'POST', // or 'PUT'
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataWithN),
				})
				.then(response => response.json())
				.then(dataForRSIfromAPI => {
					createMomentumIndicatorsChart(dataForRSIfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox)
					
				// if (dataForRSI.length < 1) {
				// 	createMomentumIndicatorsChart(dataForRSIfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,NforRSI)
				// }
				// setDataForRSI(dataForRSIfromAPI)
				})
				.catch((error) => {
				console.error('Error:', error);
				});
		}
		
	}

	// function getAndSetRSIdata(stockDataForRSI) {

	// 	// Creating a XHR object 
	// 	let xhr = new XMLHttpRequest(); 
	// 	let url = '/calculate_RSI/'; 
	
	// 	// open a connection 
	// 	xhr.open('POST', url, false); 
	
	// 	// Set the request header i.e. which type of content you are sending 
	// 	xhr.setRequestHeader("Content-Type", "application/json"); 
	
	// 	// Create a state change callback 
	// 	xhr.onload = function () { 
	// 		if (xhr.readyState === 4 && xhr.status === 200) { 
	
	// 			// Print received data from server 
	// 			const result = xhr.response; 
	// 			setDataForRSI(result)
			
	// 		} 
	// 	}; 
	
	// 	// Converting JSON data to string 
	// 	const data = JSON.stringify(stockDataForRSI); 
	// 	console.log(data)
	// 	// Sending data with the request 
	// 	xhr.send(data); 
	// }
	
	const momentumNtradingDayOptions = [
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
	  ]
	  
	 
	console.log(NforRSI)


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
						<Button.Content visible>Go!</Button.Content>
						<Button.Content hidden>
							<Icon name='arrow right' />
						</Button.Content>
					</Button>
				</Form>
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
			<React.Fragment>
				<svg ref={stockPriceLineChartNode}></svg>
			</React.Fragment>
			<React.Fragment>
				<svg ref={momentumIndicatorsChartNode}></svg>
			</React.Fragment>
			<React.Fragment>
				<svg ref={showVolumeNode}></svg>
			</React.Fragment>
			<Accordion>


				<Accordion.Title
					onClick={() => {
						setActiveMomentumMenuItem(!activeMomentumMenuItem)
					}}
				>
					<h3>Momentum Indicators {activeMomentumMenuItem ? "-" : "+"}</h3>
				</Accordion.Title>
				<Accordion.Content active={activeMomentumMenuItem}>
					<React.Fragment>
						<Checkbox defaultChecked onClick={() => {
							setDisplayRSIcheckbox(!displayRSIcheckbox)
							}} label="Relative Strength Index">
						</Checkbox>
						<Form.Field
							control={Select}
							options={momentumNtradingDayOptions}
							label={{ children: 'over how many trading days?' }}
							placeholder='10'
							onChange ={(e,selectedOption) => {
								console.log(selectedOption.value)
								setNforRSI(selectedOption.value)
								}}
						/>
					</React.Fragment>
					{/* <Form.Group widths='equal'>
						<Form.Field control={Checkbox} onClick={() => {
							setDisplayRSIcheckbox(!displayRSIcheckbox)
						}} label='Relative Strength Index'/>
					</Form.Group> */}
				</Accordion.Content>

				<Accordion.Title
					onClick={() => {
						setActiveEarningsMenuItem(!activeEarningsMenuItem)
					}}
				>
					<h3>Earnings {activeEarningsMenuItem ? "-" : "+"}</h3>
				</Accordion.Title>
				<Accordion.Content active={activeEarningsMenuItem}>
					<React.Fragment>
						<svg ref={earningsChartNode}></svg>
					</React.Fragment>
				</Accordion.Content>
				<Accordion.Title
					onClick={() => {
						setActiveFinancialsMenuItem(!activeFinancialsMenuItem)
					}}
				>
					<h3>Financials {activeFinancialsMenuItem ? "-" : "+"}</h3>
				</Accordion.Title>
				<Accordion.Content active={activeFinancialsMenuItem}>{Object.keys(financials).map(function(key,index) {
						if (financials.length > 0) {
						return(
						<Segment.Group>
							<Segment.Group horizontal>
								<Segment>Gross Profit (M$): {financials[key].grossProfit}</Segment>
								<Segment>Operating Revenue (M$): {financials[key].operatingRevenue}</Segment>
								<Segment>Total Revenue (M$): {financials[key].totalRevenue}</Segment>
							</Segment.Group>
							<Segment.Group horizontal>
								<Segment>Total Assets (M$): {financials[key].totalAssets}</Segment>
								<Segment>Total Liabilities (M$): {financials[key].totalLiabilities}</Segment>
								<Segment>Total Cash (M$): {financials[key].totalCash}</Segment>
							</Segment.Group>
							<Segment.Group horizontal>
								<Segment>Net Income (M$): {financials[key].netIncome}</Segment>
								<Segment>Research and Development (M$): {financials[key].researchAndDevelopment}</Segment>
								<Segment>Cash Flow (M$): {financials[key].cashFlow}</Segment>
							</Segment.Group>
							<Segment.Group horizontal>
								<Segment>Total Debt (M$): {financials[key].totalDebt}</Segment>
								<Segment>Short Term Debt (M$): {financials[key].shortTermDebt}</Segment>
								<Segment>Long Term Debt (M$): {financials[key].longTermDebt}</Segment>
							</Segment.Group>
						</Segment.Group>
					)}}
					)}
				</Accordion.Content>
			</Accordion>
		</div>
		
	);
} 
   
