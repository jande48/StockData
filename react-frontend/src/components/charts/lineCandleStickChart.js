import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'
//import { scaleLinear, scaleBand, scalePoint, tickFormat  } from 'd3-scale'

import * as d3 from "d3";
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
export function createLineCandleStickChart(Initialdata,stockPriceLineChartNode,startingDate,InitialtrendData,displayLine,displaySMA,displayMACD,displayEMA,displayMACDsignal,displayADX,displayADXP,displayADXN,displayVIPOS,displayVINEG,displayTRIX,displayMI,displayDPO) {

        //const Initialdata = props.stockData
        function convertDatesToString(initialDate) {
            const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
            return convertedDate
        }
        function sliceDataStartDate(data) {
          var startingIndex = 0
          
          if (startingDate.getDay()== 0){
            var dateOffset = (24*60*60*1000) * 2; 
            startingDate.setTime(startingDate.getTime()-dateOffset)
          }
          if (startingDate.getDay()== 6){
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
      
        //const InitialtrendData = props.trendData
        const trendData = sliceDataStartDate(InitialtrendData)
        
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
          // ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
        const close = new Indicator('close','#e0e1e2',data,displayLine,'axisLeft')
        const sma = new Indicator('sma',"#d62728",trendData,displaySMA,'axisLeft')
        const macd = new Indicator('macd',"#ff7f0e",trendData,displayMACD,'axisRight')
        const ema = new Indicator('ema',"#9467bd",trendData,displayEMA,'axisLeft')
        const macdSignal = new Indicator('macds',"#1b9e77",trendData,displayMACDsignal,'axisRight')
        const adx = new Indicator('adx',"#d95f02",trendData,displayADX,'axisLeft')
        const adxp = new Indicator('adxp',"#7570b3",trendData,displayADXP,'axisLeft')
        const adxn = new Indicator('adxn',"#e7298a",trendData,displayADXN,'axisLeft')
        const vipos = new Indicator('vipos',"#66a61e",trendData,displayVIPOS,'axisRight')
        const vineg = new Indicator('vineg',"#e6ab02",trendData,displayVINEG,'axisRight')
        const trix = new Indicator('trix',"#a6761d",trendData,displayTRIX,'axisRight')
        const mi = new Indicator('mi',"#666666",trendData,displayMI,'axisRight')
        //const cci = new Indicator('cci',"#1b9e77",trendData,props.displayCCI,'axisRight')
        const dpo = new Indicator('dpo',"#1b9e77",trendData,displayDPO,'axisRight')
        // const bbsma = new Indicator('bbsma',"#66a61e",trendData,props.displayBBSMA,'axisLeft')
        
        const objectList = [close,sma,macd,ema,macdSignal,adx,adxp,adxn,vipos,vineg,trix,mi,dpo]


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
            .call(d3.axisBottom(x)
                .tickValues(d3.utcMonday
                    .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
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
        
        

        if (displayLine) {
            
            svg.selectAll("g").selectAll(".candleStick").remove()
    
            const g = svg.append("g")
                .attr("stroke-linecap", "round")
                .attr("stroke", "#e0e1e2")
                .selectAll("g")
                .data(data)
                .join("g")
                // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
    
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