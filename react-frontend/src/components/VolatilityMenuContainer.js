import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { displayATR, displayBBSMA, displayBBUpper, displayBBLower, displayKeltnerC } from '../redux'
import { Grid, Menu, Accordion, Checkbox, Icon, Header} from "semantic-ui-react"


import { fetchVolatilityData } from '../redux';
import ATRcontentpanel from './accordion/volatility/ATRcontentpanel'
import BBSMAcontentpanel from './accordion/volatility/BBSMAcontentpanel'
import BBUppercontentpanel from './accordion/volatility/BBUppercontentpanel'
import BBLowercontentpanel from './accordion/volatility/BBLowercontentpanel'
import KCcontentpanel from './accordion/volatility/KCcontentpanel'

function MomentumMenuContainer(props) {
    
    const [activeATRAccodianMenuItem, setATRActiveAccordionMenuItem] = useState(-1)
    const [activeBBSMAAccodianMenuItem, setBBSMAActiveAccordionMenuItem] = useState(-1)
    const [activeBBUpperAccodianMenuItem, setBBUpperActiveAccordionMenuItem] = useState(-1)
    const [activeBBLowerAccodianMenuItem, setBBLowerActiveAccordionMenuItem] = useState(-1)
    const [activeKCAccodianMenuItem, setKCActiveAccordionMenuItem] = useState(-1)

    useEffect(() => {
        if (typeof(props.stockData) != 'undefined' ) {
          if (props.stockData.length > 0) {
          const ATRparameters = {'displayATR':props.displayATR,'nForATR':props.nForATR}
          const BBSMAparameters = {'displayBBSMA':props.displayBBSMA,'nForBBSMA':props.nForBBSMA}
          const BBUpperparameters = {'displayBBUpper':props.displayBBUpper,'nForBBUpper':props.nForBBUpper,'ndevBBUpper':props.ndevBBUpper}
          const BBLowerparameters = {'displayBBLower':props.displayBBLower,'nForBBLower':props.nForBBLower,'ndevBBLower':props.ndevBBLower}
          const KCparameters = {'displayKeltnerC':props.displayKeltnerC,'nForKeltnerC':props.nForKeltnerC}
          
          props.fetchVolatilityData(JSON.stringify([props.stockData,ATRparameters,BBSMAparameters,BBUpperparameters,BBLowerparameters,KCparameters]))
  
        }}
      }, [props.stockData,props.displayATR,props.nForATR,props.displayBBSMA,props.displayBBSMA,props.displayBBUpper,props.nForBBUpper,
        props.ndevBBUpper,props.displayBBLower,props.nForBBLower,props.ndevBBLower,props.displayKeltnerC,props.nForKeltnerC])



      class createTiles {
        constructor(name,dispatch,display,activeState,setActiveState,content) {
          this.name = name;
          this.display = display;
          this.dispatch = dispatch;
          this.activeState =activeState;
          this.setActiveState = setActiveState
          this.content = content;

        }
        // Getter
        get tile() {
          return this.createTile();
        }

        // Method
        createTile() {
            return(
                <Grid columns='equal' textAlign='bottom'>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column width={2}>
                        <Checkbox borderless index={1} onClick={(event) => {
                                    event.stopPropagation()
                                    this.dispatch(!this.display)
                                }}>
                        </Checkbox>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h5' inverted>{this.name}</Header>
                    </Grid.Column>
                    <Grid.Column floated='right' width={2}>
                        <Icon name={this.activeState === 0 ? 'caret down' : 'caret left'}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid> 
            )
        }

    }

    const ATRAccordionClass = new createTiles('Average True Range',props.displayATRdispatch,props.displayATR,activeATRAccodianMenuItem,
    setATRActiveAccordionMenuItem,<ATRcontentpanel/>)
    const BBSMAAccordionClass = new createTiles('Bollinger Moving Average',props.displayBBSMAdispatch,props.displayBBSMA,activeBBSMAAccodianMenuItem,
    setBBSMAActiveAccordionMenuItem,<BBSMAcontentpanel/>)
    const BBUpperAccordionClass = new createTiles('Bollinger Upper Band',props.displayBBUpperdispatch,props.displayBBUpper,activeBBUpperAccodianMenuItem,
    setBBUpperActiveAccordionMenuItem,<BBUppercontentpanel/>)
    const BBLowerAccordionClass = new createTiles('Bollinger Lower Band',props.displayBBLowerdispatch,props.displayBBLower,activeBBLowerAccodianMenuItem,
    setBBLowerActiveAccordionMenuItem,<BBLowercontentpanel/>)
    const KCAccordionClass = new createTiles('Keltner C Mid Band',props.displayKeltnerCdispatch,props.displayKeltnerC,activeKCAccodianMenuItem,
    setKCActiveAccordionMenuItem,<KCcontentpanel/>)
    

    const objectList = [ ATRAccordionClass,BBSMAAccordionClass,BBUpperAccordionClass, BBLowerAccordionClass, KCAccordionClass]

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

    

  return (
    <div>
        <Grid> 
        
         <Grid.Row stretched>        
                <Accordion as={Menu} vertical stretched fluid borderless inverted>
                    {objectList.map( el => (
                    <Menu.Item borderless>
                        <Accordion.Title
                            active={el.activeState === 0}
                            //content={RSIAccordionTitle}
                            index={0}
                            //borderless
                            onClick={(e,index) => {
                                el.setActiveState(index.index === el.activeState ? -1 : index.index)
                                }}
                            inverted
                        >{el.createTile()}</Accordion.Title>
                        <Accordion.Content borderless active={el.activeState=== 0} >{el.content}</Accordion.Content>
                    </Menu.Item> 
                        ))}  
                </Accordion>
        </Grid.Row> 
        
     </Grid>
      
    </div> 
  )
}

const mapStateToProps = state => {
  return {
    stockData: state.stockDataFromRootReducer.stockData,
    displayATR: state.volatilityFromtRootReducer.displayATR,
    nForATR: state.volatilityFromtRootReducer.nForATR,
    displayBBSMA: state.volatilityFromtRootReducer.displayBBSMA,
    nForBBSMA: state.volatilityFromtRootReducer.nForBBSMA,
    displayBBUpper: state.volatilityFromtRootReducer.displayBBUpper,
    nForBBUpper: state.volatilityFromtRootReducer.nForBBUpper,
    ndevBBUpper: state.volatilityFromtRootReducer.ndevForBBUpper,
    displayBBLower: state.volatilityFromtRootReducer.displayBBLower,
    nForBBLower: state.volatilityFromtRootReducer.nForBBLower,
    ndevBBLower: state.volatilityFromtRootReducer.ndevForBBLower,
    displayKeltnerC: state.volatilityFromtRootReducer.displayKeltnerC,
    nForKeltnerC: state.volatilityFromtRootReducer.nForKeltnerC,
    startDate: state.datesFromRootReducer.startDate,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchVolatilityData: (APIstring) => dispatch(fetchVolatilityData(APIstring)),
    displayATRdispatch: x => dispatch(displayATR(x)),
    displayBBSMAdispatch: x => dispatch(displayBBSMA(x)),
    displayBBUpperdispatch: x => dispatch(displayBBUpper(x)),
    displayBBLowerdispatch: x => dispatch(displayBBLower(x)),
    displayKeltnerCdispatch: x => dispatch(displayKeltnerC(x)),
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MomentumMenuContainer)








// function headerCollapsible(title) {
//     return (
//         <Item.Group>
//         <Item>
//             <Item.Content>
//                 <Item.Header as='a'>{title}</Item.Header><br/>
//             </Item.Content>
//         </Item>
//     </Item.Group>
//     )
// }


// const [sForUO, setsForUO] = useState(7)
// const [mForUO, setmForUO] = useState(14)
// const [lenForUO, setlenForUO] = useState(28)
// const [wsForUO, setwsForUO] = useState(4)
// const [wmForUO, setwmForUO] = useState(2)
// const [wlForUO, setwlForUO] = useState(1)

// const [nForStoch, setNForStoch] = useState(14)
//     const [d_nForStoch, setd_nForStoch] = useState(3)
//     const [activeStochAccodianMenuItem, setStochActiveAccordionMenuItem] = useState(-1)
//     const [nForStochSignal, setNForStochSignal] = useState(14)
//     const [d_nForStochSignal, setd_nForStochSignal] = useState(3)
//     const [activeStochSignalAccodianMenuItem, setStochSignalActiveAccordionMenuItem] = useState(-1)
//     const [lbpForWR, setLBPForWR] = useState(14)
//     const [activeWRAccodianMenuItem, setWRActiveAccordionMenuItem] = useState(-1)
//     const [sForAO, setSForAO] = useState(5)
//     const [lenForAO, setLenForAO] = useState(34)
//     const [activeAOAccodianMenuItem, setAOActiveAccordionMenuItem] = useState(-1)
//     const [nForKama, setNForKama] = useState(10)
//     const [pow1ForKama, setPow1ForKama] = useState(2)
//     const [pow2ForKama, setPow2ForKama] = useState(30)
//     const [activeKamaAccodianMenuItem, setKamaActiveAccordionMenuItem] = useState(-1)
//     const [nForROC, setNForROC] = useState(12)
//     const [activeROCAccodianMenuItem, setROCActiveAccordionMenuItem] = useState(-1)


    //const TSIAccordionTitle = createAccordionTile(setDisplayTSIcheckbox,displayTSIcheckbox,'True Strength Index')
    // const UOAccordionTitle = createAccordionTile(setDisplayUOCheckbox,displayUOCheckbox,'Ultimate Oscillator')
    // const StochAccordionTitle = createAccordionTile(setDisplayStochCheckbox,displayStochCheckbox,'Stochastic Oscillator')
    // const StochSignalAccordionTitle = createAccordionTile(setDisplayStochSignalCheckbox,displayStochSignalCheckbox,'Stochastic Oscillator Signal')
    // const WRAccordionTitle = createAccordionTile(setDisplayWR,displayWR,'Williams %R')
    // const AOAccordionTitle = createAccordionTile(setDisplayAO,displayAO,'Awesome Oscillator') 
    // const KamaAccordionTitle = createAccordionTile(setDisplayKama,displayKama,'Kaufmans Adaptive Moving Average')
    // const ROCAccordionTitle = createAccordionTile(setDisplayROC,displayROC,'Rate-of-Change (ROC) indicator') 


        //const RSIcontentPanel = createContentPanelAccordion(['Period in Trading Days (n):'],['12'],[nForRSIdispatch(selectedOption.value)])
    // const RSIcontentPanel = (
    //     <Grid columns='equal'>
    //             <Grid.Column>
    //                 <br/>'Period in Trading Days (n):'
    //             </Grid.Column>
    //             <Grid.Column width={4}>
    //                 <Form.Field
    //                     control={Select}
    //                     options={momentumNtradingDayOptions}
    //                     placeholder='12'
    //                     compact
    //                     onChange ={(e,selectedOption) => {
    //                         props.nForRSIdispatch(selectedOption.value)
    //                         }}
    //                 />
    //             </Grid.Column>
    //         </Grid>
    // )
    //const TSIcontentPanel = createContentPanelAccordion(['EMA Smoothing Period (r):'],['25'],[setrForTSI])
    // const UOcontentPanel =  createContentPanelAccordion(['Short Period (s):','Medium Period (m): ','Long Period (l)','Weight of Short BP Average (ws):','Weight of Medium BP Average (wm):','Weight of Long BP Average'],['7','14','28','4','2','1'],[setsForUO,setmForUO,setlenForUO,setwsForUO,setwmForUO,setwlForUO])
    // const StochcontentPanel = createContentPanelAccordion(['Period of Trading Days:','Simple Moving Average Period:'],['14','3'],[setNForStoch,setd_nForStoch])
    // const StochSignalcontentPanel = createContentPanelAccordion(['Period of Trading Days:','Simple Moving Average Period:'],['14','3'],[setNForStochSignal,setd_nForStochSignal])
    // const WRcontentPanel =  createContentPanelAccordion(['Lookback Period:'],['14'],[setLBPForWR])
    // const AOcontentPanel = createContentPanelAccordion(['Short Period (s):','Long Period (l):'],['5','34'],[setSForAO,setLenForAO])
    // const KamacontentPanel = createContentPanelAccordion(['Periods for Efficiency Ratio (n):','Periods for Fast EMA Constant:','Periods for Slow EMA Constant:'],['10','2','30'],[setNForKama,setPow1ForKama,setPow2ForKama])
    // const ROCcontentPanel = createContentPanelAccordion(['Number of Periods (n):'],['12'],[setNForROC])
    
    
    // const [displayUOCheckbox, setDisplayUOCheckbox] = useState(false)
    // const [displayStochCheckbox, setDisplayStochCheckbox] = useState(false)
    // const [displayStochSignalCheckbox, setDisplayStochSignalCheckbox] = useState(false)
    // const [displayWR, setDisplayWR] = useState(false)
    // const [displayAO, setDisplayAO] = useState(false)
    // const [displayKama, setDisplayKama] = useState(false)
    // const [displayROC, setDisplayROC] = useState(false)

    // function createContentPanelAccordion(title,place,set) {
    //     // for (var i = 0; i < title.length; i++) {
    //     //     return (

    //     //     )
    //     if (title.length == 1) {
    //         return (
    //         <Grid columns='equal'>
    //             <Grid.Column>
    //                 <br/>{title[0]}
    //             </Grid.Column>
    //             <Grid.Column width={4}>
    //                 <Form.Field
    //                     control={Select}
    //                     options={momentumNtradingDayOptions}
    //                     placeholder={place[0]}
    //                     compact
    //                     onChange ={(e,selectedOption) => {
    //                         set[0](selectedOption.value)
    //                         }}
    //                 />
    //             </Grid.Column>
    //         </Grid>
    //         )
    //     } else if (title.length == 2) {
    //         return (
    //         <Grid columns='equal'>
    //             <Grid.Row>
    //             <Grid.Column>
    //                 <br/>{title[0]}
    //             </Grid.Column>
    //             <Grid.Column width={4}>
    //                 <Form.Field
    //                     control={Select}
    //                     options={momentumNtradingDayOptions}
    //                     placeholder={place[0]}
    //                     compact
    //                     onChange ={(e,selectedOption) => {
    //                         set[0](selectedOption.value)
    //                         }}
    //                 />
    //             </Grid.Column>
    //             </Grid.Row>
    //             <Grid.Row>
    //             <Grid.Column>
    //                 <br/>{title[1]}
    //             </Grid.Column>
    //             <Grid.Column width={4}>
    //                 <Form.Field
    //                     control={Select}
    //                     options={momentumNtradingDayOptions}
    //                     placeholder={place[1]}
    //                     compact
    //                     onChange ={(e,selectedOption) => {
    //                         set[1](selectedOption.value)
    //                         }}
    //                 />
    //             </Grid.Column>
    //             </Grid.Row>
    //         </Grid>
    //         )
    //     } else if (title.length == 3) {
    //         return (
    //             <Grid columns='equal'>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[0]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[0]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[0](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[1]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[1]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[1](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[2]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[2]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[2](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //             )
    //     } else if (title.length == 4) {
    //         return (
    //             <Grid columns='equal'>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[0]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[0]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[0](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[1]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[1]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[1](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[2]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[2]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[2](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[3]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[3]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[3](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //             )
    
    //     } else if (title.length == 5) {
    //         return (
    //             <Grid columns='equal'>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[0]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[0]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[0](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[1]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[1]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[1](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[2]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[2]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[2](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[3]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[3]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[3](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[4]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[4]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[4](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //             )
    //     } else if (title.length == 6) {
    //         return (
    //             <Grid columns='equal'>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[0]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[0]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[0](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[1]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[1]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[1](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[2]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[2]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[2](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[3]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[3]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[3](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[4]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[4]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[4](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                 <Grid.Column>
    //                     <br/>{title[5]}
    //                 </Grid.Column>
    //                 <Grid.Column width={4}>
    //                     <Form.Field
    //                         control={Select}
    //                         options={momentumNtradingDayOptions}
    //                         placeholder={place[5]}
    //                         compact
    //                         onChange ={(e,selectedOption) => {
    //                             set[5](selectedOption.value)
    //                             }}
    //                     />
    //                 </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //             )    
    //     } else {}
    //     }



    // function createAccordionTile(set,state,title){
    //     return(
    //     <Grid columns='equal'>
    //     <Grid.Column width={2}>
    //             <Checkbox borderless index={1} onClick={(event) => {
    //                         event.stopPropagation()
    //                         set(!state)
    //                     }}>
    //             </Checkbox>
    //     </Grid.Column>
    //     <Grid.Column>
    //         <h5>{title}</h5>
    //     </Grid.Column>
    //     </Grid>)
    // }