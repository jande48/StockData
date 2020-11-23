import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { addPercentChange, addSplicedStartDate } from '../redux'
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

function LineCandleGraphContainer (props) {

    const stockChartNode = useRef(null);
    const loadingSpinnerNode = useRef(null);
        const height = 220;
        const width = 700;
        const margin = ({top: 15, right: 20, bottom: 20, left: 50})

    useEffect(() => {
    createLoadingSpinnerChart(loadingSpinnerNode,width,height,margin)
    if (typeof(props.stockData) != 'undefined') {
      if (props.stockData.length > 1 && !props.momentumLoading && !props.loading && !props.trendLoading) {
        createStockPriceLineChart(stockChartNode,props.stockData)
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
  
  //props.addPercentChange(calcPercentChange())

  



  function createStockPriceLineChart(stockPriceLineChartNode, Initialdata) {
      //const Initialdata = props.stockData

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
        //console.log(startingDate.getTime())
        for (var i = 0; i < data.length; i++) {
          var dateSplit = data[i]['date'].split("-")
          var indexDate = new Date(parseInt(dateSplit[0]),(parseInt(dateSplit[1])-1),parseInt(dateSplit[2]))

          if (indexDate.getTime() > startingDate.getTime()) {
            startingIndex = i
            break
          }
          // if ((String(parseInt(dateSplit[0]))+"-"+String(parseInt(dateSplit[1]))+"-"+String(parseInt(dateSplit[2]))) == convertDatesToString(startingDate)) {
          //   startingIndex = i
          //   break
          // } 
        }
        const exportData = data.slice(startingIndex)
        if (typeof(exportData) != 'undefined' && exportData.length > 1){
          props.addSplicedStartDate(exportData[0]['date'])
        }
        return exportData
      }

      const data = sliceDataStartDate(Initialdata)
      //console.log(data)
      const InitialtrendData = props.trendData
      const trendData = sliceDataStartDate(InitialtrendData)
      const InitialVolatilityData = props.volatilityData
      const volatilityData = sliceDataStartDate(InitialVolatilityData)
      
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
        // ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
      const close = new Indicator('close','#e0e1e2',data,props.displayLine,'axisLeft')
      const sma = new Indicator('sma',"#d62728",trendData,props.displaySMA,'axisLeft')
      const macd = new Indicator('macd',"#ff7f0e",trendData,props.displayMACD,'axisRight')
      const ema = new Indicator('ema',"#9467bd",trendData,props.displayEMA,'axisLeft')
      const macdSignal = new Indicator('macds',"#1b9e77",trendData,props.displayMACDsignal,'axisRight')
      const adx = new Indicator('adx',"#d95f02",trendData,props.displayADX,'axisLeft')
      const adxp = new Indicator('adxp',"#7570b3",trendData,props.displayADXP,'axisLeft')
      const adxn = new Indicator('adxn',"#e7298a",trendData,props.displayADXN,'axisLeft')
      const vipos = new Indicator('vipos',"#66a61e",trendData,props.displayVIPOS,'axisRight')
      const vineg = new Indicator('vineg',"#e6ab02",trendData,props.displayVINEG,'axisRight')
      const trix = new Indicator('trix',"#a6761d",trendData,props.displayTRIX,'axisRight')
      const mi = new Indicator('mi',"#666666",trendData,props.displayMI,'axisRight')
      //const cci = new Indicator('cci',"#1b9e77",trendData,props.displayCCI,'axisRight')
      const dpo = new Indicator('dpo',"#1b9e77",trendData,props.displayDPO,'axisRight')
      // ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
      const bbsma = new Indicator('bbsma',"#7fc97f",volatilityData,props.displayBBSMA,'axisLeft')
      const atr = new Indicator('atr',"#beaed4",volatilityData,props.displayATR,'axisRight')
      const BBupper = new Indicator('BBupper',"#fdc086",volatilityData,props.displayBBUpper,'axisLeft')
      const BBlower = new Indicator('BBlower',"#ffff99",volatilityData,props.displayBBLower,'axisLeft')
      const KeltnerC = new Indicator('keltnerC',"#386cb0",volatilityData,props.displayKeltnerC,'axisLeft')
      const objectList = [close,sma,macd,ema,macdSignal,adx,adxp,adxn,vipos,vineg,trix,mi,dpo,bbsma,atr,BBlower,BBupper,KeltnerC]


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
      
      
      // var mousePerLine = tooltip.selectAll('.mouse-per-line')
      //     .data(data)
      //     .enter()
      //     .append("g")
      //     .attr("class", "mouse-per-line");

      tooltip.append("text")
          .attr("text-anchor", "middle")
          .attr("font-size",'50px')
          .style('fill','white')
          .attr('x',margin.left+(width/2))
          .attr('y',height)
          .style("opacity", '0')
          .text(function(d) {
            //console.log(d)
            //console.log(d.close)
            return d.close
          })
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
      
      

      if (props.displayLine) {
          
          // svg.selectAll("g").selectAll(".candleStick").remove()
          // svg.on("mouseover", function() { 
          //   console.log('mouseover',d3.svg.mouse(this))
          // }).on("mousemove", function() {
          //   console.log('mousemove');
          //   var x = d3.mouse(this)[0];
          //   hoverLine.attr("x1", x).attr("x2", x).style("opacity", 1);
          // }).on("mouseout", function() {
          //   console.log('mouseout');
          //   hoverLine.style("opacity", 1e-6);
          // });
          const g = svg.append("g")
              .attr("stroke-linecap", "round")
              .attr("stroke", "#e0e1e2")
              .selectAll("g")
              .data(data)
              .join("g")
              
              // .on("mouseover", function(e,data){
              //   svg.selectAll("#tooltip")
              //     .text(data.close)
              //     .style("opacity", 1)
      
              //   // Get current event info
              //   console.log(e);
              //   console.log(data)
                
              //   Get x & y co-ordinates
              //   console.log(d3.mouse(this));
              // })
              // .on("mousemove", function(){
              //   d3.selectAll("#tooltip")
              //     .text(data)
              //     .style("opacity", "1");
              //   // svg.selectAll("#tooltip")
              //   //   .text(data)
              //   //   .style("opacity", 1)
      
              //   // Get current event info
                
              //   // Get x & y co-ordinates
              //   //console.log(d3.mouse(this));
              // })
              // .on("mouseout", function(){
              //   d3.selectAll("#tooltip")
              //     .style("opacity", "0");
              // })
              //.attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
  
          const lineGenerator = line()
              .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
              .y(d => y(d.close))
              .curve(curveLinear);

          // const Tooltip = svg.append("g")
          //     .style("opacity", 0)
          //     .attr("class", "tooltip")
          //     .style("background-color", "white")
          //     .style("border", "solid")
          //     .style("border-width", "2px")
          //     .style("border-radius", "5px")
          //     .style("padding", "5px")
              
          //     // Three function that change the tooltip when user hover / move / leave a cell
          // var mouseover = function(d) {
          //   Tooltip
          //     .style("opacity", 1)
          //     .html("The exact value of<br>this cell is: " + d.close)
          //     .style("left", (svg.mouse(this)[0]+70) + "px")
          //     .style("top", (svg.mouse(this)[1]) + "px")
          //   d3.select(this)
          //     .style("stroke", "black")
          //     .style("opacity", 1)
          // }
          // var mousemove = function(d) {
          //   Tooltip
              
          // }
          // var mouseleave = function(d) {
          //   Tooltip
          //     .style("opacity", 0)
          //   d3.select(this)
          //     .style("stroke", "none")
          //     .style("opacity", 0.8)
          // }
          g.append('path')
              .attr('class', 'line-path')
              .attr('d', lineGenerator(data))
              .attr('id','lineChart')
              .attr('fill','none')
              .attr('stroke-width',1)
              .attr('stroke-linecap','round')
              .on('mousemove',function(e){
                  //var m = d3.svg.mouse(this);
                  //console.log(e)
                  //d3.select('#tooltip').selectAll('text').style('opacity', 1).text(d)
                  
                // console.log(d3.select(this).attr('d'))
                // tooltip.selectAll("text")
                //   .style("opacity", '0')
              }
                  )
              .on('mouseout',function(){
                d3.select('#tooltip').selectAll('text').style('opacity', 0)
              }
                  )
              // .on("mouseover", function(e,d){
              //   // svg.selectAll("#tooltip")
              //   //   .text(data.close)
              //   //   .style("opacity", 1)
      
              //   // // Get current event info
              //   // console.log(e);
              //   // console.log(data)
                
              //   // Get x & y co-ordinates
              //   //console.log(d3.mouse(this));
              // })
              // .on("mousemove", function(e,d){
              //   svg.selectAll("#tooltip")
              //     // .text(d.close)
              //     // .style("opacity", 1)
      
              //   // Get current event info
              //   console.log(e);
              //   console.log(d)
                
              //   // Get x & y co-ordinates
              //   //console.log(d3.mouse(this));
              // })
              // .on("mouseout", function(){
              //   svg.selectAll("#tooltip")
              //     .style("opacity", 0)
              // })
            // var mouseG = svg.append("g")
            //   .attr("class", "mouse-over-effects");
        
            // mouseG.append("path") // this is the black vertical line to follow mouse
            //   .attr("class", "mouse-line")
            //   .style("stroke", "white")
            //   .style("stroke-width", "1px")
            //   .style("opacity", "0");

            // var mousePerLine = mouseG.selectAll('.mouse-per-line')
            //   .append("g")
            //   .attr("class", "mouse-per-line");
        
            // mousePerLine.append("circle")
            //   .attr("r", 7)
            //   .style("stroke", 'white')
            //   .style("fill", "none")
            //   .style("stroke-width", "1px")
            //   .style("opacity", "0");

            // mousePerLine.append("text")
            //   .attr("transform", "translate(10,3)");

            // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            //   .attr('width', width) // can't catch mouse events on a g element
            //   .attr('height', height)
            //   .attr('fill', 'none')
            //   .attr('pointer-events', 'all')
            //   .on('mouseout', function() { // on mouse out hide line, circles and text
            //     d3.select(".mouse-line")
            //       .style("opacity", "0");
            //     d3.selectAll(".mouse-per-line circle")
            //       .style("opacity", "0");
            //     d3.selectAll(".mouse-per-line text")
            //       .style("opacity", "0");
            //   })
            //   .on('mouseover', function() { // on mouse in show line, circles and text
            //     d3.select(".mouse-line")
            //       .style("opacity", "1");
            //     d3.selectAll(".mouse-per-line circle")
            //       .style("opacity", "1");
            //     d3.selectAll(".mouse-per-line text")
            //       .style("opacity", "1");
            //   })
            //   .on('mousemove', function() { // mouse moving over canvas

            //     d3.select(".mouse-line")
            //       .style("opacity", "1");
            //     d3.selectAll(".mouse-per-line circle")
            //       .style("opacity", "1");
            //     d3.selectAll(".mouse-per-line text")
            //       .style("opacity", "1");
            //       })




          






          
          
          

          








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

      return svg.node();
      }

  // function calcPercentChange() {
  //     var exportDefault = 0
  //     if (typeof(props.stockData) != 'undefined'){
  //     if (props.stockData.length > 2) {
  //         const percentChange = ((props.stockData[props.stockData.length -1]['close'] - props.stockData[props.stockData.length -2]['close'])/props.stockData[props.stockData.length -1]['close'])*100
  //         const percentChangeFormatted = percentChange.toFixed(2)
  //         return percentChangeFormatted

  //     }else{
  //         return exportDefault
  //     }}
  // }

  


  return  props.loading ? (
    <React.Fragment>
      <svg ref={loadingSpinnerNode}></svg>
    </React.Fragment>
  ) : props.error ? (
    <Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get stock data now.</Header>
  ) : (
    <div>
        <React.Fragment>
            <svg ref={stockChartNode}></svg>
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
    // displayCCI: state.trendFromRootReducer.displayCCI,
    // nForCCI: state.trendFromRootReducer.nForCCI,
    // cForCCI: state.trendFromRootReducer.cForCCI,
    // displayBBSMA: state.trendFromRootReducer.displayBBSMA,
    // nForBBSMA: state.trendFromRootReducer.nForBBSMA,
    // nDevForBBSMA: state.trendFromRootReducer.nDevForBBSMA,
    


  }
}

const mapDispatchToProps = dispatch => {
  return {
    //requestAPIstockData: (APIstring) => dispatch(requestAPIstockData(APIstring)),
    //fetchStockData: (APIstring) => dispatch(fetchStockData(APIstring)),
    //fetchTrendData: (APIstring) => dispatch(fetchTrendData(APIstring)),
    addPercentChange: (percentChange) => dispatch(addPercentChange(percentChange)),
    addSplicedStartDate: (startingDate) => dispatch(addSplicedStartDate(startingDate))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineCandleGraphContainer)

























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