import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { displaySMA, displayEMA, displayMACD, displayMACDsignal, displayADX, displayADXP, displayADXN, displayVIPOS, displayVINEG,
    displayTRIX, displayMI, displayDPO, } from '../redux'
import { Grid, Menu, Accordion, Checkbox, Icon, Header } from "semantic-ui-react"
import EMAcontentPanel from './accordion/momentum/EMAcontentpanel'
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

function TrendMenuContainer(props) {
    
    useEffect(() => {
        const SMAp = {'displaySMA':props.displaySMA,'nForSMA':props.nForSMA}
        const EMAp = {'displayEMA':props.displayEMA,'nForEMA':props.nForEMA}
        const MACDp = {'displayMACD':props.displayMACD,'nFastForMACD':props.nFastForMACD,'nSlowForMACD':props.nSlowForMACD}
        const MACDsignalp = {'displayMACDsignal':props.displayMACDsignal,'nSlowForMACDsignal':props.nSlowForMACDsignal,'nFastForMACDsignal':props.nFastForMACDsignal,'nSignForMACDsignal':props.nSignForMACDsignal}
        const ADXp = {'displayADX':props.displayADX,'nForADX':props.nForADX}
        const ADXPp = {'displayADXP':props.displayADXP,'nForADXP':props.nForADXP}
        const ADXNp = {'displayADXN':props.displayADXN,'nForADXN':props.nForADXN}
        const VIPOSp = {'displayVIPOS':props.displayVIPOS,'nForVIPOS':props.nForVIPOS}
        const VINEGp = {'displayVINEG':props.displayVINEG,'nForVINEG':props.nForVINEG}
        const TRIXp = {'displayTRIX':props.displayTRIX,'nForTRIX':props.nForTRIX}
        const MIp = {'displayMI':props.displayMI,'nForMI':props.nForMI,'n2ForMI':props.n2ForMI}
        const DPOp = {'displayDPO':props.displayDPO,'nForDPO':props.nForDPO}
    
        props.fetchTrendData(JSON.stringify([props.stockData,SMAp,EMAp,MACDp,MACDsignalp,ADXp,ADXPp,ADXNp,VIPOSp,VINEGp,TRIXp,MIp, DPOp]))
        
      }, [props.stockData,props.displaySMA,props.nForSMA,props.displayEMA,props.nForEMA,props.displayMACD,props.nFastForMACD,props.nSlowForMACD,
        props.displayMACDsignal,props.nSlowForMACDsignal,props.nFastForMACDsignal,props.nSignForMACDsignal,props.displayADX,props.nForADX,
        props.displayADXP,props.nForADXP,props.displayADXN,props.nForADXN,props.displayVIPOS,props.nForVIPOS,props.displayVINEG,props.nForVINEG,
        props.displayTRIX,props.nForTRIX,props.displayMI,props.nForMI,props.n2ForMI,props.displayDPO,props.nForDPO])

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
                            index={0}
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

