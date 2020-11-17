import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
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

function VolumeGraphContainer (props) {


  const showVolumeNode = useRef(null);


  if (typeof(props.stockData) != 'undefined' ) {
    
    if (props.stockData.length > 0){
    createVolumeBarChart(showVolumeNode)
    }}

  function createVolumeBarChart(showVolumeNode) {
    const Initialdata = props.stockData
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
    const svg = select(showVolumeNode.current);
    svg.selectAll("g").remove()
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
                .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
                .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            .tickFormat(d3.utcFormat("")))
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

    function findIndexStockData(d) {
      for (var i = 0; i < data.length; i++) {
          if (d.open == data[i]['open'] && d.volume == data[i]['volume']) {
            return i
          }
      }
    }
    
    
    function handleMouseOverRect(d, i) {
        //console.log(d.getPrototypeOf())
        //console.log(d.offsetX)
        d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.85');
              //Makes the new div appear on hover:
        div.transition()
            .duration(50)
            .style("opacity", 1);
        //var coordinates = d3.mouse(this);
        // d3.select(this)
        //   .append("text")
        //   .attr('x',String(100)+'px') 
        //   .attr('y',String(50)+'px') 
        //   .attr('font-size','7px')
        //   .text(function () { 
        //     //console.log(d.fromElement.data) 
        //     return 'Open: '+String(i.open)});
        //   }

        svg.append("text")
          //console.log(x.bandwidth())
          //.attr('id',String(Math.round(i.high))+'-'+String(Math.round(i.low))+'-'+String(Math.round(i.volume)))
          .attr('x',String(100)+'px') //String(d.pageX)+'px')
          .attr('y',String(50)+'px') //String(d.pageY)+'px')
          //.attr('transform',`translate(${x.bandwidth()},${innerHeight})  rotate(180)`)
          //.attr('x', coordinates[0]+10+'px')
          //.attr('y', coordinates[1]-10+'px')
          .attr('font-size','20px')
          .text(function () { 
            //console.log(d.fromElement.data) 
            return 'Open: '+String(i.open)});
          }
          
        

    function handleMouseOutRect(d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        //Makes the new div disappear:
        div.transition()
            .duration('50')
            .style("opacity", 0);
        d3.selectAll("text").remove()
            //d3.select(svg).select(String(Math.round(i.open))+'-'+String(Math.round(i.close))+'-'+String(Math.round(i.volume))).remove();  // Remove text location
        }

    return svg.node();
  }

  return  (
    <div>
        <React.Fragment>
            <svg ref={showVolumeNode}></svg>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    stockData: state.stockDataFromRootReducer.stockData,
    loading: state.stockDataFromRootReducer.loading,
    error: state.stockDataFromRootReducer.error,
    displayLine: state.chartsFromRootReducer.displayLine,
    startDate: state.datesFromRootReducer.startDate,
  }
}

export default connect(
  mapStateToProps,
  null
)(VolumeGraphContainer)


