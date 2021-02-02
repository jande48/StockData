import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {Header, Grid, Button} from 'semantic-ui-react'
import { fetchFinancialsData } from '../redux'
import '../App.css'


function CompanyFinancialsContainer (props) {

    useEffect(() => {
        props.fetchFinancialsData(String(props.tickers))
    }, [props.tickers])


    var description = ''
    var ceo = ''
    var mktCap = 0
    var dividend = 0
    var grossProfit = 0
    var operatingRevenue = 0
    var totalRevenue = 0
    var totalAssets = 0
    var totalLiabilities = 0
    var totalCash = 0
    var netIncome = 0
    var cashFlow =0
    var totalDebt = 0

    if (typeof(props.financialsData) != 'undefined' && typeof(props.financialsData[0]) != 'undefined' && typeof(props.financialsData[1]) != 'undefined' && typeof(props.financialsData[2]) != 'undefined') {
        if (props.financialsData.length > 1) {
            ceo = props.financialsData[1]['CEO']
            mktCap = props.financialsData[2]['mktCap'] 
            dividend = props.financialsData[2]['lastDiv']
            description = props.financialsData[1]['description']
            grossProfit = props.financialsData[0]['grossProfit']
            operatingRevenue = props.financialsData[0]['operatingRevenue']
            totalRevenue = props.financialsData[0]['totalRevenue']
            totalLiabilities = props.financialsData[0]['totalLiabilities']
            totalCash = props.financialsData[0]['totalCash']
            netIncome = props.financialsData[0]['netIncome']
            totalDebt = props.financialsData[0]['totalDebt']
            cashFlow = props.financialsData[0]['cashFlow']
        }
    }

    function formatNumbers(input) {
        return(
            input > 1000000000000 ? String(Math.round(parseInt(input / 1000000000000 * 10)) / 10)+" T" : (input > 1000000000 ? String(Math.round(input / 1000000000 * 10) / 10)+" B" : (input > 100000 ? String(Math.round(input / 1000000 * 10 ) / 10)+" M" : input))
        )
    }
    
    return props.financialsLoading ? ( 
        <Header as='h3' inverted color="#e0e1e2" textAlign='center'>Loading Company Info</Header>
    ) : props.financialsError ? (
    <h2><Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get company info now.</Header></h2>
    ) : (typeof(props.financialsData) === 'undefined') ? '' : (props.financialsData.length < 1) ? '' : (
    <div class="fullWidth">
        <React.Fragment>
            <Grid columns='equal'>
                {/* <Grid.Row>
                    <Grid.Column>
                        <p style={{color:"#e0e1e2"}}>{displayMoreText ? description : description.slice(0,500) }<a href="#" style={{color:'green'}} onClick={(e) => {setDisplayMoreText(!displayMoreText)}}>{displayMoreText ? ' -Less' : ' +More'}</a></p>
                    </Grid.Column>
                </Grid.Row> */}
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Market Cap: ${formatNumbers(mktCap)}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>Dividend: { String(Math.round(parseInt(dividend * 100)) / 100)+" %"}</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <p style={{color:"#e0e1e2"}}>CEO: {String(ceo)}</p>
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


