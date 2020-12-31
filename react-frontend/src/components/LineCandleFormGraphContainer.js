import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { addPercentChange, addSplicedStartDate, addStockPriceForPercentChange, addEndDateForPercentChange, addSplicedIndexStockData, 
  addActiveNav, addOnMouseOverTicker, addDateMouseOverTicker, addIndexMouseOver } from '../redux'
import {Header, Grid} from 'semantic-ui-react'
import { createLoadingSpinnerChart } from './charts/loadingSpinner.js'
import '../App.css'
import 'react-datepicker/dist/react-datepicker.css'

import * as d3 from "d3"

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
    transition,
    curveLinear,
  } from 'd3';
import { DATE_MOUSE_OVER_TICKER } from '../redux/tickers/tickerTypes'

function LineCandleFormGraphContainer (d) {

    const stockChartNode = useRef(null);
    const loadingSpinnerNode = useRef(null);
    const height = 220;
    const width = 700;
    const margin = ({top: 15, right: 20, bottom: 20, left: 50})

    useEffect(() => {
  
    createLoadingSpinnerChart(loadingSpinnerNode,width,height,margin)
    if (typeof(d.stockData.stockData) != 'undefined') {
      if (d.stockData.stockData.length > 1) {
        createStockPriceLineChart(stockChartNode,d.stockData.stockData)
        }}
      },[d])




  function createStockPriceLineChart(stockPriceLineChartNode, Initialdata) {

      function sliceDataStartDate(data) {
        var startingIndex = 0
        var startingDate = d.dates.startDate
        
        if (d.dates.startDate.getDay()== 0){
          var dateOffset = (24*60*60*1000) * 2; 
          startingDate.setTime(startingDate.getTime()-dateOffset)
        }
        if (d.dates.startDate.getDay()== 6){
          var dateOffset = (24*60*60*1000) * 1; 
          startingDate.setTime(startingDate.getTime()-dateOffset)
        }
        //console.log(startingDate.getTime())
        for (var i = 0; i < data.length; i++) {
          var dateSplit = data[i]['date'].split("-")
          var indexDate = new Date(parseInt(dateSplit[0]),(parseInt(dateSplit[1])-1),parseInt(dateSplit[2]))

          if (indexDate.getTime() > startingDate.getTime()) {
            startingIndex = i
            break
          }
        }
        const exportData = data.slice(startingIndex)

        return exportData
      }

      const data = sliceDataStartDate(Initialdata)
      const InitialtrendData = d.trend.trendData
      const trendData = sliceDataStartDate(InitialtrendData)
      const InitialVolatilityData = d.volatility.volatilityData
      const volatilityData = sliceDataStartDate(InitialVolatilityData)
      const InitialMomentumData = d.momentum.momentumData
      const momentumData = sliceDataStartDate(InitialMomentumData)
      function findMixMaxObjects(objects,leftOrRight) {
          var min = objects[0]['dataInd'][0]['close']
          var max = 0
            for (var i = 0; i < objects.length; i++) {
              if (objects[i]['axis'] == leftOrRight && objects[i]['dataInd'] !='undefined'  && objects[i]['display'] || (objects[i]['name'] == 'close' && !objects[i]['display'] && leftOrRight == 'axisLeft')) {
                  for (var j = 0; j < objects[i]['dataInd'].length; j++) {
                  if (objects[i]['dataInd'][j][objects[i]['name']] < min) {
                      min = objects[i]['dataInd'][j][objects[i]['name']]
                  }
                  if (objects[i]['dataInd'][j][objects[i]['name']] > max) {
                      max = objects[i]['dataInd'][j][objects[i]['name']] 
                  }
                  if (objects[i]['name'] === 'close' && data[j]['low'] < min) {
                    min = data[j]['low']
                  }
                  if (objects[i]['name'] === 'close' && data[j]['high'] > max) {
                    max = data[j]['high'] 
                }
                  }
                }
                
            }
          
          
          if (min == 0 && max == 0) {
            max = 80
          }
          //console.log(min,max)
          return [min,max]
        }

      const svg = select(stockPriceLineChartNode.current);
      svg.selectAll("g").remove()
  
      const height = 220;
      const width = 700;
      const parseDate = d3.utcParse("%Y-%m-%d")
      const margin = ({top: 15, right: 20, bottom: 20, left: 50})

          
      class Indicator {
        constructor(name,color,dataForInd,display,axis) {
          this.name = name;
          this.color = color;
          this.dataInd = dataForInd;
          this.svg = svg;
          this.display =display;
          this.axis = axis;
          this.g = this.svg.append("g")
          this.lineGenerator = line()
        }
        // Getter
        get d3line() {
          return this.calcD3LinePara();
        }

        // Method
        calcD3LinePara() {
          if (this.display) {
          this.g
            .attr("stroke-linecap", "round")
            .attr("stroke",this.color)
            .selectAll("g")
            .data(this.dataInd)
            .join("g")

            if (this.axis == 'axisLeft') {
              this.lineGenerator
                .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
                .y(d => y(d[this.name]))
                .curve(curveLinear);
            }else{
              this.lineGenerator
                .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
                .y(d => yRight(d[this.name]))
                .curve(curveLinear);
            }
          

          this.g.append('path')
            .attr('class', 'line-path')
            .attr("id", this.name)
            .attr('d', this.lineGenerator(this.dataInd))
            .attr('fill','none')
            .attr('stroke-width',1)
            .attr('stroke-linecap','round')
          
            return this.g
          }else{
            return svg.selectAll("g").selectAll("."+this.name).remove()
          }
        }
      }

      const close = new Indicator('close','#e0e1e2',data,d.charts.displayLine,'axisLeft')
      const sma = new Indicator('sma',"#d62728",trendData,d.trend.displaySMA,'axisLeft')
      const macd = new Indicator('macd',"#ff7f0e",trendData,d.trend.displayMACD,'axisRight')
      const ema = new Indicator('ema',"#9467bd",trendData,d.trend.displayEMA,'axisLeft')
      const macdSignal = new Indicator('macds',"#1b9e77",trendData,d.trend.displayMACDsignal,'axisRight')
      const adx = new Indicator('adx',"#d95f02",trendData,d.trend.displayADX,'axisLeft')
      const adxp = new Indicator('adxp',"#7570b3",trendData,d.trend.displayADXP,'axisLeft')
      const adxn = new Indicator('adxn',"#e7298a",trendData,d.trend.displayADXN,'axisLeft')
      const vipos = new Indicator('vipos',"#66a61e",trendData,d.trend.displayVIPOS,'axisRight')
      const vineg = new Indicator('vineg',"#e6ab02",trendData,d.trend.displayVINEG,'axisRight')
      const trix = new Indicator('trix',"#a6761d",trendData,d.trend.displayTRIX,'axisRight')
      const mi = new Indicator('mi',"#666666",trendData,d.trend.displayMI,'axisRight')
      //const cci = new Indicator('cci',"#1b9e77",trendData,props.displayCCI,'axisRight')
      const dpo = new Indicator('dpo',"#1b9e77",trendData,d.trend.displayDPO,'axisRight')
      // ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
      const bbsma = new Indicator('bbsma',"#7fc97f",volatilityData,d.volatility.displayBBSMA,'axisLeft')
      const atr = new Indicator('atr',"#beaed4",volatilityData,d.volatility.displayATR,'axisRight')
      const BBupper = new Indicator('BBupper',"#fdc086",volatilityData,d.volatility.displayBBUpper,'axisLeft')
      const BBlower = new Indicator('BBlower',"#ffff99",volatilityData,d.volatility.displayBBLower,'axisLeft')
      const KeltnerC = new Indicator('keltnerC',"#386cb0",volatilityData,d.volatility.displayKeltnerC,'axisLeft')

      const rsi = new Indicator('rsi',"#1f77b4",momentumData,d.momentum.displayRSI,'axisRight');
      //const macd = new Indicator('macd',"#ff7f0e",trendData,props.displayMACD,'axisRight')
      const tsi = new Indicator('tsi',"#2ca02c",momentumData,d.momentum.displayTSI,'axisRight')
      const uo = new Indicator('uo',"#d62728",momentumData,d.momentum.displayUO,'axisRight')
      const stoch = new Indicator('stoch',"#9467bd",momentumData,d.momentum.displaySTOCH,'axisRight')
      const stochSignal = new Indicator('stoch_signal',"#8c564b",momentumData,d.momentum.displayStochSignal,'axisRight')
      const williamsR = new Indicator('wr',"#e377c2",momentumData,d.momentum.displayWR,'axisRight')
      const ao = new Indicator('ao',"#7f7f7f",momentumData,d.momentum.displayAO,'axisRight')
      const kama = new Indicator('kama',"#bcbd22",momentumData,d.momentum.displayKama,'axisRight')
      const roc = new Indicator('roc',"#17becf",momentumData,d.momentum.displayROC,'axisRight')
      const objectList = [close,sma,macd,ema,macdSignal,adx,adxp,adxn,vipos,vineg,trix,mi,dpo,bbsma,atr,BBlower,BBupper,KeltnerC,rsi,tsi,uo,stoch,stochSignal,williamsR,ao,kama,roc,rsi,tsi,uo,stoch,stochSignal,williamsR,ao,kama,roc]

      const xForToolTip = scaleBand()
          .domain(d3.utcDay
              .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
              .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
          .range([margin.left, width - margin.right])
          
      const x = scaleBand()
          .domain(d3.utcDay
              .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
              .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
          .range([margin.left, width - margin.right])
          .padding(0.2)
  
      var y = scaleLinear()
          .domain(findMixMaxObjects(objectList,'axisLeft'))
          //.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
          .rangeRound([height - margin.bottom, margin.top])
              //d3.min(data, d => d.low), d3.max(data, d => d.high

      var yRight = scaleLinear()
          .domain(findMixMaxObjects(objectList,'axisRight'))
          .rangeRound([height - margin.bottom, margin.top])

      const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .attr('class','axisWhite')
          .call(d3.axisBottom(x)   //.ticks(Math.round((data.length-1)/7))
              //.tickValues(d3.range(parseDate(data[0].date), parseDate(data[data.length - 1].date),((data.length-1)*86400000/10)).map( d => d.date))
              .tickValues(d3.utcMonday
                  .every(data.length > 2 ? (data.length > 250 ? 8 : (data.length > 150 ? 4 : (data.length > 80 ? 2 : 1))) : 1)
                  .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
              .tickFormat(d3.utcFormat("%-m/%-d")))
          //.call(g => g.select(".domain").remove())


      svg.append("text")
          .attr("class", "axisWhite")
          .attr("text-anchor", "middle")
          .attr("font-size",'10px')
          .style('fill','#e0e1e2')
          .attr('transform',`translate(10,${height/2}) rotate(-90)`)
          .text("Price ($)")
         
      const tooltip = svg.append("g")
          .attr("class", "axisWhite")
          .attr("id","tooltip")
          .selectAll("g")
          .data(data)
          .join("g")
      
      const invisibleRectForTooltip = svg.append("g")
          // .attr("stroke", "black")
          .selectAll("g")
          .attr("id","invisibleTooltip")
          .data(data)
          .join("g")
          .attr("transform", data => `translate(${x(parseDate(data.date))},0)`);
  
      invisibleRectForTooltip.append("rect")
          .attr('x',0)
          .attr('y',0)
          .attr('width', d=>(xForToolTip.bandwidth()))
          .attr('height',height - margin.top)
          .attr("fill", 'green')
          .style("opacity",'0')
          .attr('transform',d=>(`translate(${x.bandwidth()},${height - margin.top}) rotate(180)`))
          // .on('mouseover',function(event,d){
          //   d3.select(this).style('opacity','0.5')
          //   var endingDateSplit = d.date.split('-')
          //   var dateFromSplit = new Date(parseInt(endingDateSplit[0]),parseInt(endingDateSplit[1]),parseInt(endingDateSplit[2]))
          //   props.addEndDateForPercentChange(dateFromSplit)
          //   props.addStockPriceForPercentChange(d.close)
          //   props.addOnMouseOverTicker(true)
          //   props.addDateMouseOverTicker(d.date)
          //   // const newI = props.stockData.findIndex(function(d){ return props.dateMouseOverTicker == d.date})
          //   // const e = invisibleRectForTooltip.nodes();
          //   // const i = e.indexOf(this);
          //   // //console.log(newI)
          //   props.addIndexMouseOver(i)
          // })
          // .on('mouseout',function(e,d){
          //   d3.select(this).style('opacity','0')
          //   props.addOnMouseOverTicker(false)
          // })
      // var mousePerLine = tooltip.selectAll('.mouse-per-line')
      //     .data(data)
      //     .enter()
      //     .append("g")
      //     .attr("class", "mouse-per-line");

      // tooltip.append("text")
      //     .attr("text-anchor", "middle")
      //     .attr("font-size",'50px')
      //     .style('fill','white')
      //     .attr('x',margin.left+(width/2))
      //     .attr('y',height)
      //     .style("opacity", '0')
      //     .text(function(d) {
      //       //console.log(d)
      //       //console.log(d.close)
      //       return d.close
      //     })
      // const tooltip = svg.append("text")
      //     .attr("class", "axisWhite")
      //     .attr("id","tooltip")
      //     .attr("text-anchor", "middle")
      //     .attr("font-size",'50px')
      //     .style('fill','white')
      //     .attr('x',margin.left+(width/2))
      //     .attr('y',height)
      //     .style("opacity", 1)
      //     .text(function(d) { 
      //       console.log(d)
      //       if (typeof(d) != 'undefined' && typeof(d.close) != 'undefined'){
              
      //         return d.close;
      //       }
      //        })
          // .join("text")

          

      const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .attr('class','axisWhite')
          .call(d3.axisLeft(y)
              .tickFormat(d3.format("~f"))
              .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
          .call(g => g.selectAll(".tick line").clone()
              .attr("stroke-opacity", 0)
              .attr("x2", width - margin.left - margin.right))
          //.call(g => g.select(".domain").remove())
      

      svg.attr("viewBox", [0, 0, width, height])
  
      svg.append("g")
          .call(xAxis);
          
      svg.append("g")
          .call(yAxis);
      
      

      if (d.charts.displayLine) {

          const g = svg.append("g")
              .attr("stroke-linecap", "round")
              .attr("stroke", "#e0e1e2")
              .selectAll("g")
              .data(data)
              .join("g")
         
          const lineGenerator = line()
              .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
              .y(d => y(d.close))
              .curve(curveLinear);

          g.append('path')
              .attr('class', 'line-path')
              .attr('d', lineGenerator(data))
              .attr('id','lineChart')
              .attr('fill','none')
              .attr('stroke-width',1)
              .attr('stroke-linecap','round')
            
      }else{
          svg.selectAll("g").selectAll(".lineChart").remove()
  
          const g = svg.append("g")
              .attr("stroke-linecap", "butt")
              .attr("stroke", "#e0e1e2")
              .selectAll("g")
              .data(data)
              .join("g")
              .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
  
          g.append("line")
              .attr("y1", d => y(d.low))
              .attr("y2", d => y(d.high));
  
          g.append("line")
              .attr("y1", d => y(d.open))
              .attr("y2", d => y(d.close))
              .attr("id","candleStick")
              .attr("stroke-width", x.bandwidth())
              .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
                  : d.close > d.open ? d3.schemeSet1[2]
                  : d3.schemeSet1[8]);
      }
  
      const closeline = close.d3line
      const macdline = macd.d3line
      const smaline = sma.d3line
      const emaline = ema.d3line
      const macdSignalline = macdSignal.d3line
      const adxline = adx.d3line
      const adxpline = adxp.d3line
      const adxnline = adxn.d3line
      // const bbsmaline = bbsma.d3line
      const viposline = vipos.d3line
      const vinegline = vineg.d3line
      const trixline = trix.d3line
      const miline = mi.d3line
      //const cciline = cci.d3line
      const dpoline = dpo.d3line
      const atrline = atr.d3line
      const bbsmaline = bbsma.d3line
      const BBupperline = BBupper.d3line
      const BBlowerline = BBlower.d3line
      const keltnerCline = KeltnerC.d3line
      
      const rsiline = rsi.d3line
      //const macdline = macd.d3line
      const tsiline = tsi.d3line
      const uoline = uo.d3line
      const stochline = stoch.d3line
      const stochSignalLine = stochSignal.d3line
      const wrline = williamsR.d3line
      const aoline = ao.d3line
      const kamaline = kama.d3line
      const rocline = roc.d3line

      var showRightAxis = false
      for (var i = 0; i < objectList.length; i++) {
          if (objectList[i]['axis'] == 'axisRight' && objectList[i]['display']) {
          showRightAxis = true
          break
          }
      }
      if (showRightAxis) {

          var yAxisRight = g => g
              .attr("transform", `translate(${width-margin.right},0)`)
              .attr('class','axisWhite')
              .call(d3.axisRight(yRight)
                  .tickFormat(d3.format("~f"))
                  .tickValues(d3.scaleLinear().domain(yRight.domain()).ticks(4)))
              .call(g => g.selectAll(".tick line").clone()
                  .attr("stroke-opacity", 0)
                  .attr("x2", width - margin.left - margin.right+50))
              //.call(g => g.select(".domain").remove())
        
          svg.append("g")
              .attr('fill',macd.color)
              .call(yAxisRight)
            
      }
      function createLegendLeft(objects) {
          var keysList = []
          for (var i = 0; i < objects.length; i++) {
            if (objects[i]['display'] && objects[i]['axis'] == 'axisLeft'){
              keysList.push({'name':objects[i]['name'],'color':objects[i]['color']})
            }
          }
          svg.selectAll("g").selectAll(".mydotsLeft").remove()
          svg.selectAll("g").selectAll(".mylabelsLeft").remove()
          //svg.selectAll("mydotsLeft").remove()
          //svg.selectAll("mylabelsLeft").remove()
          const size = 10
          //svg.selectAll("mydotsLeft")
          const mydotsLeft = svg.append("g")
            .selectAll("g")
            .data(keysList)
            .join('g')
            //.enter()
          mydotsLeft.append("rect")
              .attr('id','mydotsLeft')
              .attr("x", margin.left + 5)
              .attr("y", function(d,i){ return margin.top + 1 + i*10}) // 100 is where the first dot appears. 25 is the distance between dots
              .attr("width",size)
              .attr("height", size/2)
              .style("fill", function(d){return d['color']})
            // Add one dot in the legend for each name.
  
          const mylabelsLeft = svg.append('g')
            .selectAll('g')
            .data(keysList)
            .join('g')
  
          mylabelsLeft.append("text")
              .attr('id','mylabelsLeft')
              .attr("x", margin.left + 20)
              .attr("y", function(d,i){ return margin.top + 4 + i*10 }) // 100 is where the first dot appears. 25 is the distance between dots
              .style("fill", function(d){return d['color']})
              .text(function(d){ return d['name'].toUpperCase()})
              .attr("text-anchor", "left")
              .attr("font-size",'10px')
              .style("alignment-baseline", "middle")
        }
  
      function createLegendRight(objects) {
          var keysList = []
          for (var i = 0; i < objects.length; i++) {
            if (objects[i]['display'] && objects[i]['axis'] == 'axisRight'){
              keysList.push({'name':objects[i]['name'],'color':objects[i]['color']})
            }
          }
          svg.selectAll("g").selectAll(".mydotsRight").remove()
          svg.selectAll("g").selectAll(".mylabelsRight").remove()
          const size = 10
  
          const mydotsRight = svg.append("g")
            .selectAll("g")
            .data(keysList)
            .join('g')
  
          mydotsRight.append("rect")
            .attr('id','mydotsRight')
            .attr("x", width - margin.right - 50)
            .attr("y", function(d,i){ return height - margin.bottom - 7 - i*10}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width",size)
            .attr("height", size/2)
            .style("fill", function(d){return d['color']})
          // Add one dot in the legend for each name.
  
          const mylabelsRight = svg.append('g')
            .selectAll('g')
            .data(keysList)
            .join('g')
  
          mylabelsRight.append("text")
            .attr('id','mylabelsRight')
            .attr("x", width - margin.right - 35)
            .attr("y", function(d,i){ return height - margin.bottom - 4 - i*10 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){return d['color']})
            .text(function(d){ return d['name'].toUpperCase()})
            .attr("text-anchor", "left")
            .attr("font-size",'10px')
            .style("alignment-baseline", "middle")
        }
  
        createLegendLeft(objectList)
        createLegendRight(objectList)

      return svg.node()
      }

  var endDateVar = 'Jacob'
  var endDateVar2 = ''

  function getIndex(data,date) {
    data.forEach(function (el, i) {
      
      if (el['date']==date){
        return i
      }
    })
    return (data.length -1)
  }

  return  (
    <div>
        <React.Fragment>
            <svg id="lineCandlestickSVG" ref={stockChartNode}></svg>
        </React.Fragment>
    </div>
  )
}

// const mapStateToProps = state => {
//   return {
//     tickers: state.tickersFromRootReducer.tickers,
//     startDate: state.datesFromRootReducer.startDate,
//     endDate: state.datesFromRootReducer.endDate,
//     dateMouseOverTicker: state.tickersFromRootReducer.dateMouseOverTicker,
//     stockData: state.stockDataFromRootReducer.stockData,
//     loading: state.stockDataFromRootReducer.loading,
//     trendLoading: state.trendFromRootReducer.trendLoading,
//     momentumLoading: state.momentumFromRootReducer.momentumLoading,
//     error: state.stockDataFromRootReducer.error,
//     errorMessage: state.stockDataFromRootReducer.errorMessage,
//     fetchStockData: state.stockDataFromRootReducer.fetchStockData,
//     displayLine: state.chartsFromRootReducer.displayLine,
//     displaySMA: state.trendFromRootReducer.displaySMA,
//     nForSMA: state.trendFromRootReducer.nForSMA,
//     displayEMA: state.trendFromRootReducer.displayEMA,
//     nForEMA: state.trendFromRootReducer.nForEMA,
//     displayMACD: state.trendFromRootReducer.displayMACD,
//     nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
//     nFastForMACD: state.trendFromRootReducer.nFastForMACD,
//     trendData: state.trendFromRootReducer.trendData,
//     compName: state.tickersFromRootReducer.name,
//     percentChange: state.tickersFromRootReducer.percentChange,
//     displayMACDsignal: state.trendFromRootReducer.displayMACDsignal,
//     nSlowForMACDsignal: state.trendFromRootReducer.nSlowForMACDsignal,
//     nFastForMACDsignal: state.trendFromRootReducer.nFastForMACDsignal,
//     nSignForMACDsignal: state.trendFromRootReducer.nSignForMACDsignal,
//     displayADX: state.trendFromRootReducer.displayADX,
//     nForADX: state.trendFromRootReducer.nForADX,
//     displayADXP: state.trendFromRootReducer.displayADXP,
//     nForADXP: state.trendFromRootReducer.nForADXP,
//     displayADXN: state.trendFromRootReducer.displayADXN,
//     nForADXN: state.trendFromRootReducer.nForADXN,
//     displayVIPOS: state.trendFromRootReducer.displayVIPOS,
//     nForVIPOS: state.trendFromRootReducer.nForVIPOS,
//     displayVINEG: state.trendFromRootReducer.displayVINEG,
//     nForVINEG: state.trendFromRootReducer.nForVINEG,
//     displayTRIX: state.trendFromRootReducer.displayTRIX,
//     nForTRIX: state.trendFromRootReducer.nForTRIX,
//     displayMI: state.trendFromRootReducer.displayMI,
//     nForMI: state.trendFromRootReducer.nForMI,
//     n2ForMI: state.trendFromRootReducer.n2ForMI,
//     displayDPO: state.trendFromRootReducer.displayDPO,
//     nForDPO: state.trendFromRootReducer.nForDPO,
//     financials: state.stockDataFromRootReducer.financialsData,
//     displayATR: state.volatilityFromtRootReducer.displayATR,
//     nForATR: state.volatilityFromtRootReducer.nForATR,
//     displayBBSMA: state.volatilityFromtRootReducer.displayBBSMA,
//     nForBBSMA: state.volatilityFromtRootReducer.nForBBSMA,
//     displayBBUpper: state.volatilityFromtRootReducer.displayBBUpper,
//     nForBBUpper: state.volatilityFromtRootReducer.nForBBUpper,
//     ndevBBUpper: state.volatilityFromtRootReducer.ndevForBBUpper,
//     displayBBLower: state.volatilityFromtRootReducer.displayBBLower,
//     nForBBLower: state.volatilityFromtRootReducer.nForBBLower,
//     ndevBBLower: state.volatilityFromtRootReducer.ndevForBBLower,
//     displayKeltnerC: state.volatilityFromtRootReducer.displayKeltnerC,
//     nForKeltnerC: state.volatilityFromtRootReducer.nForKeltnerC,
//     volatilityData: state.volatilityFromtRootReducer.volatilityData,
//     onMouseOverTicker: state.tickersFromRootReducer.onMouseOverTicker,
//     dateMouseOverTicker: state.tickersFromRootReducer.dateMouseOverTicker,
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     addPercentChange: (percentChange) => dispatch(addPercentChange(percentChange)),
//     addSplicedStartDate: (startingDate) => dispatch(addSplicedStartDate(startingDate)),
//     addStockPriceForPercentChange: (stockPrice) => dispatch(addStockPriceForPercentChange(stockPrice)),
//     addEndDateForPercentChange: (endingDate) => dispatch(addEndDateForPercentChange(endingDate)),
//     addSplicedIndexStockData: (index) => dispatch(addSplicedIndexStockData(index)),
//     addActiveNav: (x) => dispatch(addActiveNav(x)),
//     addOnMouseOverTicker: (x) => dispatch(addOnMouseOverTicker(x)),
//     addDateMouseOverTicker: (x) => dispatch(addDateMouseOverTicker(x)),
//     addIndexMouseOver: (x) => dispatch(addIndexMouseOver(x)),
//   }
// }

export default LineCandleFormGraphContainer


















