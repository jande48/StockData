import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { createLoadingSpinnerChart } from './charts/loadingSpinner.js'
import {Header, Grid} from 'semantic-ui-react'
import '../App.css'
import 'react-datepicker/dist/react-datepicker.css'
import * as d3 from "d3"
import { fetchMomentumData } from '../redux';
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

function MomentumGraphContainer (props) {

  


  const momentumIndicatorsChartNode = useRef(null);
  const loadingSpinnerNode = useRef(null);
  const height = 70;
  const width = 700;
  const margin = ({top: 5, right: 20, bottom: 5, left: 50})

  useEffect(() => {
  createLoadingSpinnerChart(loadingSpinnerNode,width,height,margin)
  if (typeof(props.momentumData) != 'undefined') {
    if (props.momentumData.length > 2) {
    function createMomentumIndicatorsChart(momentumIndicatorsChartNode) {
      const Initialdata = props.momentumData
      const InitialtrendData = props.trendData
      function convertDatesToString(initialDate) {
        const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
        return convertedDate
      }
      function sliceDataStartDate(data) {
        var startingIndex = 0
        var startingDate = props.startDate
        if (props.startDate.getDay()== 0){
          var dateOffset = (24*60*60*1000) * 2; 
          startingDate.setTime(startingDate.getTime()-dateOffset)
        }
        if (props.startDate.getDay()== 6){
          var dateOffset = (24*60*60*1000) * 1; 
          startingDate.setTime(startingDate.getTime()-dateOffset)
        }
        for (var i = 0; i < data.length; i++) {
          var dateSplit = data[i]['date'].split("-")
          if ((String(parseInt(dateSplit[0]))+"-"+String(parseInt(dateSplit[1]))+"-"+String(parseInt(dateSplit[2]))) == convertDatesToString(startingDate)) {
            startingIndex = i
            break
          } 
        }
        const exportData = data.slice(startingIndex)

        return exportData
      }
      const data = sliceDataStartDate(Initialdata)
      const trendData = sliceDataStartDate(InitialtrendData)
      

      function findMixMaxObjects(objects,leftOrRight) {
        var min = 0
        var max = 0
        
          for (var i = 0; i < objects.length; i++) {
            if (objects[i]['axis'] == leftOrRight && objects[i]['dataInd'] !='undefined' && objects[i]['display']) {
              for (var j = 0; j < objects[i]['dataInd'].length; j++) {
                if (objects[i]['dataInd'][j][objects[i]['name']] < min) {
                    min = objects[i]['dataInd'][j][objects[i]['name']]
                }
                if (objects[i]['dataInd'][j][objects[i]['name']] > max) {
                    max = objects[i]['dataInd'][j][objects[i]['name']] 
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

      const svg = select(momentumIndicatorsChartNode.current);
      svg.selectAll("g").remove()

      const height = 70;
      const width = 700;

      const margin = ({top: 5, right: 20, bottom: 5, left: 50})
      const parseDate = d3.utcParse("%Y-%m-%d")
      
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
            .attr("stroke", this.color)
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

      const rsi = new Indicator('rsi',"#1f77b4",data,props.displayRSI,'axisLeft');
      //const macd = new Indicator('macd',"#ff7f0e",trendData,props.displayMACD,'axisRight')
      const tsi = new Indicator('tsi',"#2ca02c",data,props.displayTSI,'axisLeft')
      const uo = new Indicator('uo',"#d62728",data,props.displayUO,'axisLeft')
      const stoch = new Indicator('stoch',"#9467bd",data,props.displaySTOCH,'axisLeft')
      const stochSignal = new Indicator('stoch_signal',"#8c564b",data,props.displayStochSignal,'axisLeft')
      const williamsR = new Indicator('wr',"#e377c2",data,props.displayWR,'axisRight')
      const ao = new Indicator('ao',"#7f7f7f",data,props.displayAO,'axisRight')
      const kama = new Indicator('kama',"#bcbd22",data,props.displayKama,'axisLeft')
      const roc = new Indicator('roc',"#17becf",data,props.displayROC,'axisLeft')

      const objectList = [rsi,tsi,uo,stoch,stochSignal,williamsR,ao,kama,roc]
      
      const x = scaleBand()
          .domain(d3.utcDay
              .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
              .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
          .range([margin.left, width - margin.right])
          .padding(0.2)

      var y = scaleLinear()
          //.domain([d3.min(data, d => d.rsi), d3.max(data, d => d.rsi)])
          //.domain(findMinMax(data))
          .domain(findMixMaxObjects(objectList,'axisLeft'))
          .rangeRound([height - margin.bottom, margin.top])

      // if (props.displayMACD) {
      //   var yRight = scaleLinear()
      //     //.domain([min,max])
      //     .domain(findMixMaxObjects(objectList,'axisRight'))
      //     .rangeRound([height - margin.bottom, margin.top])
      // }

      const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .attr('class','axisWhite')
          .call(d3.axisBottom(x)
              .tickValues(d3.utcMonday
                  .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
                  .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
              .tickFormat(d3.utcFormat("")))
          //.call(g => g.select(".domain").remove())

      var yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .attr('class','axisWhite')
          .call(d3.axisLeft(y)
              .tickFormat(d3.format("~f"))
              .tickValues(d3.scaleLinear().domain(y.domain()).ticks(4)))
          .call(g => g.selectAll(".tick line").clone()
              .attr("stroke-opacity", 0)
              .attr("x2", width - margin.left - margin.right))
          //.call(g => g.select(".domain").remove())

      svg.append("text")
          .attr("class", "axisWhite")
          .attr("text-anchor", "middle")
          .attr("font-size",'10px')
          .style('fill','#e0e1e2')
          .attr('transform',`translate(10,${height/2}) rotate(-90)`)
          .text("Indicator")

      var showRightAxis = false
      for (var i = 0; i < objectList.length; i++) {
        if (objectList[i]['axis'] == 'axisRight') {
          showRightAxis = true
          break
        }
      }
      if (showRightAxis) {
        var yRight = scaleLinear()
            .domain(findMixMaxObjects(objectList,'axisRight'))
            .rangeRound([height - margin.bottom, margin.top])

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
      }

      svg.attr("viewBox", [0, 0, width, height])

      svg.append("g")
          .call(xAxis);

      svg.append("g")
        .call(yAxis);

      // d3 Schema Set 3 https://observablehq.com/@d3/color-schemes
      //  ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
      // categorical 10: ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]
      
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
      
      if ( props.displayWR || props.displayAO) {
        svg.append("g")
          .attr('fill', () => props.displayWR ? williamsR.color : ao.color )
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
            .attr("y", function(d,i){ return height - margin.bottom - 7 - i*10}) // 100 is where the first dot appears. 25 is the distance between dots
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
            .attr("y", function(d,i){ return height - margin.bottom - 4 - i*10 }) // 100 is where the first dot appears. 25 is the distance between dots
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

    

      return svg.node();

    }

    createMomentumIndicatorsChart(momentumIndicatorsChartNode)
  
      
  }}

  },[props.loading,props.momentumLoading,props.stockData,props.startDate,props.endDate])


  return props.loading ? (
    <React.Fragment>
      <svg ref={loadingSpinnerNode}></svg>
    </React.Fragment>
  ) :props.error || props.momentumError ? (
    <Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get momentum data now.</Header>
  ) : (
    <div>
        <React.Fragment>
            <svg ref={momentumIndicatorsChartNode}></svg>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    stockData: state.stockDataFromRootReducer.stockData,
    startDate: state.datesFromRootReducer.startDate,
    endDate: state.datesFromRootReducer.endDate,
    loading: state.stockDataFromRootReducer.loading,
    momentumLoading: state.momentumFromRootReducer.momentumLoading,
    momentumError: state.momentumFromRootReducer.momentumError,
    error: state.stockDataFromRootReducer.error,
    trendData: state.trendFromRootReducer.trendData,
    loads: state.stockDataFromRootReducer.loads,
    momentumLoads: state.momentumFromRootReducer.momentumLoads,
    momentumData: state.momentumFromRootReducer.momentumData,
    fetchMomentumData: state.momentumFromRootReducer.fetchMomentumData,
    displayRSI: state.momentumFromRootReducer.displayRSI,
    nForRSI: state.momentumFromRootReducer.nForRSI,
    displayTSI: state.momentumFromRootReducer.displayTSI,
    rForTSI: state.momentumFromRootReducer.rForTSI,
    sForTSI: state.momentumFromRootReducer.sForTSI,
    //displayMACD: state.trendFromRootReducer.displayMACD,
    //nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    //nFastForMACD: state.trendFromRootReducer.nFastForMACD,
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
    //requestAPIstockData: (APIstring) => dispatch(requestAPIstockData(APIstring)),
    fetchMomentumData: (APIstring) => dispatch(fetchMomentumData(APIstring))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MomentumGraphContainer)













      // // Usually you have a color scale in your chart already
      // var color = d3.scaleOrdinal()
      //   .domain(LegendLabels())
      //   .range(d3.schemeSet1);




      // const LegendLabels = () => {
      //   const displayParas = [props.displayRSI,props.displayMACD]
      //   const labels = ['RSI','MACD']
      //   const colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
      //   var keysList = []
      //   var colorsList = []
      //   for (var i = 0; i < displayParas.length; i++) {
      //     if (displayParas[i]){
      //       keysList.push(labels[i])
      //       colorsList.push(colors[i])
      //     }
      //   }
      //   return keysList
      // }
      // const  LegendColors = () => {
      //   const displayParas = [props.displayRSI,props.displayMACD]
      //   const labels = ['RSI','MACD']
      //   const colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
      //   var keysList = []
      //   var colorsList = []
      //   for (var i = 0; i < displayParas.length; i++) {
      //     if (displayParas[i]){
      //       keysList.push(labels[i])
      //       colorsList.push(colors[i])
      //     }
      //   }
      //   return colorsList
      // }
      // const legendColorList = LegendColors()

//if (props.displayTSI && typeof(data[0]['tsi']) !== 'undefined') {
  //     const gTSI = svg.append("g")
  //         .attr("stroke-linecap", "round")
  //         .attr("stroke", legendColorList[2])
  //         .selectAll("g")
  //         .data(data)
  //         .join("g")

  //     const lineGeneratorTSI = line()
  //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
  //         .y(d => y(d.tsi))
  //         .curve(curveLinear);

  //     gTSI.append('path')
  //         .attr('class', 'line-path')
  //         .attr("id", "tsi")
  //         .attr('d', lineGeneratorTSI(data))
  //         .attr('fill','none')
  //         .attr('stroke-width',2)
  //         .attr('stroke-linecap','round')
  // }else{
  //     svg.selectAll("g").selectAll(".tsi").remove()
  // }

  // if (props.displayMACD) {
  //   const gMACD = svg.append("g")
  //       .attr("stroke-linecap", "round")
  //       .attr("stroke", color(2))
  //       .selectAll("g")
  //       .data(trendData)
  //       .join("g")
  //       // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

  //   const lineGeneratorMACD = line()
  //       .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
  //       .y(d => yRight(d.macd))
  //       .curve(curveLinear);

  //   gMACD.append('path')
  //       .attr('class', 'line-path')
  //       .attr('d', lineGeneratorMACD(trendData))
  //       .attr('id','macd')
  //       .attr('fill','none')
  //       .attr('stroke-width',2)
  //       .attr('stroke-linecap','round')
  //   }else{
  //     svg.selectAll("g").selectAll(".macd").remove()
  //   }



  // var RSIobject = {name:'RSI',theData:getTheData(this)}
  // function getTheData() {
  //   return this.name
  // }
  // console.log(RSIobject)

  


      // const gRSI = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", legendColorList[0])
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")
      //     // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

      // const lineGeneratorRSI = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.rsi))
      //     .curve(curveLinear);


// if (props.displayRSI) {
      //     gRSI.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "rsi")
      //     .attr('d', lineGeneratorRSI(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',2)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".rsi").remove()
      // }

      
      



      // if (displayTSIcheckbox) {
      //     gTSI.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "tsi")
      //     .attr('d', lineGeneratorTSI(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".tsi").remove()
      // }

      // const gUO = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "green")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorUO = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.UO))
      //     .curve(curveLinear);

      // if (displayUOcheckbox) {
      //     gUO.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "uo")
      //     .attr('d', lineGeneratorUO(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".uo").remove()
      // }
      
      
      // const gStoch = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "purple")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorStoch = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.stoch))
      //     .curve(curveLinear);

      // if (displayStochCheckbox) {
      //     gStoch.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "stoch")
      //     .attr('d', lineGeneratorStoch(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".stoch").remove()
      // }

      
      // const gStochSignal = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "yellow")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorStochSignal = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.stoch_signal))
      //     .curve(curveLinear);

      // if (displayStochSignalCheckbox) {
      //     gStochSignal.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "stochSignal")
      //     .attr('d', lineGeneratorStochSignal(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".stochSignal").remove()
      // }

      // const gWR = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "orange")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorWR = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.wr))
      //     .curve(curveLinear);

      // if (displayWR) {
      //     gWR.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "wr")
      //     .attr('d', lineGeneratorWR(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".wr").remove()
      // }

      // const gAO = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "pink")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorAO = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.ao))
      //     .curve(curveLinear);

      // if (displayAO) {
      //     gAO.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "ao")
      //     .attr('d', lineGeneratorAO(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".ao").remove()
      // }

      // const gKama = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "darkgreen")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorKama = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.kama))
      //     .curve(curveLinear);

      // if (displayKama) {
      //     gKama.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "kama")
      //     .attr('d', lineGeneratorKama(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".kama").remove()
      // }

      // const gROC = svg.append("g")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke", "lightblue")
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")

      // const lineGeneratorROC = line()
      //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
      //     .y(d => y(d.roc))
      //     .curve(curveLinear);

      // if (displayROC) {
      //     gROC.append('path')
      //     .attr('class', 'line-path')
      //     .attr("id", "roc")
      //     .attr('d', lineGeneratorROC(data))
      //     .attr('fill','none')
      //     .attr('stroke-width',3)
      //     .attr('stroke-linecap','round')
      // }else{
      //     svg.selectAll("g").selectAll(".roc").remove()
      // }


