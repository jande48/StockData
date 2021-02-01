import React, {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import { fetchPosts, createNewReply, addActiveNav, addFetchPostSuccess, addFormDataDisplay, addShowComments, addFetchPostLoading, 
  addFetchPostFailure, addPageNumber, addDisableNext } from '../redux'
import {Link} from 'react-router-dom'
import { createLoadingSpinnerChart } from './charts/loadingSpinner.js'
import '../App.css'
import { Grid, Header, Message, Form, Button, Icon, Divider} from "semantic-ui-react"
import * as d3 from "d3"
import axios from 'axios'
import {
    select,
    scaleLinear,
    scaleBand,
    line,
    curveLinear,
  } from 'd3';


function ForumComponent (props) {
  const [reply, setReply] = useState(['','','','','','','','','',''])
  const [activeID, setActiveID] = useState(0)
  const [showReply, setShowReply] = useState([false,false,false,false,false,false,false,false,false,false])
  var destructuredReply = [false,false,false,false,false,false,false,false,false,false]
  const [showComments, setShowComments] = useState([true,true,true,true,true,true,true,true,true,true])
  var destructuredComments = [true,true,true,true,true,true,true,true,true,true]
  const [showWarning, setShowWarning] = useState({'activeID':-1,'warning':false})
  const stockChartNode = [useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null)];
  const volumeNode = [useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null)];
  const loadingSpinnerNode = useRef(null);
  const height = 220;
  const width = 700;
  const margin = ({top: 15, right: 30, bottom: 20, left: 50})


  useEffect(() => {
    props.addActiveNav('forum')
    createLoadingSpinnerChart(loadingSpinnerNode,width,height,margin)
    if (!props.replyLoading) {
    
    axios({
      method: 'get',
      url: "/posts/"+props.pageNumber,
    }).then(res => {
        const response = res.data;
        props.addFormDataDisplay(response)
        response.map( (el, index) => (
        createStockPriceLineChart(stockChartNode[index],el.chartData),
        createVolumeBarChart(volumeNode[index],el.chartData,response.length,index)
        ))
    })
  }
  
  
  },[props.pageNumber,props.replySuccess,props.replyLoading])

  if (props.formDataDisplay.length < 10) {
    props.addDisableNext(true)
  } else {
    props.addDisableNext(false)
  }

  // function createLoadingSpinnerChart(loadingSpinnerNode, width, height, margin) {
  //   const data = [{'date':'2020-07-29'},{'date':'2020-07-30'},{'date':'2020-07-31'},{'date':'2020-08-02'},{'date':'2020-08-03'}]
  //   const parseDate = d3.utcParse("%Y-%m-%d")
  //   const svg = select(loadingSpinnerNode.current);
  //     svg.selectAll("g").remove()
  
  //     const x = scaleBand()
  //       .range([margin.left, width - margin.right])
  //       .padding(0.2)

  //     var y = scaleLinear()
  //         //.domain(findMixMaxObjects(objectList,'axisLeft'))
  //         //.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
  //         .rangeRound([height - margin.bottom, margin.top])
  //             //d3.min(data, d => d.low), d3.max(data, d => d.high

  //     const xAxis = g => g
  //         .attr("transform", `translate(0,${height - margin.bottom})`)
  //         .attr('class','axisWhite')
  //         .call(d3.axisBottom(x)
  //           .tickValues(d3.utcMonday
  //             .every(data.length > 2 ? (data.length > 250 ? 8 : (data.length > 150 ? 4 : (data.length > 80 ? 2 : 1))) : 1)
  //           .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
  //         .tickFormat(d3.utcFormat("")))

  //     const yAxis = g => g
  //         .attr("transform", `translate(${margin.left},0)`)
  //         .attr('class','axisWhite')
  //         .call(d3.axisLeft(y))
  //         .call(g => g.selectAll(".tick line").remove())
  //         .call(g => g.selectAll("text").remove())
  //         //     .attr("stroke-opacity", 0)
  //         //     .attr("x2", width - margin.left - margin.right))
  //         //.call(g => g.select(".domain").remove())
      
  //     svg.attr("viewBox", [0, 0, width, height])

  //     svg.append("g")
  //         .call(xAxis);
          
  //     svg.append("g")
  //         .call(yAxis)
          
  //     // svg.append('g')
  //     //     .attr("stroke-linecap", "round")
  //     //     .attr("stroke",  '#1b1c1d')
  //     //     .selectAll("g")
  //     //     .data(data)
  //     //     .join("g")
  //     // main circle
  //     const CX = (width) / 2;
  //     const CY = (height-margin.bottom-margin.top) / 2;
  //     const R = 12;
  //     // little circles
  //     const r = 1.2;

  //     // degree - radian conversion
  //     function radian(degree) {
  //       return degree * Math.PI / 180;
  //     }
  //     // parametric equation of a circle is : x=cx+r*cos(t) and y=cy+r*sin(t)
  //     function xSpinner(radian) {
  //       return CX + R * Math.cos(radian);
  //     }
  //     function ySpinner(radian) {
  //       return CY + R * Math.sin(radian);
  //     }

  //     // root svg
  //     // const svg = d3
  //     //   .select("body")
  //     //   .append("svg")
  //     //   .attr("width", margin.width)
  //     //   .attr("height", margin.height)
  //     //   .style("background-color", "lightblue")
  //     //   .append("g")
  //     //   .attr("transform", "translate(" + margin.left + "," + margin.left + ")");

  //     // g and rect are useless : just for showing element g
  //     // const justForShowing_g = svg
  //     //   .append("rect")
  //     //   .style("fill", "lightgrey")
  //     //   .attr("width", WIDTH)
  //     //   .attr("height", HEIGHT);

  //     // main circle : just for explanation purpose
  //     // uncomment if needed
  //     /*
  //     const mainCircle = svg
  //       .append("circle")
  //       .attr("id", "main")
  //       .attr("cx", CX)
  //       .attr("cy", CY)
  //       .attr("r", R)
  //       .style("stroke", "red")
  //       .style("fill", "none");
  //     */

  //     // little circles
  //     // 10 equal sectors for 10 points on the main circle
  //     const SECTORS = 10; // number of sectors
  //     const SECTOR = 360 / SECTORS; // sector in degree: each equal
  //     let anglesList = [];

  //     for (let index = 0; index < SECTORS; index++) {
  //       anglesList.push(radian(index * SECTOR));
  //     }
  //     const MAX = anglesList[SECTORS - 1];

  //     // opacity
  //     function getOpacity(datum) {
  //       return Number((datum / MAX).toFixed(1));
  //     }

  //     // little circle radius
  //     function getRadius(datum) {
  //       return Number(r + r * (datum / MAX).toFixed(1));
  //     }

  //     function update(dataset) {
  //       let littleCircle = svg.selectAll("#little").data(dataset);
  //       // const g = svg.append("g")
  //       //   .selectAll("g")
  //       //   .data(dataset)
  //       //   .join("g")

  //       // UPDATE
  //       // Update old elements as needed.

  //       littleCircle
  //         .attr("r", function(d) {
  //           return getRadius(d);
  //         })
  //         .style("opacity", function(d) {
  //           return getOpacity(d);
  //         });

  //       // ENTER
  //       // Create new elements as needed.
  //       littleCircle
  //         .enter()
  //         .append("circle")
  //         .attr("id", "little")
  //         .attr("fill", "green")
  //         .attr("cx", function(d) {
  //           return xSpinner(d);
  //         })
  //         .attr("cy", function(d) {
  //           return ySpinner(d);
  //         })
  //         .attr("r", function(d) {
  //           return getRadius(d);
  //         })
  //         .style("opacity", function(d) {
  //           return getOpacity(d);
  //         });

  //         // EXIT
  //       // Remove old elements as needed.
  //       //littleCircle.exit().remove();
      
        
  //     }

  //     update(anglesList);

  //     function arrayRotate(arr, count) {
  //       count -= arr.length * Math.floor(count / arr.length);
  //       arr.push.apply(arr, arr.splice(0, count));
  //       return arr;
  //     }

  //     // cyclic circular permutation
  //     d3.interval(function() {
  //       anglesList = arrayRotate(anglesList.slice(), -1);
  //       update(anglesList);
  //     }, 350);

  //   return svg.node();
  // }

  function createStockPriceLineChart(stockPriceLineChartNode, d) {

    function sliceDataStartDate(data) {
      var startingIndex = 0
      var startingDate = new Date(d.dates.startDate) 
      
      if (startingDate.getDay()== 0){
        var dateOffset = (24*60*60*1000) * 2; 
        startingDate.setTime(startingDate.getTime()-dateOffset)
      }
      if (startingDate.getDay()== 6){
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

    const data = sliceDataStartDate(d.stockData)
    const trendData = sliceDataStartDate(d.trend.trendData)
    const volatilityData = sliceDataStartDate(d.volatility.volatilityData)
    const momentumData = sliceDataStartDate(d.momentum.momentumData)
    
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
    const dpo = new Indicator('dpo',"#1b9e77",trendData,d.trend.displayDPO,'axisRight')
    const bbsma = new Indicator('bbsma',"#7fc97f",volatilityData,d.volatility.displayBBSMA,'axisLeft')
    const atr = new Indicator('atr',"#beaed4",volatilityData,d.volatility.displayATR,'axisRight')
    const BBupper = new Indicator('BBupper',"#fdc086",volatilityData,d.volatility.displayBBUpper,'axisLeft')
    const BBlower = new Indicator('BBlower',"#ffff99",volatilityData,d.volatility.displayBBLower,'axisLeft')
    const KeltnerC = new Indicator('keltnerC',"#386cb0",volatilityData,d.volatility.displayKeltnerC,'axisLeft')
    const rsi = new Indicator('rsi',"#1f77b4",momentumData,d.momentum.displayRSI,'axisRight');
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
        .rangeRound([height - margin.bottom, margin.top])

    var yRight = scaleLinear()
        .domain(findMixMaxObjects(objectList,'axisRight'))
        .rangeRound([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr('class','axisWhite')
        .call(d3.axisBottom(x)  
            .tickValues(d3.utcMonday
                .every(data.length > 2 ? (data.length > 250 ? 8 : (data.length > 150 ? 4 : (data.length > 80 ? 2 : 1))) : 1)
                .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            .tickFormat(d3.utcFormat("%-m/%-d")))

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

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .attr('class','axisWhite')
        .call(d3.axisLeft(y)
            .tickFormat(d3.format("~f"))
            .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0)
            .attr("x2", width - margin.left - margin.right))

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
    const viposline = vipos.d3line
    const vinegline = vineg.d3line
    const trixline = trix.d3line
    const miline = mi.d3line
    const dpoline = dpo.d3line
    const atrline = atr.d3line
    const bbsmaline = bbsma.d3line
    const BBupperline = BBupper.d3line
    const BBlowerline = BBlower.d3line
    const keltnerCline = KeltnerC.d3line
    
    const rsiline = rsi.d3line
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
        var rsiAlreadyInList = false
        for (var i=0; i < keysList.length; i++){
          if (rsiAlreadyInList && keysList[i]['name'] == 'rsi') {
            keysList.splice(i,1)
            break
          } else if (keysList[i]['name'] == 'rsi'){
            rsiAlreadyInList = true
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

  
  function createVolumeBarChart(showVolumeNode, d) {
    
    const Initialdata = d.stockData
    function convertDatesToString(initialDate) {
      const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
      return convertedDate
    }
    function sliceDataStartDate(data) {
      var startingIndex = 0
      var startingDate = new Date(d.dates.startDate) 
      
      if (startingDate.getDay()== 0){
        var dateOffset = (24*60*60*1000) * 2; 
        startingDate.setTime(startingDate.getTime()-dateOffset)
      }
      if (startingDate.getDay()== 6){
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
    const svg = select(showVolumeNode.current);
    svg.selectAll("g").remove()
    svg.selectAll("circle").remove()
    const margin = ({top: 10, right: 20, bottom: 5, left: 50})
    const parseDate = d3.utcParse("%Y-%m-%d")
    const height = 70;
    const width = 700;
    svg.attr("viewBox", [0, 0, width, height])
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = scaleBand()
        .domain(d3.utcDay
            .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([margin.left, width - margin.right])
        .padding(0.2)
    const xForToolTip = scaleBand()
        .domain(d3.utcDay
            .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([margin.left, width - margin.right])
    // d3.min(data, d => d.volume)-(d3.max(data, d => d.volume)-d3.min(data, d => d.volume))/10
    const y = scaleLinear()
        .domain([0, d3.max(data, d => d.volume)])
        .rangeRound([innerHeight, 0])
    //console.log(y.domain())
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom- margin.top})`)
        .attr('class','axisWhite')
        .call(d3.axisBottom(x)
            .tickValues(d3.utcMonday
              .every(data.length > 2 ? (data.length > 250 ? 8 : (data.length > 150 ? 4 : (data.length > 80 ? 2 : 1))) : 1)
              .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            .tickFormat(d3.utcFormat("")))
            // .tickValues(d3.utcMonday
            //     .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
            //     .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            // .tickFormat(d3.utcFormat("")))
        //.call(g => g.select(".domain").remove())
    

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .attr('class','axisWhite')
        .call(d3.axisLeft(y).ticks(3,'s'))
        //     .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
        // .call(g => g.selectAll(".tick line").clone()
        //     .attr("stroke-width", 0))
            //.attr("x2", width - margin.left - margin.right))
        //.call(g => g.select(".domain").remove())

    // yAxis.select('.domain')
    //     .attr('stroke-width', 0);
    svg.append("text")
        .attr("class", "axisWhite")
        .attr("text-anchor", "middle")
        .attr("font-size",'10px')
        .style('fill','#e0e1e2')
        .attr('transform',`translate(10,${height/2}) rotate(-90)`)
        .text("Volume")
        
    svg.append("g")
        .call(xAxis);
        
    svg.append("g")
        .call(yAxis);
    
    

    var div = d3.select("body").append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);

    // var tip = d3.tip()
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return "<strong>Frequency:</strong> <span style='color:red'>" + d.open + "</span>";
    //   })

    const g = svg.append("g")
        // .attr("stroke", "black")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", data => `translate(${x(parseDate(data.date))},0)`);

    g.append("rect")
        .attr('x',0)
        .attr('y',0)
        .attr('width', d=>(x.bandwidth()+x.padding()))
        .attr('height',d=>(innerHeight - y(d.volume)))
        .attr("fill", d => d.open > d.close ? d3.schemeSet1[0]
            : d.close > d.open ? d3.schemeSet1[2]
            : d3.schemeSet1[8])
        .attr('transform',d=>(`translate(${x.bandwidth()},${innerHeight}) rotate(180)`))
        //.attr('transform',`translate(${x.bandwidth()},${innerHeight})  rotate(180)`)
        // .on('mouseover', handleMouseOverRect)
        // .on('mouseout', handleMouseOutRect)
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
        

        
    return svg.node();
  }
  
  function handleShowReplyChange (e,data) {
    destructuredReply[parseInt(data.name)] = true
    setShowReply(destructuredReply)
  }

  function handleShowCommentsChange (e,data) {
    destructuredComments[parseInt(data.value)] = !destructuredComments[parseInt(data.value)]
    setShowComments(destructuredComments)
  }

  function handleNextChange (e,data) {
    props.addPageNumber(props.pageNumber + 1)
  }

  function handlePreviousChange (e,data) {
    props.addPageNumber(props.pageNumber -1)
  }

  function handleReplyChange (e,data) {
    setActiveID(parseInt(data.name))
    setReply(data.value)
  }

  function handleReplySubmit () {
    if (props.isAuthenticated) {

      const payload = {
        'reply': reply,
        'id': (activeID),
      }

      props.createNewReply(payload)

    } else {
      setShowWarning({'activeID':activeID,'warning':true})
    }
    
  }

  
  var w = window.innerWidth;

  return (
    <div>
      { w > 700 ? 
      <Grid columns='equal'>
      
      <Grid.Column></Grid.Column>
      <Grid.Column width={14}>
        <Grid.Row>
          {props.fetchPostLoading ? <Button loading color='green' floated='left' content='Previous' />: props.pageNumber == 1 ? <Button disabled color='green' floated='left' content='Previous' /> : <Button color='green' floated='left' content='Previous' onClick={handlePreviousChange} />}
          {props.fetchPostLoading ? <Button loading color='green' floated='right' content='Next' />: props.disableNext ? <Button disabled color='green' floated='right' content='Next'/> : <Button color='green' floated='right' content='Next' onClick={handleNextChange}/>}
        </Grid.Row>
        <Divider hidden/>
        <Divider hidden />
        <Divider hidden />
        {typeof(props.formDataDisplay) == 'undefined' || props.formDataDisplay.length < 1 || props.fetchPostLoading ?
        <React.Fragment>
          <svg ref={loadingSpinnerNode}></svg>
        </React.Fragment>
        : ''}
        


    {typeof(props.formDataDisplay) != 'undefined' ? props.formDataDisplay.length > 0 ? !props.fetchPostLoading ? props.formDataDisplay.map( (el, index) => (
      
      <Grid.Row>
        <Grid borderless inverted>
          <Divider hidden/>
          <Grid.Column><Header as='h3' inverted>{el.chartData.tickers}</Header></Grid.Column>
          <Grid.Column floated='right' width='5'><Header as='h4' floated='right' inverted><Header.Subheader>{el.user} - {el.date}</Header.Subheader></Header></Grid.Column>
        </Grid>
        <Header as='h2' inverted><Header.Subheader>{el.content}</Header.Subheader></Header>
        <React.Fragment>
          <svg ref={stockChartNode[index]}></svg>
        </React.Fragment>
          
         {el.chartData['includeVolume'] ? 
         <React.Fragment>
            <svg ref={volumeNode[index]}></svg>
         </React.Fragment>
         : ''}
         <Header inverted as='h5'>
          <Header.Subheader>{showComments[index] ? <Icon inverted name="angle down" value={index} onClick={handleShowCommentsChange}></Icon> : <Icon inverted value={index} name="angle up" onClick={handleShowCommentsChange}></Icon>}Comments: {!showReply ?  <Button inverted color='green' floated='right' content='Reply' onClick={handleShowReplyChange}/> : ''}</Header.Subheader> </Header>
        { showComments[index] ? (el.replies != null && el.replies != 'undefined') ? 
        el.replies.map( (replyEl) => (
          <Header as='h5' inverted>
            <Header.Subheader>{replyEl.userWhoReplied} - {replyEl.dateReplied}</Header.Subheader>
            <Header.Content>{replyEl.reply}</Header.Content>
          </Header>
        ))
        : '' : '' }
        { (showWarning['activeID'] == el.id && showWarning['warning']) ? 
        <Message warning>
            <Message.Header>Please <Link to="/login"><a style={{color: "green"}} href="#">login</a></Link> or <Link to="/register"><a style={{color: "green"}} href="#">sign up</a></Link> to post content</Message.Header>
        </Message>
        : ''}
        {showReply[index] ? 
        <Header>
        <Form inverted>
          <Form.Input
            placeholder="What's your opinion of this chart?"
            name={el.id}
            value={activeID == el.id ? reply : ''}
            onChange={handleReplyChange}
          />
        {props.replyLoading || props.fetchPostLoading ? <Form.Button loading size='medium' floated='right'/> : <Form.Button inverted color='green' floated='right' content='Reply' onClick={handleReplySubmit}/>}     
        </Form></Header> : <Form.Button inverted color='green' floated='right' name={index} content='Reply' onClick={handleShowReplyChange}/> }
        <Divider hidden/>
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        
      </Grid.Row>
  
   
          
       
   
     
      
    )) :  
    <React.Fragment>
      <svg ref={loadingSpinnerNode}></svg>
    </React.Fragment>
    : 
    <React.Fragment>
      <svg ref={loadingSpinnerNode}></svg>
    </React.Fragment>
    : 
    <React.Fragment>
      <svg ref={loadingSpinnerNode}></svg>
    </React.Fragment>
    } 

    <Grid.Row>
          {props.fetchPostLoading ? <Button loading color='green' floated='left' content='Previous' />: props.pageNumber == 1 ? <Button disabled color='green' floated='left' content='Previous' /> : <Button color='green' floated='left' content='Previous' onClick={handlePreviousChange} />}
          {props.fetchPostLoading ? <Button loading color='green' floated='right' content='Next' />: props.disableNext ? <Button disabled color='green' floated='right' content='Next'/> : <Button color='green' floated='right' content='Next' onClick={handleNextChange}/>}
    </Grid.Row>
    </Grid.Column>
    <Grid.Column></Grid.Column>
    </Grid>
    
      : 
      <div class="fullWidth">
        <Grid columns='equal'>
        <Grid.Column>
        <Grid.Row>
          {props.fetchPostLoading ? <Button loading color='green' floated='left' content='Previous' />: props.pageNumber == 1 ? <Button disabled color='green' floated='left' content='Previous' /> : <Button color='green' floated='left' content='Previous' onClick={handlePreviousChange} />}
          {props.fetchPostLoading ? <Button loading color='green' floated='right' content='Next' />: props.disableNext ? <Button disabled color='green' floated='right' content='Next'/> : <Button color='green' floated='right' content='Next' onClick={handleNextChange}/>}
        </Grid.Row>
        <Divider hidden/>
        <Divider hidden />
        <Divider hidden />
          {typeof(props.formDataDisplay) != 'undefined' ? props.formDataDisplay.length > 0 ? !props.fetchPostLoading ? props.formDataDisplay.map( (el, index) => (
          
        <Grid.Row color={'#242525'}>
          <Grid borderless inverted>
            <Divider hidden/>
            <Grid.Column><Header as='h3' inverted>{el.chartData.tickers}</Header></Grid.Column>
            <Grid.Column floated='right' width='5'><Header as='h4' floated='right' inverted><Header.Subheader>{el.user} - {el.date}</Header.Subheader></Header></Grid.Column>
          </Grid>
          <Header as='h5' inverted><Header.Subheader>{el.content}</Header.Subheader></Header>
            <React.Fragment>
              <svg ref={stockChartNode[index]}></svg>
          </React.Fragment>
          {el.chartData['includeVolume'] ? <React.Fragment>
              <svg ref={volumeNode[index]}></svg>
          </React.Fragment>: ''}
          <Header inverted as='h5'>
            <Header.Subheader>{showComments[index] ? <Icon inverted name="angle down" value={index} onClick={handleShowCommentsChange}></Icon> : <Icon inverted value={index} name="angle up" onClick={handleShowCommentsChange}></Icon>}Comments: {!showReply ?  <Button inverted color='green' floated='right' content='Reply' onClick={handleShowReplyChange}/> : ''}</Header.Subheader> </Header>
          { showComments[index] ? (el.replies != null && el.replies != 'undefined') ? 
          el.replies.map( (replyEl) => (
            <React.Fragment>
            <Header as='h5' inverted>
              
              <Header.Subheader>{replyEl.userWhoReplied} - {replyEl.dateReplied}</Header.Subheader>
              <Header.Content>{replyEl.reply}</Header.Content>
            </Header>
            </React.Fragment>
          ))
          : '' : '' }
          { (showWarning['activeID'] == el.id && showWarning['warning']) ? 
          <Message warning>
              <Message.Header>Please <Link to="/login"><a style={{color: "green"}} href="#">login</a></Link> or <Link to="/register"><a style={{color: "green"}} href="#">sign up</a></Link> to post content</Message.Header>
          </Message>
          : ''}
          {showReply[index] ? 
          <Header>
          <Form inverted>
            <Form.Input
              placeholder="What's your opinion of this chart?"
              name={el.id}
              value={activeID == el.id ? reply : ''}
              onChange={handleReplyChange}
            />
          {props.replyLoading || props.fetchPostLoading ? <Form.Button loading size='medium' floated='right'/> : <Form.Button inverted color='green' floated='right' content='Reply' onClick={handleReplySubmit}/>}     
          </Form></Header> : <Form.Button inverted color='green' floated='right' name={index} content='Reply' onClick={handleShowReplyChange}/> }
          <Divider hidden/>
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
        </Grid.Row>
        
          
        )) : 
        <React.Fragment>
          <svg ref={loadingSpinnerNode}></svg>
        </React.Fragment>
        : 
        <React.Fragment>
          <svg ref={loadingSpinnerNode}></svg>
        </React.Fragment>
        : 
        <React.Fragment>
          <svg ref={loadingSpinnerNode}></svg>
        </React.Fragment>
        }
        
        {props.fetchPostLoading ?
        <React.Fragment>
          <svg ref={loadingSpinnerNode}></svg>
        </React.Fragment>
        :''}
        <Grid.Row>
          {props.fetchPostLoading ? <Button loading color='green' floated='left' content='Previous' />: props.pageNumber == 1 ? <Button disabled color='green' floated='left' content='Previous' /> : <Button color='green' floated='left' content='Previous' onClick={handlePreviousChange} />}
          {props.fetchPostLoading ? <Button loading color='green' floated='right' content='Next' />: props.disableNext ? <Button disabled color='green' floated='right' content='Next'/> : <Button color='green' floated='right' content='Next' onClick={handleNextChange}/>}
        </Grid.Row>
        </Grid.Column>
        </Grid>
      </div> 
      }
    </div>
    
    
  )
  
  }
const mapStateToProps = state => {
    return {
      isAuthenticated: state.usersFromRootReducer.isAuthenticated,
      pageNumber: state.usersFromRootReducer.pageNumber, 
      tickers: state.tickersFromRootReducer.tickers,
      formDataDisplay: state.usersFromRootReducer.formDataDisplay,
      pageNumber: state.usersFromRootReducer.pageNumber,
      replyLoading: state.usersFromRootReducer.replyLoading,
      replySuccess: state.usersFromRootReducer.replySuccess,
      replyFailure: state.usersFromRootReducer.replyFailure,
      fetchPostSuccess: state.usersFromRootReducer.fetchPostSuccess,
      showComments: state.usersFromRootReducer.showComments,
      replyLoading: state.usersFromRootReducer.replyLoading,
      fetchPostLoading: state.usersFromRootReducer.fetchPostLoading,
      disableNext: state.usersFromRootReducer.disableNext,
    }
  }
  
const mapDispatchToProps = dispatch => {
return {
    fetchPosts: (page) => dispatch(fetchPosts(page)),
    createNewReply: (reply) => dispatch(createNewReply(reply)),
    addActiveNav: (x) => dispatch(addActiveNav(x)),
    addFetchPostSuccess: (x) => dispatch(addFetchPostSuccess(x)),
    addFormDataDisplay: (x) => dispatch(addFormDataDisplay(x)),
    addShowComments: (x) => dispatch(addShowComments(x)),
    addFetchPostLoading: (x) => dispatch(addFetchPostLoading(x)),
    addFetchPostFailure: (x) => dispatch(addFetchPostFailure(x)),
    addPageNumber: (x) => dispatch(addPageNumber(x)),
    addDisableNext: (x) => dispatch(addDisableNext(x)),
    
}
}
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ForumComponent)
