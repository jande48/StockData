import React, {useState, useEffect, useRef} from 'react';
import "semantic-ui-css/semantic.min.css"
import '../App.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { List, Header, Form, Input, Button, Radio, Grid, Container, Sidebar, Icon, Menu, Segment, Accordion, Checkbox, Select } from "semantic-ui-react"
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
	const [displayPriceChart, setDisplayPriceChart] = useState(true)
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
    
    const [displayStochCheckbox, setDisplayStochCheckbox] = useState(false)
    const [nForStoch, setNForStoch] = useState(14)
    const [d_nForStoch, setd_nForStoch] = useState(3)

    const [displayStochSignalCheckbox, setDisplayStochSignalCheckbox] = useState(false)
    const [nForStochSignal, setNForStochSignal] = useState(14)
    const [d_nForStochSignal, setd_nForStochSignal] = useState(3)

    const [displayWR, setDisplayWR] = useState(false)
    const [lbpForWR, setLBPForWR] = useState(14)

    const [displayAO, setDisplayAO] = useState(false)
    const [sForAO, setSForAO] = useState(5)
    const [lenForAO, setLenForAO] = useState(34)

    const [displayKama, setDisplayKama] = useState(false)
    const [nForKama, setNForKama] = useState(10)
    const [pow1ForKama, setPow1ForKama] = useState(2)
    const [pow2ForKama, setPow2ForKama] = useState(30)

    const [displayROC, setDisplayROC] = useState(false)
    const [nForROC, setNForROC] = useState(12)

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
			createStockPriceLineChart(stockData,stockPriceLineChartNode,displayPriceChart);
			createVolumeBarChart(stockData,showVolumeNode);
			createMomentumIndicatorsChartFunction(stockData,momentumIndicatorsChartNode)
		}

		if (earnings.length > 0) {
			//console.log(earnings)
			createEarningsChart(earnings,earningsChartNode)
		}
	},[stockData,displayRSIcheckbox,NforRSI,displayTSIcheckbox,rForTSI,sForTSI,displayUOcheckbox,sForUO,mForUO,lenForUO,wsForUO,wmForUO,wlForUO,displayStochCheckbox,nForStoch,d_nForStoch,,displayStochSignalCheckbox,nForStochSignal,d_nForStochSignal,displayWR,lbpForWR,displayAO,sForAO,lenForAO,displayKama,nForKama,pow1ForKama,pow2ForKama,displayROC,nForROC,displayPriceChart])

console.log(displayPriceChart)

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
					createStockPriceLineChart(data,stockPriceLineChartNode,displayPriceChart);
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

    const handlePriceClickLine = (event, {value}) => setDisplayPriceChart(true)
    const handlePriceClickCandle = (event, {value}) => setDisplayPriceChart(false)
    // function handlePriceChartClick() {
    //     //(event, {value}) => setDisplayPriceChart(!{ value });
    //     setDisplayPriceChart(!displayPriceChart)
    //     console.log(!displayPriceChart)
        
    // }

	function createMomentumIndicatorsChartFunction(data,momentumIndicatorsChartNode) {
		
		const RSIparameters = {'N':NforRSI}
		const TSIparameters = {'displayTSI':displayTSIcheckbox,'rTSI':rForTSI,'sTSI':sForTSI}
		const UOparameters = {'displayUO':displayUOcheckbox,'sForUO':sForUO,'mForUO':mForUO,'lenForUO':lenForUO,'wsForUO':wsForUO,'wmForUO':wmForUO,'wlForUO':wlForUO}
		const StochParameters = {'displayStoch':displayStochCheckbox,'nForStoch':nForStoch,'d_nForStoch':d_nForStoch}
		const StochSignalParameters = {'displayStochSignal':displayStochSignalCheckbox,'nForStochSignal':nForStochSignal,'d_nForStochSignal':d_nForStochSignal}
        const WRParameters = {'displayWR':displayWR,'lbpForWR':lbpForWR}
        const AOParameters = {'displayAO':displayAO,'sForAO':sForAO,'lenForAO':lenForAO}
        const KamaParameters = {'displayKama':displayKama,'nForKama':nForKama,'pow1ForKama':pow1ForKama,'pow2ForKama':pow2ForKama}
        const ROCParameters = {'displayROC':displayROC,'nForROC':nForROC}

		if (data.length > 1){
			fetch('/calculate_Momentum_Indicators/', {
				method: 'POST', // or 'PUT'
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify([data,RSIparameters,TSIparameters,UOparameters,StochParameters,StochSignalParameters,WRParameters,AOParameters,KamaParameters,ROCParameters]),
				})
				.then(response => response.json())
				.then(dataForMomfromAPI => {
					createMomentumIndicatorsChart(dataForMomfromAPI,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox,displayStochCheckbox,displayStochSignalCheckbox,displayWR,displayAO,displayKama,displayROC)
				})
				.catch((error) => {
				console.error('Error:', error);
				});
		}else{
			createMomentumIndicatorsChart(data,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox,displayStochCheckbox,displayStochSignalCheckbox,displayWR,displayAO,displayKama,displayROC)
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
        { key: 'thirty', text: '30', value: 30 },
        { key: 'thirtyone', text: '31', value: 31 },
		{ key: 'thirtytwo', text: '32', value: 32 },
		{ key: 'thirtythree', text: '33', value: 33 },
		{ key: 'thirtyfour', text: '34', value: 34 },
		{ key: 'thirtyfive', text: '35', value: 35 }
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
                        setrForTSI(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'EMA Smoothing Period for Smoothed Mom (s)' }}
                    placeholder='13'
                    onChange ={(e,selectedOption) => {
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
                        setsForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Medium Period (m)' }}
                    placeholder='14'
                    onChange ={(e,selectedOption) => {
                        setmForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Long Period (l)' }}
                    placeholder='28'
                    onChange ={(e,selectedOption) => {
                        setlenForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Short BP Average (ws)' }}
                    placeholder='4'
                    onChange ={(e,selectedOption) => {
                        setwsForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Medium BP Average (wm)' }}
                    placeholder='2'
                    onChange ={(e,selectedOption) => {
                        setwmForUO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Weight of Long BP Average (wl)' }}
                    placeholder='1'
                    onChange ={(e,selectedOption) => {
                        setwlForUO(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div>
        
    )

    const StochcontentPanel = (
        <div class='content active'>
            <React.Fragment>
            <Checkbox onClick={() => {
                setDisplayStochCheckbox(!displayStochCheckbox)
                }} label="Stochastic Oscillator">
            </Checkbox>
            <Form.Field
                control={Select}
                options={momentumNtradingDayOptions}
                label={{ children: 'over how many trading days?' }}
                placeholder='14'
                onChange ={(e,selectedOption) => {
                    setNForStoch(selectedOption.value)
                    }}
            />
            <Form.Field
                control={Select}
                options={momentumNtradingDayOptions}
                label={{ children: 'simple moving average period' }}
                placeholder='3'
                onChange ={(e,selectedOption) => {
                    setd_nForStoch(selectedOption.value)
                }}
            />
            </React.Fragment>
        </div>
        
    )                    

    const StochSignalcontentPanel = (
        <div class='content active'>
            <React.Fragment>
            <Checkbox onClick={() => {
                setDisplayStochSignalCheckbox(!displayStochSignalCheckbox)
                }} label="Stochastic Oscillator Signal">
            </Checkbox>
            <Form.Field
                control={Select}
                options={momentumNtradingDayOptions}
                label={{ children: 'over how many trading days?' }}
                placeholder='14'
                onChange ={(e,selectedOption) => {
                    setNForStochSignal(selectedOption.value)
                    }}
            />
            <Form.Field
                control={Select}
                options={momentumNtradingDayOptions}
                label={{ children: 'simple moving average period' }}
                placeholder='3'
                onChange ={(e,selectedOption) => {
                    setd_nForStochSignal(selectedOption.value)
                }}
            />
            </React.Fragment>
        </div>
        
    )      
    
    
    const WRcontentPanel = (
        <div class='content active'>
            <React.Fragment>
            <Checkbox onClick={() => {
                setDisplayWR(!displayWR)
                }} label="Williams %R">
            </Checkbox>
            <Form.Field
                control={Select}
                options={momentumNtradingDayOptions}
                label={{ children: 'Lookback Period' }}
                placeholder='14'
                onChange ={(e,selectedOption) => {
                    setLBPForWR(selectedOption.value)
                    }}
            />
            </React.Fragment>
        </div>
    )

    const AOcontentPanel = (
        <div class='content active'>
            <React.Fragment>
                <Checkbox onClick={() => {
                    setDisplayAO(!displayAO)
                    }} label="Awesome Oscillator">
                </Checkbox>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Short Period (s)' }}
                    placeholder='5'
                    onChange ={(e,selectedOption) => {
                        setSForAO(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'Long Period (len)' }}
                    placeholder='34'
                    onChange ={(e,selectedOption) => {
                        setLenForAO(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div> 
    )

    const KamacontentPanel = (
        <div class='content active'>
            <React.Fragment>
                <Checkbox onClick={() => {
                    setDisplayKama(!displayKama)
                    }} label="Kaufman's Adaptive Moving Average (KAMA)">
                </Checkbox>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'number of periods for the efficiency ratio (n)' }}
                    placeholder='10'
                    onChange ={(e,selectedOption) => {
                        setNForKama(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'number of periods for the fastest EMA constant' }}
                    placeholder='2'
                    onChange ={(e,selectedOption) => {
                        setPow1ForKama(selectedOption.value)
                        }}
                />
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'number of periods for the slowest EMA constant' }}
                    placeholder='30'
                    onChange ={(e,selectedOption) => {
                        setPow2ForKama(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div> 
    )

    const ROCcontentPanel = (
        <div class='content active'>
            <React.Fragment>
                <Checkbox onClick={() => {
                    setDisplayROC(!displayROC)
                    }} label="Rate of Change (ROC) Indicator">
                </Checkbox>
                <Form.Field
                    control={Select}
                    options={momentumNtradingDayOptions}
                    label={{ children: 'number of periods (n)' }}
                    placeholder='12'
                    onChange ={(e,selectedOption) => {
                        setNForROC(selectedOption.value)
                        }}
                />
            </React.Fragment>
        </div> 
    )

    const level1MomentumMenuPanels = [
        { key: 'RSI', title: 'Relative Strength Index', content: RSIcontentPanel, index: 0 },
        { key: 'TSI', title: 'True Strength Index', content: TSIcontentPanel, index: 1 },
        { key: 'UO', title: 'Ultimate Oscillator', content: UOcontentPanel, index: 2 },
        { key: 'Stoch', title: 'Stochastic Oscillator', content: StochcontentPanel, index: 3 },
        { key: 'StochSignal', title: 'Stochastic Oscillator Signal', content: StochSignalcontentPanel, index: 4 },
        { key: 'WR', title: 'Williams %R', content: WRcontentPanel, index: 5 },
        { key: 'AO', title: 'Awesome Oscillator', content: AOcontentPanel, index: 6 },
        { key: 'Kama', title: 'Kaufmans Adaptive Moving Average', content: KamacontentPanel, index: 7 },
        { key: 'ROC', title: 'Rate-of-Change (ROC) indicator', content: ROCcontentPanel, index: 8 },
    ]

    // function handleMomentumItemClick(e,itemProps) {
    //     const { index } = itemProps
    //     const { activeIndex } = activeMomentumMenuItem
    //     const newIndex = activeIndex === index ? -1 : index
    //     setActiveMomentumMenuItem({ activeIndex: newIndex })
    // }

    const Level1MomentumContent = (
            <div className="no-padding">
              {/* <Accordion.Accordion panels={level1MomentumMenuPanels} onTitleClick={handleMomentumItemClick(e,itemProps)} value={activeIndex} /> */}
              <Accordion.Accordion panels={level1MomentumMenuPanels} className='no-padding'/>
            </div>
        )

    const rootPanels = [
            { key: 'panel-1-Momentum', title: 'Momentum Indicators', content: { content: Level1MomentumContent } },
            //{ key: 'panel-2', title: 'Level 2', content: { content: Level2Content } },
        ]
	//console.log(NforRSI)


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
                                Custom Dates
                                <br/>Start: <DatePicker 
                                selected={startDate} 
                                maxDate={new Date()} 
                                onChange={date => handleStartDateClick(date)}
                                placeholderText='MM/DD/YYYY'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown />
                                
                                <br/>  End:  <DatePicker 
                                selected={endDate} 
                                maxDate={new Date()}
                                onChange={date => handleEndDateClick(date)}
                                placeholderText='MM/DD/YYYY'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown />
                            <br/> 
                            </Segment>
                            <Segment>
                                <Form>
                                    <Form.Field>
                                        {/* Line <Radio toggle value={displayPriceChart} checked={!displayPriceChart} onChange={handlePriceClick}/> Candle Stick */}
                                        <Button toggle active={displayPriceChart} onClick={handlePriceClickLine}>
                                            Line Chart
                                        </Button>
                                        <Button toggle active={!displayPriceChart} onClick={handlePriceClickCandle}>
                                            Candlecd Stick
                                        </Button>
                                    </Form.Field>
                                </Form>
                            {/* <Button toggle active={displayPriceChart} onClick={setDisplayPriceChart(!displayPriceChart)}>
                                Line Chart
                            </Button>
                            <Button toggle active={!displayPriceChart} onClick={setDisplayPriceChart(!displayPriceChart)}>
                                Candle Stick
                            </Button> */}
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