import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { fetchStockData } from '../redux'
import { createStockPriceLineChart } from './charts/stockPriceLineChart';

function LineCandleGraphContainer ({ tickers, startDate, endDate, fetchStockData, stockData }) {

    const stockPriceLineChartNode = useRef(null);

    function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}
  useEffect(() => {
      console.log(tickers)
      console.log(convertDatesToString(startDate))
      console.log(convertDatesToString(endDate))
    //requestAPIstockData(tickers+convertDatesToString(startDate)+convertDatesToString(endDate))
    fetchStockData(String(tickers+"/"+convertDatesToString(startDate)+"/"+convertDatesToString(endDate)))
  }, [])
  return stockData.loading ? (


    <h2>Loading</h2>
  ) : stockData.error ? (
    <h2>{stockData.error}</h2>
  ) : (
    <div>
        <React.Fragment>
            <svg ref={stockPriceLineChartNode}></svg>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDate: state.datesFromRootReducer.startDate,
    endDate: state.datesFromRootReducer.endDate,
    stockData: state.stockDataFromRootReducer
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