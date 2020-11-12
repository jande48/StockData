import React, {useState} from 'react'
import { connect } from 'react-redux'
import { displaySMA, displayEMA, displayMACD, displayMACDsignal, displayADX, displayADXP, displayADXN, displayVIPOS, displayVINEG,
    displayTRIX, displayMI, displayDPO, } from '../redux'
import { Grid, Menu, Accordion, Checkbox } from "semantic-ui-react"
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
//import CCIcontentPanel from './accordion/trend/CCIcontentpanel'

function TrendMenuContainer(props) {
    
    
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
    //const [activeCCIAccodianMenuItem, setActiveCCIAccodianMenuItem] = useState(-1)

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
        </Grid>)

    const EMAAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayEMAdispatch(!props.displayEMA)


                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Exponential Moving Average</h5>
        </Grid.Column>
        </Grid>)

    const MACDSIGNALAccordionTitle = (
      <Grid columns='equal'>
      <Grid.Column width={2}>
              <Checkbox borderless index={1} onClick={(event) => {
                          event.stopPropagation()
                          props.displayMACDsignaldispatch(!props.displayMACDsignal)


                      }}>
              </Checkbox>
      </Grid.Column>
      <Grid.Column>
          <h5>MACD Signal</h5>
      </Grid.Column>
      </Grid>)
    const ADXAccordionTitle = (
      <Grid columns='equal'>
      <Grid.Column width={2}>
              <Checkbox borderless index={1} onClick={(event) => {
                          event.stopPropagation()
                          props.displayADXdispatch(!props.displayADX)
                      }}>
              </Checkbox>
      </Grid.Column>
      <Grid.Column>
          <h5>Average Directional Movement</h5>
      </Grid.Column>
      </Grid>)
    const ADXPAccordionTitle = (
      <Grid columns='equal'>
      <Grid.Column width={2}>
              <Checkbox borderless index={1} onClick={(event) => {
                          event.stopPropagation()
                          props.displayADXPdispatch(!props.displayADXP)
                      }}>
              </Checkbox>
      </Grid.Column>
      <Grid.Column>
          <h5>Average Directional Movement Positive</h5>
      </Grid.Column>
      </Grid>)
    const ADXNAccordionTitle = (
      <Grid columns='equal'>
      <Grid.Column width={2}>
              <Checkbox borderless index={1} onClick={(event) => {
                          event.stopPropagation()
                          props.displayADXNdispatch(!props.displayADXN)
                      }}>
              </Checkbox>
      </Grid.Column>
      <Grid.Column>
          <h5>Average Directional Movement Negative</h5>
      </Grid.Column>
      </Grid>)
    const VIPOSAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayVIPOSNdispatch(!props.displayVIPOS)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Vortex Indicator - Positive</h5>
        </Grid.Column>
        </Grid>)
    const VINEGAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayVINEGdispatch(!props.displayVINEG)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Vortex Indicator - Negative</h5>
        </Grid.Column>
        </Grid>)
    const TRIXAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayTRIXdispatch(!props.displayTRIX)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>TRIX</h5>
        </Grid.Column>
        </Grid>)
    const MIAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayMIdispatch(!props.displayMI)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Mass Index</h5>
        </Grid.Column>
        </Grid>)
    const DPOAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} onClick={(event) => {
                            event.stopPropagation()
                            props.displayDPOdispatch(!props.displayDPO)
                        }}>
                </Checkbox>
        </Grid.Column>
        <Grid.Column>
            <h5>Detrended Price Oscillator</h5>
        </Grid.Column>
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
                        inverted
                        active={activeSMAAccordionMenuItem === 0}
                        content={SMAAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveSMAAccordionMenuItem(index.index === activeSMAAccordionMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeSMAAccordionMenuItem === 0} content={<SMAcontentpanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeMACDAccordionMenuItem === 0}
                        content={MACDAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveMACDAccordionMenuItem(index.index === activeMACDAccordionMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeMACDAccordionMenuItem === 0} content={<MACDcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeEMAAccodianMenuItem === 0}
                        content={EMAAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveEMAAccodianMenuItem(index.index === activeEMAAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeEMAAccodianMenuItem === 0} content={<EMAcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeMACDSIGNALAccodianMenuItem === 0}
                        content={MACDSIGNALAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveMACDSIGNALAccodianMenuItem(index.index === activeMACDSIGNALAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeMACDSIGNALAccodianMenuItem === 0} content={<MACDSIGNALcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeADXAccodianMenuItem === 0}
                        content={ADXAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveADXAccodianMenuItem(index.index === activeADXAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeADXAccodianMenuItem === 0} content={<ADXcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeADXPAccodianMenuItem === 0}
                        content={ADXPAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveADXPAccodianMenuItem(index.index === activeADXPAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeADXPAccodianMenuItem === 0} content={<ADXPcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeADXNAccodianMenuItem === 0}
                        content={ADXNAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveADXNAccodianMenuItem(index.index === activeADXNAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeADXNAccodianMenuItem === 0} content={<ADXNcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeVIPOSAccodianMenuItem === 0}
                        content={VIPOSAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveVIPOSAccodianMenuItem(index.index === activeVIPOSAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeVIPOSAccodianMenuItem === 0} content={<VIPOScontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeVINEGAccodianMenuItem === 0}
                        content={VINEGAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveVINEGAccodianMenuItem(index.index === activeVINEGAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeVINEGAccodianMenuItem === 0} content={<VINEGcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeTRIXAccodianMenuItem === 0}
                        content={TRIXAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveTRIXAccodianMenuItem(index.index === activeTRIXAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeTRIXAccodianMenuItem === 0} content={<TRIXcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeMIAccodianMenuItem === 0}
                        content={MIAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveMIAccodianMenuItem(index.index === activeMIAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeMIAccodianMenuItem === 0} content={<MIcontentPanel />} />
                </Menu.Item>
                <Menu.Item borderless>
                    <Accordion.Title
                        active={activeDPOAccodianMenuItem === 0}
                        content={DPOAccordionTitle}
                        index={0}
                        borderless
                        onClick={(e,index) => {
                            setActiveDPOAccodianMenuItem(index.index === activeDPOAccodianMenuItem ? -1 : index.index)
                            }}
                    />
                    <Accordion.Content borderless active={activeDPOAccodianMenuItem === 0} content={<DPOcontentPanel />} />
                </Menu.Item>
                
                   
                </Accordion>

        </Grid.Row>
        
        </Grid>
      
    </div>
  )
}

const mapStateToProps = state => {
  return {
    
    displaySMA: state.trendFromRootReducer.displaySMA,
    nForSMA: state.trendFromRootReducer.nForSMA,
    displayEMA: state.trendFromRootReducer.displayEMA,
    nForEMA: state.trendFromRootReducer.nForEMA,
    displayMACD: state.trendFromRootReducer.displayMACD,
    nFastForMACD: state.trendFromRootReducer.nFastForMACD,
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    displayMACDsignal: state.trendFromRootReducer.displayMACDsignal,
    nFastForMACDsignal: state.trendFromRootReducer.nFastForMACDsignal,
    nSlowForMACDsignal: state.trendFromRootReducer.nSlowForMACDsigna,
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

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendMenuContainer)





