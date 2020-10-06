import React, {useState, useEffect, useRef} from 'react';
import "semantic-ui-css/semantic.min.css"
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Grid, Container, Sidebar, Icon, Menu, Segment, Accordion, Checkbox, Select } from "semantic-ui-react"
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
    const [activeRSIMenuItem, setActiveRSIMenuItem] = useState()
    const [activeTSIMenuItem, setActiveTSIMenuItem] = useState()
    const [activeUOMenuItem, setActiveUOMenuItem] = useState()
    

	const [stockData, setStockData] = useState([]);
	
	const [displayRSIcheckbox, setDisplayRSIcheckbox] = useState(true)
	const [NforRSI, setNforRSI] = useState(10)

	const [displayTSIcheckbox, setDisplayTSIcheckbox] = useState(false)
	const [rForTSI, setrForTSI] = useState(25)
	const [sForTSI, setsForTSI] = useState(13)

	const [displayUOcheckbox, setUOcheckbox] = useState(false)
	const [sForUO, setsForUO] = useState(7)
	const [mForUO, setmForUO] = useState(14)
	const [lenForUO, setlenForUO] = useState(28)
	const [wsForUO, setwsForUO] = useState(4)
	const [wmForUO, setwmForUO] = useState(2)
	const [wlForUO, setwlForUO] = useState(1)



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
			createMomentumIndicatorsChartFunction(stockData,momentumIndicatorsChartNode)
		}

		if (earnings.length > 0) {
			//console.log(earnings)
			createEarningsChart(earnings,earningsChartNode)
		}
	},[stockData,displayRSIcheckbox,NforRSI,displayTSIcheckbox,rForTSI,sForTSI,displayUOcheckbox,sForUO,mForUO,lenForUO,wsForUO,wmForUO,wlForUO])



	function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}

	function getAndSetStockData(stockTicker,theStartDate,theEndDate) {

		const startDateConverted = convertDatesToString(theStartDate) 
		const endDateConverted = convertDatesToString(theEndDate) 
		fetch("/get_stock_data/"+stockTicker+"/"+startDateConverted+"/"+endDateConverted).then(response => 
			response.json().then(data => {
				if (stockData.length < 1) {
					createStockPriceLineChart(data,stockPriceLineChartNode);
					createVolumeBarChart(data,showVolumeNode);
					createMomentumIndicatorsChartFunction(data,momentumIndicatorsChartNode);
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

	function createMomentumIndicatorsChartFunction(data,momentumIndicatorsChartNode) {
		
		const RSIparameters = {'N':NforRSI}
		const TSIparameters = {'displayTSI':displayTSIcheckbox,'rTSI':rForTSI,'sTSI':sForTSI}
		const UOparameters = {'displayUO':displayUOcheckbox,'sForUO':sForUO,'mForUO':mForUO,'lenForUO':lenForUO,'wsForUO':wsForUO,'wmForUO':wmForUO,'wlForUO':wlForUO}
		//const dataWithMomPara = [...data,UOparameters,RSIparameters,TSIparameters];
		

		if (data.length > 1){
			fetch('/calculate_Momentum_Indicators/', {
				method: 'POST', // or 'PUT'
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify([data,RSIparameters,TSIparameters,UOparameters]),
				})
				.then(response => response.json())
				.then(dataForMomfromAPI => {
					createMomentumIndicatorsChart(dataForMomfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox)
				})
				.catch((error) => {
				console.error('Error:', error);
				});
		}else{
			createMomentumIndicatorsChart(data,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox)
		}

		// if (displayTSIcheckbox) {
		// 	const dataWithsAndrForTSI = [...stockData,{'r':rForTSI},{'s':sForTSI}]
		// 	if (dataWithsAndrForTSI > 1) {
		// 		fetch('/calculate_TSI/', {
		// 			method: 'POST', // or 'PUT'
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 			},
		// 			body: JSON.stringify(dataWithsAndrForTSI),
		// 			})
		// 			.then(response => response.json())
		// 			.then(dataForTSIfromAPI => {
		// 				createMomentumIndicatorsChart(dataForRSIfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,dataForTSIfromAPI,displayTSIcheckbox)
		// 			})
		// 			.catch((error) => {
		// 			console.error('Error:', error);
		// 			});

		// 	}
		// }

		// const dataWithN = [...stockData,{'N':NforRSI}]
		// if (dataWithN.length > 1) {
			
		// 	fetch('/calculate_RSI/', {
		// 		method: 'POST', // or 'PUT'
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify(dataWithN),
		// 		})
		// 		.then(response => response.json())
		// 		.then(dataForRSIfromAPI => {
		// 			createMomentumIndicatorsChart(dataForRSIfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox)
		// 		})
		// 		.catch((error) => {
		// 		console.error('Error:', error);
		// 		});
		//}
		
	}

	const momentumNtradingDayOptions = [
		{ key: 'one', text: '1', value: 1 },
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
		{ key: 'twentyone', text: '21', value: 21 },
		{ key: 'twentytwo', text: '22', value: 22 },
		{ key: 'twentythree', text: '23', value: 23 },
		{ key: 'twentyfour', text: '24', value: 24 },
		{ key: 'twentyfive', text: '25', value: 25 },
		{ key: 'twentysix', text: '26', value: 26 },
		{ key: 'twentyseven', text: '27', value: 27 },
		{ key: 'twentyeight', text: '28', value: 28 },
		{ key: 'twentynine', text: '29', value: 29 },
		{ key: 'thirty', text: '30', value: 30 }
	]
	  
    

    const RSIcontentPanel = (
        <div class='content active'>
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
        </div>
        
    )

    const TSIcontentPanel = (
        <div class='content active'>
            <React.Fragment>
                <Checkbox onClick={() => {
                    setDisplayTSIcheckbox(!displayTSIcheckbox)
                    }} label="True Strength Index">
                </Checkbox>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'EMA Smoothing Period (r)' }}
                    placeholder='25'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setrForTSI(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'EMA Smoothing Period for Smoothed Mom (s)' }}
                    placeholder='13'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setsForTSI(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div>
        
    )

    const UOcontentPanel = (
        <div class='content active'>
            <React.Fragment>
                <Checkbox onClick={() => {
                    setUOcheckbox(!displayUOcheckbox)
                    }} label="Ultimate Oscillator">
                </Checkbox>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Short Period (s)' }}
                    placeholder='7'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setsForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Medium Period (m)' }}
                    placeholder='14'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setmForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Long Period (l)' }}
                    placeholder='28'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setlenForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Short BP Average (ws)' }}
                    placeholder='4'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setwsForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Medium BP Average (wm)' }}
                    placeholder='2'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setwmForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Long BP Average (wl)' }}
                    placeholder='1'
                    onChange ={(e,selectedOption) => {
                        console.log(selectedOption.value)
                        setwlForUO(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div>
        
    )

    const level1MomentumMenuPanels = [
        { key: 'RSI', title: 'Relative Strength Index', content: RSIcontentPanel, index: 0 },
        { key: 'TSI', title: 'True Strength Index', content: TSIcontentPanel, index: 1 },
        { key: 'UO', title: 'Ultimate Oscillator', content: UOcontentPanel, index: 2 }
    ]

    // function handleMomentumItemClick(e,itemProps) {
    //     const { index } = itemProps
    //     const { activeIndex } = activeMomentumMenuItem
    //     const newIndex = activeIndex === index ? -1 : index
    //     setActiveMomentumMenuItem({ activeIndex: newIndex })
    // }

    const Level1MomentumContent = (
            <div className="no-padding">
              {/* <Accordion.Accordion panels={level1MomentumMenuPanels} onTitleClick={setActiveMomentumMenuItem(level1MomentumMenuPanels.index)} activeIndex={activeMomentumMenuItem} /> */}
              <Accordion.Accordion panels={level1MomentumMenuPanels} className='no-padding'/>
            </div>
        )

    const rootPanels = [
            { key: 'panel-1-Momentum', title: 'Momentum Indicators', content: { content: Level1MomentumContent } },
            //{ key: 'panel-2', title: 'Level 2', content: { content: Level2Content } },
        ]
	console.log(NforRSI)


	return (
		<div>
            <Grid celled>
                <Grid.Column width = {4}>
                    <Grid.Row>
                        <Grid.Row stretched>
                            <Segment>
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
                            </Segment>
                            <Segment>
                                <Menu>
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
                            </Segment>
                            <Segment>
                                Custom
                                <DatePicker 
                                selected={startDate} 
                                maxDate={new Date()} 
                                onChange={date => handleStartDateClick(date)}
                                placeholderText='MM/DD/YYYY'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown />
                                
                                <DatePicker 
                                selected={endDate} 
                                maxDate={new Date()}
                                onChange={date => handleEndDateClick(date)}
                                placeholderText='MM/DD/YYYY'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown />

                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Accordion defaultActiveIndex={0} panels={rootPanels} styled />
                            {/* <Accordion>
                                <Accordion.Title
                                    onClick={() => {
                                        setActiveMomentumMenuItem(!activeMomentumMenuItem)
                                    }}
                                >
                                    <h3>Momentum Indicators {activeMomentumMenuItem ? "-" : "+"}</h3>
                                </Accordion.Title>
                                <Accordion.Content active={activeMomentumMenuItem}>
                                    <React.Fragment>
                                        <Accordion>
                                            <Accordion.Title
                                            onClick={() => {
                                                setActiveRSIMenuItem(!activeRSIMenuItem)
                                            }}
                                            >
                                            <Accordion.Content active={activeRSIMenuItem}>
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
                                            </Accordion.Content>
                                        </Accordion>
                                    </React.Fragment>
                                    
                                    
                                    <React.Fragment>
                                        <Checkbox onClick={() => {
                                            setDisplayTSIcheckbox(!displayTSIcheckbox)
                                            }} label="True Strength Index">
                                        </Checkbox>
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'EMA Smoothing Period (r)' }}
                                            placeholder='25'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setrForTSI(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'EMA Smoothing Period for Smoothed Mom (s)' }}
                                            placeholder='13'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setsForTSI(selectedOption.value)
                                                }}
                                        />
                                    </React.Fragment>
                                    <React.Fragment>
                                        <Checkbox onClick={() => {
                                            setUOcheckbox(!displayUOcheckbox)
                                            }} label="Ultimate Oscillator">
                                        </Checkbox>
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Short Period (s)' }}
                                            placeholder='7'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setsForUO(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Medium Period (m)' }}
                                            placeholder='14'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setmForUO(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Long Period (l)' }}
                                            placeholder='28'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setlenForUO(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Weight of Short BP Average (ws)' }}
                                            placeholder='4'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setwsForUO(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Weight of Medium BP Average (wm)' }}
                                            placeholder='2'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setwmForUO(selectedOption.value)
                                                }}
                                        />
                                        <Form.Field
                                            control={Select}
                                            options={momentumNtradingDayOptions}
                                            label={{ children: 'Weight of Long BP Average (wl)' }}
                                            placeholder='1'
                                            onChange ={(e,selectedOption) => {
                                                console.log(selectedOption.value)
                                                setwlForUO(selectedOption.value)
                                                }}
                                        />
                                    </React.Fragment>
                                </Accordion.Content>
                            </Accordion> */}
                        </Grid.Row>
                    </Grid.Row>
                    
                </Grid.Column>
                <Grid.Column width = {12}>
                    
                    
                        
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
                </Grid.Column>
            </Grid>    
        </div>	
	);
} 