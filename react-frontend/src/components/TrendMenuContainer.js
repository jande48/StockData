import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { displaySMA, displayEMA, displayMACD, displayMACDsignal, displayADX, displayADXP, displayADXN, displayVIPOS, displayVINEG,
    displayTRIX, displayMI, displayDPO, } from '../redux'
import { Grid, Menu, Accordion, Checkbox, Icon, Header } from "semantic-ui-react"
import SMAcontentpanel from './accordion/momentum/SMAcontentpanel'
import EMAcontentPanel from './accordion/momentum/EMAcontentpanel'
import MACDcontentPanel from './accordion/momentum/MACDcontentpanel'
import MACDSIGNALcontentPanel from './accordion/trend/MACDSIGNALcontentpanel'
import ADXcontentPanel from './accordion/trend/ADXcontentpanel'
import ADXPcontentPanel from './accordion/trend/ADXPcontentpanel'
import ADXNcontentPanel from './accordion/trend/ADXNcontentpanel'
import VIPOScontentPanel from './accordion/trend/VIPOScontentpanel'
import VINEGcontentPanel from './accordion/trend/VINEGcontentpanel'
import TRIXcontentPanel from './accordion/trend/TRIXcontentpanel'
import MIcontentPanel from './accordion/trend/MIcontentpanel'
import DPOcontentPanel from './accordion/trend/DPOcontentpanel'
import { fetchTrendData } from '../redux';
//import CCIcontentPanel from './accordion/trend/CCIcontentpanel'

function TrendMenuContainer(props) {
    
    useEffect(() => {
        const SMAp = {'displaySMA':props.displaySMA,'nForSMA':props.nForSMA}
        const EMAp = {'displayEMA':props.displayEMA,'nForEMA':props.nForEMA}
        const MACDp = {'displayMACD':props.displayMACD,'nFastForMACD':props.nFastForMACD,'nSlowForMACD':props.nSlowForMACD}
        const MACDsignalp = {'displayMACDsignal':props.displayMACDsignal,'nSlowForMACDsignal':props.nSlowForMACDsignal,'nFastForMACDsignal':props.nFastForMACDsignal,'nSignForMACDsignal':props.nSignForMACDsignal}
        const ADXp = {'displayADX':props.displayADX,'nForADX':props.nForADX}
        const ADXPp = {'displayADXP':props.displayADXP,'nForADXP':props.nForADXP}
        const ADXNp = {'displayADXN':props.displayADXN,'nForADXN':props.nForADXN}
        // const BBSMAp = {'displayBBSMA':props.displayBBSMA, 'nForBBSMA':props.nForBBSMA, 'nDevForBBSMA': props.nDevForBBSMA}
        const VIPOSp = {'displayVIPOS':props.displayVIPOS,'nForVIPOS':props.nForVIPOS}
        const VINEGp = {'displayVINEG':props.displayVINEG,'nForVINEG':props.nForVINEG}
        const TRIXp = {'displayTRIX':props.displayTRIX,'nForTRIX':props.nForTRIX}
        const MIp = {'displayMI':props.displayMI,'nForMI':props.nForMI,'n2ForMI':props.n2ForMI}
        //const CCIp = {'displayCCI':props.displayCCI,'nForCCI':props.nForCCI,'cForCCI':props.cForCCI}
        const DPOp = {'displayDPO':props.displayDPO,'nForDPO':props.nForDPO}
    
        //props.fetchStockData(String(props.tickers+"/"+convertDatesToString(props.startDate)+"/"+convertDatesToString(props.endDate)))
        props.fetchTrendData(JSON.stringify([props.stockData,SMAp,EMAp,MACDp,MACDsignalp,ADXp,ADXPp,ADXNp,VIPOSp,VINEGp,TRIXp,MIp, DPOp]))
        
      }, [props.stockData,props.displaySMA,props.nForSMA,props.displayEMA,props.nForEMA,props.displayMACD,props.nFastForMACD,props.nSlowForMACD,
        props.displayMACDsignal,props.nSlowForMACDsignal,props.nFastForMACDsignal,props.nSignForMACDsignal,props.displayADX,props.nForADX,
        props.displayADXP,props.nForADXP,props.displayADXN,props.nForADXN,props.displayVIPOS,props.nForVIPOS,props.displayVINEG,props.nForVINEG,
        props.displayTRIX,props.nForTRIX,props.displayMI,props.nForMI,props.n2ForMI,props.displayDPO,props.nForDPO])

    const [activeSMAAccordionMenuItem, setActiveSMAAccordionMenuItem] = useState(-1)
    const [activeMACDAccordionMenuItem, setActiveMACDAccordionMenuItem] = useState(-1)
    const [activeEMAAccodianMenuItem, setActiveEMAAccodianMenuItem] = useState(-1)
    const [activeMACDSIGNALAccodianMenuItem, setActiveMACDSIGNALAccodianMenuItem] = useState(-1)
    const [activeADXAccodianMenuItem, setActiveADXAccodianMenuItem] = useState(-1)
    const [activeADXPAccodianMenuItem, setActiveADXPAccodianMenuItem] = useState(-1)
    const [activeADXNAccodianMenuItem, setActiveADXNAccodianMenuItem] = useState(-1)
    const [activeVIPOSAccodianMenuItem, setActiveVIPOSAccodianMenuItem] = useState(-1)
    const [activeVINEGAccodianMenuItem, setActiveVINEGAccodianMenuItem] = useState(-1)
    const [activeTRIXAccodianMenuItem, setActiveTRIXAccodianMenuItem] = useState(-1)
    const [activeMIAccodianMenuItem, setActiveMIAccodianMenuItem] = useState(-1)
    const [activeDPOAccodianMenuItem, setActiveDPOAccodianMenuItem] = useState(-1)


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

    const EMAAccordionClass = new createTiles('Exponential Moving Average',props.displayEMAdispatch,props.displayEMA,activeEMAAccodianMenuItem,
    setActiveEMAAccodianMenuItem,<EMAcontentPanel />)
    const MACDsignalAccordionClass = new createTiles('MACD Signal',props.displayMACDsignaldispatch,props.displayMACDsignal,activeMACDSIGNALAccodianMenuItem,
    setActiveMACDSIGNALAccodianMenuItem,<MACDSIGNALcontentPanel />)
    const ADXAccordionClass = new createTiles('Average Directional Movement',props.displayADXdispatch,props.displayADX,activeADXAccodianMenuItem,
    setActiveADXAccodianMenuItem,<ADXcontentPanel />)
    const ADXPAccordionClass = new createTiles('ADM - Positive',props.displayADXPdispatch,props.displayADXP,activeADXPAccodianMenuItem,
    setActiveADXPAccodianMenuItem,<ADXPcontentPanel />)
    const ADXNAccordionClass = new createTiles('ADM - Negative',props.displayADXNdispatch,props.displayADXN,activeADXNAccodianMenuItem,
    setActiveADXNAccodianMenuItem,<ADXNcontentPanel />)
    const VIPOSAccordionClass = new createTiles('Vortex Indicator - Positive',props.displayVIPOSNdispatch,props.displayVIPOS,activeVIPOSAccodianMenuItem,
    setActiveVIPOSAccodianMenuItem,<VIPOScontentPanel />)
    const VINEGAccordionClass = new createTiles('Vortex Indicator - Negative',props.displayVINEGdispatch,props.displayVINEG,activeVINEGAccodianMenuItem,
    setActiveVINEGAccodianMenuItem,<VINEGcontentPanel />)
    const TRIXAccordionClass = new createTiles('TRIX',props.displayTRIXdispatch,props.displayTRIX,activeTRIXAccodianMenuItem,
    setActiveTRIXAccodianMenuItem,<TRIXcontentPanel />)
    const MIAccordionClass = new createTiles('Mass Index',props.displayMIdispatch,props.displayMI,activeMIAccodianMenuItem,
    setActiveMIAccodianMenuItem,<MIcontentPanel />)
    const DPOAccordionClass = new createTiles('Detrended Price Oscillator',props.displayDPOdispatch,props.displayDPO,activeDPOAccodianMenuItem,
    setActiveDPOAccodianMenuItem,<DPOcontentPanel />)
    
    const objectList = [EMAAccordionClass,MACDsignalAccordionClass,ADXAccordionClass,ADXPAccordionClass,ADXNAccordionClass,VIPOSAccordionClass,
        VINEGAccordionClass,TRIXAccordionClass,MIAccordionClass,DPOAccordionClass]

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
    displaySMA: state.trendFromRootReducer.displaySMA,
    nForSMA: state.trendFromRootReducer.nForSMA,
    displayEMA: state.trendFromRootReducer.displayEMA,
    nForEMA: state.trendFromRootReducer.nForEMA,
    displayMACD: state.trendFromRootReducer.displayMACD,
    nFastForMACD: state.trendFromRootReducer.nFastForMACD,
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    displayMACDsignal: state.trendFromRootReducer.displayMACDsignal,
    nFastForMACDsignal: state.trendFromRootReducer.nFastForMACDsignal,
    nSlowForMACDsignal: state.trendFromRootReducer.nSlowForMACDsignal,
    nSignForMACDsignal: state.trendFromRootReducer.nSignForMACDsignal,
    displayADX: state.trendFromRootReducer.displayADX,
    nForADX: state.trendFromRootReducer.nForADX,
    displayADXP: state.trendFromRootReducer.displayADXP,
    nForADXP: state.trendFromRootReducer.nForADXP,
    displayADXN: state.trendFromRootReducer.displayADXN,
    nForADXN: state.trendFromRootReducer.nForADXN,
    displayVIPOS: state.trendFromRootReducer.displayVIPOS,
    nForVIPOS: state.trendFromRootReducer.nForVIPOS,
    displayVINEG: state.trendFromRootReducer.displayVINEG,
    nForVINEG: state.trendFromRootReducer.nForVINEG,
    displayTRIX: state.trendFromRootReducer.displayTRIX,
    nForTRIX: state.trendFromRootReducer.nForTRIX,
    displayMI: state.trendFromRootReducer.displayMI,
    nForMI: state.trendFromRootReducer.nForMI,
    n2ForMI: state.trendFromRootReducer.n2ForMI,
    displayDPO: state.trendFromRootReducer.displayDPO,
    nForDPO: state.trendFromRootReducer.nForDPO,
    displayCCI: state.trendFromRootReducer.displayCCI,
    nForCCI: state.trendFromRootReducer.nForCCI,
    //cForCCI: state.trendFromRootReducer.cForCCI,


  }
}

const mapDispatchToProps = dispatch => {
  return {
    displaySMAdispatch: varDisplaySMA => dispatch(displaySMA(varDisplaySMA)),
    displayEMAdispatch: varDisplayEMA => dispatch(displayEMA(varDisplayEMA)),
    displayMACDdispatch: varDisplayMACD => dispatch(displayMACD(varDisplayMACD)),
    displayMACDsignaldispatch: x => dispatch(displayMACDsignal(x)),
    displayADXdispatch: x => dispatch(displayADX(x)),
    displayADXPdispatch: x => dispatch(displayADXP(x)),
    displayADXNdispatch: x => dispatch(displayADXN(x)),
    displayVIPOSNdispatch: x => dispatch(displayVIPOS(x)),
    displayVINEGdispatch: x => dispatch(displayVINEG(x)),
    displayTRIXdispatch: x => dispatch(displayTRIX(x)),
    displayMIdispatch: x => dispatch(displayMI(x)),
    displayDPOdispatch: x => dispatch(displayDPO(x)),
    fetchTrendData: (APIstring) => dispatch(fetchTrendData(APIstring)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendMenuContainer)






// const EMAAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayEMAdispatch(!props.displayEMA)


//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>Exponential Moving Average</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeEMAAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)

// const MACDSIGNALAccordionTitle = (
//   <Grid columns='equal'>
//   <Grid.Column width={2}>
//           <Checkbox borderless index={1} onClick={(event) => {
//                       event.stopPropagation()
//                       props.displayMACDsignaldispatch(!props.displayMACDsignal)


//                   }}>
//           </Checkbox>
//   </Grid.Column>
//   <Grid.Column>
//       <h5>MACD Signal</h5>
//   </Grid.Column>
//   <Grid.Column floated='right' width={2}>
//             <Icon name={activeMACDSIGNALAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//   </Grid>)
// const ADXAccordionTitle = (
//   <Grid columns='equal'>
//   <Grid.Column width={2}>
//           <Checkbox borderless index={1} onClick={(event) => {
//                       event.stopPropagation()
//                       props.displayADXdispatch(!props.displayADX)
//                   }}>
//           </Checkbox>
//   </Grid.Column>
//   <Grid.Column>
//       <h5>Average Directional Movement</h5>
//   </Grid.Column>
//   <Grid.Column floated='right' width={2}>
//             <Icon name={activeADXAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//   </Grid>)

// const ADXPAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayADXPdispatch(!props.displayADXP)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>ADM - Positive</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//               <Icon name={activeADXPAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//       </Grid.Column>
//     </Grid>)
//   const ADXNAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayADXNdispatch(!props.displayADXN)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>ADM - Negative</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//               <Icon name={activeADXNAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//       </Grid.Column>
//     </Grid>)
// const VIPOSAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayVIPOSNdispatch(!props.displayVIPOS)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>Vortex Indicator - Positive</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeVIPOSAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)
// const VINEGAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayVINEGdispatch(!props.displayVINEG)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>Vortex Indicator - Negative</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeVINEGAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)



// const TRIXAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayTRIXdispatch(!props.displayTRIX)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>TRIX</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeTRIXAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)
// const MIAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayMIdispatch(!props.displayMI)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>Mass Index</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeMIAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)
// const DPOAccordionTitle = (
//     <Grid columns='equal'>
//     <Grid.Column width={2}>
//             <Checkbox borderless index={1} onClick={(event) => {
//                         event.stopPropagation()
//                         props.displayDPOdispatch(!props.displayDPO)
//                     }}>
//             </Checkbox>
//     </Grid.Column>
//     <Grid.Column>
//         <h5>Detrended Price Oscillator</h5>
//     </Grid.Column>
//     <Grid.Column floated='right' width={2}>
//             <Icon name={activeDPOAccodianMenuItem === 0 ? 'caret down' : 'caret left'}/>
//     </Grid.Column>
//     </Grid>)



// <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeEMAAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveEMAAccodianMenuItem(index.index === activeEMAAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{EMAAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeEMAAccodianMenuItem === 0} >{<EMAcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeMACDSIGNALAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveMACDSIGNALAccodianMenuItem(index.index === activeMACDSIGNALAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{MACDSIGNALAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeMACDSIGNALAccodianMenuItem === 0} >{<MACDSIGNALcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeADXAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveADXAccodianMenuItem(index.index === activeADXAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{ADXAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeADXAccodianMenuItem === 0} >{<ADXcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeADXPAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveADXPAccodianMenuItem(index.index === activeADXPAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{ADXPAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeADXPAccodianMenuItem === 0} >{<ADXPcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeADXNAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveADXNAccodianMenuItem(index.index === activeADXNAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{ADXNAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeADXNAccodianMenuItem === 0} >{<ADXNcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeVIPOSAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveVIPOSAccodianMenuItem(index.index === activeVIPOSAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{VIPOSAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeVIPOSAccodianMenuItem === 0} >{<VIPOScontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeVINEGAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveVINEGAccodianMenuItem(index.index === activeVINEGAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{VINEGAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeVINEGAccodianMenuItem === 0} >{<VINEGcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeTRIXAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveTRIXAccodianMenuItem(index.index === activeTRIXAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{TRIXAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeTRIXAccodianMenuItem === 0} >{<TRIXcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeMIAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveMIAccodianMenuItem(index.index === activeMIAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{MIAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeMIAccodianMenuItem === 0} >{<MIcontentPanel />}</Accordion.Content>
//                 </Menu.Item>
//                 <Menu.Item borderless>
//                     <Accordion.Title
//                         active={activeDPOAccodianMenuItem === 0}
//                         index={0}
//                         borderless
//                         onClick={(e,index) => {
//                             setActiveDPOAccodianMenuItem(index.index === activeDPOAccodianMenuItem ? -1 : index.index)
//                             }}
//                     >{DPOAccordionTitle}</Accordion.Title>
//                     <Accordion.Content borderless active={activeDPOAccodianMenuItem === 0} >{<DPOcontentPanel />}</Accordion.Content>
//                 </Menu.Item>