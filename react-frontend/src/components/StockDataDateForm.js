import React, {useState, useEffect, useRef} from 'react';
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Container, Icon, Menu, Segment, Accordion } from "semantic-ui-react"
import { scaleLinear, scaleBand, scalePoint } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import * as d3 from "d3";
import { StockData } from './StockData';

export const StockDataDateForm = () => {

	const [startDate, setStartDate] = useState(new Date(2020,7,1,0,0,0,0));
	const [endDate, setEndDate] = useState(new Date());
	const [ticker, setTicker] = useState('AAPL');
	const [financials, setFinancials] = useState([])
	const [earnings, setEarnings] = useState([])
	const [activeItemDateMenu, setActiveItemDateMenu] = useState('');
	const [activeFinancialsMenuItem, setActiveFinancialsMenuItem] = useState()
	const [activeEarningsMenuItem, setActiveEarningsMenuItem] = useState()
	const [stockData, setStockData] = useState([]);

	const [fakeStockData, setFakeStockDate] = useState([5,10,1,3])
	const [fakeSize, setFakeSize] = useState([500,500])
	const chartNode = useRef(null);
	const candleChartNode = useRef(null);
	const earningsChartNode = useRef(null);
	const showVolumeNode = useRef(null);


	useEffect(() => {
		if (stockData.length > 0) {
			//createLineChart(stockData);
			console.log(stockData)
			createCandleStickChart(stockData);
			createVolumeBarChart(stockData);
			
		}
		if (earnings.length > 0) {
			console.log(earnings)
			createEarningsChart(earnings)
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

	// function handleFinancialsMenuItemClick(e, titleProps) {
	// 	const { index } = titleProps
	// 	const { activeIndex } = activeFinancialsMenuItem
	// 	const newIndex = activeIndex === index ? -1 : index
	// 	setActiveFinancialsMenuItem(newIndex)
		
	//   }

	// function createLineChart(data) {
	// 	// https://observablehq.com/@d3/line-chart
	// 	const svg = select(candleChartNode.current);
	// 	svg.selectAll("g").remove()
	// 	const height = 350;
	// 	const width = 700;
	// 	const margin = ({top: 20, right: 30, bottom: 30, left: 40})

	// 	const parseDate = d3.utcParse("%Y-%m-%d")
	// 	const yAxis = g => g
	// 		.attr("transform", `translate(${margin.left},0)`)
	// 		.call(d3.axisLeft(y))
	// 		.call(g => g.select(".domain").remove())
	// 		.call(g => g.select(".tick:last-of-type text").clone()
	// 			.attr("x", 3)
	// 			.attr("text-anchor", "start")
	// 			.attr("font-weight", "bold"))
	// 			//.text(data.y))
		
	// 	const xAxis = g => g
	// 		.attr("transform", `translate(0,${height - margin.bottom})`)
	// 		.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

	// 	const y = d3.scaleLinear()
	// 		.domain([0, d3.max(data, d => d.close)]).nice()
	// 		.range([height - margin.bottom, margin.top])

	// 	const x = d3.scaleUtc()
	// 		.domain(d3.extent(data, d => parseDate(d.date)))
	// 		.range([margin.left, width - margin.right])
		
	// 	const line = d3.line()
	// 		.defined(d => !isNaN(d.close))
	// 		.x(d => x(parseDate(d.date)))
	// 		.y(d => y(d.close))

	// 	svg.append("g")
	// 		.call(xAxis);
	  
	// 	svg.append("g")
	// 		.call(yAxis);
	  
	// 	svg.append("path")
	// 		.datum(data)
	// 		.attr("fill", "none")
	// 		.attr("stroke", "steelblue")
	// 		.attr("stroke-width", 1.5)
	// 		.attr("stroke-linejoin", "round")
	// 		.attr("stroke-linecap", "round")
	// 		.attr("d", line);
	  
	// 	return svg.node();
	// }


	function createCandleStickChart(data) {
		// https://observablehq.com/d/8974f775c6a0ae5d

		const svg = select(candleChartNode.current);
		svg.selectAll("g").remove()
		const height = 350;
		const width = 700;
		//const margin = ({top: 20, right: 30, bottom: 30, left: 80})
		const margin = ({top: 50, right: 30, bottom: 50, left: 40})
		const parseDate = d3.utcParse("%Y-%m-%d")
		const x = scaleBand()
    		.domain(d3.utcDay
        		.range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
        		.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
    		.range([margin.left, width - margin.right])
    		.padding(0.2)

		
		const y = scaleLinear()
			.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
			.rangeRound([height - margin.bottom, margin.top])

		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x)
				.tickValues(d3.utcMonday
					.every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
					.range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
				.tickFormat(d3.utcFormat("%-m/%-d")))
			.call(g => g.select(".domain").remove())
		

		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y)
				.tickFormat(d3.format("$~f"))
				.tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
			.call(g => g.selectAll(".tick line").clone()
				.attr("stroke-opacity", 0)
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
			.attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
	
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

	function createVolumeBarChart(data) {
		const svg = select(showVolumeNode.current);
		svg.selectAll("g").remove()
		const margin = ({top: 30, right: 30, bottom: 50, left: 40})
		const parseDate = d3.utcParse("%Y-%m-%d")
		const height = 150;
		const width = 700;
		svg.attr("viewBox", [0, 0, width, height])
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const x = scaleBand()
    		.domain(d3.utcDay
        		.range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
        		.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
    		.range([margin.left, width - margin.right])
    		.padding(0.2)

		
		const y = scaleLinear()
			.domain([d3.min(data, d => d.volume), d3.max(data, d => d.volume)])
			.rangeRound([height - margin.bottom,margin.top,])

		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x)
				.tickValues(d3.utcMonday
					.every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
					.range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
				.tickFormat(d3.utcFormat("%-m/%-d")))
			.call(g => g.select(".domain").remove())
		

		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
				//.tickFormat(d3.format("")))
				//.tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
			.call(g => g.selectAll(".tick line").clone()
				.attr("stroke-opacity", 0)
				.attr("x2", width - margin.left - margin.right))
			.call(g => g.select(".domain").remove())
  
		svg.append("g")
			.call(xAxis);
			
		svg.append("g")
			.call(yAxis);

		const g = svg.append("g")
			// .attr("stroke", "black")
			.selectAll("g")
			.data(data)
			.join("g")
			.attr("transform", data => `translate(${x(parseDate(data.date))},0)`);

		g.append("rect")
			.attr('width', d=>x.bandwidth())
			.attr('height',d=>y(d.volume))
			.attr("fill", d => d.open > d.close ? d3.schemeSet1[0]
				: d.close > d.open ? d3.schemeSet1[2]
				: d3.schemeSet1[8]);
		// //	.attr('y',d=> (y(d.volume) - `${height - margin.bottom}`));
		// g.append("rect")
		// 	.attr('y', d=>y(d.volume))
		// 	.attr('width', d=>x.bandwidth())
		// 	.attr('height',d=>x(parseDate(d.date)));

		return svg.node();
	}


	function createEarningsChart(data) {
		// https://www.youtube.com/watch?v=UDDGcgxficY 
		// stopped video at 3:41
		const svg = select(earningsChartNode.current);
		svg.selectAll("g").remove()
		// const height = 350;
		// const width = 700;
		const margin = ({top: 30, right: 30, bottom: 50, left: 40})
		const parseDate = d3.utcParse("%Y-%m-%d")

		// const xValue = d => d.fiscalPeriod;
		// const yValue = d => d.actualEPS;
		const xLabel = 'Fiscal Period';
		const yLabel = 'Earnings Per Share'
		const width = 700;
		const height = 350;
		svg.attr("viewBox", [0, 0, width, height])
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const yScale = scaleLinear()
			.domain([d3.min(data,d => Math.min(d.consensusEPS,d.actualEPS)),d3.max(data,d => Math.max(d.consensusEPS,d.actualEPS))])
			.range([innerHeight,0])

		const yAxis = d3.axisLeft(yScale)

		const xScale = scaleBand()
			.domain(data.map(d => d.fiscalPeriod))
			.range([0,innerWidth])
			
		
		const xAxis = d3.axisBottom(xScale);

		const g = svg.append('g')
			.attr('transform',`translate(${margin.left},${margin.top})`);

		g.append('g').call(d3.axisLeft(yScale))
			.select(".domain").remove();
		g.append('g').call(d3.axisBottom(xScale))
			.attr('transform',`translate(0,${innerHeight})`)
			.select(".domain").remove();

		g.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
				.attr('cx', d => ((xScale.bandwidth()/2)+xScale(d.fiscalPeriod)))
				.attr('cy', d => yScale(d.consensusEPS))
				.attr('r',30)
				.attr('fill','green')
				.attr('width', xScale.bandwidth())
			
		// g.append('circle')
		// 		.attr('cx', d => ((xScale.bandwidth()/2)+xScale(d.fiscalPeriod)))
		// 		.attr('cy', d => yScale(d.actualEPS))
		// 		.attr('r',30)
		// 		.attr('fill','#50eb79')
		// 		.attr('width', xScale.bandwidth());
		
			
		// const g = svg.append('g')
		// 	.attr('transform',`translate(${margin.left},${margin.top})`);
		// const xAxisG = g.append('g')
		// 	.attr('transform',`translate(0,${innerHeight})`);
		// const yAxisG = g.append('g');

		// xAxisG.append('text')
		// 	.attr('class','axis-label')
		// 	.attr('x', innerWidth/2)
		// 	.attr('y',90)
		// 	.text(xLabel);
		
		// yAxisG.append('text')
		// 	.attr('class','axis-label')
		// 	.attr('x', innerHeight / 2)
		// 	.attr('y',-100)
		// 	.attr('transform',`rotate(-90)`)
		// 	.style('text-anchor','middle')
		// 	.text(yLabel);
		
		// const xScale = scalePoint();
		// const yScale = scaleLinear();

		// const xAxis = d3.axisBottom()
		// 	.scale(xScale)
		// 	.tickPadding(15)
		// 	.tickSize(-innerHeight)
		// 	.domain(data.map(xValue))
		// 	.range([0, innerWidth]);

		// const yTicks = 4;
		// const yAxis = d3.axisLeft()
		// 	.scale(yScale)
		// 	.ticks(yTicks)
		// 	.tickPadding(15)
		// 	.tickFormat(d3.format('.0s'))
		// 	.tickSize(-innerWidth)
		// 	.domain(d3.extent(data,yValue))
		// 	.range([innerHeight,0])
		// 	.nice(yTicks)

		// // const g = svg.append("g")
		// // 	.data(data)
		// // 	.enter()
		
		
		// 	// xScale
		// 	// 	.domain(data.map(xValue))
		// 	// 	.range([0, innerWidth]);
		// 	// yScale
		// 	// 	.domain(d3.extent(data,yValue))
		// 	// 	.range([innerHeight,0])
		// 	// 	.nice(yTicks)

		// g.selectAll('circle')
		// 	.data(data)
		// 	.enter()
		// 	.append('circle')
		// 	.attr('cx', d => xScale(xValue(d)))
		// 	.attr('cy', d => yScale(yValue(d)))
		// 	.attr('fill','black')
		// 	.attr('fill-opacity', 0.6)
		// 	.attr('r',8)
			
		// xAxisG.call(xAxis);
		// yAxisG.call(yAxis);
		
		return svg.node();

	}

	//  function createEarningsChart(data) {
	// 	// https://observablehq.com/d/8974f775c6a0ae5d

	// 	const svg = select(earningsChartNode.current);
	// 	svg.selectAll("g").remove()
	// 	const height = 350;
	// 	const width = 700;
	// 	const margin = ({top: 20, right: 30, bottom: 50, left: 40})
	// 	const parseDate = d3.utcParse("%Y-%m-%d")
	// 	// const x = scaleBand()
    // 	// 	.domain(d3.utcDay
    //     // 		.range(parseDate(data[0].EPSReportDate), +parseDate(data[data.length - 1].EPSReportDate) + 1)
    //     // 		.filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
    // 	// 	.range([margin.left, width - margin.right])
	// 	// 	.padding(0.2)
	// 	console.log(data)
	// 	console.log(earnings)
	// 	const temp1 = {earnings}[0].fiscalPeriod
	// 	const temp2 = {earnings}[1].fiscalPeriod
	// 	const temp3 = {earnings}[2].fiscalPeriod
	// 	const temp4 = {earnings}[3].fiscalPeriod
	// 	const x = scalePoint()
	// 		.domain([temp1,temp2,temp3,temp4])
	// 		.range([(margin.right+margin.right+margin.right),(width-margin.left-margin.left)])

		

	// 	const minEPS = d3.min(data, d => d.actualEPS)
	// 	const minConsensus = d3.min(data, d => d.consensusEPS)
	// 	const maxEPS = d3.max(data, d => d.actualEPS)
	// 	const maxConsensus = d3.max(data, d => d.consensusEPS)
	// 	const y = scaleLinear()
	// 		.domain([d3.min([minEPS,minConsensus]), d3.max([maxEPS,maxConsensus])])
	// 		.rangeRound([height-margin.bottom, margin.top])

		
	// 	const xAxis = g => g
	// 		.attr("transform", `translate(0,${height - margin.bottom})`)
	// 		.call(d3.axisBottom(x))
	// 		.select(".domain").remove()
	// 		.call(g => g.select(".domain").remove())

	// 	const yAxis = g => g
	// 		.attr("transform", `translate(${margin.left},0)`)
	// 		.call(d3.axisLeft(y)
	// 			.tickFormat(d3.format("$~f"))
	// 			.tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
	// 		.call(g => g.selectAll(".tick line").clone()
	// 			.attr("stroke-opacity", 0)
	// 			.attr("x2", width - margin.left - margin.right))
	// 		.call(g => g.select(".domain").remove())

	// 	svg.attr("viewBox", [0, 0, width, height])
  
	// 	svg.append("g")
	// 		.call(yAxis);

	// 	svg.append("g")
	// 		.attr("transform", `translate(0,${height - (margin.bottom-20)})`)
	// 		.call(d3.axisBottom(x))
	// 		.select(".domain").remove()
		
	// 	// svg.append("g")
	// 	// 	.attr("transform",`translate(0,${height})`)
	// 	// 	.call(d3.axisBottom(x))
	// 	// 	.select(".domain").remove()
			
	// 	// svg.selectAll(".circlesAnalyst")
	// 	// 	.data(data)
	// 	// 	.enter()
	// 	// 	.append("circle")
	// 	// 		.attr('class','circlesAnalyst')
	// 	// 		.attr("cx",d => x(d.fiscalPeriod))
	// 	// 		.attr("cy",d => y(d.consensusEPS))
	// 	// 		.attr("r",15)
	// 	// 		.style("fill", "#94FF8C");

	// 	// svg.selectAll(".circles")
	// 	// 	.data(data)
	// 	// 	.enter()
	// 	// 	.append("circle")
	// 	// 		.attr('class','circles')
	// 	// 		.attr("cx",d => x(d.fiscalPeriod))
	// 	// 		.attr("cy",d => y(d.consensusEPS))
	// 	// 		.attr("r",15)
	// 	// 		.style("fill", "#94FF8C");
			
	// 	// svg.selectAll(".circlesAnalyst")
	// 	// 	.data(data)
	// 	// 	.enter()
	// 	// 	.append("circle")
	// 	// 		.attr('class','circlesAnalyst')
	// 	// 		.attr("cx",d => x(d.fiscalPeriod))
	// 	// 		.attr("cy",d => y(d.actualEPS))
	// 	// 		.attr("r",15)
	// 	// 		.style("fill", "#11E402");

		
	// 	// const xAxis = d3.axisBottom(x)
	// 	// let xAxisG =svg.selectAll('g').data(null)
	// 	// xAxisG.call(xAxis)
	// 	// svg.append("circle")
	// 	// 	.attr("cx",x(data[0].fiscalPeriod))
	// 	// 	.attr("cy",y(data[0].actualEPS))
	// 	// 	.attr("r",8)

	// 	// svg.append("cir")
	// 	// const g = svg.append("g")
	// 	// 	.selectAll("g")
	// 	// 	.data(data)
	// 	// 	.join("g")
	// 	// 	//.attr("transform", data => `translate(${x(parseDate(data.EPSReportDate))},0)`);
	

	// 	// g.append("circle")			
	// 	// 	.attr("cx", d => x(d.EPSReportDate))
	// 	// 	.attr("cy", d => y(d.actualEPS))

	// 	return svg.node();
	//  }
	// if (stockData.length === 0 ) {
	// 	setActiveItemDateMenu('1m')
		
	// 	var currentDate = new Date();
	// 	var dateOffset = (24*60*60*1000) * 30; 
	// 	var newDate = currentDate.setTime(currentDate.getTime() - dateOffset);
	// 	var theEndDate = new Date();
	// 	fetch("/get_stock_data/AAPL/"+currentDate.getFullYear()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+theEndDate.getFullYear()+"/"+(theEndDate.getMonth()+1)+"/"+theEndDate.getDate()).then(response => 
	// 		response.json().then(data => {
	// 			console.log(data)
	// 			createCandleStickChart(data)
	// 			setStockData(data);
	// 		})
	// 	)

		
	// 	createCandleStickChart(stockData)
	// }
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
				<svg ref={candleChartNode}></svg>
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
   

			
{/* 
			<Accordion>
				<Accordion.Title
          			active={activeFinancialsMenuItem === 0}
          			index={0}
          			onClick={handleFinancialsMenuItemClick(e)}
        			>
				
				<Icon name='dropdown' />
				Financials
				</Accordion.Title>
				<Accordion.Content active={activeFinancialsMenuItem === 0}>
					{Object.keys(financials).map(function(key,index) {
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
						</Segment.Group>
					)}}
					)}
				</Accordion.Content>

				<Accordion.Title
          			active={activeFinancialsMenuItem === 1}
          			index={0}
          			onClick={handleFinancialsMenuItemClick()}
        		>
          			<Icon name='dropdown' />
          				What kinds of dogs are there?
        		</Accordion.Title>
        		<Accordion.Content active={activeFinancialsMenuItem === 1}>
          			<p>
					There are many breeds of dogs. Each breed varies in size and
					temperament. Owners often select a breed of dog that they find to be
					compatible with their own lifestyle and desires from a companion.
					</p>
        		</Accordion.Content>
			</Accordion> */}

			{/* <Tab menu={{ pointing: true }} panes={comapnyFinancepanes(financials)} /> */}

{/* 
					// <Segment.Group>
					// 	<Segment>{ticker.toUpperCase()} Earnings and Financials as of {financials[key].reportDate}</Segment>
					// 	<Segment.Group horizontal>
					// 		<Segment>Gross Profit (M$): {financials[key].grossProfit}</Segment>
					// 		<Segment>Operating Revenue (M$): {financials[key].operatingRevenue}</Segment>
					// 		<Segment>Total Revenue (M$): {financials[key].totalRevenue}</Segment>
					// 	</Segment.Group>
					// 	<Segment.Group horizontal>
					// 		<Segment>Total Assets (M$): {financials[key].totalAssets}</Segment>
					// 		<Segment>Total Liabilities (M$): {financials[key].totalLiabilities}</Segment>
					// 		<Segment>Total Cash (M$): {financials[key].totalCash}</Segment>
					// 	</Segment.Group>
						
					// </Segment.Group> */}
			
{/* 
			{function() {
				if (Object.keys(financials).length !== 0) {
					return(
						<Segment.Group>
							<Segment>Gross Profit: {financials[0].grossProfit}</Segment>
							<Segment>Operating Revenue: {financials[0].operatingRevenue}</Segment>
						</Segment.Group>
					)
				}
			} }			 */}

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


				
	// const comapnyFinancepanes = (financialsData) => {
	// 	if (financialsData.length != 0) {
	// 		{Object.keys(financialsData).map(function(key,index){
	// 			return(
	// 				[
	// 					{
	// 					  menuItem: 'Earning',
	// 					  render: () => <Tab.Pane attached={false}>
	// 							  <Segment.Group>
	// 								<Segment>{ticker.toUpperCase()} Earnings and Financials as of {financialsData[key].reportDate}</Segment>
	// 								<Segment.Group horizontal>
	// 									<Segment>Gross Profit (M$): {financialsData[key].grossProfit}</Segment>
	// 									<Segment>Operating Revenue (M$): {financialsData[key].operatingRevenue}</Segment>
	// 									<Segment>Total Revenue (M$): {financialsData[key].totalRevenue}</Segment>
	// 								</Segment.Group>
	// 								<Segment.Group horizontal>
	// 									<Segment>Total Assets (M$): {financialsData[key].totalAssets}</Segment>
	// 									<Segment>Total Liabilities (M$): {financialsData[key].totalLiabilities}</Segment>
	// 									<Segment>Total Cash (M$): {financialsData[key].totalCash}</Segment>
	// 								</Segment.Group>
										
	// 							</Segment.Group>
	// 					  </Tab.Pane>,
	// 					},
	// 					{
	// 					  menuItem: 'Finances',
	// 					  render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
	// 					},
	// 					{
	// 					  menuItem: 'Tab 3',
	// 					  render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
	// 					},
	// 				  ]
	// 			)})};
	// 	}
	// }