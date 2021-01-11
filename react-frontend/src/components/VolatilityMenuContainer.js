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






