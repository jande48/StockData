import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { addSplicedStartDate, addStockPriceForPercentChange, addEndDateForPercentChange, addSplicedIndexStockData, 
  addActiveNav, addOnMouseOverTicker, addDateMouseOverTicker } from '../redux'
import {Header, Grid} from 'semantic-ui-react'
import { createLoadingSpinnerChart } from './charts/loadingSpinner.js'
import '../App.css'
import 'react-datepicker/dist/react-datepicker.css'
import * as d3 from "d3"



function ToolTipContainer (props) {

    objectListTrend = [{'display':'displaySMA','data':'sma'},{'display':'displayEMA','data':'ema'},{'display':'displayADX','data':'adx'},{'display':'displayADXN','data':'adxn'},
  {'display':'displayADXP','data':'adxp'},{'display':'displayDPO','data':'dpo'},{'display':'displayMI','data':'mi'},{'display':'displayTRIX','data':'trix'},
  {'display':'displayVINEG','data':'vineg'},{'display':'displayVIPOS','data':'vipos'},{'display':'displayMACDsignal','data':'macds'},{'display':'displayMACD','data':'macd'}]


    useEffect(() => {
        if (typeof(props.stockData) != 'undefined') {
          if (props.stockData.length > 1 && !props.momentumLoading && !props.loading && !props.trendLoading) {
            var objects = makeDisplayList(objectListTrend)
            }}
          },[props.stockData,props.startDate,props.endDate,props.loading,props.momentumLoading,props.trendLoading,props.displayLine,props.displaySMA,props.displayEMA,props.displayMACD,props.displayMACDsignal,
            props.displayADX,props.displayADXN,props.displayADXP,props.displayVIPOS,props.displayVINEG,props.displayTRIX,
            props.displayMI,props.displayDPO,props.displayATR,props.nForATR,props.displayBBSMA,props.displayBBSMA,props.displayBBUpper,
            props.nForBBUpper,props.ndevBBUpper,props.displayBBLower,props.nForBBLower,props.ndevBBLower,props.displayKeltnerC,
            props.nForKeltnerC,props.volatilityData])

    function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	  }


  function splitDate(date){
      var dateSplit = date.split("-")
      var formattedDate = String(parseInt(dateSplit[1])-1)+"/"+String(parseInt(dateSplit[2]))+"/"+String(parseInt(dateSplit[0]))
      return formattedDate
  }
  function getIndex(data,date) {
    
    for (let [index, val] of data.entries()) {
        if (val['date'] === date) {
            return index
        }   
    }
    return (data.length -1)
  }

  
  function makeDisplayList(objects) {
      var output = []
      for (let [index, val] of objects.entries()) {
        if (val['display']) {
            output.push({'name':String(val['data']).toUpperCase(),'data':props.stockData[getIndex(props.stockData,props.dateMouseOverTicker)][val['data']]})
        }   
        }
    return output
  }

  return  (
    <div>

        <Grid inverted columns='equal'>
        <Grid.Row>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "Date " + String(splitDate(props.dateMouseOverTicker)) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "Open " + String(props.stockData[0]['open'].toFixed(2)) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "High " + String(props.stockData[0]['high'].toFixed(2)) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "Low " + String(props.stockData[0]['low'].toFixed(2)) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "Close " + String(props.stockData[0]['close'].toFixed(2)) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column inverted>
            <Header inverted as="h5"><Header.Content></Header.Content>
                <Header.Subheader> 
                    {props.onMouseOverTicker ? !props.loading ? !props.error ? "Volume " + String(props.stockData[0]['volume']) : "" : "" : ""}
                </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>

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


















