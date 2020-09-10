import React, {useState, useEffect, useRef} from 'react';
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu } from "semantic-ui-react"
import { scaleLinear, scaleBand, scaleLog } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import * as d3 from "d3";
import { StockData } from './StockData';

export const StockDataDateForm = () => {

	const [startDate, setStartDate] = useState(new Date(2020,7,1,0,0,0,0));
	const [endDate, setEndDate] = useState(new Date());
	const [ticker, setTicker] = useState('AAPL');
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');

	const [stockData, setStockData] = useState([]);

	const [fakeStockData, setFakeStockDate] = useState([5,10,1,3])
	const [fakeSize, setFakeSize] = useState([500,500])
	const chartNode = useRef(null);
	const candleChartNode = useRef(null);


	useEffect(() => {
		if (stockData.length > 0) {
			//createLineChart(stockData);
			createCandleStickChart(stockData);
		}
	},[stockData])
	//const d3 = require("d3");

	function handleStartDateClick(date) {
		if (date !== startDate) {
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
		setStartDate(currentDate);
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
	}


	function handleTickerFormSubmit() {
		fetch("/get_stock_data/"+ticker+"/"+startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/"+endDate.getDate()).then(response => 
			response.json().then(data => {
				setStockData(data);
			})
			)
	}

	function createLineChart(data) {
		// https://observablehq.com/@d3/line-chart
		const svg = select(candleChartNode.current);
		svg.selectAll("g").remove()
		const height = 350;
		const width = 700;
		const margin = ({top: 20, right: 30, bottom: 30, left: 40})

		const parseDate = d3.utcParse("%Y-%m-%d")
		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
			.call(g => g.select(".domain").remove())
			.call(g => g.select(".tick:last-of-type text").clone()
				.attr("x", 3)
				.attr("text-anchor", "start")
				.attr("font-weight", "bold"))
				//.text(data.y))
		
		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.close)]).nice()
			.range([height - margin.bottom, margin.top])

		const x = d3.scaleUtc()
			.domain(d3.extent(data, d => parseDate(d.date)))
			.range([margin.left, width - margin.right])
		
		const line = d3.line()
			.defined(d => !isNaN(d.close))
			.x(d => x(parseDate(d.date)))
			.y(d => y(d.close))

		svg.append("g")
			.call(xAxis);
	  
		svg.append("g")
			.call(yAxis);
	  
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("d", line);
	  
		return svg.node();
	}

	function createCandleStickChart(data) {
		// https://observablehq.com/d/8974f775c6a0ae5d

		const svg = select(candleChartNode.current);
		svg.selectAll("g").remove()
		const height = 350;
		const width = 700;
		const margin = ({top: 20, right: 30, bottom: 30, left: 40})
		const parseDate = d3.utcParse("%Y-%m-%d")
		const x = scaleBand()
    		.domain(d3.utcDay
        		.range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
        		.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
    		.range([margin.left, width - margin.right])
    		.padding(0.2)

		const y = scaleLog()
			.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
			.rangeRound([height - margin.bottom, margin.top])

		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x)
				.tickValues(d3.utcMonday
					.every(width > 720 ? 1 : 2)
					.range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
				.tickFormat(d3.utcFormat("%-m/%-d")))
			.call(g => g.select(".domain").remove())

		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y)
				.tickFormat(d3.format("$~f"))
				.tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
			.call(g => g.selectAll(".tick line").clone()
				.attr("stroke-opacity", 0.2)
				.attr("x2", width - margin.left - margin.right))
			.call(g => g.select(".domain").remove())

		svg.attr("viewBox", [0, 0, width, height])
  
		svg.append("g")
			.call(xAxis);
	
		svg.append("g")
			.call(yAxis);
	
		const g = svg.append("g")
			.attr("stroke-linecap", "round")
			.attr("stroke", "black")
			.selectAll("g")
			.data(data)
			.join("g")
			.attr("transform", data => `translate(${x(parseDate(data.date))},0)`);
	
		g.append("line")
			.attr("y1", d => y(d.low))
			.attr("y2", d => y(d.high));
	
		g.append("line")
			.attr("y1", d => y(d.open))
			.attr("y2", d => y(d.close))
			.attr("stroke-width", x.bandwidth())
			.attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
				: d.close > d.open ? d3.schemeSet1[2]
				: d3.schemeSet1[8]);
		return svg.node();
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
				<svg ref={candleChartNode}></svg>
			</React.Fragment>
			
			
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

