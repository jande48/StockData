import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { fetchStockData } from '../redux'
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

  const LegendLabels = () => {
    const displayParas = [props.displayRSI,props.displayMACD]
    const labels = ['RSI','MACD']
    const colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
    var keysList = []
    var colorsList = []
    for (var i = 0; i < displayParas.length; i++) {
      if (displayParas[i]){
        keysList.push(labels[i])
        colorsList.push(colors[i])
      }
    }
    return keysList
  }
  const  LegendColors = () => {
    const displayParas = [props.displayRSI,props.displayMACD]
    const labels = ['RSI','MACD']
    const colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
    var keysList = []
    var colorsList = []
    for (var i = 0; i < displayParas.length; i++) {
      if (displayParas[i]){
        keysList.push(labels[i])
        colorsList.push(colors[i])
      }
    }
    return colorsList
  }
  const legendColorList = LegendColors()


  // var RSIobject = {name:'RSI',theData:getTheData(this)}
  // function getTheData() {
  //   return this.name
  // }
  // console.log(RSIobject)

  

  const momentumIndicatorsChartNode = useRef(null);

  useEffect(() => {
    if (props.loads > 0) {
      const RSIparameters = {'N':props.nForRSI}
      const TSIparameters = {'displayTSI':props.displayTSI,'rTSI':props.rForTSI,'sTSI':props.sForTSI}
      props.fetchMomentumData(JSON.stringify([props.stockData,RSIparameters,TSIparameters]))
    }
    
  }, [props.stockData,props.displayRSI,props.nForRSI,props.displayTSI,props.sForTSI,props.rForTSI])

  if (props.momentumLoads > 0) {
    function createMomentumIndicatorsChart(momentumIndicatorsChartNode) {
      const data = props.momentumData
      const trendData = props.trendData
      
      function findMinMax(data) {
        var min = 0
        var max = 0
        for (var i = 0; i < data.length; i++) {
            if (props.displayRSI) {
                if (data[i]['rsi'] < min) {
                    min = data[i]['rsi']
                }
                if (data[i]['rsi'] > max) {
                    max = data[i]['rsi']
                }
            }
            if (props.displayTSI) {
                if (data[i]['tsi'] < min) {
                    min = data[i]['tsi']
                }
                if (data[i]['tsi'] > max) {
                    max = data[i]['tsi']
                }
            }
        //     if (displayUOcheckbox) {
        //         if (data[i]['uo'] < min) {
        //             min = data[i]['uo']
        //         }
        //         if (data[i]['uo'] > max) {
        //             max = data[i]['uo']
        //         }
        //     }
        //     if (displayStochCheckbox) {
        //         if (data[i]['stoch'] < min) {
        //             min = data[i]['stoch']
        //         }
        //         if (data[i]['stoch'] > max) {
        //             max = data[i]['stoch']
        //         }
        //     }
        //     if (displayStochSignalCheckbox) {
        //         if (data[i]['stoch_signal'] < min) {
        //             min = data[i]['stoch_signal']
        //         }
        //         if (data[i]['stoch_signal'] > max) {
        //             max = data[i]['stoch_signal']
        //         }
        //     }
        //     if (displayWR) {
        //         if (data[i]['wr'] < min) {
        //             min = data[i]['wr']
        //         }
        //         if (data[i]['wr'] > max) {
        //             max = data[i]['wr']
        //         }
        //     }
        //     if (displayAO) {
        //         if (data[i]['ao'] < min) {
        //             min = data[i]['ao']
        //         }
        //         if (data[i]['ao'] > max) {
        //             max = data[i]['ao']
        //         }
        //     }
        //     if (displayKama) {
        //         if (data[i]['kama'] < min) {
        //             min = data[i]['kama']
        //         }
        //         if (data[i]['kama'] > max) {
        //             max = data[i]['kama']
        //         }
        //     }
        //     if (displayROC) {
        //         if (data[i]['roc'] < min) {
        //             min = data[i]['roc']
        //         }
        //         if (data[i]['roc'] > max) {
        //             max = data[i]['roc']
        //         }
        //     }
        }
        if (min == 0 && max == 0) {
            max = 80
        }
        return [min,max]
      }
      
      function findMinMaxMACD(data) {
        var min = 0
        var max = 0
        for (var i = 0; i < data.length; i++) {
           
          if (data[i]['macd'] < min) {
              min = data[i]['macd']
          }
          if (data[i]['macd'] > max) {
              max = data[i]['macd']
          }
            
        }
        if (min == 0 && max == 0) {
            max = 2
            min = -2
        }
        return [min,max]
      }

      const svg = select(momentumIndicatorsChartNode.current);
      svg.selectAll("g").remove()

      const height = 70;
      const width = 700;
      //const margin = ({top: 20, right: 30, bottom: 30, left: 80})

      const margin = ({top: 5, right: 30, bottom: 5, left: 40})
      const parseDate = d3.utcParse("%Y-%m-%d")
      
      class Indicator {
        constructor(name) {
          this.name = name;
          this.color = color;
          this.data = data;
          this.svg = svg;
          this.display = props.displayRSI;
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
            .data(this.data)
            .join("g")
    
          this.lineGenerator
            .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            .y(d => y(d.rsi))
            .curve(curveLinear);

          this.g.append('path')
            .attr('class', 'line-path')
            .attr("id", "rsi")
            .attr('d', this.lineGenerator(this.data))
            .attr('fill','none')
            .attr('stroke-width',2)
            .attr('stroke-linecap','round')
          
          
            return this.g
          }else{
            return svg.selectAll("g").selectAll(".rsi").remove()
          }
          
        }
    
      }
      
      



      const x = scaleBand()
          .domain(d3.utcDay
              .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
              .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
          .range([margin.left, width - margin.right])
          .padding(0.2)

      var y = scaleLinear()
          //.domain([d3.min(data, d => d.rsi), d3.max(data, d => d.rsi)])
          .domain(findMinMax(data))
          .rangeRound([height - margin.bottom, margin.top])

      if (props.displayMACD) {
        var yRight = scaleLinear()
          //.domain([min,max])
          .domain(findMinMaxMACD(trendData))
          .rangeRound([height - margin.bottom, margin.top])
      }

      const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x)
              .tickValues(d3.utcMonday
                  .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
                  .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
              .tickFormat(d3.utcFormat("%-m/%-d")))
          .call(g => g.select(".domain").remove())

      var yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y)
              .tickFormat(d3.format("~f"))
              .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
          .call(g => g.selectAll(".tick line").clone()
              .attr("stroke-opacity", 0)
              .attr("x2", width - margin.left - margin.right))
          .call(g => g.select(".domain").remove())



      if (props.displayMACD) {
        var yAxisRight = g => g
          .attr("transform", `translate(${width-margin.left},0)`)
          .call(d3.axisRight(yRight)
              .tickFormat(d3.format("~f"))
              .tickValues(d3.scaleLinear().domain(yRight.domain()).ticks()))
              .style("fill",'blue')
          .call(g => g.selectAll(".tick line").clone()
              .attr("stroke-opacity", 0)
              .attr("x2", width - margin.left - margin.right+50))
          .call(g => g.select(".domain").remove())
      }

      svg.attr("viewBox", [0, 0, width, height])

      svg.append("g")
          .call(xAxis);
          
      svg.append("g")
          .call(yAxis);

      // Usually you have a color scale in your chart already
      var color = d3.scaleOrdinal()
        .domain(LegendLabels())
        .range(d3.schemeSet1);


      const size = 5
      svg.selectAll("mydots")
        .data(LegendLabels())
        .enter()
        .append("rect")
          .attr("x", margin.left + 5)
          .attr("y", function(d,i){ return height - margin.bottom - 2 - i*15}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("width",size)
          .attr("height", size/2)
          .style("fill", legendColorList.forEach( x => x))
          //.style("fill", function(d){return color(d)})
        // Add one dot in the legend for each name.
      svg.selectAll('mylabels')
        .data(LegendLabels())
        .enter()
        .append("text")
          .attr("x", margin.left + 15)
          .attr("y", function(d,i){ return height - margin.bottom - i*15 }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", legendColorList.forEach( x => x))
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .attr("font-size",'10px')
          .style("alignment-baseline", "middle")

      if (props.displayMACD) {
        svg.append("g")
          .attr('fill',legendColorList[1])
          .call(yAxisRight)
      }

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
      
      const rsi = new Indicator('rsi', 'red', data, svg);
      const rsiline = rsi.d3line
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

      
      
      

      if (props.displayTSI && typeof(data[0]['tsi']) !== 'undefined') {
          const gTSI = svg.append("g")
              .attr("stroke-linecap", "round")
              .attr("stroke", legendColorList[2])
              .selectAll("g")
              .data(data)
              .join("g")

          const lineGeneratorTSI = line()
              .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
              .y(d => y(d.tsi))
              .curve(curveLinear);

          gTSI.append('path')
              .attr('class', 'line-path')
              .attr("id", "tsi")
              .attr('d', lineGeneratorTSI(data))
              .attr('fill','none')
              .attr('stroke-width',2)
              .attr('stroke-linecap','round')
      }else{
          svg.selectAll("g").selectAll(".tsi").remove()
      }

      if (props.displayMACD) {
        const gMACD = svg.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke", color(2))
            .selectAll("g")
            .data(trendData)
            .join("g")
            // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

        const lineGeneratorMACD = line()
            .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            .y(d => yRight(d.macd))
            .curve(curveLinear);

        gMACD.append('path')
            .attr('class', 'line-path')
            .attr('d', lineGeneratorMACD(trendData))
            .attr('id','macd')
            .attr('fill','none')
            .attr('stroke-width',2)
            .attr('stroke-linecap','round')
        }else{
          svg.selectAll("g").selectAll(".macd").remove()
        }

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

      return svg.node();

    }
    createMomentumIndicatorsChart(momentumIndicatorsChartNode)
  }
      
  




  return props.stockData.loading ? (


    <h2>Loading</h2>
  ) : props.stockData.error ? (
    <h2>{props.stockData.error}</h2>
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
    displayMACD: state.trendFromRootReducer.displayMACD,
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    nFastForMACD: state.trendFromRootReducer.nFastForMACD
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


