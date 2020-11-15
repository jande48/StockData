import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import {Header, Grid, Button} from 'semantic-ui-react'
import { fetchFinancialsData } from '../redux'
import '../App.css'
import * as d3 from 'd3'
import {
    select,
    csv,
    scaleLinear,
    scaleBand,
    scaleTime,
    extent,
    axisLeft,
    axisBottom,
    line,
    curveBasis,
    curveLinear
  } from 'd3';

function CompanyFinancialsContainer (props) {

    useEffect(() => {

        props.fetchFinancialsData(String(props.tickers))

        }, [props.tickers])

    const [displayMoreText, setDisplayMoreText] = useState(false)

    var description = ''
    var grossProfit = 0
    var operatingRevenue = 0
    var totalRevenue = 0
    var totalAssets = 0
    var totalLiabilities = 0
    var totalCash = 0
    var netIncome = 0
    var RD = 0
    var cashFlow =0
    var totalDebt = 0
    var shortTermDebt = 0
    var longTermDebt = 0
    if (typeof(props.financialsData) != 'undefined') {
        if (props.financialsData.length > 1) {
            description = props.financialsData[1]['description']
            grossProfit = props.financialsData[0]['grossProfit']
        }
    }

    
  return props.loading ? (


    <Header as='h3' inverted color="#e0e1e2">Loading</Header>
  ) : props.FinancialsError ? (
    <h2>{props.financialsError}</h2>
  ) :  (
    <div>
        <React.Fragment>
            <Grid columns='equal'>
                <Grid.Row>
                    <p style={{color:"#e0e1e2"}}>{displayMoreText ? description : description.slice(0,390) }<a href="#" onClick={(e) => {setDisplayMoreText(!displayMoreText)}}>{displayMoreText ? ' -Less' : ' +More'}</a></p>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='left'>
                        <p style={{color:"#e0e1e2"}}>Total Debt: ${grossProfit > 100000000 ? String(Math.round(grossProfit / 1000000000 * 10) / 10)+" B" : (grossProfit > 100000 ? String(Math.round(grossProfit / 1000000 * 10 ) / 10)+" M" : grossProfit)}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    financialsData: state.stockDataFromRootReducer.financialsData,
    financialsError: state.stockDataFromRootReducer.financialsError,
    loading: state.stockDataFromRootReducer.loading,
    startDate: state.datesFromRootReducer.startDate,
    tickers: state.tickersFromRootReducer.tickers,
  }
}
const mapDispatchToProps = dispatch => {
    return {
      fetchFinancialsData: (ticker) => dispatch(fetchFinancialsData(ticker)),
    }
  }
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyFinancialsContainer)


