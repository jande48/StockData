import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { addSplicedStartDate, addStockPriceForPercentChange, addEndDateForPercentChange, addSplicedIndexStockData, 
   addOnMouseOverTicker, addDateMouseOverTicker } from '../redux'
import {Header, Grid} from 'semantic-ui-react'
import '../App.css'
import 'react-datepicker/dist/react-datepicker.css'


function ToolTipContainer (props) {

  function makeObjectList(objectDisplay,objectData) {
    var out = []
    for (var i = 0; i < objectDisplay.length; i++) {
      out.push({'display':objectDisplay[i],'data':objectData[i]})
    }
    return out
  }

  const objectDisplayTrend = [props.displaySMA,props.displayEMA,props.displayADX,
    props.displayADXN,props.displayADXP,props.displayDPO,props.displayMI,
    props.displayTRIX,props.displayVINEG,props.displayVIPOS,props.displayMACDsignal,
    props.displayMACD]
  const objectDataTrend = ['sma','ema','adx','adxn','adxp','dpo','mi','trix','vineg','vipos','macds','macd']

  const objectListTrend = makeObjectList(objectDisplayTrend,objectDataTrend)

  const objectDisplayMomentum = [props.displayAO,props.displayKama,props.displayROC,
    props.displayRSI,props.displaySTOCH,props.displayStochSignal,props.displayTSI,
    props.displayUO,props.displayWR]

  const objectDataMomentum = ['ao','kama','roc','rsi','stoch','stoch_signal','tsi','uo','wr']

  const objectListMomentum = makeObjectList(objectDisplayMomentum,objectDataMomentum)

  const objectDisplayVolatility = [props.displayATR,props.displayBBLower,props.displayBBSMA,
    props.displayBBUpper,props.displayKeltnerC]

  const objectDataVolatility = ['atr','BBlower','bbsma','BBupper','keltnerC']

  const objectListVolatility = makeObjectList(objectDisplayVolatility,objectDataVolatility)
  // const objectListVolatility = [{'display':props.displayATR,'data':'atr'},{'display':props.displayBBLower,'data':'BBlower'},{'display':props.displayBBSMA,'data':'bbsma'},
  // {'display':props.displayBBUpper,'data':'BBupper'},{'display':props.displayKeltnerC,'data':'keltnerC'}]

  function makeDisplayList(objectsTrend,objectsMom,objectsVol) {
    var arrayOuter = []
    var arrayInner = []
    function checkDate(date) {
      return date['date'] == props.dateMouseOverTicker;
    }
    var indexAdded = props.stockData.findIndex(checkDate)

    var index = 0
    if (typeof(props.stockData[indexAdded]) != 'undefined' && typeof(props.momentumData[indexAdded]) != 'undefined') {
      arrayInner.push({'name':'Date','data':props.stockData[indexAdded]['date']})
      arrayInner.push({'name':'Open','data':props.stockData[indexAdded]['open']})
      arrayInner.push({'name':'High','data':props.stockData[indexAdded]['high']})
      arrayInner.push({'name':'Low','data':props.stockData[indexAdded]['low']})
      arrayInner.push({'name':'Close','data':props.stockData[indexAdded]['close']})
      arrayInner.push({'name':'Vol','data':props.stockData[indexAdded]['volume']})
      arrayOuter.push(arrayInner)
      arrayInner = []

    objectsTrend.forEach( function (el){
      if (index % 6 == 0 && index != 0) {
        arrayOuter.push(arrayInner)
        arrayInner = []
      }
      if (el['display']){
        arrayInner.push({'name':el['data'].toUpperCase(),'data':props.trendData[indexAdded][el['data']]})
        index++
      }
    })
    objectsMom.forEach( function (el){
      if (index % 6 == 0 && index != 0) {
        arrayOuter.push(arrayInner)
        arrayInner = []
      }
      if (el['display']){
        arrayInner.push({'name':el['data'].toUpperCase(),'data':props.momentumData[indexAdded][el['data']]})
        index++
      }
    })
    objectsVol.forEach( function (el){
      if (index % 6 == 0 && index != 0) {
        arrayOuter.push(arrayInner)
        arrayInner = []
      }
      if (el['display']){
        arrayInner.push({'name':el['data'].toUpperCase(),'data':props.volatilityData[indexAdded][el['data']]})
        index++
      }
    })
    arrayOuter.push(arrayInner)
    return arrayOuter
  }

  }
  var objects = makeDisplayList(objectListTrend,objectListMomentum,objectListVolatility)

    useEffect(() => {
        if (typeof(props.stockData) != 'undefined') {
          if (props.stockData.length > 1 && !props.momentumLoading && !props.loading && !props.trendLoading) {
            var objects = makeDisplayList(objectListTrend,objectListMomentum,objectListVolatility)
            }}
          },[props.stockData,props.startDate,props.endDate,props.loading,props.momentumLoading,props.trendLoading,props.displayLine,props.displaySMA,props.displayEMA,props.displayMACD,props.displayMACDsignal,
            props.displayADX,props.displayADXN,props.displayADXP,props.displayVIPOS,props.displayVINEG,props.displayTRIX,
            props.displayMI,props.displayDPO,props.displayATR,props.nForATR,props.displayBBSMA,props.displayBBSMA,props.displayBBUpper,
            props.nForBBUpper,props.ndevBBUpper,props.displayBBLower,props.nForBBLower,props.ndevBBLower,props.displayKeltnerC,
            props.nForKeltnerC,props.volatilityData,props.indexMouseOver,props.splicedIndexStockData])

    


  return  (
    <div class="fullWidth">
      <Grid inverted columns='equal'>
        {typeof(objects) != 'undefined' ? props.onMouseOverTicker ? 
        
          objects.map(el => (
            <Grid.Row inverted>
              {el.map( elInner => (
              <Grid.Column inverted>
                <Header inverted as="h5"><Header.Content></Header.Content>
                  <Header.Subheader>
                  {typeof(elInner['data']) !='undefined' ? typeof(elInner['data']) == 'string' ? String(elInner['name'])+": "+String(elInner['data']) : String(elInner['name'])+": "+String(elInner['data'].toFixed(2)) : ''}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              )
            )}
            </Grid.Row>
          ))
        
        : 
          objects.map(el => (
            <Grid.Row inverted>
              {el.map( elInner => (
              <Grid.Column inverted>
                <Header inverted as="h5"><Header.Content></Header.Content>
                  <Header.Subheader>
                  {typeof(elInner['data']) !='undefined' ? typeof(elInner['data']) == 'string' ? String(elInner['name'])+": " : String(elInner['name'])+": " : ''}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              )
            )}
            </Grid.Row>
          ))
        : '' }
      </Grid>

        
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDate: state.datesFromRootReducer.startDate,
    endDate: state.datesFromRootReducer.endDate,
    stockData: state.stockDataFromRootReducer.stockData,
    loading: state.stockDataFromRootReducer.loading,
    trendLoading: state.trendFromRootReducer.trendLoading,
    trendData: state.trendFromRootReducer.trendData,
    momentumLoading: state.momentumFromRootReducer.momentumLoading,
    error: state.stockDataFromRootReducer.error,
    errorMessage: state.stockDataFromRootReducer.errorMessage,
    fetchStockData: state.stockDataFromRootReducer.fetchStockData,
    displayLine: state.chartsFromRootReducer.displayLine,
    displaySMA: state.trendFromRootReducer.displaySMA,
    nForSMA: state.trendFromRootReducer.nForSMA,
    displayEMA: state.trendFromRootReducer.displayEMA,
    nForEMA: state.trendFromRootReducer.nForEMA,
    displayMACD: state.trendFromRootReducer.displayMACD,
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    nFastForMACD: state.trendFromRootReducer.nFastForMACD,
    trendData: state.trendFromRootReducer.trendData,
    compName: state.tickersFromRootReducer.name,
    percentChange: state.tickersFromRootReducer.percentChange,
    displayMACDsignal: state.trendFromRootReducer.displayMACDsignal,
    nSlowForMACDsignal: state.trendFromRootReducer.nSlowForMACDsignal,
    nFastForMACDsignal: state.trendFromRootReducer.nFastForMACDsignal,
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
    financials: state.stockDataFromRootReducer.financialsData,
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
    volatilityData: state.volatilityFromtRootReducer.volatilityData,
    onMouseOverTicker: state.tickersFromRootReducer.onMouseOverTicker,
    dateMouseOverTicker: state.tickersFromRootReducer.dateMouseOverTicker,
    indexMouseOver: state.tickersFromRootReducer.indexMouseOver,
    splicedIndexStockData: state.tickersFromRootReducer.splicedIndexStockData,
    momentumData: state.momentumFromRootReducer.momentumData,
    displayAO: state.momentumFromRootReducer.displayAO,
    displayKama: state.momentumFromRootReducer.displayKama,
    displayROC: state.momentumFromRootReducer.displayROC,
    displayRSI: state.momentumFromRootReducer.displayRSI,
    displaySTOCH: state.momentumFromRootReducer.displaySTOCH,
    displayStochSignal: state.momentumFromRootReducer.displayStochSignal,
    displayTSI: state.momentumFromRootReducer.displayTSI,
    displayUO: state.momentumFromRootReducer.displayUO,
    displayWR: state.momentumFromRootReducer.displayWR,
    volatilityData: state.volatilityFromtRootReducer.volatilityData,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSplicedStartDate: (startingDate) => dispatch(addSplicedStartDate(startingDate)),
    addStockPriceForPercentChange: (stockPrice) => dispatch(addStockPriceForPercentChange(stockPrice)),
    addEndDateForPercentChange: (endingDate) => dispatch(addEndDateForPercentChange(endingDate)),
    addSplicedIndexStockData: (index) => dispatch(addSplicedIndexStockData(index)),
    addOnMouseOverTicker: (x) => dispatch(addOnMouseOverTicker(x)),
    addDateMouseOverTicker: (x) => dispatch(addDateMouseOverTicker(x)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolTipContainer)



















