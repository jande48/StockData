import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { displayRSI, displaySTOCH, displayStochSignal, displayTSI, displayUO, displayWR, displayAO, displayKama, displayROC  } from '../redux'
import { Grid, Menu, Accordion, Checkbox, Icon, Header} from "semantic-ui-react"
import TSIcontentPanel from './accordion/momentum/TSIcontentpanel'
import UOcontentPanel from './accordion/momentum/UOcontentpanel'
import STOCHcontentPanel from './accordion/momentum/STOCHcontentpanel'
import STOCHSIGNALcontentPanel from './accordion/momentum/STOCHSIGNALcontentpanel'
import WRcontentPanel from './accordion/momentum/WRcontentpanel'
import AOcontentPanel from './accordion/momentum/AOcontentpanel'
import KamacontentPanel from './accordion/momentum/KAMAcontentpanel'
import ROCcontentPanel from './accordion/momentum/ROCcontentpanel'
import { fetchMomentumData } from '../redux';

function MomentumMenuContainer(props) {
    
    const [activeTSIAccodianMenuItem, setTSIActiveAccordionMenuItem] = useState(-1)
    const [activeUOAccodianMenuItem, setUOActiveAccordionMenuItem] = useState(-1)
    const [activeSTOCHAccodianMenuItem, setSTOCHActiveAccordionMenuItem] = useState(-1)
    const [activeSTOCHSIGNALAccodianMenuItem, setSTOCHSIGNALActiveAccordionMenuItem] = useState(-1)
    const [activeWRAccodianMenuItem, setWRActiveAccordionMenuItem] = useState(-1)
    const [activeAOAccodianMenuItem, setAOActiveAccordionMenuItem] = useState(-1)
    const [activeKAMAAccodianMenuItem, setKAMAActiveAccordionMenuItem] = useState(-1)
    const [activeROCAccodianMenuItem, setROCActiveAccordionMenuItem] = useState(-1)


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
    
      
        }}
      }, [props.stockData,props.displayRSI,props.nForRSI,props.displayTSI,props.sForTSI,props.rForTSI,props.displayUO,props.sForUO,props.mForUO,props.lenForUO,props.wsForUO,props.wmForUO,props.wlForUO,props.displaySTOCH,props.nForSTOCH,props.dnForSTOCH,
      props.displayStochSignal,props.nForStochSignal,props.dnForStochSignal,props.displayWR,props.lbpForWR,props.displayAO,props.sForAO,props.lenForAO,props.displayKama,props.nForKama,props.pow1ForKama,props.pow2ForKama,
      props.displayROC,props.nForROC])



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

    const TSIAccordionClass = new createTiles('True Strength Index',props.displayTSIdispatch,props.displayTSI,activeTSIAccodianMenuItem,
    setTSIActiveAccordionMenuItem,<TSIcontentPanel/>)
    const UOAccordionClass = new createTiles('Ultimate Oscillator',props.displayUOdispatch,props.displayUO,activeUOAccodianMenuItem,
    setUOActiveAccordionMenuItem,<UOcontentPanel />)
    const STOCHAccordionClass = new createTiles('Stochcastic Oscillator',props.displaySTOCHdispatch,props.displaySTOCH,activeSTOCHAccodianMenuItem,
    setSTOCHActiveAccordionMenuItem,<STOCHcontentPanel />)
    const STOCHSIGNALAccordionClass = new createTiles('Stochcastic Signal Oscillator',props.displaySTOCHSIGNALdispatch,props.displayStochSignal,activeSTOCHSIGNALAccodianMenuItem,
    setSTOCHSIGNALActiveAccordionMenuItem,<STOCHSIGNALcontentPanel />)
    const WRAccordionClass = new createTiles('Williams %R',props.displayWRdispatch,props.displayWR,activeWRAccodianMenuItem,
    setWRActiveAccordionMenuItem,<WRcontentPanel />)
    const AOAccordionClass = new createTiles('Awesome Oscillator',props.displayAOdispatch,props.displayAO,activeAOAccodianMenuItem,
    setAOActiveAccordionMenuItem,<AOcontentPanel />)
    const KAMAAccordionClass = new createTiles('Kaufmans Adaptive MA',props.displayKAMAdispatch,props.displayKama,activeKAMAAccodianMenuItem,
    setKAMAActiveAccordionMenuItem,<KamacontentPanel />)
    const ROCAccordionClass = new createTiles('Rate of Change',props.displayROCdispatch,props.displayROC,activeROCAccodianMenuItem,
    setROCActiveAccordionMenuItem,<ROCcontentPanel />)

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

    const objectList = [TSIAccordionClass,UOAccordionClass,STOCHAccordionClass,STOCHSIGNALAccordionClass,WRAccordionClass,AOAccordionClass,
        KAMAAccordionClass,ROCAccordionClass]

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
    displayRSI: state.momentumFromRootReducer.displayRSI,
    fetchMomentumData: state.momentumFromRootReducer.fetchMomentumData,
    displayRSI: state.momentumFromRootReducer.displayRSI,
    nForRSI: state.momentumFromRootReducer.nForRSI,
    displayTSI: state.momentumFromRootReducer.displayTSI,
    rForTSI: state.momentumFromRootReducer.rForTSI,
    sForTSI: state.momentumFromRootReducer.sForTSI,
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
    displayRSIdispatch: varDisplayRSI => dispatch(displayRSI(varDisplayRSI)),
    displayTSIdispatch: varDisplayTSI => dispatch(displayTSI(varDisplayTSI)),
    displayUOdispatch: x => dispatch(displayUO(x)),
    displaySTOCHdispatch: x => dispatch(displaySTOCH(x)),
    displaySTOCHSIGNALdispatch: x => dispatch(displayStochSignal(x)),
    displayWRdispatch: x => dispatch(displayWR(x)),
    displayAOdispatch: x => dispatch(displayAO(x)),
    displayKAMAdispatch: x => dispatch(displayKama(x)),
    displayROCdispatch: x => dispatch(displayROC(x)),
    fetchMomentumData: (APIstring) => dispatch(fetchMomentumData(APIstring))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MomentumMenuContainer)





