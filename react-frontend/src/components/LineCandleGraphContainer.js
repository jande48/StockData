import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { fetchStockData } from '../redux'
import { createStockPriceLineChartRedux } from './charts/stockPriceLineChartRedux'
import { createVolumeBarChart } from './charts/volumeBarChart.js'
import { createMomentumIndicatorsChart } from './charts/momentumIndicatorsChart'

function LineCandleGraphContainer ({ tickers, startDate, endDate, fetchStockData, stockData }) {

    const stockPriceLineChartNode = useRef(null);
    const showVolumeNode = useRef(null);
    const momentumIndicatorsChartNode = useRef(null);

    function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}
  useEffect(() => {
    //requestAPIstockData(tickers+convertDatesToString(startDate)+convertDatesToString(endDate))
    fetchStockData(String(tickers+"/"+convertDatesToString(startDate)+"/"+convertDatesToString(endDate)))
    
        
  }, [tickers,startDate,endDate])

  if (stockData.length > 1) {
    createStockPriceLineChartRedux(stockData,stockPriceLineChartNode)
    createVolumeBarChart(stockData,showVolumeNode)
    //createMomentumIndicatorsChartFunction(stockData,momentumIndicatorsChartNode)
    }

  return stockData.loading ? (


    <h2>Loading</h2>
  ) : stockData.error ? (
    <h2>{stockData.error}</h2>
  ) : (
    <div>
        <React.Fragment>
            <svg ref={stockPriceLineChartNode}></svg>
        </React.Fragment>
        <React.Fragment>
            <svg ref={showVolumeNode}></svg>
        </React.Fragment>
        <React.Fragment>
            <svg ref={momentumIndicatorsChartNode}></svg>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDate: state.datesFromRootReducer.startDate,
    endDate: state.datesFromRootReducer.endDate,
    stockData: state.stockDataFromRootReducer.stockData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    //requestAPIstockData: (APIstring) => dispatch(requestAPIstockData(APIstring)),
    fetchStockData: (APIstring) => dispatch(fetchStockData(APIstring))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineCandleGraphContainer)