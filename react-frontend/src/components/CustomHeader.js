// import React, {useState, useRef} from 'react';
// import '../App.css'
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'
// import { List, Header, Form, Input, Button, Container, Icon, Menu, Segment, Accordion, Checkbox, Select } from "semantic-ui-react"
// //import { ticker, setTicker,  startDate, endDate} from './StockData'
// import { createCandleStickChart } from './charts/candleStickChart.js'
// import { createVolumeBarChart } from './charts/volumeBarChart.js'
// import { createEarningsChart } from './charts/earningChart.js'
// import { createStockPriceLineChart } from './charts/stockPriceLineChart';
// import { createMomentumIndicatorsChart } from './charts/momentumIndicatorsChart'

// const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
// export const [startDate, setStartDate] = useState(currentDate);
// export const [endDate, setEndDate] = useState(new Date());
// export const [ticker, setTicker] = useState('AAPL');

// export const [stockData, setStockData] = useState([]);
// export const [financials, setFinancials] = useState([])
// export const [earnings, setEarnings] = useState([])
// export const [displayRSIcheckbox, setDisplayRSIcheckbox] = useState(true)
// export const [NforRSI, setNforRSI] = useState(10)

// export const [displayTSIcheckbox, setDisplayTSIcheckbox] = useState(false)
// export const [rForTSI, setrForTSI] = useState(25)
// export const [sForTSI, setsForTSI] = useState(13)

// export const [displayUOcheckbox, setUOcheckbox] = useState(false)
// export const [sForUO, setsForUO] = useState(7)
// export const [mForUO, setmForUO] = useState(14)
// export const [lenForUO, setlenForUO] = useState(28)
// export const [wsForUO, setwsForUO] = useState(4)
// export const [wmForUO, setwmForUO] = useState(2)
// export const [wlForUO, setwlForUO] = useState(1)



// export const candleChartNode = useRef(null);
// export const earningsChartNode = useRef(null);
// export const showVolumeNode = useRef(null);
// export const stockPriceLineChartNode = useRef(null);
// export const momentumIndicatorsChartNode = useRef(null);


// var currentDate = new Date();
// var dateOffset = (24*60*60*1000) * 182; 
// var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);

// if (stockData.length < 1 && earnings.length < 1){
// 	getAndSetStockData(ticker,startDate,endDate)
// 	getAndSetEarnings(ticker)
// }

// function convertDatesToString(initialDate) {
// 		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
// 		return convertedDate
// 	}

// function getAndSetStockData(stockTicker,theStartDate,theEndDate) {

// 	const startDateConverted = convertDatesToString(theStartDate) 
// 	const endDateConverted = convertDatesToString(theEndDate) 
// 	fetch("/get_stock_data/"+stockTicker+"/"+startDateConverted+"/"+endDateConverted).then(response => 
// 		response.json().then(data => {
// 			if (stockData.length < 1) {
// 				createStockPriceLineChart(data,stockPriceLineChartNode);
// 				createVolumeBarChart(data,showVolumeNode);
// 				createMomentumIndicatorsChartFunction(data,momentumIndicatorsChartNode);
// 			}
// 			setStockData(data);

// 		})
// 	)
// }

// function getAndSetFinancials(stockTicker) {
// 	fetch("/get_financial_data/"+stockTicker).then(response => 
// 		response.json().then(data => {
// 			setFinancials(data)
// 		}))
// }

// function getAndSetEarnings(stockTicker) {
// 	fetch("/get_earnings_data/"+stockTicker).then(response => 
// 		response.json().then(data => {
// 			if (earnings.length < 1) {
// 				createEarningsChart(data,earningsChartNode)
// 			}
// 			setEarnings(data)
// 		}))
// }

// function handleStartDateClick(date) {
// 	if (date !== startDate) {
// 			setStartDate(date)
			
// 		}
// 		getAndSetStockData(ticker,date,endDate)
// 		getAndSetFinancials(ticker);
// 		getAndSetEarnings(ticker);
// 	}
	
// function handleDateClick(minusDays, name) {
// 	setActiveItemDateMenu(name)
	
// 	var currentDate = new Date();
// 	var dateOffset = (24*60*60*1000) * minusDays; 
// 	var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
// 	setStartDate(currentDate);
// 	getAndSetStockData(ticker,currentDate,endDate) 
// 	getAndSetFinancials(ticker);
// 	getAndSetEarnings(ticker);
// }

// function handleEndDateClick(date) {
// 	setEndDate(date)
// 	getAndSetStockData(ticker,startDate,date) 
// 	getAndSetFinancials(ticker);
// 	getAndSetEarnings(ticker);

// }

// function handleTickerFormSubmit() {
// 	getAndSetStockData(ticker,startDate,endDate) 
// 	getAndSetFinancials(ticker);
// 	getAndSetEarnings(ticker);
// }

// export function createMomentumIndicatorsChartFunction(data,momentumIndicatorsChartNode) {
		
// 	const RSIparameters = {'N':NforRSI}
// 	const TSIparameters = {'displayTSI':displayTSIcheckbox,'rTSI':rForTSI,'sTSI':sForTSI}
// 	const UOparameters = {'displayUO':displayUOcheckbox,'sForUO':sForUO,'mForUO':mForUO,'lenForUO':lenForUO,'wsForUO':wsForUO,'wmForUO':wmForUO,'wlForUO':wlForUO}
// 	//const dataWithMomPara = [...data,UOparameters,RSIparameters,TSIparameters];
	

// 	if (data.length > 1){
// 		fetch('/calculate_Momentum_Indicators/', {
// 			method: 'POST', // or 'PUT'
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify([data,RSIparameters,TSIparameters,UOparameters]),
// 			})
// 			.then(response => response.json())
// 			.then(dataForMomfromAPI => {
// 				createMomentumIndicatorsChart(dataForMomfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox)
// 			})
// 			.catch((error) => {
// 			console.error('Error:', error);
// 			});
// 	}else{
// 		createMomentumIndicatorsChart(data,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox)
// 	}
// }

// export function CustomHeader() {
//     return (
//         <div>
//             <Menu>
// 				<Form>
// 					<Input 
// 						placeholder="Add ticker ex) APPL" 
// 						value={ticker}
// 						name='ticker'
// 						onChange={(e) => setTicker(e.target.value)}
// 						isClearable
// 					/>
// 					<Button animated primary onClick={handleTickerFormSubmit}>
// 						<Button.Content visible>Go!</Button.Content>
// 						<Button.Content hidden>
// 							<Icon name='arrow right' />
// 						</Button.Content>
// 					</Button>
// 				</Form>
// 				<Menu.Item
// 				name='5d'
// 				active={activeItemDateMenu === '5d'}
// 				onClick={() => handleDateClick(8, '5d')}
// 				>
// 				5 d
// 				</Menu.Item>
// 				<Menu.Item
// 				name='1m'
// 				active={activeItemDateMenu === '1m'}
// 				onClick={() => handleDateClick(30, '1m')}
// 				>
// 				1 m
// 				</Menu.Item>
// 				<Menu.Item
// 				name='6m'
// 				active={activeItemDateMenu === '6m'}
// 				onClick={() => handleDateClick(180, '6m')}
// 				>
// 				6 m
// 				</Menu.Item>
// 				<Menu.Item
// 				name='1y'
// 				active={activeItemDateMenu === '1y'}
// 				onClick={() => handleDateClick(365, '1y')}
// 				>
// 				1 y
// 				</Menu.Item>
// 				<Menu.Item
// 				name='StartDate'
// 				position='right'
// 				>
// 				Custom:
// 				<DatePicker 
// 				selected={startDate} 
// 				maxDate={new Date()} 
// 				onChange={date => handleStartDateClick(date)}
// 				placeholderText='MM/DD/YYYY'
// 				isClearable
// 				showYearDropdown
// 				scrollableMonthYearDropdown />
// 				To: 
// 				<DatePicker 
// 				selected={endDate} 
// 				maxDate={new Date()}
// 				onChange={date => handleEndDateClick(date)}
// 				placeholderText='MM/DD/YYYY'
// 				isClearable
// 				showYearDropdown
// 				scrollableMonthYearDropdown />
// 				</Menu.Item>
// 			</Menu>
//         </div>
//     )
// }

