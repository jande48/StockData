import React, {useState, useEffect, useRef} from 'react';
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu, Segment, Accordion } from "semantic-ui-react"
import { createCandleStickChart } from './charts/candleStickChart.js'
import { createVolumeBarChart } from './charts/volumeBarChart.js'
import { createEarningsChart } from './charts/earningChart.js'
import { createStockPriceLineChart } from './charts/stockPriceLineChart';

export const StockData = () => {

	const [startDate, setStartDate] = useState(new Date(2020,7,1,0,0,0,0));
	const [endDate, setEndDate] = useState(new Date());
	const [ticker, setTicker] = useState('AAPL');
	const [financials, setFinancials] = useState([])
	const [earnings, setEarnings] = useState([])
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
	const [activeFinancialsMenuItem, setActiveFinancialsMenuItem] = useState()
	const [activeEarningsMenuItem, setActiveEarningsMenuItem] = useState()
	const [stockData, setStockData] = useState([]);

	const candleChartNode = useRef(null);
	const earningsChartNode = useRef(null);
	const showVolumeNode = useRef(null);
	const stockPriceLineChartNode = useRef(null);

	useEffect(() => {
		if (stockData.length > 0) {
			//createLineChart(stockData);
			//console.log(stockData)
			//createCandleStickChart(stockData,candleChartNode);
			createStockPriceLineChart(stockData,stockPriceLineChartNode);
			createVolumeBarChart(stockData,showVolumeNode);
			
		}
		if (earnings.length > 0) {
			console.log(earnings)
			createEarningsChart(earnings,earningsChartNode)
		}
	},[stockData])

	function getAndSetStockData(stockTicker,theStartDate,theEndDate) {
		fetch("/get_stock_data/"+stockTicker+"/"+theStartDate.getFullYear()+"/"+(theStartDate.getMonth()+1)+"/"+theStartDate.getDate()+"/"+theEndDate.getFullYear()+"/"+(theEndDate.getMonth()+1)+"/"+theEndDate.getDate()).then(response => 
			response.json().then(data => {
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
		var dateOffset = (24*60*60*1000) * minusDays; //5 days
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
	// console.log(earnings)
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
			{/* <List>
				{Object.keys(stockData).map(function(key,index) {
					return(
						<List.Item key={stockData[key].close}>
							<Header>Date: {stockData[key].date}</Header>
							<p>Open: {stockData[key].open}</p>
							<p>High: {stockData[key].high}</p>
							<p>Low: {stockData[key].low}</p>
							<p>Close: {stockData[key].close}</p>
						</List.Item>
					)
				})}
        	</List> */}
			<React.Fragment>
				<svg ref={stockPriceLineChartNode}></svg>
				{/* <svg ref={candleChartNode}></svg> */}
			</React.Fragment>
			<React.Fragment>
				<svg ref={showVolumeNode}></svg>
			</React.Fragment>
			<Accordion>

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
   
