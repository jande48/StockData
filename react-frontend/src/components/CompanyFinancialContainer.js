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
            operatingRevenue = props.financialsData[0]['operatingRevenue']
            totalRevenue = props.financialsData[0]['totalRevenue']
            totalAssets = props.financialsData[0]['totalAssets']
            totalLiabilities = props.financialsData[0]['totalLiabilities']
            totalCash = props.financialsData[0]['totalCash']
            netIncome = props.financialsData[0]['netIncome']
            totalDebt = props.financialsData[0]['totalDebt']
            cashFlow = props.financialsData[0]['cashFlow']
        }
    }

    function formatNumbers(input) {
        return(
            input > 1000000000000 ? String(Math.round(input / 1000000000000 * 10) / 10)+" T" : (input > 1000000000 ? String(Math.round(input / 1000000000 * 10) / 10)+" B" : (input > 100000 ? String(Math.round(input / 1000000 * 10 ) / 10)+" M" : input))
        )
    }
    
    return props.financialsLoading ? ( 


        <Header as='h3' inverted color="#e0e1e2" textAlign='center'>Loading Company Info</Header>
  ) : props.financialsError ? (
    <h2><Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get company info now.</Header></h2>
  ) : (typeof(props.financialsData) === 'undefined') ? '' : (props.financialsData.length < 1) ? '' : (
    <div>
        <React.Fragment>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <p style={{color:"#e0e1e2"}}>{displayMoreText ? description : description.slice(0,500) }<a href="#" style={{color:'green'}} onClick={(e) => {setDisplayMoreText(!displayMoreText)}}>{displayMoreText ? ' -Less' : ' +More'}</a></p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Gross Profit: ${formatNumbers(grossProfit)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Total Assets: ${formatNumbers(totalAssets)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Total Revenue: ${formatNumbers(totalRevenue)}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Operating Revenue: ${formatNumbers(operatingRevenue)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Total Liabilities: ${formatNumbers(totalLiabilities)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Net Income: ${formatNumbers(netIncome)}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Total Cash: ${formatNumbers(totalCash)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Total Debt: ${formatNumbers(totalDebt)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Cash Flow: ${formatNumbers(cashFlow)}</p>
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
    financialsLoading: state.stockDataFromRootReducer.financialsLoading,
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


