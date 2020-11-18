import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { displaySMA,  displayMACD, displayRSI} from '../redux'
import { Grid, Menu, Accordion, Checkbox, Icon, Header } from "semantic-ui-react"
import SMAcontentpanel from './accordion/momentum/SMAcontentpanel'
import { fetchMomentumData } from '../redux';
import { fetchTrendData } from '../redux';
import MACDcontentPanel from './accordion/momentum/MACDcontentpanel'
import RSIcontentPanel from './accordion/momentum/RSIcontentpanel'
//import CCIcontentPanel from './accordion/trend/CCIcontentpanel'

function PopularMenuContainer(props) {
    
    
    const [activeSMAAccordionMenuItem, setActiveSMAAccordionMenuItem] = useState(-1)
    const [activeMACDAccordionMenuItem, setActiveMACDAccordionMenuItem] = useState(-1)
    const [activeRSIAccordionMenuItem, setRSIActiveAccordionMenuItem] = useState(-1)

    useEffect(() => {
        if (typeof(props.stockData) != 'undefined' ) {
          if (props.stockData.length > 0) {
          const RSIparameters = {'N':props.nForRSI}
          const TSIparameters = {'displayTSI':props.displayTSI,'rTSI':props.rForTSI,'sTSI':props.sForTSI}
          const UOparameters = {'displayUO':props.displayUO,'sForUO':props.sForUO,'mForUO':props.mForUO,'lenForUO':props.lenForUO,'wsForUO':props.wsForUO,'wmForUO':props.wmForUO,'wlForUO':props.wlForUO}
          const STOCHparameters = {'displaySTOCH':props.displaySTOCH,'nForSTOCH':props.nForSTOCH, 'dnForSTOCH':props.dnForSTOCH}
          const StochSignalparameters = {'displayStochSignal':props.displayStochSignal,'nForStochSignal':props.nForStochSignal,'dnForStochSignal':props.dnForStochSignal}
          const WilliamsRparameters = {'displayWR':props.displayWR,'lbpForWR':props.lbpForWR}
          const AOparameters = {'displayAO':props.displayAO,'sForAO':props.sForAO,'lenForAO':props.lenForAO}
          const KAMAparameters = {'displayKama':props.displayKama,'nForKama':props.nForKama,'pow1ForKama':props.pow1ForKama,'pow2ForKama':props.pow2ForKama}
          const ROCparameters = {'displayROC':props.displayROC,'nForROC':props.nForROC}
        
          props.fetchMomentumData(JSON.stringify([props.stockData,RSIparameters,TSIparameters,UOparameters,STOCHparameters,StochSignalparameters,WilliamsRparameters,AOparameters,KAMAparameters,ROCparameters]))
    
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
            
      
        }}
      }, [props.stockData,props.displaySMA,props.nForSMA,props.displayEMA,props.nForEMA,props.displayMACD,props.nFastForMACD,props.nSlowForMACD,
        props.displayMACDsignal,props.nSlowForMACDsignal,props.nFastForMACDsignal,props.nSignForMACDsignal,props.displayADX,props.nForADX,
        props.displayADXP,props.nForADXP,props.displayADXN,props.nForADXN,props.displayVIPOS,props.nForVIPOS,props.displayVINEG,props.nForVINEG,
        props.displayTRIX,props.nForTRIX,props.displayMI,props.nForMI,props.n2ForMI,props.displayDPO,props.nForDPO,props.displayRSI,props.nForRSI,props.displayTSI,props.sForTSI,props.rForTSI,props.displayUO,props.sForUO,props.mForUO,props.lenForUO,props.wsForUO,props.wmForUO,props.wlForUO,props.displaySTOCH,props.nForSTOCH,props.dnForSTOCH,
        props.displayStochSignal,props.nForStochSignal,props.dnForStochSignal,props.displayWR,props.lbpForWR,props.displayAO,props.sForAO,props.lenForAO,props.displayKama,props.nForKama,props.pow1ForKama,props.pow2ForKama,
        props.displayROC,props.nForROC])

    class AccordionTile {
        constructor(name,activeMenuItem) {
          this.name = name;
          this.activeMenuItem = activeMenuItem;
          
        }
        get constructTile() {
            return this.tileConstruction();
          }

        tileConstruction(){
            return (
                <Grid columns='equal'>
                    <Grid.Column width={2}>
                            <Checkbox borderless index={1} onClick={(event) => {
                                        event.stopPropagation()
                                        props.displaySMAdispatch(!props.displaySMA)
                                    }}>
                            </Checkbox>
                    </Grid.Column>
                    <Grid.Column>
                        <h5>{this.name}</h5>
                    </Grid.Column>
                    <Grid.Column floated='right' width={2}>
                            <Icon name={this.activeMenuItem === 0 ? 'caret down' : 'caret left'}/>
                    </Grid.Column>
                </Grid>
            )
        }
    }


    const SMAAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displaySMAdispatch(!props.displaySMA)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Simple Moving Average</h5>
        </Grid.Column>
        <Grid.Column floated='right' width={2}>
                <Icon name={activeSMAAccordionMenuItem === 0 ? 'caret down' : 'caret left'}/>
        </Grid.Column>
        </Grid>)
        
    const MACDAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayMACDdispatch(!props.displayMACD)


                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>MACD</h5>
        </Grid.Column>
        <Grid.Column floated='right' width={2}>
                <Icon name={activeMACDAccordionMenuItem === 0 ? 'caret down' : 'caret left'}/>
        </Grid.Column>
        </Grid>)

    const RSIAccordionTitle = (
        <Grid columns='equal' textAlign='bottom'>
            <Grid.Row verticalAlign='top'>
                <Grid.Column width={2}>
                    <Checkbox borderless index={1} defaultChecked onClick={(event) => {
                                event.stopPropagation()
                                props.displayRSIdispatch(!props.displayRSI)
                            }}>
                    </Checkbox>
                </Grid.Column>
                <Grid.Column>
                    <Header as='h5' inverted>Relative Strength Index</Header>
                </Grid.Column>
                <Grid.Column floated='right' width={2}>
                    <Icon name={activeRSIAccordionMenuItem === 0 ? 'caret down' : 'caret left'}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>)

    

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
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeRSIAccordionMenuItem === 0}
                        index={0}
                        //borderless
                        onClick={(e,index) => {
                            setRSIActiveAccordionMenuItem(index.index === activeRSIAccordionMenuItem ? -1 : index.index)
                            }}
                        inverted
                    >{RSIAccordionTitle}</Accordion.Title>
                    <Accordion.Content borderless active={activeRSIAccordionMenuItem === 0} >{<RSIcontentPanel/>}</Accordion.Content>
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        inverted
                        active={activeSMAAccordionMenuItem === 0}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveSMAAccordionMenuItem(index.index === activeSMAAccordionMenuItem ? -1 : index.index)
                            }}
                    >{SMAAccordionTitle}</Accordion.Title>
                    <Accordion.Content borderless active={activeSMAAccordionMenuItem === 0} >{<SMAcontentpanel />}</Accordion.Content>
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeMACDAccordionMenuItem === 0}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveMACDAccordionMenuItem(index.index === activeMACDAccordionMenuItem ? -1 : index.index)
                            }}
                    >{MACDAccordionTitle}</Accordion.Title>
                    <Accordion.Content borderless active={activeMACDAccordionMenuItem === 0} >{<MACDcontentPanel />}</Accordion.Content>
                </Menu.Item>
                
                   
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
    displayRSI: state.momentumFromRootReducer.displayRSI,
    fetchMomentumData: state.momentumFromRootReducer.fetchMomentumData,
    displayRSI: state.momentumFromRootReducer.displayRSI,
    nForRSI: state.momentumFromRootReducer.nForRSI,
    displayTSI: state.momentumFromRootReducer.displayTSI,
    rForTSI: state.momentumFromRootReducer.rForTSI,
    sForTSI: state.momentumFromRootReducer.sForTSI,
    //displayMACD: state.trendFromRootReducer.displayMACD,
    //nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    //nFastForMACD: state.trendFromRootReducer.nFastForMACD,
    sForUO: state.momentumFromRootReducer.sForUO,
    mForUO: state.momentumFromRootReducer.mForUO,
    lenForUO: state.momentumFromRootReducer.lenForUO,
    wsForUO: state.momentumFromRootReducer.wsForUO,
    wmForUO: state.momentumFromRootReducer.wmForUO,
    wlForUO: state.momentumFromRootReducer.wlForUO,
    displayUO: state.momentumFromRootReducer.displayUO,
    displaySTOCH: state.momentumFromRootReducer.displaySTOCH,
    nForSTOCH: state.momentumFromRootReducer.nForSTOCH,
    dnForSTOCH: state.momentumFromRootReducer.dnForSTOCH,
    displayStochSignal: state.momentumFromRootReducer.displayStochSignal,
    nForStochSignal: state.momentumFromRootReducer.nForStochSignal,
    dnForStochSignal: state.momentumFromRootReducer.dnForStochSignal,
    displayWR: state.momentumFromRootReducer.displayWR,
    lbpForWR: state.momentumFromRootReducer.lbpForWR,
    displayAO: state.momentumFromRootReducer.displayAO,
    sForAO: state.momentumFromRootReducer.sForAO,
    lenForAO: state.momentumFromRootReducer.lenForAO,
    displayKama: state.momentumFromRootReducer.displayKama,
    nForKama: state.momentumFromRootReducer.nForKama,
    pow1ForKama: state.momentumFromRootReducer.pow1ForKama,
    pow2ForKama: state.momentumFromRootReducer.pow2ForKama,
    displayROC: state.momentumFromRootReducer.displayROC,
    nForROC: state.momentumFromRootReducer.nForROC,
    startDate: state.datesFromRootReducer.startDate,
    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    displaySMAdispatch: varDisplaySMA => dispatch(displaySMA(varDisplaySMA)),
    displayMACDdispatch: varDisplayMACD => dispatch(displayMACD(varDisplayMACD)),
    displayRSIdispatch: varDisplayRSI => dispatch(displayRSI(varDisplayRSI)),
    fetchTrendData: (APIstring) => dispatch(fetchTrendData(APIstring)),
    fetchMomentumData: (APIstring) => dispatch(fetchMomentumData(APIstring))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularMenuContainer)





