import React, {useState} from 'react'
import { connect } from 'react-redux'
import { displaySMA, displayEMA, displayMACD } from '../redux'
import { Grid, Menu, Accordion, Checkbox } from "semantic-ui-react"
import SMAcontentpanel from './accordion/momentum/SMAcontentpanel'
import EMAcontentPanel from './accordion/momentum/EMAcontentpanel'
import MACDcontentPanel from './accordion/momentum/MACDcontentpanel'

function TrendMenuContainer(props) {
    
    
    const [activeSMAAccordionMenuItem, setActiveSMAAccordionMenuItem] = useState(-1)
    const [activeMACDAccordionMenuItem, setActiveMACDAccordionMenuItem] = useState(-1)
    const [activeEMAAccodianMenuItem, setActiveEMAAccodianMenuItem] = useState(-1)

    

    const SMAAccordionTitle = (
        <Grid columns='equal'>
        <Grid.Column width={2}>
                <Checkbox borderless index={1} defaultChecked onClick={(event) => {
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
                        props.displayEMADdispatch(!props.displayEMA)


                    }}>
            </Checkbox>
    </Grid.Column>
    <Grid.Column>
        <h5>Exponential Moving Average</h5>
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

                
                <Accordion as={Menu} vertical stretched fluid borderless>
                <Menu.Item borderless>
                    <Accordion.Title
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
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD

  }
}

const mapDispatchToProps = dispatch => {
  return {
    displaySMAdispatch: varDisplaySMA => dispatch(displaySMA(varDisplaySMA)),
    displayEMAdispatch: varDisplayEMA => dispatch(displayEMA(varDisplayEMA)),
    displayMACDdispatch: varDisplayMACD => dispatch(displayMACD(varDisplayMACD))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendMenuContainer)





