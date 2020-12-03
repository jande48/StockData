import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { addPercentChange, addStockPriceForPercentChange } from '../redux'
import {Header, Grid, Label} from 'semantic-ui-react'
import '../App.css'



function HeaderTickerPriceContainer (props) {


    useEffect(() => {
    var endingStockPrice = props.stockPriceForPercentChange 
    if (endingStockPrice == 0 && typeof(props.stockData) != 'undefined' && props.stockData.length > 1) {
      endingStockPrice = props.stockData[props.stockData.length -1]['close']
    }
    if (typeof(props.stockData) != 'undefined') {
      if (props.stockData.length > 1 && !props.momentumLoading && !props.loading && !props.trendLoading) {
        props.addPercentChange(calcPercentChange())
        }}
      },[props.stockData,props.loading,props.momentumLoading,props.trendLoading,props.endDateForPercentChange,props.stockPriceForPercentChange])


  var endingStockPrice = props.stockPriceForPercentChange 
  if (endingStockPrice == 0 && typeof(props.stockData) != 'undefined' && props.stockData.length > 1) {
    endingStockPrice = props.stockData[props.stockData.length -1]['close']
  }

  
  function calcPercentChange() {
      var exportDefault = 0
      if (typeof(props.stockData) != 'undefined'){
      if (props.stockData.length > 2) {
          var startingStockPrice = props.stockPriceForPercentChange
          if (startingStockPrice === 0) {
            startingStockPrice = props.stockData[parseInt(props.stockData.length-1)]['close']
          }
          const percentChange = ((startingStockPrice - props.stockData[parseInt(props.splicedIndexStockData)]['open'])/props.stockData[parseInt(props.splicedIndexStockData)]['open'])*100
          const percentChangeFormatted = percentChange.toFixed(2)
          return percentChangeFormatted

      }else{
          return exportDefault
      }}
  }
  var splicedStartDateConst = "2020-11-01"
  if (typeof(props.splicedStartDate) != 'undefined' &&  props.splicedStartDate.length > 1){
    splicedStartDateConst = props.splicedStartDate.split('-')
  }
  
  var endDateVar = props.endDateForPercentChange

  return  props.loading ? (
    <React.Fragment>
      <Grid inverted columns='equal'>
          <Grid.Row stretched>
            <Grid.Column>
                <h2 style={{color: "#1b1c1d"}}>A</h2>
              {/* <Header as='h2' textAlign='left' inverted color="#e0e1e2"> { typeof(props.stockData) === 'undefined' ? 'A' : (props.stockData.length > 0 ?  props.compName + ' - '+ props.tickers + ' ($' + props.stockData[props.stockData.length-1]['close'] + ')' : '')}</Header> */}
            </Grid.Column>
            <Grid.Column color='black'>
                <Header as='h2' textAlign='right' color={(props.percentChange > 0) ? 'green' : 'red'}>{((props.percentChange==0) ? '' : (props.percentChange > 0) ? '+' + String(props.percentChange) + '%': String(props.percentChange)+'%')}
                </Header>
                
            </Grid.Column>
          </Grid.Row>
      </Grid>
    </React.Fragment>
  ) : props.error ? (
    <Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get stock data now.</Header>
  ) : (
    <div>
        <React.Fragment>
        <Grid inverted columns='equal'>
          <Grid.Row stretched  color='black'>
            <Grid.Column  color='black'>
            {/* <Image src={(typeof(props.financials)!='undefined') ? (props.financials.length>0 ? props.financials[2]['image'] : '') : ''} size='mini' spaced='right' verticalAlign='top' /> */}
              <Header as='h2' textAlign='left' inverted color="#e0e1e2"> { typeof(props.stockData) === 'undefined' ? '' : (props.stockData.length > 0 ?  props.compName + ' - '+ props.tickers + ' ($' + endingStockPrice.toFixed(2) + ')' : '')}</Header>
            </Grid.Column>
            <Grid.Column color='black'>
                <Header as='h2' textAlign='right' color={(props.percentChange > 0) ? 'green' : 'red'}>{((props.percentChange==0) ? '' : (props.percentChange > 0) ? '+' + String(props.percentChange) + '%': String(props.percentChange)+'%')}
                <Label>{String(parseInt(splicedStartDateConst[1]))+"/"+String(parseInt(splicedStartDateConst[2]))+"/"+splicedStartDateConst[0].slice(2)
                +" - "+String(endDateVar.getMonth())+"/"+String(endDateVar.getDay())+"/"+endDateVar.getFullYear().toString().substr(-2)}</Label>
                </Header>
                
            </Grid.Column>
          </Grid.Row>
          </Grid>
        </React.Fragment>
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
    trendData: state.trendFromRootReducer.trendData,
    compName: state.tickersFromRootReducer.name,
    percentChange: state.tickersFromRootReducer.percentChange,
    stockPriceForPercentChange: state.tickersFromRootReducer.stockPriceForPercentChange,
    endDateForPercentChange: state.tickersFromRootReducer.endDateForPercentChange,
    splicedStartDate: state.tickersFromRootReducer.splicedStartDate,
    splicedIndexStockData: state.tickersFromRootReducer.splicedIndexStockData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addPercentChange: (percentChange) => dispatch(addPercentChange(percentChange)),
    //addStockPriceForPercentChange: (stockPrice) => dispatch(addStockPriceForPercentChange(stockPrice))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderTickerPriceContainer)

























// if (props.displayMACD) {
            //     const gMACD = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "blue")
            //         .selectAll("g")
            //         .data(trendData)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMACD = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.macd))
            //         .curve(curveLinear);
        
            //     gMACD.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMACD(trendData))
            //         .attr('id','macd')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".macd").remove()
            // }
            // if (displayMACDsignal) {
            //     const gMACDsignal = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "yellow")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMACDsignal = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.macdSignal))
            //         .curve(curveLinear);
        
            //     gMACDsignal.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMACDsignal(data))
            //         .attr('id','macdSignal')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".macdSignal").remove()
            // }
            // if (displayAIdown) {
            //     const gAIdown = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "green")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorAIdown = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.AIdown))
            //         .curve(curveLinear);
        
            //     gAIdown.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorAIdown(data))
            //         .attr('id','AIdown')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".AIdown").remove()
            // }
            // if (displayAIup) {
            //     const gAIup = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightgreen")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorAIup = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.AIup))
            //         .curve(curveLinear);
        
            //     gAIup.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorAIup(data))
            //         .attr('id','AIup')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".AIup").remove()
            // }
            // if (displayIchimuku) {
            //     const gIchimuku = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightblue")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorIchimuku = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.ichimoku))
            //         .curve(curveLinear);
        
            //     gIchimuku.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorIchimuku(data))
            //         .attr('id','Ichimuku')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".Ichimuku").remove()
            // }
            // if (displayDPO) {
            //     const gDPO = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "red")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorDPO = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.dpo))
            //         .curve(curveLinear);
        
            //     gDPO.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorDPO(data))
            //         .attr('id','dpo')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".dpo").remove()
            // }
            // if (displayCCI) {
            //     const gCCI = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "pink")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorCCI = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.cci))
            //         .curve(curveLinear);
        
            //     gCCI.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorCCI(data))
            //         .attr('id','cci')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".cci").remove()
            // }
            // if (displaySMA) {
            //     const gSMA = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "purple")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorSMA = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.sma))
            //         .curve(curveLinear);
        
            //     gSMA.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorSMA(data))
            //         .attr('id','sma')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".sma").remove()
            // }
            // if (displayADX) {
            //     const gADX = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "orange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADX = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adx))
            //         .curve(curveLinear);
        
            //     gADX.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADX(data))
            //         .attr('id','adx')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adx").remove()
            // }
            // if (displayADXpos) {
            //     const gADXpos = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightorange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADXpos = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adxPositive))
            //         .curve(curveLinear);
        
            //     gADXpos.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADXpos(data))
            //         .attr('id','adxPos')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adxPos").remove()
            // }
            // if (displayADXneg) {
            //     const gADXneg = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "darkorange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADXneg = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adxNegative))
            //         .curve(curveLinear);
        
            //     gADXneg.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADXneg(data))
            //         .attr('id','adxNeg')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adxNeg").remove()
            // }
            // if (displayVIneg) {
            //     const gVIneg = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "steelblue")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorVIneg = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.VInegative))
            //         .curve(curveLinear);
        
            //     gVIneg.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorVIneg(data))
            //         .attr('id','VIneg')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".VIneg").remove()
            // }
            // if (displayVIpos) {
            //     const gVIpos = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "rgb(12,240,233)")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorVIpos = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.VIpositive))
            //         .curve(curveLinear);
        
            //     gVIpos.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorVIpos(data))
            //         .attr('id','VIpos')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".VIpos").remove()
            // }
            // if (displayTRIX) {
            //     const gTRIX = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "rgba(198, 45, 205, 0.8)")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorTRIX = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.trix))
            //         .curve(curveLinear);
        
            //     gTRIX.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorTRIX(data))
            //         .attr('id','trix')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".trix").remove()
            // }
            // if (displayMassIndex) {
            //     const gMI = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "darkred")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMI = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.massIndex))
            //         .curve(curveLinear);
        
            //     gMI.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMI(data))
            //         .attr('id','mi')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".mi").remove()
            // }
        
        
        // displayIchimuku,displayDPO,displayCCI,displaySMA,displayMACD,displayMACDsignal,displayADX,displayADXpos,displayADXneg,displayVIpos,displayVIneg,displayTRIX,displayMassIndex
        //   


 // var min = 0
            // var max = 0
            // //console.log(displayEMA)
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i]['close'] < min) {
            //         min = data[i]['close']
            //     }
            //     if (data[i]['close'] > max) {
            //         max = data[i]['close']
            //     }
            //     if (displayEMA) {
            //         if (data[i]['ema'] < min) {
            //             min = data[i]['ema']
            //         }
            //         if (data[i]['ema'] > max) {
            //             max = data[i]['ema']
            //         }
            //     }
            //     if (displayAIdown) {
                   
            //         if (data[i]['AIdown'] < min) {
            //             min = data[i]['AIdown']
            //         }
            //         if (data[i]['AIdown'] > max) {
            //             max = data[i]['AIdown']
            //         }
            //     }
        
                
            //     if (displayAIup) {
            //         if (data[i]['AIup'] < min) {
            //             min = data[i]['AIup']
            //         }
            //         if (data[i]['AIupuo'] > max) {
            //             max = data[i]['AIup']
            //         }
            //     }
            //     if (displayIchimuku) {
            //         if (data[i]['ichimoku'] < min) {
            //             min = data[i]['ichimoku']
            //         }
            //         if (data[i]['ichimoku'] > max) {
            //             max = data[i]['ichimoku']
            //         }
            //     }
            //     if (displayDPO) {
            //         if (data[i]['dpo'] < min) {
            //             min = data[i]['dpo']
            //         }
            //         if (data[i]['dpo'] > max) {
            //             max = data[i]['dpo']
            //         }
            //     }
            //     if (displayCCI) {
            //         if (data[i]['cci'] < min) {
            //             min = data[i]['cci']
            //         }
            //         if (data[i]['cci'] > max) {
            //             max = data[i]['cci']
            //         }
            //     }
            //     if (displaySMA) {
            //         if (data[i]['sma'] < min) {
            //             min = data[i]['sma']
            //         }
            //         if (data[i]['sma'] > max) {
            //             max = data[i]['sma']
            //         }
            //     }
            //     if (displayMACD) {
            //         if (data[i]['macd'] < min) {
            //             min = data[i]['macd']
            //         }
            //         if (data[i]['macd'] > max) {
            //             max = data[i]['macd']
            //         }
            //     }
            //     if (displayMACDsignal) {
            //         if (data[i]['macdSignal'] < min) {
            //             min = data[i]['macdSignal']
            //         }
            //         if (data[i]['macdSignal'] > max) {
            //             max = data[i]['macdSignal']
            //         }
            //     }
            //     if (displayADX) {
            //         if (data[i]['adx'] < min) {
            //             min = data[i]['adx']
            //         }
            //         if (data[i]['adx'] > max) {
            //             max = data[i]['adx']
            //         }
            //     }
            //     if (displayADXpos) {
            //         if (data[i]['adxPositive'] < min) {
            //             min = data[i]['adxPositive']
            //         }
            //         if (data[i]['adxPositive'] > max) {
            //             max = data[i]['adxPositive']
            //         }
            //     }
            //     if (displayADXneg) {
            //         if (data[i]['adxNegative'] < min) {
            //             min = data[i]['adxNegative']
            //         }
            //         if (data[i]['adxNegative'] > max) {
            //             max = data[i]['adxNegative']
            //         }
            //     }
            //     if (displayVIpos) {
            //         if (data[i]['VIpositive'] < min) {
            //             min = data[i]['VIpositive']
            //         }
            //         if (data[i]['VIpositive'] > max) {
            //             max = data[i]['VIpositive']
            //         }
            //     }
            //     if (displayVIneg) {
            //         if (data[i]['VInegative'] < min) {
            //             min = data[i]['VInegative']
            //         }
            //         if (data[i]['VInegative'] > max) {
            //             max = data[i]['VInegative']
            //         }
            //     }
            //     if (displayTRIX) {
            //         if (data[i]['trix'] < min) {
            //             min = data[i]['trix']
            //         }
            //         if (data[i]['trix'] > max) {
            //             max = data[i]['trix']
            //         }
            //     }
            //     if (displayMassIndex) {
            //         if (data[i]['massIndex'] < min) {
            //             min = data[i]['massIndex']
            //         }
            //         if (data[i]['massIndex'] > max) {
            //             max = data[i]['massIndex']
            //         }
            //     }
            // }
            // if (min == 0 && max == 0) {
            //     max = 80
            // }